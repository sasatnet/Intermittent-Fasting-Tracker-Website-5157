import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useFasting } from '../context/FastingContext';
import { useAuth } from '../context/AuthContext';
import ProfileSetup from './ProfileSetup';

const { FiSettings, FiBell, FiRefreshCw, FiInfo, FiHeart, FiUser, FiEdit3, FiLogOut, FiDatabase } = FiIcons;

const Settings = () => {
  const { state, dispatch, syncUserProfile } = useFasting();
  const { user, signOut } = useAuth();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const toggleNotifications = () => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: !state.notifications });
  };

  const resetProgress = () => {
    localStorage.removeItem('fastingState');
    window.location.reload();
  };

  const resetWater = () => {
    dispatch({ type: 'RESET_WATER' });
  };

  const handleProfileEditComplete = () => {
    setShowProfileEdit(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSyncProfile = async () => {
    if (state.userProfile.gender && state.userProfile.age) {
      await syncUserProfile({
        ...state.userProfile,
        weight: state.weight,
        targetWeight: state.targetWeight,
      });
    }
  };

  if (showProfileEdit) {
    return <ProfileSetup onComplete={handleProfileEditComplete} />;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 font-cairo mb-2">
          الإعدادات
        </h1>
        <p className="text-gray-600 font-cairo">
          تخصيص تجربة الصيام المتقطع
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center ml-4">
              <SafeIcon icon={FiUser} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-cairo">
                مرحباً بك!
              </h3>
              <p className="text-primary-100 font-cairo">
                اليوم {state.currentDay} من رحلة الـ 20 يوم
              </p>
              <p className="text-primary-200 font-cairo text-sm">
                {user?.email}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileEdit(true)}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <SafeIcon icon={FiEdit3} className="w-5 h-5 text-white" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSignOutConfirm(true)}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <SafeIcon icon={FiLogOut} className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Sync Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-primary-100">
            <SafeIcon icon={FiDatabase} className="w-4 h-4 ml-2" />
            <span className="text-sm font-cairo">
              {state.syncing ? 'جاري المزامنة...' : 'متصل بقاعدة البيانات'}
            </span>
          </div>
          {state.syncing && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </motion.div>

      {/* Settings Options */}
      <div className="space-y-4">
        {/* Profile Info */}
        {state.userProfile.gender && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 font-cairo flex items-center">
                <SafeIcon icon={FiUser} className="w-5 h-5 text-primary-500 ml-3" />
                معلومات الملف الشخصي
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSyncProfile}
                disabled={state.syncing}
                className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors disabled:opacity-50"
              >
                <SafeIcon icon={FiDatabase} className="w-4 h-4" />
              </motion.button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 font-cairo block">الجنس:</span>
                <span className="font-cairo text-gray-800">
                  {state.userProfile.gender === 'male' ? 'ذكر' : 'أنثى'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-cairo block">العمر:</span>
                <span className="font-cairo text-gray-800">{state.userProfile.age} سنة</span>
              </div>
              <div>
                <span className="text-gray-500 font-cairo block">الوزن:</span>
                <span className="font-cairo text-gray-800">{state.weight} كجم</span>
              </div>
              <div>
                <span className="text-gray-500 font-cairo block">الهدف:</span>
                <span className="font-cairo text-gray-800">
                  {state.userProfile.goal === 'weight_loss' && 'فقدان الوزن'}
                  {state.userProfile.goal === 'weight_gain' && 'زيادة الوزن'}
                  {state.userProfile.goal === 'maintenance' && 'المحافظة'}
                  {state.userProfile.goal === 'muscle_gain' && 'بناء العضلات'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SafeIcon icon={FiBell} className="w-5 h-5 text-primary-500 ml-3" />
              <div>
                <h3 className="font-bold text-gray-800 font-cairo">التنبيهات</h3>
                <p className="text-sm text-gray-500 font-cairo">
                  تلقي تذكيرات الصيام والوجبات
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleNotifications}
              className={`w-12 h-6 rounded-full transition-colors ${
                state.notifications ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-sm"
                animate={{ x: state.notifications ? 24 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Fasting Type */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border"
        >
          <div className="flex items-center mb-4">
            <SafeIcon icon={FiSettings} className="w-5 h-5 text-primary-500 ml-3" />
            <h3 className="font-bold text-gray-800 font-cairo">نوع الصيام</h3>
          </div>
          <div className="space-y-2">
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
                {type} - 
                {type === '16:8' && ' الأكثر شيوعاً'}
                {type === '18:6' && ' متوسط الصعوبة'}
                {type === '20:4' && ' صعب - للمتقدمين'}
                {type === '14:10' && ' سهل - للمبتدئين'}
              </motion.button>
            ))}
          </div>
          {state.isActive && (
            <p className="text-xs text-warning-600 font-cairo mt-2">
              لا يمكن تغيير نوع الصيام أثناء الصيام النشط
            </p>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border"
        >
          <h3 className="font-bold text-gray-800 font-cairo mb-4 flex items-center">
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5 text-primary-500 ml-3" />
            إعدادات سريعة
          </h3>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetWater}
              className="w-full p-3 bg-blue-50 text-blue-600 rounded-lg font-cairo text-right hover:bg-blue-100 transition-colors"
            >
              إعادة تعيين شرب الماء اليومي
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowResetConfirm(true)}
              className="w-full p-3 bg-red-50 text-red-600 rounded-lg font-cairo text-right hover:bg-red-100 transition-colors"
            >
              إعادة تعيين جميع البيانات
            </motion.button>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200"
        >
          <div className="flex items-center mb-4">
            <SafeIcon icon={FiInfo} className="w-5 h-5 text-green-600 ml-3" />
            <h3 className="font-bold text-gray-800 font-cairo">النسخة الكاملة</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700 font-cairo">
            <p>
              التطبيق متصل بقاعدة بيانات Supabase ويتم حفظ بياناتك بشكل آمن.
            </p>
            <div className="flex items-center text-green-600">
              <SafeIcon icon={FiDatabase} className="w-4 h-4 ml-2" />
              <span>متصل بقاعدة البيانات</span>
            </div>
            <div className="flex items-center text-blue-600">
              <SafeIcon icon={FiHeart} className="w-4 h-4 ml-2" />
              <span>صنع بحب لصحة أفضل</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowResetConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 font-cairo mb-4 text-center">
              تأكيد إعادة التعيين
            </h3>
            <p className="text-gray-600 font-cairo text-center mb-6">
              هل أنت متأكد من رغبتك في حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-cairo font-semibold"
              >
                إلغاء
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetProgress}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-cairo font-semibold"
              >
                حذف الكل
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSignOutConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 font-cairo mb-4 text-center">
              تسجيل الخروج
            </h3>
            <p className="text-gray-600 font-cairo text-center mb-6">
              هل أنت متأكد من رغبتك في تسجيل الخروج؟
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-cairo font-semibold"
              >
                إلغاء
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-cairo font-semibold"
              >
                تسجيل الخروج
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Settings;