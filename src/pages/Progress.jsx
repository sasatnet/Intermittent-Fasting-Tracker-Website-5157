import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useFasting } from '../context/FastingContext';
import ReactECharts from 'echarts-for-react';

const { FiTrendingUp, FiTarget, FiCalendar, FiActivity, FiScale } = FiIcons;

const Progress = () => {
  const { state, dispatch } = useFasting();
  const [weightInput, setWeightInput] = useState('');
  const [targetWeightInput, setTargetWeightInput] = useState('');

  // Generate mock weight data for chart
  const generateWeightData = () => {
    const data = [];
    const startWeight = state.weight || 70;
    const targetWeight = state.targetWeight || startWeight - 5;
    const weightLossPerDay = (startWeight - targetWeight) / 20;
    
    for (let i = 1; i <= Math.min(state.currentDay, 20); i++) {
      const expectedWeight = startWeight - (weightLossPerDay * i);
      const variation = (Math.random() - 0.5) * 0.5; // Small random variation
      data.push([i, Math.max(expectedWeight + variation, targetWeight)]);
    }
    return data;
  };

  const chartOption = {
    title: {
      text: 'تطور الوزن',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        return `اليوم ${params[0].data[0]}: ${params[0].data[1].toFixed(1)} كجم`;
      }
    },
    xAxis: {
      type: 'value',
      name: 'الأيام',
      nameLocation: 'middle',
      nameGap: 30,
      min: 1,
      max: 20
    },
    yAxis: {
      type: 'value',
      name: 'الوزن (كجم)',
      nameLocation: 'middle',
      nameGap: 50
    },
    series: [{
      data: generateWeightData(),
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        color: '#0ea5e9',
        width: 3
      },
      itemStyle: {
        color: '#0ea5e9'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(14, 165, 233, 0.3)'
          }, {
            offset: 1, color: 'rgba(14, 165, 233, 0.05)'
          }]
        }
      }
    }]
  };

  const updateWeight = () => {
    if (weightInput && !isNaN(weightInput)) {
      dispatch({ type: 'SET_WEIGHT', payload: parseFloat(weightInput) });
      setWeightInput('');
    }
  };

  const updateTargetWeight = () => {
    if (targetWeightInput && !isNaN(targetWeightInput)) {
      dispatch({ type: 'SET_TARGET_WEIGHT', payload: parseFloat(targetWeightInput) });
      setTargetWeightInput('');
    }
  };

  const completionPercentage = (state.currentDay / 20) * 100;
  const weightLoss = state.weight && state.targetWeight 
    ? Math.max(0, state.weight - (state.weight - ((state.weight - state.targetWeight) * (state.currentDay / 20))))
    : 0;

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 font-cairo mb-2">
          متابعة التقدم
        </h1>
        <p className="text-gray-600 font-cairo">
          تتبع رحلتك نحو الهدف
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white mb-6"
      >
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">
            {state.currentDay}/20
          </div>
          <p className="text-primary-100 font-cairo mb-4">أيام مكتملة</p>
          
          <div className="w-full bg-primary-400 rounded-full h-3 mb-2">
            <motion.div
              className="bg-white h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-sm text-primary-100 font-cairo">
            {completionPercentage.toFixed(1)}% من البرنامج
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <SafeIcon icon={FiTarget} className="w-5 h-5 text-success-500" />
            <span className="text-xl font-bold text-success-500">
              {state.completedDays.length}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-cairo">أيام ناجحة</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <SafeIcon icon={FiActivity} className="w-5 h-5 text-primary-500" />
            <span className="text-xl font-bold text-primary-500">
              {state.longestStreak}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-cairo">أطول سلسلة</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <SafeIcon icon={FiScale} className="w-5 h-5 text-warning-500" />
            <span className="text-xl font-bold text-warning-500">
              {weightLoss.toFixed(1)}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-cairo">كجم مفقود</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-blue-500" />
            <span className="text-xl font-bold text-blue-500">
              {state.currentStreak}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-cairo">السلسلة الحالية</p>
        </div>
      </motion.div>

      {/* Weight Chart */}
      {state.weight && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <ReactECharts 
            option={chartOption} 
            style={{ height: '250px' }}
            opts={{ renderer: 'svg' }}
          />
        </motion.div>
      )}

      {/* Weight Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm border mb-6"
      >
        <h3 className="text-lg font-bold text-gray-800 font-cairo mb-4">
          تحديث الوزن
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-cairo text-gray-600 mb-2">
              الوزن الحالي (كجم)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder={state.weight ? state.weight.toString() : "أدخل وزنك"}
                className="flex-1 p-3 border border-gray-300 rounded-lg font-cairo text-right"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={updateWeight}
                className="px-4 py-3 bg-primary-500 text-white rounded-lg font-cairo font-semibold"
              >
                حفظ
              </motion.button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-cairo text-gray-600 mb-2">
              الوزن المستهدف (كجم)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={targetWeightInput}
                onChange={(e) => setTargetWeightInput(e.target.value)}
                placeholder={state.targetWeight ? state.targetWeight.toString() : "أدخل الهدف"}
                className="flex-1 p-3 border border-gray-300 rounded-lg font-cairo text-right"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={updateTargetWeight}
                className="px-4 py-3 bg-success-500 text-white rounded-lg font-cairo font-semibold"
              >
                حفظ
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievement Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl p-6 shadow-sm border"
      >
        <h3 className="text-lg font-bold text-gray-800 font-cairo mb-4">
          الإنجازات
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          <div className={`p-3 rounded-lg text-center ${
            state.completedDays.length >= 1 ? 'bg-success-50 text-success-600' : 'bg-gray-50 text-gray-400'
          }`}>
            <SafeIcon icon={FiTarget} className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs font-cairo">اليوم الأول</p>
          </div>
          
          <div className={`p-3 rounded-lg text-center ${
            state.completedDays.length >= 7 ? 'bg-success-50 text-success-600' : 'bg-gray-50 text-gray-400'
          }`}>
            <SafeIcon icon={FiCalendar} className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs font-cairo">أسبوع كامل</p>
          </div>
          
          <div className={`p-3 rounded-lg text-center ${
            state.completedDays.length >= 20 ? 'bg-success-50 text-success-600' : 'bg-gray-50 text-gray-400'
          }`}>
            <SafeIcon icon={FiTrendingUp} className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs font-cairo">البطل</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Progress;