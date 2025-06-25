import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight } = FiIcons;

const RecommendationCard = ({ recommendation, index, onActionClick }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'أولوية عالية';
      case 'medium':
        return 'أولوية متوسطة';
      case 'low':
        return 'أولوية منخفضة';
      default:
        return 'عادي';
    }
  };

  const getPriorityTextColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-xl p-4 border-2 ${getPriorityColor(recommendation.priority)}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl ml-3">{recommendation.icon}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold font-cairo text-lg text-gray-800">
                {recommendation.title}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full font-cairo ${getPriorityTextColor(recommendation.priority)} bg-white`}>
                {getPriorityLabel(recommendation.priority)}
              </span>
            </div>
            <p className="text-sm font-cairo text-gray-700 mb-2">
              {recommendation.description}
            </p>
          </div>
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onActionClick && onActionClick(recommendation)}
        className="w-full flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
      >
        <span className="font-cairo text-gray-800 font-semibold">
          {recommendation.action}
        </span>
        <SafeIcon icon={FiArrowRight} className="w-4 h-4 text-gray-500" />
      </motion.button>
    </motion.div>
  );
};

export default RecommendationCard;