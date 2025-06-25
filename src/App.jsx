import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Timer from './pages/Timer';
import MealPlan from './pages/MealPlan';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import ShoppingCart from './pages/ShoppingCart';
import Schedule from './pages/Schedule';
import Analytics from './pages/Analytics';
import ProfileSetup from './pages/ProfileSetup';
import Auth from './pages/Auth';
import { FastingProvider } from './context/FastingContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false);
      if (user) {
        // Check if user profile is complete
        const checkProfile = async () => {
          try {
            const savedState = localStorage.getItem('fastingState');
            if (savedState) {
              const parsedState = JSON.parse(savedState);
              if (!parsedState.userProfile?.gender || !parsedState.userProfile?.age) {
                setShowProfileSetup(true);
              }
            } else {
              setShowProfileSetup(true);
            }
          } catch (error) {
            setShowProfileSetup(true);
          }
        };
        checkProfile();
      }
    }
  }, [user, authLoading]);

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-primary-800 font-cairo">
            متتبع الصيام المتقطع
          </h1>
          <p className="text-primary-600 mt-2 font-cairo">جاري التحميل...</p>
          <p className="text-primary-400 mt-1 font-cairo text-sm">
            النسخة الكاملة مع قاعدة البيانات Supabase
          </p>
        </motion.div>
      </div>
    );
  }

  // Show auth page if user is not logged in
  if (!user) {
    return <Auth />;
  }

  // Show profile setup if needed
  if (showProfileSetup) {
    return <ProfileSetup onComplete={handleProfileSetupComplete} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-cairo" dir="rtl">
        <Navbar />
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/meal-plan" element={<MealPlan />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/shopping-cart" element={<ShoppingCart />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <FastingProvider>
          <AppContent />
        </FastingProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;