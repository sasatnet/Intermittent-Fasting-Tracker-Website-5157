import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiClock, FiUsers, FiShoppingCart, FiChef, FiInfo } = FiIcons;

const RecipeModal = ({ recipe, onClose, onAddToCart }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'بروتين': 'bg-red-100 text-red-800',
      'كربوهيدرات': 'bg-yellow-100 text-yellow-800',
      'خضار': 'bg-green-100 text-green-800',
      'دهون': 'bg-blue-100 text-blue-800',
      'فواكه': 'bg-purple-100 text-purple-800',
      'توابل': 'bg-orange-100 text-orange-800',
      'أخرى': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['أخرى'];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-2xl font-bold font-cairo mb-2">{recipe.name}</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <SafeIcon icon={FiClock} className="w-4 h-4 ml-1" />
                <span className="font-cairo">{recipe.prepTime}</span>
              </div>
              <div className="flex items-center">
                <SafeIcon icon={FiUsers} className="w-4 h-4 ml-1" />
                <span className="font-cairo">{recipe.servings} حصة</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Nutrition Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold text-gray-800 font-cairo mb-3 flex items-center">
              <SafeIcon icon={FiInfo} className="w-5 h-5 ml-2" />
              القيم الغذائية
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{recipe.calories}</div>
                <div className="text-sm text-gray-600 font-cairo">سعرة حرارية</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-sm font-bold text-red-600">{recipe.macros.protein}جم</div>
                  <div className="text-xs text-gray-500 font-cairo">بروتين</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-green-600">{recipe.macros.carbs}جم</div>
                  <div className="text-xs text-gray-500 font-cairo">كربوهيدرات</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-yellow-600">{recipe.macros.fat}جم</div>
                  <div className="text-xs text-gray-500 font-cairo">دهون</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 font-cairo mb-3">
              المكونات
            </h3>
            <div className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full ml-3" />
                    <span className="font-cairo text-gray-800">{ingredient.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-cairo text-gray-600">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-cairo ${getCategoryColor(ingredient.category)}`}>
                      {ingredient.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 font-cairo mb-3 flex items-center">
              <SafeIcon icon={FiChef} className="w-5 h-5 ml-2" />
              طريقة التحضير
            </h3>
            <div className="space-y-3">
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 font-cairo">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 font-cairo mb-3">
                نصائح للتحضير
              </h3>
              <div className="space-y-2">
                {recipe.tips.map((tip, index) => (
                  <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 ml-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-cairo">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onAddToCart();
              onClose();
            }}
            className="w-full flex items-center justify-center py-3 bg-success-500 text-white rounded-lg font-cairo font-semibold text-lg"
          >
            <SafeIcon icon={FiShoppingCart} className="w-5 h-5 ml-2" />
            أضف جميع المكونات للسلة
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecipeModal;