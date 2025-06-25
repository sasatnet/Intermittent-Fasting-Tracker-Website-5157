import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useFasting } from '../context/FastingContext';

const { FiHome, FiClock, FiCalendar, FiTrendingUp, FiSettings, FiShoppingCart, FiBell, FiBarChart3 } = FiIcons;

const Navbar = () => {
  const location = useLocation();
  const { state } = useFasting();

  const navItems = [
    { path: '/', icon: FiHome, label: 'الرئيسية' },
    { path: '/timer', icon: FiClock, label: 'المؤقت' },
    { path: '/meal-plan', icon: FiCalendar, label: 'الوجبات' },
    { path: '/schedule', icon: FiBell, label: 'الجدولة' },
    { path: '/progress', icon: FiTrendingUp, label: 'التقدم' },
    { path: '/analytics', icon: FiBarChart3, label: 'التحليلات' },
  ];

  const cartItemCount = state.shoppingCart.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
    >
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center py-2 px-2 min-w-0 flex-1"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-500 hover:text-primary-500'
                }`}
              >
                <SafeIcon icon={item.icon} className="w-4 h-4" />
              </motion.div>
              <span
                className={`text-xs mt-1 font-cairo ${
                  isActive
                    ? 'text-primary-500 font-semibold'
                    : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Shopping Cart */}
        <Link
          to="/shopping-cart"
          className="flex flex-col items-center py-2 px-2 min-w-0 flex-1"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-lg transition-colors relative ${
              location.pathname === '/shopping-cart'
                ? 'bg-primary-500 text-white'
                : 'text-gray-500 hover:text-primary-500'
            }`}
          >
            <SafeIcon icon={FiShoppingCart} className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </motion.div>
          <span
            className={`text-xs mt-1 font-cairo ${
              location.pathname === '/shopping-cart'
                ? 'text-primary-500 font-semibold'
                : 'text-gray-500'
            }`}
          >
            السلة
          </span>
        </Link>

        {/* Settings */}
        <Link
          to="/settings"
          className="flex flex-col items-center py-2 px-2 min-w-0 flex-1"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-lg transition-colors ${
              location.pathname === '/settings'
                ? 'bg-primary-500 text-white'
                : 'text-gray-500 hover:text-primary-500'
            }`}
          >
            <SafeIcon icon={FiSettings} className="w-4 h-4" />
          </motion.div>
          <span
            className={`text-xs mt-1 font-cairo ${
              location.pathname === '/settings'
                ? 'text-primary-500 font-semibold'
                : 'text-gray-500'
            }`}
          >
            الإعدادات
          </span>
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;