import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((result) => {
          setPermission(result);
        });
      }
    }
  }, []);

  const showNotification = (title, options = {}) => {
    if (permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    }
  };

  const scheduleNotification = (title, body, time) => {
    const now = new Date().getTime();
    const notificationTime = new Date(time).getTime();
    const delay = notificationTime - now;

    if (delay > 0) {
      setTimeout(() => {
        showNotification(title, { body });
      }, delay);

      // Store scheduled notification
      const notification = {
        id: Date.now(),
        title,
        body,
        time,
        scheduled: true
      };

      setNotifications(prev => [...prev, notification]);
      return notification.id;
    }
  };

  const cancelNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const scheduleRecurringNotification = (title, body, times, days = []) => {
    const scheduledIds = [];
    
    times.forEach(time => {
      if (days.length === 0) {
        // Daily notification
        const [hours, minutes] = time.split(':');
        const now = new Date();
        const notificationTime = new Date();
        notificationTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        if (notificationTime <= now) {
          notificationTime.setDate(notificationTime.getDate() + 1);
        }
        
        const id = scheduleNotification(title, body, notificationTime);
        scheduledIds.push(id);
      } else {
        // Weekly notification on specific days
        days.forEach(day => {
          const [hours, minutes] = time.split(':');
          const now = new Date();
          const notificationTime = new Date();
          
          // Calculate next occurrence of this day and time
          const dayDiff = (day - now.getDay() + 7) % 7;
          notificationTime.setDate(now.getDate() + dayDiff);
          notificationTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          if (notificationTime <= now) {
            notificationTime.setDate(notificationTime.getDate() + 7);
          }
          
          const id = scheduleNotification(title, body, notificationTime);
          scheduledIds.push(id);
        });
      }
    });
    
    return scheduledIds;
  };

  const value = {
    notifications,
    permission,
    showNotification,
    scheduleNotification,
    cancelNotification,
    scheduleRecurringNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}