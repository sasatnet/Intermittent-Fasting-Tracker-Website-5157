import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useFasting } from '../context/FastingContext';

const { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiCheck } = FiIcons;

const ShoppingCart = () => {
  const { state, dispatch } = useFasting();

  const groupedItems = state.shoppingCart.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      dispatch({
        type: 'UPDATE_CART_QUANTITY',
        payload: { id: itemId, quantity: newQuantity }
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'بروتين': 'bg-red-50 border-red-200',
      'كربوهيدرات': 'bg-yellow-50 border-yellow-200',
      'خضار': 'bg-green-50 border-green-200',
      'دهون': 'bg-blue-50 border-blue-200',
      'فواكه': 'bg-purple-50 border-purple-200',
      'توابل': 'bg-orange-50 border-orange-200',
      'أخرى': 'bg-gray-50 border-gray-200'
    };
    return colors[category] || colors['أخرى'];
  };

  const totalItems = state.shoppingCart.reduce((total, item) => total + item.quantity, 0);

  if (state.shoppingCart.length === 0) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 font-cairo mb-2">
            سلة المشتريات
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiShoppingCart} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-600 font-cairo mb-2">
            سلة المشتريات فارغة
          </h3>
          <p className="text-gray-500 font-cairo">
            أضف المكونات من صفحة الوصفات لتظهر هنا
          </p>
        </motion.div>
      </div>
    );
  }

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
            سلة المشتريات
          </h1>
          <p className="text-gray-600 font-cairo">
            {totalItems} عنصر في السلة
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearCart}
          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
        >
          <SafeIcon icon={FiTrash2} className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Shopping List by Category */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-xl p-4 border-2 ${getCategoryColor(category)}`}
          >
            <h3 className="text-lg font-bold text-gray-800 font-cairo mb-3">
              {category}
            </h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex-1">
                    <div className="font-cairo text-gray-800 font-semibold">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500 font-cairo">
                      {item.amount} {item.unit}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <SafeIcon icon={FiMinus} className="w-4 h-4" />
                    </motion.button>
                    
                    <span className="w-8 text-center font-bold text-gray-800">
                      {item.quantity}
                    </span>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors mr-2"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Shopping Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-50 to-success-50 rounded-xl p-6 mt-6"
      >
        <h3 className="text-lg font-bold text-gray-800 font-cairo mb-3">
          نصائح للتسوق الذكي
        </h3>
        <div className="space-y-2 text-sm text-gray-700 font-cairo">
          <div className="flex items-start">
            <SafeIcon icon={FiCheck} className="w-4 h-4 text-success-500 mt-0.5 ml-2 flex-shrink-0" />
            <span>اختر المنتجات الطازجة والموسمية للحصول على أفضل قيمة غذائية</span>
          </div>
          <div className="flex items-start">
            <SafeIcon icon={FiCheck} className="w-4 h-4 text-success-500 mt-0.5 ml-2 flex-shrink-0" />
            <span>قم بالتسوق بعد تناول الطعام لتجنب الشراء العشوائي</span>
          </div>
          <div className="flex items-start">
            <SafeIcon icon={FiCheck} className="w-4 h-4 text-success-500 mt-0.5 ml-2 flex-shrink-0" />
            <span>اقرأ التسميات الغذائية واختر المنتجات قليلة المعالجة</span>
          </div>
          <div className="flex items-start">
            <SafeIcon icon={FiCheck} className="w-4 h-4 text-success-500 mt-0.5 ml-2 flex-shrink-0" />
            <span>حضر وجباتك مسبقاً لتوفير الوقت والمال</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShoppingCart;