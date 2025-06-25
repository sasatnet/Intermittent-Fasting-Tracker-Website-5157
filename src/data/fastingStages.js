export const fastingStages = [
  {
    id: 1,
    name: 'بداية الصيام',
    timeRange: '0-4 ساعات',
    hours: [0, 4],
    icon: '🍽️',
    color: '#ef4444',
    description: 'الجسم يستخدم الجلوكوز المتاح',
    effects: [
      'هضم الوجبة الأخيرة',
      'مستويات الأنسولين تبدأ بالانخفاض',
      'الجسم يستخدم الجلوكوز كمصدر طاقة رئيسي'
    ],
    tips: [
      'اشرب الماء بكثرة',
      'تجنب التفكير في الطعام',
      'ابقَ مشغولاً بأنشطة مفيدة'
    ]
  },
  {
    id: 2,
    name: 'دخول الكيتوسيس',
    timeRange: '4-8 ساعات',
    hours: [4, 8],
    icon: '⚡',
    color: '#f59e0b',
    description: 'الجسم يبدأ بحرق الدهون المخزنة',
    effects: [
      'انخفاض مستويات الأنسولين',
      'بداية حرق الدهون',
      'زيادة التركيز الذهني'
    ],
    tips: [
      'قد تشعر بجوع خفيف - هذا طبيعي',
      'استمر في شرب الماء',
      'يمكن شرب الشاي أو القهوة بدون سكر'
    ]
  },
  {
    id: 3,
    name: 'حرق الدهون',
    timeRange: '8-12 ساعة',
    hours: [8, 12],
    icon: '🔥',
    color: '#f97316',
    description: 'الجسم في حالة حرق دهون نشطة',
    effects: [
      'حرق فعال للدهون المخزنة',
      'تحسن في مستويات الطاقة',
      'بداية عملية التجديد الخلوي'
    ],
    tips: [
      'هذه مرحلة ممتازة لفقدان الوزن',
      'قد تشعر بطاقة أكثر',
      'استغل هذا الوقت للأنشطة المنتجة'
    ]
  },
  {
    id: 4,
    name: 'الكيتوسيس العميق',
    timeRange: '12-16 ساعة',
    hours: [12, 16],
    icon: '🧠',
    color: '#8b5cf6',
    description: 'تحسن كبير في الوظائف الذهنية',
    effects: [
      'إنتاج الكيتونات بكثافة',
      'وضوح ذهني ممتاز',
      'تحسن في التركيز والذاكرة'
    ],
    tips: [
      'استغل هذا الوقت للمهام الذهنية',
      'قد تشعر بوضوح استثنائي',
      'هذا هو الوقت الأمثل للإبداع'
    ]
  },
  {
    id: 5,
    name: 'التجديد الخلوي',
    timeRange: '16-20 ساعة',
    hours: [16, 20],
    icon: '🔄',
    color: '#10b981',
    description: 'بداية عملية الالتهام الذاتي (Autophagy)',
    effects: [
      'تنشيط عملية الالتهام الذاتي',
      'تنظيف الخلايا التالفة',
      'تجديد الخلايا وإصلاح الأنسجة'
    ],
    tips: [
      'هذه مرحلة مهمة للصحة العامة',
      'الجسم يقوم بإصلاح نفسه',
      'فوائد مكافحة الشيخوخة تبدأ هنا'
    ]
  },
  {
    id: 6,
    name: 'الصيام المتقدم',
    timeRange: '20-24 ساعة',
    hours: [20, 24],
    icon: '🌟',
    color: '#3b82f6',
    description: 'فوائد متقدمة للصحة والتجديد',
    effects: [
      'زيادة هرمون النمو',
      'تحسن في حساسية الأنسولين',
      'فوائد مضادة للالتهاب'
    ],
    tips: [
      'مرحلة متقدمة - للمتمرسين فقط',
      'راقب جسمك جيداً',
      'اكسر الصيام تدريجياً'
    ]
  }
];

export const getFastingStageByHour = (currentHour) => {
  return fastingStages.find(stage => 
    currentHour >= stage.hours[0] && currentHour < stage.hours[1]
  ) || fastingStages[fastingStages.length - 1];
};

export const getNextStage = (currentHour) => {
  const currentStageIndex = fastingStages.findIndex(stage => 
    currentHour >= stage.hours[0] && currentHour < stage.hours[1]
  );
  
  if (currentStageIndex !== -1 && currentStageIndex < fastingStages.length - 1) {
    return fastingStages[currentStageIndex + 1];
  }
  
  return null;
};