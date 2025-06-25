import { createClient } from '@supabase/supabase-js'

// Supabase project credentials
const SUPABASE_URL = 'https://rkymcpxixyqyhildzstr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJreW1jcHhpeHlxeWhpbGR6c3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODczMzgsImV4cCI6MjA2NjM2MzMzOH0.FlCwO2s9nBAZGlnzcvH1DPCchTYF2o-QAxvE0zmKJ-k'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export default supabase

// Helper functions for database operations
export const supabaseHelpers = {
  // Profile operations
  async getUserProfile(userId) {
    try {
      console.log('Getting profile for user:', userId);
      
      const { data, error } = await supabase
        .from('user_profiles_complete')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error getting user profile:', error);
        throw error;
      }

      console.log('Profile data:', data);
      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw error;
    }
  },

  async updateUserProfile(userId, profileData) {
    try {
      console.log('Updating profile for user:', userId, profileData);
      
      const { data, error } = await supabase
        .from('user_profiles_complete')
        .upsert({
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        .select()
        .single()

      if (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }

      console.log('Profile updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      throw error;
    }
  },

  async getUserStats(userId) {
    try {
      const { data, error } = await supabase
        .rpc('get_user_stats', { user_uuid: userId })

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        total_sessions: 0,
        completed_sessions: 0,
        current_streak: 0,
        avg_weight_loss: 0,
        total_water_intake: 0
      };
    }
  },

  async getWeeklyProgress(userId, weeksCount = 4) {
    try {
      const { data, error } = await supabase
        .rpc('get_weekly_progress', { 
          user_uuid: userId, 
          weeks_count: weeksCount 
        })

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting weekly progress:', error);
      return [];
    }
  },

  async getPersonalizedRecommendations(userId) {
    try {
      const { data, error } = await supabase
        .rpc('get_personalized_recommendations', { user_uuid: userId })

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  },

  // Fasting session operations
  async createFastingSession(userId, sessionData) {
    try {
      const { data, error } = await supabase
        .from('fasting_sessions_complete')
        .insert({
          user_id: userId,
          ...sessionData
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating fasting session:', error);
      throw error;
    }
  },

  async updateFastingSession(sessionId, updates) {
    try {
      const { data, error } = await supabase
        .from('fasting_sessions_complete')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating fasting session:', error);
      throw error;
    }
  },

  async getUserFastingSessions(userId) {
    try {
      const { data, error } = await supabase
        .from('fasting_sessions_complete')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting fasting sessions:', error);
      throw error;
    }
  },

  async getActiveFastingSession(userId) {
    try {
      const { data, error } = await supabase
        .from('active_fasting_sessions')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error getting active session:', error);
      return null;
    }
  },

  // Progress tracking
  async saveProgress(userId, progressData) {
    try {
      const { data, error } = await supabase
        .from('progress_tracking_complete')
        .upsert({
          user_id: userId,
          date: new Date().toISOString().split('T')[0],
          ...progressData
        }, { onConflict: 'user_id,date' })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  },

  async getUserProgress(userId, limit = 30) {
    try {
      const { data, error } = await supabase
        .from('progress_tracking_complete')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  },

  async getRecentProgress(userId, days = 7) {
    try {
      const { data, error } = await supabase
        .from('recent_progress')
        .select('*')
        .eq('user_id', userId)
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting recent progress:', error);
      return [];
    }
  },

  // Shopping cart operations
  async getShoppingCart(userId) {
    try {
      const { data, error } = await supabase
        .from('shopping_cart_complete')
        .select('*')
        .eq('user_id', userId)
        .order('added_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting shopping cart:', error);
      throw error;
    }
  },

  async addToCart(userId, item) {
    try {
      const { data, error } = await supabase
        .from('shopping_cart_complete')
        .insert({
          user_id: userId,
          ...item
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  async updateCartItem(itemId, updates) {
    try {
      const { data, error } = await supabase
        .from('shopping_cart_complete')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  async removeFromCart(itemId) {
    try {
      const { error } = await supabase
        .from('shopping_cart_complete')
        .delete()
        .eq('id', itemId)

      if (error) throw error
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  async clearCart(userId) {
    try {
      const { error } = await supabase
        .from('shopping_cart_complete')
        .delete()
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Schedule operations
  async getUserSchedules(userId) {
    try {
      const { data, error } = await supabase
        .from('fasting_schedules_complete')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting schedules:', error);
      return [];
    }
  },

  async createSchedule(userId, scheduleData) {
    try {
      const { data, error } = await supabase
        .from('fasting_schedules_complete')
        .insert({
          user_id: userId,
          ...scheduleData
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  async updateSchedule(scheduleId, updates) {
    try {
      const { data, error } = await supabase
        .from('fasting_schedules_complete')
        .update(updates)
        .eq('id', scheduleId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  async deleteSchedule(scheduleId) {
    try {
      const { error } = await supabase
        .from('fasting_schedules_complete')
        .delete()
        .eq('id', scheduleId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  },

  // Notifications
  async getUserNotifications(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('user_notifications_complete')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  async createNotification(userId, notificationData) {
    try {
      const { data, error } = await supabase
        .from('user_notifications_complete')
        .insert({
          user_id: userId,
          ...notificationData
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from('user_notifications_complete')
        .update({ is_read: true })
        .eq('id', notificationId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Dashboard data
  async getDashboardData(userId) {
    try {
      const { data, error } = await supabase
        .from('user_dashboard_view')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return null;
    }
  },

  // Update last activity
  async updateLastActivity(userId) {
    try {
      await supabase.rpc('update_user_last_activity', { user_uuid: userId });
    } catch (error) {
      console.error('Error updating last activity:', error);
    }
  }
}