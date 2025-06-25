import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTrendingDown, FiMinus } = FiIcons;

const InsightCard = ({ insight, index }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return FiTrendingUp;
      case 'down':
        return FiTrendingDown;
      default:
        return FiMinus;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-xl p-4 border-2 ${getTypeColor(insight.type)}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl ml-3">{insight.icon}</span>
          <div>
            <h3 className="font-bold font-cairo text-lg">
              {insight.title}
            </h3>
            <p className="text-sm font-cairo opacity-75">
              {insight.description}
            </p>
          </div>
        </div>
        {insight.trend && (
          <div className="flex items-center">
            <SafeIcon 
              icon={getTrendIcon(insight.trend)} 
              className={`w-5 h-5 ${getTrendColor(insight.trend)}`} 
            />
          </div>
        )}
      </div>
      
      {insight.value && (
        <div className="text-right">
          <span className="text-2xl font-bold font-cairo">
            {insight.value}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default InsightCard;