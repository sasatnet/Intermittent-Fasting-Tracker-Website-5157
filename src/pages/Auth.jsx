import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiUserPlus, FiAlertCircle, FiCheckCircle } = FiIcons;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { signIn, signUp, loading, error } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear messages when user starts typing
    if (error || successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const { email, password, confirmPassword, firstName, lastName } = formData;
    
    if (!email || !password) {
      return 'يرجى ملء جميع الحقول المطلوبة';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'يرجى إدخال بريد إلكتروني صحيح';
    }

    if (password.length < 6) {
      return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    if (!isLogin) {
      if (!firstName || !lastName) {
        return 'يرجى إدخال الاسم الأول واسم العائلة';
      }
      
      if (password !== confirmPassword) {
        return 'كلمات المرور غير متطابقة';
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      if (isLogin) {
        console.log('Attempting login...');
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          console.error('Login error:', error);
        } else {
          console.log('Login successful');
        }
      } else {
        console.log('Attempting signup...');
        const userData = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim()
        };
        
        const { error, data } = await signUp(formData.email, formData.password, userData);
        if (error) {
          console.error('Signup error:', error);
        } else {
          console.log('Signup successful:', data);
          setSuccessMessage('تم إنشاء الحساب بنجاح! مرحباً بك في التطبيق.');
          
          // Reset form
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: ''
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // تسجيل دخول تجريبي سريع
  const handleTestLogin = async () => {
    setFormData({
      email: 'test@test.com',
      password: '12345678',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    });
    
    setIsSubmitting(true);
    try {
      const { error } = await signIn('test@test.com', '12345678');
      if (error) {
        console.error('Test login error:', error);
      } else {
        console.log('Test login successful');
      }
    } catch (error) {
      console.error('Test login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <SafeIcon icon={FiUser} className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 font-cairo mb-2">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h1>
          <p className="text-gray-600 font-cairo">
            {isLogin 
              ? 'أدخل بياناتك للوصول إلى حسابك' 
              : 'انضم إلينا وابدأ رحلة الصيام المتقطع'}
          </p>
        </div>

        {/* Test Login Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTestLogin}
          disabled={loading || isSubmitting}
          className="w-full flex items-center justify-center py-3 bg-green-500 text-white rounded-lg font-cairo font-semibold mb-6 hover:bg-green-600 transition-colors"
        >
          🚀 تجربة سريعة (حساب تجريبي)
        </motion.button>

        <div className="text-center text-gray-400 mb-6">
          <span>أو</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name & Last Name (only for signup) */}
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
                  الاسم الأول
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required={!isLogin}
                  className="w-full p-3 border border-gray-300 rounded-lg font-cairo text-right focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="الاسم الأول"
                />
              </div>
              <div>
                <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
                  اسم العائلة
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required={!isLogin}
                  className="w-full p-3 border border-gray-300 rounded-lg font-cairo text-right focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="اسم العائلة"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg font-cairo text-right focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="example@email.com"
              />
              <SafeIcon 
                icon={FiMail} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="w-full p-3 px-10 border border-gray-300 rounded-lg font-cairo text-right focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="كلمة المرور"
              />
              <SafeIcon 
                icon={FiLock} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Confirm Password (only for signup) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required={!isLogin}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg font-cairo text-right focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="تأكيد كلمة المرور"
                />
                <SafeIcon 
                  icon={FiLock} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
                />
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center"
            >
              <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-600 ml-2" />
              <p className="text-green-600 text-sm font-cairo">{successMessage}</p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
            >
              <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-600 ml-2" />
              <p className="text-red-600 text-sm font-cairo">{error}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || isSubmitting}
            className="w-full flex items-center justify-center py-3 bg-primary-500 text-white rounded-lg font-cairo font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors"
          >
            {(loading || isSubmitting) ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <SafeIcon 
                  icon={isLogin ? FiLogIn : FiUserPlus} 
                  className="w-5 h-5 ml-2" 
                />
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
              </>
            )}
          </motion.button>

          {/* Toggle Mode */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setSuccessMessage('');
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  firstName: '',
                  lastName: ''
                });
              }}
              className="text-primary-500 font-cairo text-sm hover:underline"
            >
              {isLogin 
                ? 'ليس لديك حساب؟ إنشاء حساب جديد' 
                : 'لديك حساب بالفعل؟ تسجيل الدخول'}
            </button>
          </div>
        </form>

        {/* Test Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-cairo text-gray-600 text-center">
            <strong>الحساب التجريبي:</strong><br/>
            البريد: test@test.com<br/>
            كلمة المرور: 12345678
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;