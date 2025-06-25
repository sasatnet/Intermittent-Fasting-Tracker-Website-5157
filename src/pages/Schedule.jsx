import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useFasting } from '../context/FastingContext';
import { useNotifications } from '../context/NotificationContext';

const { FiCalendar, FiClock, FiBell, FiPlus, FiTrash2, FiEdit3, FiCheck } = FiIcons;

const Schedule = () => {
  const { state, dispatch } = useFasting();
  const { scheduleRecurringNotification, cancelNotification, notifications } = useNotifications();
  
  const [schedules, setSchedules] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '18:00',
    endTime: '10:00',
    days: [],
    fastingType: '16:8',
    active: true
  });

  const weekDays = [
    { id: 0, name: 'الأحد', short: 'ح' },
    { id: 1, name: 'الاثنين', short: 'ن' },
    { id: 2, name: 'الثلاثاء', short: 'ث' },
    { id: 3, name: 'الأربعاء', short: 'ر' },
    { id: 4, name: 'الخميس', short: 'خ' },
    { id: 5, name: 'الجمعة', short: 'ج' },
    { id: 6, name: 'السبت', short: 's' }
  ];

  useEffect(() => {
    // Load schedules from localStorage
    const savedSchedules = localStorage.getItem('fastingSchedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
  }, []);

  useEffect(() => {
    // Save schedules to localStorage
    localStorage.setItem('fastingSchedules', JSON.stringify(schedules));
  }, [schedules]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDayToggle = (dayId) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(dayId)
        ? prev.days.filter(id => id !== dayId)
        : [...prev.days, dayId]
    }));
  };

  const calculateEndTime = (startTime, fastingHours) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + (24 - fastingHours) * 60 * 60 * 1000);
    
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const fastingHours = parseInt(formData.fastingType.split(':')[0]);
    const calculatedEndTime = calculateEndTime(formData.startTime, fastingHours);
    
    const newSchedule = {
      id: editingId || Date.now(),
      ...formData,
      endTime: calculatedEndTime,
      fastingHours,
      notificationIds: []
    };

    if (editingId) {
      setSchedules(prev => prev.map(s => s.id === editingId ? newSchedule : s));
    } else {
      setSchedules(prev => [...prev, newSchedule]);
    }

    // Schedule notifications
    if (newSchedule.active && newSchedule.days.length > 0) {
      const notificationIds = scheduleRecurringNotification(
        '⏰ وقت بدء الصيام',
        `حان وقت بدء صيام ${newSchedule.fastingType} - ${newSchedule.name}`,
        [newSchedule.startTime],
        newSchedule.days
      );
      
      newSchedule.notificationIds = notificationIds;
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      startTime: '18:00',
      endTime: '10:00',
      days: [],
      fastingType: '16:8',
      active: true
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (schedule) => {
    setFormData({
      name: schedule.name,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      days: schedule.days,
      fastingType: schedule.fastingType,
      active: schedule.active
    });
    setEditingId(schedule.id);
    setIsCreating(true);
  };

  const handleDelete = (scheduleId) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule && schedule.notificationIds) {
      schedule.notificationIds.forEach(id => cancelNotification(id));
    }
    
    setSchedules(prev => prev.filter(s => s.id !== scheduleId));
  };

  const toggleScheduleActive = (scheduleId) => {
    setSchedules(prev => prev.map(schedule => {
      if (schedule.id === scheduleId) {
        const updatedSchedule = { ...schedule, active: !schedule.active };
        
        // Cancel existing notifications
        if (schedule.notificationIds) {
          schedule.notificationIds.forEach(id => cancelNotification(id));
        }
        
        // Schedule new notifications if activating
        if (updatedSchedule.active && updatedSchedule.days.length > 0) {
          const notificationIds = scheduleRecurringNotification(
            '⏰ وقت بدء الصيام',
            `حان وقت بدء صيام ${updatedSchedule.fastingType} - ${updatedSchedule.name}`,
            [updatedSchedule.startTime],
            updatedSchedule.days
          );
          updatedSchedule.notificationIds = notificationIds;
        }
        
        return updatedSchedule;
      }
      return schedule;
    }));
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getDaysText = (days) => {
    if (days.length === 7) return 'يومياً';
    if (days.length === 0) return 'لا يوجد';
    
    return days.map(dayId => weekDays.find(d => d.id === dayId)?.short).join('، ');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-cairo">
            جدولة الصيام
          </h1>
          <p className="text-gray-600 font-cairo">
            أنشئ جدولاً أسبوعياً للصيام المتقطع
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreating(true)}
          className="p-3 bg-primary-500 text-white rounded-xl"
        >
          <SafeIcon icon={FiPlus} className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Existing Schedules */}
      <div className="space-y-4 mb-6">
        {schedules.map((schedule) => (
          <motion.div
            key={schedule.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-white rounded-xl p-4 shadow-sm border-2 ${
              schedule.active ? 'border-primary-200' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleScheduleActive(schedule.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                    schedule.active
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-gray-300'
                  }`}
                >
                  {schedule.active && (
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-white" />
                  )}
                </motion.button>
                
                <div>
                  <h3 className="font-bold text-gray-800 font-cairo">
                    {schedule.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-cairo">
                    {schedule.fastingType} • {getDaysText(schedule.days)}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEdit(schedule)}
                  className="p-2 bg-gray-100 rounded-lg"
                >
                  <SafeIcon icon={FiEdit3} className="w-4 h-4 text-gray-600" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(schedule.id)}
                  className="p-2 bg-red-100 rounded-lg"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4 text-red-600" />
                </motion.button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <SafeIcon icon={FiClock} className="w-4 h-4 text-primary-500 ml-2" />
                <span className="font-cairo text-gray-600">
                  البداية: {formatTime(schedule.startTime)}
                </span>
              </div>
              <div className="flex items-center">
                <SafeIcon icon={FiClock} className="w-4 h-4 text-success-500 ml-2" />
                <span className="font-cairo text-gray-600">
                  النهاية: {formatTime(schedule.endTime)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <h3 className="text-lg font-bold text-gray-800 font-cairo mb-4">
            {editingId ? 'تعديل الجدول' : 'جدول جديد'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
                اسم الجدول
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="مثال: جدول العمل"
                className="w-full p-3 border border-gray-300 rounded-lg font-cairo text-right"
                required
              />
            </div>

            {/* Fasting Type */}
            <div>
              <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
                نوع الصيام
              </label>
              <select
                value={formData.fastingType}
                onChange={(e) => handleInputChange('fastingType', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg font-cairo text-right"
              >
                <option value="14:10">14:10 - سهل</option>
                <option value="16:8">16:8 - متوسط</option>
                <option value="18:6">18:6 - متقدم</option>
                <option value="20:4">20:4 - خبير</option>
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
                وقت بدء الصيام
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg font-cairo"
                required
              />
            </div>

            {/* Days */}
            <div>
              <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
                أيام الأسبوع
              </label>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                  <motion.button
                    key={day.id}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDayToggle(day.id)}
                    className={`p-3 rounded-lg border-2 text-center font-cairo text-sm transition-colors ${
                      formData.days.includes(day.id)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {day.short}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-cairo font-semibold"
              >
                إلغاء
              </motion.button>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-cairo font-semibold"
              >
                {editingId ? 'حفظ التغييرات' : 'إنشاء الجدول'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Quick Schedule Templates */}
      {!isCreating && schedules.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 font-cairo mb-4">
            قوالب سريعة
          </h3>
          
          <div className="space-y-3">
            {[
              { name: 'جدول العمل', type: '16:8', start: '20:00', days: [1, 2, 3, 4, 5] },
              { name: 'جدول نهاية الأسبوع', type: '18:6', start: '18:00', days: [5, 6] },
              { name: 'جدول يومي', type: '14:10', start: '19:00', days: [0, 1, 2, 3, 4, 5, 6] }
            ].map((template, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setFormData({
                    name: template.name,
                    startTime: template.start,
                    endTime: '10:00',
                    days: template.days,
                    fastingType: template.type,
                    active: true
                  });
                  setIsCreating(true);
                }}
                className="w-full p-4 bg-white rounded-lg border text-right hover:border-primary-300 transition-colors"
              >
                <div className="font-cairo font-semibold text-gray-800">
                  {template.name}
                </div>
                <div className="text-sm text-gray-500 font-cairo">
                  {template.type} • {formatTime(template.start)} • {getDaysText(template.days)}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Schedule;