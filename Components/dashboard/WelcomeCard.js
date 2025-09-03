import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, AlertTriangle, Info, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function WelcomeCard({ user, wellnessScore, alerts }) {
  const getWellnessColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getWellnessMessage = (score) => {
    if (score >= 80) return "Excellent health trends!";
    if (score >= 60) return "Good progress overall";
    return "Let's focus on wellness";
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-green-50/50 border-0 shadow-xl shadow-blue-100/20">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-green-400/10 rounded-full transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-400/10 to-blue-400/10 rounded-full transform -translate-x-24 translate-y-24"></div>
      
      <CardHeader className="relative z-10 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-slate-900 mb-2"
            >
              Welcome back, {user?.full_name?.split(' ')[0] || 'there'}!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-600 text-lg"
            >
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-medium text-slate-600">Wellness Score</span>
              </div>
              <div className={`text-3xl font-bold ${getWellnessColor(wellnessScore)}`}>
                {wellnessScore}%
              </div>
              <p className="text-sm text-slate-500">{getWellnessMessage(wellnessScore)}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-pink-600" />
            </div>
          </motion.div>
        </div>
      </CardHeader>
      
      {alerts.length > 0 && (
        <CardContent className="relative z-10 pt-0">
          <div className="flex flex-wrap gap-2">
            {alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Badge 
                  variant="outline"
                  className={`flex items-center gap-2 px-3 py-2 ${
                    alert.type === 'warning' 
                      ? 'border-yellow-200 bg-yellow-50 text-yellow-700' 
                      : 'border-blue-200 bg-blue-50 text-blue-700'
                  }`}
                >
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                  {alert.message}
                  <Link to={createPageUrl(alert.action.charAt(0).toUpperCase() + alert.action.slice(1))}>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      View
                    </Button>
                  </Link>
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}