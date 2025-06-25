import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useFasting } from '../context/FastingContext';

const { FiClock, FiDroplet, FiTarget, FiTrendingUp, FiCalendar, FiPlay, FiActivity, FiHeart } = FiIcons;

const Dashboard = () => {
  const { state, dispatch } = useFasting();

  // Generate dynamic stats based on database data
  const stats = [
    {
      icon: FiCalendar,
      label: 'اليوم الحالي',
      value: `${state.currentDay}/20`,
      color: 'text-primary-500',
      bg: 'bg-primary-50',
    },
    {
      icon: FiTarget,
      label: 'الأيام المكتملة',
      value: state.userStats?.completed_sessions || state.completedDays.length,
      color: 'text-success-500',
      bg: 'bg-success-50',
    },
    {
      icon: FiActivity,
      label: 'السلسلة الحالية',
      value: `${state.userStats?.current_streak || state.currentStreak} يوم`,
      color: 'text-warning-500',
      bg: 'bg-warning-50',
    },
    {
      icon: FiDroplet,
      label: 'شرب الماء',
      value: `${state.waterIntake}/${state.dailyWaterGoal}`,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
  ];

  const addWater = () => {
    dispatch({ type: 'ADD_WATER' });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 font-cairo mb-2">
          مرحباً بك في رحلة الصيام المتقطع
        </h1>
        <p className="text-gray-600 font-cairo">
          برنامج 20 يوم لتحسين صحتك ولياقتك
        </p>
        {state.dashboardData && (
          <div className="mt-2 text-sm text-primary-600 font-cairo">
            معدل نجاحك: {state.dashboardData.fasting_success_rate?.toFixed(1) || 0}%
          </div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className={`${stat.bg} p-4 rounded-xl`}
          >
            <div className="flex items-center justify-between mb-2">
              <SafeIcon icon={stat.icon} className={`w-5 h-5 ${stat.color}`} />
              <span className={`text-xl font-bold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-cairo">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Dashboard Stats from Database */}
      {state.dashboardData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white mb-6"
        >
          <h3 className="text-lg font-bold font-cairo mb-4">إحصائياتك الشاملة</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold">{state.dashboardData.total_fasting_sessions}</div>
              <div className="text-primary-100 font-cairo">إجمالي الجلسات</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{state.dashboardData.days_tracked}</div>
              <div className="text-primary-100 font-cairo">أيام متتبعة</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.abs(state.dashboardData.total_weight_change || 0).toFixed(1)}
              </div>
              <div className="text-primary-100 font-cairo">تغيير الوزن (كجم)</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {state.dashboardData.avg_daily_water?.toFixed(1) || 0}
              </div>
              <div className="text-primary-100 font-cairo">متوسط الماء (أكواب)</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border mb-6"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiClock} className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 font-cairo mb-2">
            {state.isActive ? 'الصيام نشط' : 'جاهز للبدء'}
          </h3>
          <p className="text-gray-600 font-cairo mb-4">
            نوع الصيام: {state.fastingType}
          </p>
          {state.syncing && (
            <p className="text-blue-500 text-sm font-cairo mb-2">
              جاري المزامنة مع قاعدة البيانات...
            </p>
          )}
          <Link
            to="/timer"
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg font-cairo font-semibold hover:bg-primary-600 transition-colors"
          >
            <SafeIcon icon={FiPlay} className="w-4 h-4 ml-2" />
            {state.isActive ? 'عرض المؤقت' : 'بدء الصيام'}
          </Link>
        </div>
      </motion.div>

      {/* Water Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm border mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 font-cairo">
            متتبع الماء
          </h3>
          <SafeIcon icon={FiDroplet} className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-500">
            {state.waterIntake}
          </span>
          <span className="text-gray-500 font-cairo">
            من {state.dailyWaterGoal} أكواب
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(state.waterIntake / state.dailyWaterGoal) * 100}%`,
            }}
          />
        </div>
        <button
          onClick={addWater}
          disabled={state.waterIntake >= state.dailyWaterGoal}
          className="w-full py-2 bg-blue-500 text-white rounded-lg font-cairo font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          أضف كوب ماء
        </button>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-3 gap-4"
      >
        <Link
          to="/meal-plan"
          className="bg-white p-4 rounded-xl shadow-sm border text-center hover:shadow-md transition-shadow"
        >
          <SafeIcon icon={FiCalendar} className="w-6 h-6 text-success-500 mx-auto mb-2" />
          <span className="text-sm font-cairo text-gray-700">خطة الوجبات</span>
        </Link>
        
        <Link
          to="/progress"
          className="bg-white p-4 rounded-xl shadow-sm border text-center hover:shadow-md transition-shadow"
        >
          <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-warning-500 mx-auto mb-2" />
          <span className="text-sm font-cairo text-gray-700">متابعة التقدم</span>
        </Link>

        <Link
          to="/analytics"
          className="bg-white p-4 rounded-xl shadow-sm border text-center hover:shadow-md transition-shadow"
        >
          <SafeIcon icon={FiHeart} className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <span className="text-sm font-cairo text-gray-700">التحليلات</span>
        </Link>
      </motion.div>

      {/* Recommendations Preview */}
      {state.recommendations && state.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border-2 border-green-200"
        >
          <h3 className="text-lg font-bold text-gray-800 font-cairo mb-2">
            توصية اليوم
          </h3>
          <div className="flex items-start">
            <span className="text-2xl ml-3">{state.recommendations[0].icon}</span>
            <div>
              <p className="font-semibold text-gray-800 font-cairo">
                {state.recommendations[0].title}
              </p>
              <p className="text-sm text-gray-600 font-cairo">
                {state.recommendations[0].description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;