export const generateAnalyticsData = (state) => {
  const now = new Date();
  const days = Math.min(state.currentDay, 20);
  
  // Generate weight progression data
  const weightData = [];
  const startWeight = state.weight || 70;
  const targetWeight = state.targetWeight || startWeight - 5;
  const weightLossPerDay = (startWeight - targetWeight) / 20;
  
  for (let i = 1; i <= days; i++) {
    const expectedWeight = startWeight - (weightLossPerDay * i);
    const variation = (Math.random() - 0.5) * 0.3;
    weightData.push({
      day: i,
      weight: Math.max(expectedWeight + variation, targetWeight),
      target: startWeight - (weightLossPerDay * i)
    });
  }
  
  // Generate fasting duration data
  const fastingData = [];
  for (let i = 1; i <= days; i++) {
    const baseHours = parseInt(state.fastingType.split(':')[0]);
    const variation = Math.random() * 2 - 1; // ±1 hour variation
    fastingData.push({
      day: i,
      duration: Math.max(baseHours + variation, 12),
      planned: baseHours,
      completed: state.completedDays.includes(i)
    });
  }
  
  // Generate water intake data
  const waterData = [];
  for (let i = 1; i <= days; i++) {
    const intake = Math.floor(Math.random() * 3) + state.dailyWaterGoal - 1;
    waterData.push({
      day: i,
      intake: Math.min(intake, state.dailyWaterGoal + 2),
      goal: state.dailyWaterGoal
    });
  }
  
  // Generate mood and energy data
  const moodData = [];
  const energyData = [];
  for (let i = 1; i <= days; i++) {
    // Simulate improvement over time with some variation
    const baseImprovement = Math.min(i * 0.1, 2);
    moodData.push({
      day: i,
      mood: Math.min(Math.max(3 + baseImprovement + (Math.random() - 0.5), 1), 5)
    });
    energyData.push({
      day: i,
      energy: Math.min(Math.max(3 + baseImprovement + (Math.random() - 0.5), 1), 5)
    });
  }
  
  // Calculate success rate by week
  const weeklySuccess = [];
  for (let week = 1; week <= Math.ceil(days / 7); week++) {
    const weekStart = (week - 1) * 7 + 1;
    const weekEnd = Math.min(week * 7, days);
    const weekDays = weekEnd - weekStart + 1;
    const completedInWeek = state.completedDays.filter(
      day => day >= weekStart && day <= weekEnd
    ).length;
    
    weeklySuccess.push({
      week,
      success: (completedInWeek / weekDays) * 100,
      completed: completedInWeek,
      total: weekDays
    });
  }
  
  return {
    weightData,
    fastingData,
    waterData,
    moodData,
    energyData,
    weeklySuccess
  };
};

export const calculateInsights = (state, analyticsData) => {
  const insights = [];
  
  // Weight loss insight
  if (analyticsData.weightData.length > 1) {
    const firstWeight = analyticsData.weightData[0].weight;
    const lastWeight = analyticsData.weightData[analyticsData.weightData.length - 1].weight;
    const weightLoss = firstWeight - lastWeight;
    
    if (weightLoss > 0) {
      insights.push({
        type: 'success',
        icon: '📉',
        title: 'تقدم ممتاز في الوزن',
        description: `فقدت ${weightLoss.toFixed(1)} كجم منذ البداية`,
        value: `${weightLoss.toFixed(1)} كجم`,
        trend: 'down'
      });
    }
  }
  
  // Consistency insight
  const consistencyRate = (state.completedDays.length / state.currentDay) * 100;
  if (consistencyRate >= 80) {
    insights.push({
      type: 'success',
      icon: '🎯',
      title: 'التزام عالي',
      description: `معدل نجاح ${consistencyRate.toFixed(0)}% - استمر!`,
      value: `${consistencyRate.toFixed(0)}%`,
      trend: 'up'
    });
  } else if (consistencyRate < 60) {
    insights.push({
      type: 'warning',
      icon: '⚠️',
      title: 'يحتاج تحسين',
      description: `معدل النجاح ${consistencyRate.toFixed(0)}% - حاول الالتزام أكثر`,
      value: `${consistencyRate.toFixed(0)}%`,
      trend: 'down'
    });
  }
  
  // Streak insight
  if (state.currentStreak >= 7) {
    insights.push({
      type: 'success',
      icon: '🔥',
      title: 'سلسلة رائعة',
      description: `${state.currentStreak} أيام متتالية من النجاح`,
      value: `${state.currentStreak} يوم`,
      trend: 'up'
    });
  }
  
  // Water intake insight
  const avgWaterIntake = analyticsData.waterData.reduce((sum, day) => sum + day.intake, 0) / analyticsData.waterData.length;
  if (avgWaterIntake >= state.dailyWaterGoal) {
    insights.push({
      type: 'success',
      icon: '💧',
      title: 'ترطيب ممتاز',
      description: `متوسط ${avgWaterIntake.toFixed(1)} أكواب يومياً`,
      value: `${avgWaterIntake.toFixed(1)} أكواب`,
      trend: 'up'
    });
  }
  
  // Weekly improvement insight
  if (analyticsData.weeklySuccess.length > 1) {
    const lastWeek = analyticsData.weeklySuccess[analyticsData.weeklySuccess.length - 1];
    const prevWeek = analyticsData.weeklySuccess[analyticsData.weeklySuccess.length - 2];
    
    if (lastWeek.success > prevWeek.success) {
      insights.push({
        type: 'success',
        icon: '📈',
        title: 'تحسن أسبوعي',
        description: `تحسن بنسبة ${(lastWeek.success - prevWeek.success).toFixed(0)}% هذا الأسبوع`,
        value: `+${(lastWeek.success - prevWeek.success).toFixed(0)}%`,
        trend: 'up'
      });
    }
  }
  
  return insights;
};

export const getRecommendations = (state, insights) => {
  const recommendations = [];
  
  // Based on consistency
  const consistencyRate = (state.completedDays.length / state.currentDay) * 100;
  if (consistencyRate < 70) {
    recommendations.push({
      type: 'improvement',
      priority: 'high',
      title: 'تحسين الالتزام',
      description: 'حاول ضبط مواعيد ثابتة للصيام والالتزام بها',
      action: 'جدولة تذكيرات يومية',
      icon: '⏰'
    });
  }
  
  // Based on fasting type
  if (state.fastingType === '20:4' && consistencyRate < 60) {
    recommendations.push({
      type: 'adjustment',
      priority: 'medium',
      title: 'تخفيف نوع الصيام',
      description: 'قد يكون الصيام 20:4 صعباً، جرب 16:8 أولاً',
      action: 'تغيير نوع الصيام',
      icon: '🔄'
    });
  }
  
  // Based on water intake
  const hasWaterInsight = insights.some(i => i.icon === '💧' && i.type === 'success');
  if (!hasWaterInsight) {
    recommendations.push({
      type: 'health',
      priority: 'medium',
      title: 'زيادة شرب الماء',
      description: 'اشرب المزيد من الماء لتحسين نتائج الصيام',
      action: 'ضبط تذكيرات الماء',
      icon: '💧'
    });
  }
  
  // Based on progress
  if (state.currentDay > 10 && state.completedDays.length < 5) {
    recommendations.push({
      type: 'motivation',
      priority: 'high',
      title: 'إعادة تقييم الأهداف',
      description: 'قد تحتاج لمراجعة خطتك وجعلها أكثر واقعية',
      action: 'مراجعة الملف الشخصي',
      icon: '🎯'
    });
  }
  
  // Success recommendations
  if (consistencyRate >= 80) {
    recommendations.push({
      type: 'advanced',
      priority: 'low',
      title: 'تحدي متقدم',
      description: 'أداؤك ممتاز! يمكنك تجربة نوع صيام أكثر تحدياً',
      action: 'ترقية نوع الصيام',
      icon: '🚀'
    });
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};