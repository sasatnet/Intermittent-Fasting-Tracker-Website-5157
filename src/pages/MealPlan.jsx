import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useFasting } from '../context/FastingContext';
import { getRecipesByDay } from '../data/recipes';
import RecipeModal from '../components/RecipeModal';

const { FiCalendar, FiClock, FiChevronLeft, FiChevronRight, FiBook, FiShoppingCart } = FiIcons;

const MealPlan = () => {
  const { state, dispatch } = useFasting();
  const [selectedDay, setSelectedDay] = useState(state.currentDay);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const currentMealPlan = getRecipesByDay(selectedDay);
  const totalCalories = Object.values(currentMealPlan).reduce((sum, meal) => sum + meal.calories, 0);

  const nextDay = () => {
    if (selectedDay < 20) {
      setSelectedDay(selectedDay + 1);
    }
  };

  const prevDay = () => {
    if (selectedDay > 1) {
      setSelectedDay(selectedDay - 1);
    }
  };

  const openRecipeModal = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  const addIngredientsToCart = (ingredients) => {
    ingredients.forEach(ingredient => {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          id: ingredient.id,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          category: ingredient.category
        }
      });
    });
  };

  const getMealTypeInArabic = (mealType) => {
    const mealTypes = {
      breakfast: 'الإفطار',
      lunch: 'الغداء',
      dinner: 'العشاء'
    };
    return mealTypes[mealType] || mealType;
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
          خطة الوجبات والوصفات
        </h1>
        <p className="text-gray-600 font-cairo">
          وصفات مفصلة مع إمكانية إضافة المكونات لسلة المشتريات
        </p>
      </motion.div>

      {/* Day Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-sm border mb-6"
      >
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevDay}
            disabled={selectedDay === 1}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SafeIcon icon={FiChevronRight} className="w-5 h-5" />
          </motion.button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <SafeIcon icon={FiCalendar} className="w-5 h-5 text-primary-500 ml-2" />
              <span className="text-lg font-bold text-gray-800 font-cairo">
                اليوم {selectedDay}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-cairo">
              إجمالي السعرات: {totalCalories} سعرة
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextDay}
            disabled={selectedDay === 20}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SafeIcon icon={FiChevronLeft} className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Meals */}
      <div className="space-y-4">
        {Object.entries(currentMealPlan).map(([mealType, recipe], index) => (
          <motion.div
            key={mealType}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border overflow-hidden"
          >
            {/* Recipe Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                <div className="p-4 text-white">
                  <h3 className="text-xl font-bold font-cairo mb-1">
                    {recipe.name}
                  </h3>
                  <div className="flex items-center text-sm">
                    <SafeIcon icon={FiClock} className="w-4 h-4 ml-1" />
                    <span className="font-cairo">{recipe.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipe Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-cairo text-primary-600 bg-primary-50 px-2 py-1 rounded">
                  {getMealTypeInArabic(mealType)}
                </span>
                <span className="text-sm font-cairo text-gray-500">
                  {recipe.prepTime} • {recipe.servings} حصة
                </span>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-800">{recipe.calories}</div>
                  <div className="text-xs text-gray-500 font-cairo">سعرة</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-600">{recipe.macros.protein}جم</div>
                  <div className="text-xs text-gray-500 font-cairo">بروتين</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-green-600">{recipe.macros.carbs}جم</div>
                  <div className="text-xs text-gray-500 font-cairo">كربوهيدرات</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-yellow-600">{recipe.macros.fat}جم</div>
                  <div className="text-xs text-gray-500 font-cairo">دهون</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openRecipeModal(recipe)}
                  className="flex-1 flex items-center justify-center py-2 bg-primary-500 text-white rounded-lg font-cairo text-sm"
                >
                  <SafeIcon icon={FiBook} className="w-4 h-4 ml-1" />
                  عرض الوصفة
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addIngredientsToCart(recipe.ingredients)}
                  className="flex-1 flex items-center justify-center py-2 bg-success-500 text-white rounded-lg font-cairo text-sm"
                >
                  <SafeIcon icon={FiShoppingCart} className="w-4 h-4 ml-1" />
                  أضف للسلة
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nutritional Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-success-50 to-primary-50 rounded-xl p-6 mt-6"
      >
        <h3 className="text-lg font-bold text-gray-800 font-cairo mb-3">
          نصائح غذائية لليوم {selectedDay}
        </h3>
        <div className="space-y-2 text-sm text-gray-700 font-cairo">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-success-500 rounded-full mt-2 ml-3 flex-shrink-0" />
            <span>تناول وجباتك في الأوقات المحددة للحفاظ على نظام الصيام</span>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-success-500 rounded-full mt-2 ml-3 flex-shrink-0" />
            <span>امضغ الطعام ببطء لتحسين الهضم والشعور بالشبع</span>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-success-500 rounded-full mt-2 ml-3 flex-shrink-0" />
            <span>اشرب الماء بكثرة بين الوجبات وتجنب المشروبات السكرية</span>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-success-500 rounded-full mt-2 ml-3 flex-shrink-0" />
            <span>تأكد من الحصول على جميع العناصر الغذائية من الوجبات</span>
          </div>
        </div>
      </motion.div>

      {/* Recipe Modal */}
      {showRecipeModal && selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setShowRecipeModal(false)}
          onAddToCart={() => addIngredientsToCart(selectedRecipe.ingredients)}
        />
      )}
    </div>
  );
};

export default MealPlan;