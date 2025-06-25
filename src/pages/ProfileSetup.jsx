import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useFasting } from '../context/FastingContext';

const { FiUser, FiTarget, FiActivity, FiHeart, FiCheck } = FiIcons;

const ProfileSetup = ({ onComplete }) => {
  const { state, dispatch, syncUserProfile } = useFasting();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    gender: state.userProfile.gender || '',
    age: state.userProfile.age || '',
    weight: state.weight || '',
    height: state.userProfile.height || '',
    targetWeight: state.targetWeight || '',
    activityLevel: state.userProfile.activityLevel || 'moderate',
    goal: state.userProfile.goal || 'weight_loss',
    healthConditions: state.userProfile.healthConditions || [],
    preferences: state.userProfile.preferences || {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
    }
  });

  const totalSteps = 4;

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (preference) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: !prev.preferences[preference]
      }
    }));
  };

  const handleHealthConditionChange = (condition) => {
    setProfileData(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(c => c !== condition)
        : [...prev.healthConditions, condition]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      completeSetup();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeSetup = async () => {
    try {
      // Update local state
      dispatch({ type: 'UPDATE_USER_PROFILE', payload: profileData });
      
      if (profileData.weight) {
        dispatch({ type: 'SET_WEIGHT', payload: parseFloat(profileData.weight) });
      }
      
      if (profileData.targetWeight) {
        dispatch({ type: 'SET_TARGET_WEIGHT', payload: parseFloat(profileData.targetWeight) });
      }

      // Calculate and set recommended fasting type
      const recommendedFasting = getRecommendedFasting();
      dispatch({ type: 'SET_FASTING_TYPE', payload: recommendedFasting });

      // Sync with database
      await syncUserProfile({
        ...profileData,
        weight: parseFloat(profileData.weight),
        targetWeight: parseFloat(profileData.targetWeight),
      });

      onComplete();
    } catch (error) {
      console.error('Error completing profile setup:', error);
      // Still complete setup even if sync fails
      onComplete();
    }
  };

  const getRecommendedFasting = () => {
    const { age, gender, activityLevel, goal } = profileData;
    
    // Beginner-friendly for older adults or those new to fasting
    if (age > 50 || goal === 'maintenance') {
      return '14:10';
    }
    
    // Standard recommendation for most people
    if (goal === 'weight_loss' && activityLevel === 'moderate') {
      return '16:8';
    }
    
    // More intensive for active individuals wanting faster results
    if (activityLevel === 'active' || activityLevel === 'very_active') {
      return '18:6';
    }
    
    return '16:8'; // Default
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profileData.gender && profileData.age && profileData.weight && profileData.height;
      case 2:
        return profileData.targetWeight && profileData.goal;
      case 3:
        return profileData.activityLevel;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <SafeIcon icon={FiUser} className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-800 font-cairo">
                المعلومات الأساسية
              </h2>
              <p className="text-gray-600 font-cairo">
                أخبرنا عن نفسك لنخصص البرنامج المناسب
              </p>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
                الجنس
              </label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('gender', 'male')}
                  className={`p-3 rounded-lg border-2 font-cairo text-center transition-all ${
                    profileData.gender === 'male'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  ذكر
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('gender', 'female')}
                  className={`p-3 rounded-lg border-2 font-cairo text-center transition-all ${
                    profileData.gender === 'female'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  أنثى
                </motion.button>
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
                العمر
              </label>
              <input
                type="number"
                value={profileData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="أدخل عمرك"
                className="w-full p-3 border border-gray-300 rounded-lg font-cairo text-right"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
                الوزن الحالي (كجم)
              </label>
              <input
                type="number"
                value={profileData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="أدخل وزنك الحالي"
                className="w-full p-3 border border-gray-300 rounded-lg font-cairo text-right"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
                الطول (سم)
              </label>
              <input
                type="number"
                value={profileData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                placeholder="أدخل طولك"
                className="w-full p-3 border border-gray-300 rounded-lg font-cairo text-right"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <SafeIcon icon={FiTarget} className="w-12 h-12 text-success-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-800 font-cairo">
                أهدافك الصحية
              </h2>
              <p className="text-gray-600 font-cairo">
                ما هو هدفك من الصيام المتقطع؟
              </p>
            </div>

            {/* Target Weight */}
            <div>
              <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
                الوزن المستهدف (كجم)
              </label>
              <input
                type="number"
                value={profileData.targetWeight}
                onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                placeholder="أدخل وزنك المستهدف"
                className="w-full p-3 border border-gray-300 rounded-lg font-cairo text-right"
              />
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-cairo font-semibold text-gray-700 mb-2">
                هدفك الأساسي
              </label>
              <div className="space-y-3">
                {[
                  { value: 'weight_loss', label: 'فقدان الوزن', desc: 'تقليل الوزن والدهون' },
                  { value: 'weight_gain', label: 'زيادة الوزن', desc: 'بناء الكتلة العضلية' },
                  { value: 'maintenance', label: 'المحافظة على الوزن', desc: 'الحفاظ على الوضع الحالي' },
                  { value: 'muscle_gain', label: 'بناء العضلات', desc: 'زيادة الكتلة العضلية' }
                ].map((goal) => (
                  <motion.button
                    key={goal.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('goal', goal.value)}
                    className={`w-full p-4 rounded-lg border-2 text-right transition-all ${
                      profileData.goal === goal.value
                        ? 'border-success-500 bg-success-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-cairo font-semibold text-gray-800">{goal.label}</div>
                    <div className="text-sm text-gray-600 font-cairo">{goal.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <SafeIcon icon={FiActivity} className="w-12 h-12 text-warning-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-800 font-cairo">
                مستوى النشاط
              </h2>
              <p className="text-gray-600 font-cairo">
                كيف تصف مستوى نشاطك اليومي؟
              </p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'sedentary', label: 'قليل النشاط', desc: 'أعمل مكتبي، قليل من الرياضة' },
                { value: 'light', label: 'نشاط خفيف', desc: 'تمارين خفيفة 1-3 مرات أسبوعياً' },
                { value: 'moderate', label: 'نشاط متوسط', desc: 'تمارين متوسطة 3-5 مرات أسبوعياً' },
                { value: 'active', label: 'نشط', desc: 'تمارين قوية 6-7 مرات أسبوعياً' },
                { value: 'very_active', label: 'نشط جداً', desc: 'تمارين قوية يومياً أو عمل بدني' }
              ].map((activity) => (
                <motion.button
                  key={activity.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('activityLevel', activity.value)}
                  className={`w-full p-4 rounded-lg border-2 text-right transition-all ${
                    profileData.activityLevel === activity.value
                      ? 'border-warning-500 bg-warning-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-cairo font-semibold text-gray-800">{activity.label}</div>
                  <div className="text-sm text-gray-600 font-cairo">{activity.desc}</div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <SafeIcon icon={FiHeart} className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-800 font-cairo">
                التفضيلات الغذائية
              </h2>
              <p className="text-gray-600 font-cairo">
                اختر ما يناسبك (اختياري)
              </p>
            </div>

            {/* Dietary Preferences */}
            <div>
              <label className="block text-sm font-cairo font-semibold text-gray-700 mb-3">
                النظام الغذائي المفضل
              </label>
              <div className="space-y-2">
                {[
                  { key: 'vegetarian', label: 'نباتي (يتضمن منتجات الألبان)' },
                  { key: 'vegan', label: 'نباتي صرف (بدون منتجات حيوانية)' },
                  { key: 'glutenFree', label: 'خالي من الغلوتين' },
                  { key: 'dairyFree', label: 'خالي من منتجات الألبان' },
                  { key: 'nutFree', label: 'خالي من المكسرات' }
                ].map((pref) => (
                  <motion.button
                    key={pref.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePreferenceChange(pref.key)}
                    className={`w-full p-3 rounded-lg border-2 text-right transition-all ${
                      profileData.preferences[pref.key]
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-cairo text-gray-800">{pref.label}</span>
                      {profileData.preferences[pref.key] && (
                        <SafeIcon icon={FiCheck} className="w-5 h-5 text-primary-500" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Health Conditions */}
            <div>
              <label className="block text-sm font-cairo font-semibold text-gray-700 mb-3">
                الحالات الصحية (إن وجدت)
              </label>
              <div className="space-y-2">
                {[
                  'السكري',
                  'ارتفاع ضغط الدم',
                  'أمراض القلب',
                  'اضطرابات الهضم',
                  'الحساسية الغذائية'
                ].map((condition) => (
                  <motion.button
                    key={condition}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleHealthConditionChange(condition)}
                    className={`w-full p-3 rounded-lg border-2 text-right transition-all ${
                      profileData.healthConditions.includes(condition)
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-cairo text-gray-800">{condition}</span>
                      {profileData.healthConditions.includes(condition) && (
                        <SafeIcon icon={FiCheck} className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-cairo text-gray-600">
              الخطوة {currentStep} من {totalSteps}
            </span>
            <span className="text-sm font-cairo text-gray-600">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          {renderStep()}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentStep > 1 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={prevStep}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-cairo font-semibold"
            >
              السابق
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextStep}
            disabled={!isStepValid() || state.syncing}
            className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-cairo font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {state.syncing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
            ) : null}
            {currentStep === totalSteps ? 'إنهاء الإعداد' : 'التالي'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;