import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabaseHelpers } from '../lib/supabase';

const FastingContext = createContext();

const initialState = {
  currentDay: 1,
  fastingHours: 16,
  eatingHours: 8,
  startTime: null,
  endTime: null,
  isActive: false,
  completedDays: [],
  weight: null,
  targetWeight: null,
  waterIntake: 0,
  dailyWaterGoal: 8,
  currentStreak: 0,
  longestStreak: 0,
  fastingType: '16:8',
  notifications: true,
  currentSessionId: null,
  
  // User profile fields
  userProfile: {
    gender: null,
    age: null,
    height: null,
    activityLevel: 'moderate',
    goal: 'weight_loss',
    healthConditions: [],
    preferences: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
    }
  },
  
  // Shopping cart
  shoppingCart: [],
  
  // Dashboard data
  dashboardData: null,
  userStats: null,
  weeklyProgress: [],
  recommendations: [],
  
  // Loading states
  loading: false,
  syncing: false,
  
  // Schedules
  schedules: [],
  
  // Custom meal plans
  customMealPlan: null,
};

function fastingReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SYNCING':
      return { ...state, syncing: action.payload };
    case 'START_FAST':
      return {
        ...state,
        isActive: true,
        startTime: action.payload.startTime,
        endTime: action.payload.endTime,
        currentSessionId: action.payload.sessionId,
      };
    case 'END_FAST':
      return {
        ...state,
        isActive: false,
        completedDays: [...state.completedDays, state.currentDay],
        currentStreak: state.currentStreak + 1,
        longestStreak: Math.max(state.longestStreak, state.currentStreak + 1),
        currentSessionId: null,
      };
    case 'SET_DAY':
      return { ...state, currentDay: action.payload };
    case 'SET_FASTING_TYPE':
      const [fasting, eating] = action.payload.split(':').map(Number);
      return {
        ...state,
        fastingType: action.payload,
        fastingHours: fasting,
        eatingHours: eating,
      };
    case 'SET_WEIGHT':
      return { ...state, weight: action.payload };
    case 'SET_TARGET_WEIGHT':
      return { ...state, targetWeight: action.payload };
    case 'ADD_WATER':
      return {
        ...state,
        waterIntake: Math.min(state.waterIntake + 1, state.dailyWaterGoal),
      };
    case 'RESET_WATER':
      return { ...state, waterIntake: 0 };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload },
      };
    case 'ADD_TO_CART':
      const existingItem = state.shoppingCart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          shoppingCart: state.shoppingCart.map(item =>
            item.id === action.payload.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        shoppingCart: [...state.shoppingCart, { ...action.payload, quantity: 1 }],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        shoppingCart: state.shoppingCart.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        shoppingCart: state.shoppingCart.map(item =>
          item.id === action.payload.id 
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, shoppingCart: [] };
    case 'SET_SHOPPING_CART':
      return { ...state, shoppingCart: action.payload };
    case 'SET_DASHBOARD_DATA':
      return { ...state, dashboardData: action.payload };
    case 'SET_USER_STATS':
      return { ...state, userStats: action.payload };
    case 'SET_WEEKLY_PROGRESS':
      return { ...state, weeklyProgress: action.payload };
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload };
    case 'SET_SCHEDULES':
      return { ...state, schedules: action.payload };
    case 'ADD_SCHEDULE':
      return { ...state, schedules: [action.payload, ...state.schedules] };
    case 'UPDATE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.map(schedule =>
          schedule.id === action.payload.id ? action.payload : schedule
        )
      };
    case 'REMOVE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.filter(schedule => schedule.id !== action.payload)
      };
    case 'SET_CUSTOM_MEAL_PLAN':
      return { ...state, customMealPlan: action.payload };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    case 'SYNC_FROM_DATABASE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function FastingProvider({ children }) {
  const [state, dispatch] = useReducer(fastingReducer, initialState);
  const { user, loading: authLoading } = useAuth();

  // Load user data from database when user logs in
  useEffect(() => {
    if (user && !authLoading) {
      loadUserData();
    }
  }, [user, authLoading]);

  // Save to localStorage for offline access
  useEffect(() => {
    if (user) {
      localStorage.setItem('fastingState', JSON.stringify(state));
    }
  }, [state, user]);

  // Update last activity every 5 minutes
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        supabaseHelpers.updateLastActivity(user.id);
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('Loading user data for:', user.id);

      // Load dashboard data
      try {
        const dashboardData = await supabaseHelpers.getDashboardData(user.id);
        if (dashboardData) {
          dispatch({ type: 'SET_DASHBOARD_DATA', payload: dashboardData });
          
          // Update profile from dashboard data
          dispatch({
            type: 'UPDATE_USER_PROFILE',
            payload: {
              gender: dashboardData.gender,
              age: dashboardData.age,
              height: dashboardData.height,
              activityLevel: dashboardData.activity_level,
              goal: dashboardData.goal,
            }
          });

          if (dashboardData.weight) {
            dispatch({ type: 'SET_WEIGHT', payload: dashboardData.weight });
          }
          if (dashboardData.target_weight) {
            dispatch({ type: 'SET_TARGET_WEIGHT', payload: dashboardData.target_weight });
          }
        }
      } catch (error) {
        console.log('Dashboard data loading failed (not critical):', error);
      }

      // Load user statistics
      try {
        const userStats = await supabaseHelpers.getUserStats(user.id);
        dispatch({ type: 'SET_USER_STATS', payload: userStats });
      } catch (error) {
        console.log('User stats loading failed (not critical):', error);
      }

      // Load weekly progress
      try {
        const weeklyProgress = await supabaseHelpers.getWeeklyProgress(user.id);
        dispatch({ type: 'SET_WEEKLY_PROGRESS', payload: weeklyProgress });
      } catch (error) {
        console.log('Weekly progress loading failed (not critical):', error);
      }

      // Load recommendations
      try {
        const recommendations = await supabaseHelpers.getPersonalizedRecommendations(user.id);
        dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations });
      } catch (error) {
        console.log('Recommendations loading failed (not critical):', error);
      }

      // Load shopping cart
      try {
        const cartItems = await supabaseHelpers.getShoppingCart(user.id);
        const formattedCart = cartItems.map(item => ({
          id: item.id,
          name: item.item_name,
          amount: item.amount,
          unit: item.unit,
          category: item.category,
          quantity: item.quantity,
        }));
        dispatch({ type: 'SET_SHOPPING_CART', payload: formattedCart });
      } catch (error) {
        console.log('Cart loading failed (not critical):', error);
      }

      // Load schedules
      try {
        const schedules = await supabaseHelpers.getUserSchedules(user.id);
        dispatch({ type: 'SET_SCHEDULES', payload: schedules });
      } catch (error) {
        console.log('Schedules loading failed (not critical):', error);
      }

      // Load active fasting session
      try {
        const activeSession = await supabaseHelpers.getActiveFastingSession(user.id);
        if (activeSession) {
          dispatch({
            type: 'START_FAST',
            payload: {
              startTime: activeSession.start_time,
              endTime: activeSession.end_time,
              sessionId: activeSession.id,
            }
          });
          dispatch({ type: 'SET_FASTING_TYPE', payload: activeSession.fasting_type });
        }
      } catch (error) {
        console.log('Active session loading failed (not critical):', error);
      }

    } catch (error) {
      console.log('Error loading user data (not critical):', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const syncUserProfile = async (profileData) => {
    if (!user) return;
    try {
      dispatch({ type: 'SET_SYNCING', payload: true });
      console.log('Syncing user profile:', profileData);
      
      await supabaseHelpers.updateUserProfile(user.id, {
        gender: profileData.gender,
        age: profileData.age,
        height: profileData.height,
        weight: profileData.weight,
        target_weight: profileData.targetWeight,
        activity_level: profileData.activityLevel,
        goal: profileData.goal,
        health_conditions: profileData.healthConditions,
        preferences: profileData.preferences,
      });
      
      console.log('Profile synced successfully');
      
      // Reload dashboard data
      const dashboardData = await supabaseHelpers.getDashboardData(user.id);
      if (dashboardData) {
        dispatch({ type: 'SET_DASHBOARD_DATA', payload: dashboardData });
      }
    } catch (error) {
      console.error('Error syncing profile:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  };

  const syncShoppingCart = async () => {
    if (!user) return;
    try {
      // Clear existing cart in database
      await supabaseHelpers.clearCart(user.id);
      
      // Add all items from local cart
      for (const item of state.shoppingCart) {
        await supabaseHelpers.addToCart(user.id, {
          item_name: item.name,
          amount: item.amount,
          unit: item.unit,
          category: item.category,
          quantity: item.quantity,
        });
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  const startFastingSession = async (startTime, endTime, fastingType) => {
    if (!user) return;
    try {
      const session = await supabaseHelpers.createFastingSession(user.id, {
        fasting_type: fastingType,
        start_time: startTime,
        end_time: endTime,
        status: 'active',
      });
      
      dispatch({
        type: 'START_FAST',
        payload: {
          startTime,
          endTime,
          sessionId: session.id,
        }
      });
      
      return session;
    } catch (error) {
      console.error('Error starting fasting session:', error);
      throw error;
    }
  };

  const endFastingSession = async () => {
    if (!user || !state.currentSessionId) return;
    try {
      await supabaseHelpers.updateFastingSession(state.currentSessionId, {
        status: 'completed',
        completed: true,
        actual_end_time: new Date().toISOString()
      });
      
      // Save progress
      await supabaseHelpers.saveProgress(user.id, {
        completed_fast: true,
        water_intake: state.waterIntake,
        weight: state.weight,
      });
      
      dispatch({ type: 'END_FAST' });
      
      // Reload stats
      const userStats = await supabaseHelpers.getUserStats(user.id);
      dispatch({ type: 'SET_USER_STATS', payload: userStats });
    } catch (error) {
      console.error('Error ending fasting session:', error);
      throw error;
    }
  };

  const saveProgress = async (progressData) => {
    if (!user) return;
    try {
      await supabaseHelpers.saveProgress(user.id, progressData);
      
      // Reload weekly progress
      const weeklyProgress = await supabaseHelpers.getWeeklyProgress(user.id);
      dispatch({ type: 'SET_WEEKLY_PROGRESS', payload: weeklyProgress });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Schedule management
  const createSchedule = async (scheduleData) => {
    if (!user) return;
    try {
      const schedule = await supabaseHelpers.createSchedule(user.id, scheduleData);
      dispatch({ type: 'ADD_SCHEDULE', payload: schedule });
      return schedule;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  };

  const updateSchedule = async (scheduleId, updates) => {
    if (!user) return;
    try {
      const schedule = await supabaseHelpers.updateSchedule(scheduleId, updates);
      dispatch({ type: 'UPDATE_SCHEDULE', payload: schedule });
      return schedule;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  };

  const deleteSchedule = async (scheduleId) => {
    if (!user) return;
    try {
      await supabaseHelpers.deleteSchedule(scheduleId);
      dispatch({ type: 'REMOVE_SCHEDULE', payload: scheduleId });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  };

  // Calculate daily calorie needs based on profile
  const calculateDailyCalories = () => {
    const { gender, age, height, activityLevel, goal } = state.userProfile;
    const weight = state.weight;
    
    if (!gender || !age || !weight || !height) return 2000; // Default
    
    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    
    let tdee = bmr * activityMultipliers[activityLevel];
    
    // Adjust for goal
    switch (goal) {
      case 'weight_loss':
        tdee *= 0.8; // 20% deficit
        break;
      case 'weight_gain':
        tdee *= 1.2; // 20% surplus
        break;
      case 'muscle_gain':
        tdee *= 1.1; // 10% surplus
        break;
      default:
        break;
    }
    
    return Math.round(tdee);
  };

  const contextValue = {
    state,
    dispatch,
    calculateDailyCalories,
    syncUserProfile,
    syncShoppingCart,
    startFastingSession,
    endFastingSession,
    saveProgress,
    loadUserData,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };

  return (
    <FastingContext.Provider value={contextValue}>
      {children}
    </FastingContext.Provider>
  );
}

export function useFasting() {
  const context = useContext(FastingContext);
  if (!context) {
    throw new Error('useFasting must be used within a FastingProvider');
  }
  return context;
}