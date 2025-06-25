import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useFasting } from '../context/FastingContext';
import AnalyticsChart from '../components/AnalyticsChart';
import InsightCard from '../components/InsightCard';
import RecommendationCard from '../components/RecommendationCard';

const { FiTrendingUp, FiTarget, FiActivity, FiHeart, FiRefreshCw } = FiIcons;

const Analytics = () => {
  const { state, dispatch } = useFasting();
  const [refreshing, setRefreshing] = useState(false);

  const refreshAnalytics = async () => {
    setRefreshing(true);
    try {
      // Reload all analytics data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      // In real app, you would reload data from database
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Generate insights based on user stats
  const generateInsights = () => {
    const insights = [];
    const { userStats, weeklyProgress, dashboardData } = state;

    if (userStats) {
      if (userStats.current_streak >= 7) {
        insights.push({
          type: 'success',
          icon: '🔥',
          title: 'سلسلة رائعة!',
          description: `${userStats.current_streak} أيام متتالية من النجاح`,
          value: `${userStats.current_streak} يوم`,
          trend: 'up'
        });
      }

      if (userStats.total_sessions > 0) {
        const successRate = (userStats.completed_sessions / userStats.total_sessions) * 100;
        insights.push({
          type: successRate >= 80 ? 'success' : successRate >= 60 ? 'warning' : 'info',
          icon: '🎯',
          title: 'معدل النجاح',
          description: `أكملت ${userStats.completed_sessions} من ${userStats.total_sessions} جلسة`,
          value: `${successRate.toFixed(1)}%`,
          trend: successRate >= 70 ? 'up' : 'down'
        });
      }

      if (userStats.avg_weight_loss !== 0) {
        insights.push({
          type: userStats.avg_weight_loss > 0 ? 'success' : 'info',
          icon: userStats.avg_weight_loss > 0 ? '📉' : '📈',
          title: 'تغيير الوزن',
          description: userStats.avg_weight_loss > 0 ? 'فقدان وزن مستمر' : 'زيادة في الوزن',
          value: `${Math.abs(userStats.avg_weight_loss).toFixed(1)} كجم`,
          trend: userStats.avg_weight_loss > 0 ? 'down' : 'up'
        });
      }
    }

    if (dashboardData) {
      insights.push({
        type: 'info',
        icon: '💧',
        title: 'شرب الماء',
        description: `متوسط ${dashboardData.avg_daily_water.toFixed(1)} أكواب يومياً`,
        value: `${dashboardData.avg_daily_water.toFixed(1)} أكواب`,
        trend: dashboardData.avg_daily_water >= 8 ? 'up' : 'down'
      });
    }

    return insights;
  };

  const insights = generateInsights();

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
            التحليلات والإحصائيات
          </h1>
          <p className="text-gray-600 font-cairo">
            تحليل مفصل لتقدمك
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshAnalytics}
          disabled={refreshing}
          className="p-3 bg-primary-500 text-white rounded-xl disabled:opacity-50"
        >
          <SafeIcon
            icon={FiRefreshCw}
            className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`}
          />
        </motion.button>
      </motion.div>

      {/* Key Metrics */}
      {state.dashboardData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-xl text-white">
            <div className="flex items-center justify-between mb-2">
              <SafeIcon icon={FiTarget} className="w-5 h-5" />
              <span className="text-2xl font-bold">
                {state.dashboardData.successful_fasting_days}
              </span>
            </div>
            <p className="text-primary-100 text-sm font-cairo">أيام ناجحة</p>
          </div>

          <div className="bg-gradient-to-r from-success-500 to-success-600 p-4 rounded-xl text-white">
            <div className="flex items-center justify-between mb-2">
              <SafeIcon icon={FiActivity} className="w-5 h-5" />
              <span className="text-2xl font-bold">
                {state.dashboardData.fasting_success_rate.toFixed(1)}%
              </span>
            </div>
            <p className="text-success-100 text-sm font-cairo">معدل النجاح</p>
          </div>

          <div className="bg-gradient-to-r from-warning-500 to-warning-600 p-4 rounded-xl text-white">
            <div className="flex items-center justify-between mb-2">
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5" />
              <span className="text-2xl font-bold">
                {Math.abs(state.dashboardData.total_weight_change || 0).toFixed(1)}
              </span>
            </div>
            <p className="text-warning-100 text-sm font-cairo">تغيير الوزن (كجم)</p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
            <div className="flex items-center justify-between mb-2">
              <SafeIcon icon={FiHeart} className="w-5 h-5" />
              <span className="text-2xl font-bold">
                {state.dashboardData.days_tracked}
              </span>
            </div>
            <p className="text-blue-100 text-sm font-cairo">أيام متتبعة</p>
          </div>
        </motion.div>
      )}

      {/* Weekly Progress Chart */}
      {state.weeklyProgress && state.weeklyProgress.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <h3 className="text-lg font-bold text-gray-800 font-cairo mb-4">
            التقدم الأسبوعي
          </h3>
          <AnalyticsChart
            data={state.weeklyProgress}
            type="weeklySuccess"
            title="معدل النجاح الأسبوعي"
            height="250px"
          />
        </motion.div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h3 className="text-lg font-bold text-gray-800 font-cairo mb-4">
            رؤى ذكية
          </h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <InsightCard
                key={index}
                insight={insight}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {state.recommendations && state.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-lg font-bold text-gray-800 font-cairo mb-4">
            توصيات شخصية
          </h3>
          <div className="space-y-4">
            {state.recommendations.map((recommendation, index) => (
              <RecommendationCard
                key={index}
                recommendation={recommendation}
                index={index}
                onActionClick={(rec) => {
                  console.log('Recommendation action clicked:', rec);
                  // Handle recommendation action
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* No Data Message */}
      {(!state.dashboardData || state.dashboardData.days_tracked === 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiTrendingUp} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-600 font-cairo mb-2">
            لا توجد بيانات كافية
          </h3>
          <p className="text-gray-500 font-cairo">
            استمر في استخدام التطبيق لرؤية التحليلات
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;