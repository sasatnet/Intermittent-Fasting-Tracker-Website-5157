export const recipes = {
  1: {
    breakfast: {
      id: 'breakfast_1',
      name: 'بيض مسلوق مع الخضار',
      image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop',
      time: '12:00 ظهراً',
      prepTime: '15 دقيقة',
      servings: 1,
      calories: 350,
      macros: {
        protein: 28,
        carbs: 15,
        fat: 18,
        fiber: 8
      },
      ingredients: [
        { id: 'eggs', name: 'بيض', amount: '2', unit: 'حبة', category: 'بروتين' },
        { id: 'spinach', name: 'سبانخ طازجة', amount: '100', unit: 'جرام', category: 'خضار' },
        { id: 'tomato', name: 'طماطم', amount: '1', unit: 'حبة متوسطة', category: 'خضار' },
        { id: 'bread', name: 'خبز أسمر', amount: '1/4', unit: 'رغيف', category: 'كربوهيدرات' },
        { id: 'olive_oil', name: 'زيت زيتون', amount: '1', unit: 'ملعقة كبيرة', category: 'دهون' },
        { id: 'salt', name: 'ملح', amount: 'حسب الذوق', unit: '', category: 'توابل' },
        { id: 'pepper', name: 'فلفل أسود', amount: 'حسب الذوق', unit: '', category: 'توابل' }
      ],
      instructions: [
        'اسلقي البيض في ماء مغلي لمدة 8-10 دقائق',
        'اغسلي السبانخ جيداً وقطعيها',
        'قطعي الطماطم إلى شرائح',
        'في مقلاة، أضيفي زيت الزيتون وحمري السبانخ',
        'أضيفي الطماطم والملح والفلفل',
        'قدمي البيض المسلوق مع الخضار والخبز الأسمر'
      ],
      tips: [
        'يمكن إضافة الأفوكادو للحصول على دهون صحية إضافية',
        'تناولي الوجبة ببطء للشعور بالشبع',
        'اشربي كوب ماء قبل الوجبة بـ 30 دقيقة'
      ]
    },
    lunch: {
      id: 'lunch_1',
      name: 'دجاج مشوي مع الأرز البني',
      image: 'https://images.unsplash.com/photo-1598515213692-d1f8134b8b78?w=400&h=300&fit=crop',
      time: '3:00 عصراً',
      prepTime: '30 دقيقة',
      servings: 1,
      calories: 450,
      macros: {
        protein: 35,
        carbs: 40,
        fat: 12,
        fiber: 4
      },
      ingredients: [
        { id: 'chicken_breast', name: 'صدر دجاج', amount: '150', unit: 'جرام', category: 'بروتين' },
        { id: 'brown_rice', name: 'أرز بني', amount: '1/2', unit: 'كوب (مطبوخ)', category: 'كربوهيدرات' },
        { id: 'mixed_vegetables', name: 'خضار مشكلة', amount: '100', unit: 'جرام', category: 'خضار' },
        { id: 'almonds', name: 'لوز', amount: '10', unit: 'حبة', category: 'دهون' },
        { id: 'garlic', name: 'ثوم', amount: '2', unit: 'فص', category: 'توابل' },
        { id: 'lemon', name: 'ليمون', amount: '1/2', unit: 'حبة', category: 'أخرى' },
        { id: 'oregano', name: 'أوريغانو', amount: '1', unit: 'ملعقة صغيرة', category: 'توابل' },
        { id: 'olive_oil', name: 'زيت زيتون', amount: '1', unit: 'ملعقة صغيرة', category: 'دهون' }
      ],
      instructions: [
        'تتبل صدر الدجاج بالثوم والأوريغانو والملح والفلفل',
        'اتركي الدجاج ينقع لمدة 15 دقيقة',
        'اطبخي الأرز البني حسب التعليمات',
        'في مقلاة، اشوي الدجاج من كل جهة حتى ينضج',
        'في نفس المقلاة، اطبخي الخضار المشكلة',
        'قدمي الدجاج مع الأرز والخضار',
        'زيني بعصير الليمون واللوز المقطع'
      ],
      tips: [
        'تأكدي من نضج الدجاج جيداً قبل التقديم',
        'يمكن إضافة الكركم للأرز لنكهة أفضل',
        'اشربي الماء مع الوجبة لتحسين الهضم'
      ]
    },
    dinner: {
      id: 'dinner_1',
      name: 'سمك مشوي مع الخضار',
      image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop',
      time: '7:00 مساءً',
      prepTime: '25 دقيقة',
      servings: 1,
      calories: 300,
      macros: {
        protein: 30,
        carbs: 20,
        fat: 10,
        fiber: 6
      },
      ingredients: [
        { id: 'fish_fillet', name: 'فيليه سمك', amount: '120', unit: 'جرام', category: 'بروتين' },
        { id: 'broccoli', name: 'بروكلي', amount: '100', unit: 'جرام', category: 'خضار' },
        { id: 'carrots', name: 'جزر', amount: '50', unit: 'جرام', category: 'خضار' },
        { id: 'apple', name: 'تفاح', amount: '1', unit: 'حبة متوسطة', category: 'فواكه' },
        { id: 'lemon', name: 'ليمون', amount: '1/2', unit: 'حبة', category: 'أخرى' },
        { id: 'dill', name: 'شبت', amount: '1', unit: 'ملعقة كبيرة', category: 'توابل' },
        { id: 'olive_oil', name: 'زيت زيتون', amount: '1', unit: 'ملعقة صغيرة', category: 'دهون' }
      ],
      instructions: [
        'نظفي السمك جيداً وتبليه بالملح والفلفل والشبت',
        'قطعي البروكلي والجزر إلى قطع متوسطة',
        'في مقلاة، اشوي السمك بقليل من زيت الزيتون',
        'في مقلاة أخرى، اسلقي الخضار بالبخار',
        'اعصري الليمون على السمك قبل التقديم',
        'قدمي السمك مع الخضار والتفاح كحلوى'
      ],
      tips: [
        'اختاري السمك الطازج للحصول على أفضل نكهة',
        'لا تفرطي في طبخ السمك حتى لا يجف',
        'التفاح يساعد في الهضم ويعطي شعوراً بالشبع'
      ]
    }
  },
  2: {
    breakfast: {
      id: 'breakfast_2',
      name: 'شوفان بالحليب والتوت',
      image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop',
      time: '12:00 ظهراً',
      prepTime: '10 دقائق',
      servings: 1,
      calories: 380,
      macros: {
        protein: 15,
        carbs: 55,
        fat: 12,
        fiber: 8
      },
      ingredients: [
        { id: 'oats', name: 'شوفان', amount: '1/2', unit: 'كوب', category: 'كربوهيدرات' },
        { id: 'low_fat_milk', name: 'حليب قليل الدسم', amount: '1', unit: 'كوب', category: 'بروتين' },
        { id: 'honey', name: 'عسل', amount: '1', unit: 'ملعقة كبيرة', category: 'أخرى' },
        { id: 'blueberries', name: 'توت أزرق', amount: '1/2', unit: 'كوب', category: 'فواكه' },
        { id: 'walnuts', name: 'جوز', amount: '1', unit: 'ملعقة كبيرة', category: 'دهون' },
        { id: 'cinnamon', name: 'قرفة', amount: '1/2', unit: 'ملعقة صغيرة', category: 'توابل' }
      ],
      instructions: [
        'في مقلاة، اطبخي الشوفان مع الحليب على نار متوسطة',
        'حركي باستمرار حتى يصبح كريمي القوام',
        'أضيفي القرفة والعسل',
        'اتركي الخليط ينضج لمدة 5 دقائق',
        'قدمي في وعاء وزيني بالتوت والجوز'
      ],
      tips: [
        'يمكن تحضير الشوفان بالماء للحصول على سعرات أقل',
        'أضيفي الفواكه في النهاية للحفاظ على قوامها',
        'الشوفان يعطي شعوراً بالشبع لفترة طويلة'
      ]
    },
    lunch: {
      id: 'lunch_2',
      name: 'لحم بقري مع البطاطس المسلوقة',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      time: '3:00 عصراً',
      prepTime: '35 دقيقة',
      servings: 1,
      calories: 420,
      macros: {
        protein: 32,
        carbs: 35,
        fat: 14,
        fiber: 5
      },
      ingredients: [
        { id: 'beef', name: 'لحم بقري', amount: '120', unit: 'جرام', category: 'بروتين' },
        { id: 'potato', name: 'بطاطس', amount: '1', unit: 'حبة متوسطة', category: 'كربوهيدرات' },
        { id: 'mixed_salad', name: 'سلطة مشكلة', amount: '150', unit: 'جرام', category: 'خضار' },
        { id: 'onion', name: 'بصل', amount: '1/2', unit: 'حبة', category: 'خضار' },
        { id: 'garlic', name: 'ثوم', amount: '2', unit: 'فص', category: 'توابل' },
        { id: 'rosemary', name: 'إكليل الجبل', amount: '1', unit: 'ملعقة صغيرة', category: 'توابل' },
        { id: 'olive_oil', name: 'زيت زيتون', amount: '1', unit: 'ملعقة كبيرة', category: 'دهون' }
      ],
      instructions: [
        'قطعي اللحم إلى قطع متوسطة وتبليه بالملح والفلفل',
        'اسلقي البطاطس في ماء مملح حتى تنضج',
        'في مقلاة، حمري اللحم مع البصل والثوم',
        'أضيفي إكليل الجبل واتركي اللحم ينضج',
        'حضري السلطة بالخضار الطازجة وزيت الزيتون',
        'قدمي اللحم مع البطاطس والسلطة'
      ],
      tips: [
        'اختاري قطع اللحم الخالية من الدهون',
        'لا تفرطي في طبخ اللحم حتى لا يجف',
        'السلطة تساعد في الهضم وتعطي فيتامينات مهمة'
      ]
    },
    dinner: {
      id: 'dinner_2',
      name: 'عجة بالخضار',
      image: 'https://images.unsplash.com/photo-1550147760-44c9966d6bc7?w=400&h=300&fit=crop',
      time: '7:00 مساءً',
      prepTime: '15 دقيقة',
      servings: 1,
      calories: 320,
      macros: {
        protein: 20,
        carbs: 18,
        fat: 18,
        fiber: 4
      },
      ingredients: [
        { id: 'eggs', name: 'بيض', amount: '2', unit: 'حبة', category: 'بروتين' },
        { id: 'bell_pepper', name: 'فلفل ملون', amount: '1/2', unit: 'حبة', category: 'خضار' },
        { id: 'zucchini', name: 'كوسا', amount: '50', unit: 'جرام', category: 'خضار' },
        { id: 'whole_wheat_bread', name: 'خبز أسمر', amount: '1', unit: 'شريحة', category: 'كربوهيدرات' },
        { id: 'low_fat_yogurt', name: 'زبادي قليل الدسم', amount: '100', unit: 'جرام', category: 'بروتين' },
        { id: 'olive_oil', name: 'زيت زيتون', amount: '1', unit: 'ملعقة صغيرة', category: 'دهون' },
        { id: 'herbs', name: 'أعشاب مشكلة', amount: '1', unit: 'ملعقة كبيرة', category: 'توابل' }
      ],
      instructions: [
        'قطعي الفلفل والكوسا إلى قطع صغيرة',
        'في مقلاة، اطبخي الخضار بقليل من زيت الزيتون',
        'اخفقي البيض مع الملح والفلفل والأعشاب',
        'اسكبي البيض على الخضار في المقلاة',
        'اتركي العجة تنضج من الأسفل ثم اقلبيها',
        'قدمي مع الخبز الأسمر والزبادي'
      ],
      tips: [
        'لا تتركي العجة تنضج أكثر من اللازم',
        'يمكن إضافة الجبن قليل الدسم للنكهة',
        'الزبادي يساعد في الهضم ويعطي بروتين إضافي'
      ]
    }
  }
};

export const getRecipesByDay = (day) => {
  const baseDay = ((day - 1) % 2) + 1;
  return recipes[baseDay] || recipes[1];
};

export const getAllIngredients = () => {
  const allIngredients = [];
  Object.values(recipes).forEach(dayRecipes => {
    Object.values(dayRecipes).forEach(recipe => {
      allIngredients.push(...recipe.ingredients);
    });
  });
  
  // Remove duplicates based on id
  const uniqueIngredients = allIngredients.filter((ingredient, index, self) => 
    index === self.findIndex(i => i.id === ingredient.id)
  );
  
  return uniqueIngredients;
};