import React from 'react';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Shield, Sparkles, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginSplash() {
  const handleLogin = async () => {
    await User.login();
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-100/50 to-green-100/40 overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full opacity-30 blur-2xl animate-pulse delay-1000"></div>
      
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md text-center bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl shadow-blue-200/20 border border-slate-200/80"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-300/40">
          <Shield className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Welcome to <span className="text-blue-600">HealthWise</span>
        </h1>
        
        <p className="text-lg text-slate-600 mb-8">
          Your personal AI-powered health and wellness assistant.
        </p>

        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Button
              onClick={handleLogin}
              size="lg"
              className="w-full text-lg font-semibold py-7 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 rounded-xl"
            >
              <LogIn className="w-5 h-5 mr-3" />
              Login or Sign Up
            </Button>
        </motion.div>
        
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Sparkles className="w-4 h-4 text-green-500" />
            <span>Secure, Private, and Intelligent Health Tracking</span>
        </div>
      </motion.div>
    </div>
  );
}