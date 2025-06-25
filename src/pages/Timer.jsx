import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useFasting } from '../context/FastingContext';
import { useNotifications } from '../context/NotificationContext';
import { fastingStages, getFastingStageByHour, getNextStage } from '../data/fastingStages';

const { FiPlay, FiPause, FiSquare, FiClock, FiBell, FiCalendar, FiInfo } = FiIcons;

const Timer = () => {
  const { state, dispatch, startFastingSession, endFastingSession } = useFasting();
  const { scheduleNotification, showNotification } = useNotifications();
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentStage, setCurrentStage] = useState(null);
  const [nextStage, setNextStage] = useState(null);
  const [showStageInfo, setShowStageInfo] = useState(false);

  useEffect(() => {
    let interval;
    if (state.isActive && state.startTime && state.endTime) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(state.startTime).getTime();
        const end = new Date(state.endTime).getTime();
        const elapsed = now - start;
        const remaining = end - now;

        setTimeElapsed(elapsed);
        setTimeLeft(Math.max(0, remaining));

        // Calculate current fasting stage
        const elapsedHours = elapsed / (1000 * 60 * 60);
        const stage = getFastingStageByHour(elapsedHours);
        const next = getNextStage(elapsedHours);

        setCurrentStage(stage);
        setNextStage(next);

        // Check if we've reached a new stage
        if (stage && currentStage && stage.id !== currentStage.id) {
          showNotification(
            `🎉 وصلت لمرحلة جديدة!`,
            {
              body: `${stage.name} - ${stage.description}`,
              icon: '/icon-192x192.png'
            }
          );
        }

        if (remaining <= 0) {
          handleEndFast();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state.isActive, state.startTime, state.endTime, currentStage, showNotification]);

  const handleStartFast = async () => {
    try {
      const now = new Date();
      const endTime = new Date(now.getTime() + state.fastingHours * 60 * 60 * 1000);

      await startFastingSession(
        now.toISOString(),
        endTime.toISOString(),
        state.fastingType
      );

      // Schedule notifications for each fasting stage
      fastingStages.forEach(stage => {
        if (stage.hours[0] > 0 && stage.hours[0] <= state.fastingHours) {
          const notificationTime = new Date(now.getTime() + stage.hours[0] * 60 * 60 * 1000);
          scheduleNotification(
            `${stage.icon} ${stage.name}`,
            `${stage.description} - ${stage.timeRange}`,
            notificationTime
          );
        }
      });

      // Schedule end notification
      scheduleNotification(
        '🎉 انتهى وقت الصيام!',
        'يمكنك الآن كسر الصيام وتناول وجبتك',
        endTime
      );

      showNotification('🎯 بدء الصيام', {
        body: `بدأت جلسة صيام ${state.fastingType} - حظاً موفقاً!`,
        icon: '/icon-192x192.png'
      });

    } catch (error) {
      console.error('Error starting fast:', error);
      showNotification('خطأ', {
        body: 'حدث خطأ في بدء الصيام. حاول مرة أخرى.',
        icon: '/icon-192x192.png'
      });
    }
  };

  const handleEndFast = async () => {
    try {
      await endFastingSession();
      
      setTimeLeft(0);
      setTimeElapsed(0);
      setCurrentStage(null);
      setNextStage(null);

      showNotification('🎉 تهانينا! انتهى وقت الصيام', {
        body: 'يمكنك الآن كسر الصيام وتناول وجبتك',
        icon: '/icon-192x192.png'
      });

    } catch (error) {
      console.error('Error ending fast:', error);
      // Still update UI even if database sync fails
      dispatch({ type: 'END_FAST' });
      setTimeLeft(0);
      setTimeElapsed(0);
      setCurrentStage(null);
      setNextStage(null);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!state.isActive) return 0;
    const totalTime = state.fastingHours * 60 * 60 * 1000;
    return Math.min((timeElapsed / totalTime) * 100, 100);
  };

  const getCurrentStageProgress = () => {
    if (!currentStage || !state.isActive) return 0;
    const elapsedHours = timeElapsed / (1000 * 60 * 60);
    const stageStart = currentStage.hours[0];
    const stageEnd = currentStage.hours[1];
    const stageProgress = ((elapsedHours - stageStart) / (stageEnd - stageStart)) * 100;
    return Math.min(Math.max(stageProgress, 0), 100);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-800 font-cairo mb-2">
          مؤقت الصيام
        </h1>
        <p className="text-gray-600 font-cairo">
          اليوم {state.currentDay} من 20
        </p>
        {state.syncing && (
          <p className="text-blue-500 text-sm font-cairo mt-1">
            جاري المزامنة مع قاعدة البيانات...
          </p>
        )}
      </motion.div>

      {/* Timer Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-8"
      >
        <div className="w-64 h-64 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={currentStage?.color || "#0ea5e9"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - getProgress() / 100) }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* Timer display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {currentStage && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-4xl mb-2"
              >
                {currentStage.icon}
              </motion.div>
            )}
            <div className="text-3xl font-bold text-gray-800 font-mono">
              {state.isActive ? formatTime(timeLeft) : `${state.fastingHours}:00:00`}
            </div>
            <div className="text-sm text-gray-500 font-cairo mt-1">
              {state.isActive ? 'متبقي' : `صيام ${state.fastingType}`}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Current Stage Info */}
      {state.isActive && currentStage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
          style={{ borderColor: currentStage.color }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{currentStage.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-800 font-cairo">
                  {currentStage.name}
                </h3>
                <p className="text-sm text-gray-600 font-cairo">
                  {currentStage.timeRange}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowStageInfo(true)}
              className="p-2 bg-gray-100 rounded-lg"
            >
              <SafeIcon icon={FiInfo} className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>

          <p className="text-gray-700 font-cairo mb-4">
            {currentStage.description}
          </p>

          {/* Stage Progress */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: currentStage.color,
                width: `${getCurrentStageProgress()}%`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${getCurrentStageProgress()}%` }}
            />
          </div>

          {/* Next Stage Preview */}
          {nextStage && (
            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-gray-600 font-cairo mb-2">
                المرحلة التالية:
              </p>
              <div className="flex items-center">
                <span className="text-lg mr-2">{nextStage.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 font-cairo">
                    {nextStage.name}
                  </p>
                  <p className="text-xs text-gray-500 font-cairo">
                    {nextStage.timeRange}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Overall Status */}
      {state.isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-50 p-4 rounded-xl mb-6 text-center"
        >
          <p className="text-primary-800 font-cairo mb-2">
            <span className="font-semibold">الوقت المنقضي:</span> {formatTime(timeElapsed)}
          </p>
          <div className="w-full bg-primary-200 rounded-full h-2">
            <motion.div
              className="bg-primary-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center gap-4 mb-6"
      >
        {!state.isActive ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartFast}
            disabled={state.loading}
            className="flex items-center px-8 py-4 bg-primary-500 text-white rounded-xl font-cairo font-semibold text-lg shadow-lg disabled:opacity-50"
          >
            {state.loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
            ) : (
              <SafeIcon icon={FiPlay} className="w-5 h-5 ml-2" />
            )}
            بدء الصيام
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEndFast}
            disabled={state.loading}
            className="flex items-center px-8 py-4 bg-red-500 text-white rounded-xl font-cairo font-semibold text-lg shadow-lg disabled:opacity-50"
          >
            {state.loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
            ) : (
              <SafeIcon icon={FiSquare} className="w-5 h-5 ml-2" />
            )}
            إنهاء الصيام
          </motion.button>
        )}
      </motion.div>

      {/* Fasting Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border"
      >
        <h3 className="text-lg font-bold text-gray-800 font-cairo mb-4">
          أنواع الصيام المتقطع
        </h3>
        <div className="space-y-3">
          {['16:8', '18:6', '20:4', '14:10'].map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch({ type: 'SET_FASTING_TYPE', payload: type })}
              className={`w-full p-3 rounded-lg text-right font-cairo transition-colors ${
                state.fastingType === type
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              disabled={state.isActive}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{type}</span>
                <span className="text-sm opacity-75">
                  {type === '16:8' && 'صيام 16 ساعة، أكل 8 ساعات'}
                  {type === '18:6' && 'صيام 18 ساعة، أكل 6 ساعات'}
                  {type === '20:4' && 'صيام 20 ساعة، أكل 4 ساعات'}
                  {type === '14:10' && 'صيام 14 ساعة، أكل 10 ساعات'}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stage Info Modal */}
      {showStageInfo && currentStage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowStageInfo(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <span className="text-4xl mb-4 block">{currentStage.icon}</span>
              <h2 className="text-xl font-bold text-gray-800 font-cairo mb-2">
                {currentStage.name}
              </h2>
              <p className="text-gray-600 font-cairo">{currentStage.timeRange}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 font-cairo mb-3">
                ما يحدث في جسمك:
              </h3>
              <ul className="space-y-2">
                {currentStage.effects.map((effect, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0" />
                    <span className="text-gray-700 font-cairo">{effect}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 font-cairo mb-3">
                نصائح لهذه المرحلة:
              </h3>
              <ul className="space-y-2">
                {currentStage.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0" />
                    <span className="text-gray-700 font-cairo">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowStageInfo(false)}
              className="w-full py-3 bg-primary-500 text-white rounded-lg font-cairo font-semibold"
            >
              فهمت
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Timer;