import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Bell, Clock, AlertTriangle, Pill, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function MedicationReminders({ medications, needRefill }) {
  const getTodaysReminders = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return medications
      .filter(med => med.times_to_take?.length > 0)
      .map(med => {
        const upcomingTimes = med.times_to_take?.filter(time => {
          const [hours, minutes] = time.split(':').map(Number);
          const scheduleTime = hours * 60 + minutes;
          return scheduleTime > currentTime;
        }) || [];
        
        return {
          ...med,
          nextTime: upcomingTimes[0] || med.times_to_take[0],
          isNext: upcomingTimes.length > 0
        };
      })
      .slice(0, 4);
  };

  const todaysReminders = getTodaysReminders();

  return (
    <div className="space-y-6">
      {/* Today's Reminders */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Today's Schedule
            </CardTitle>
            <Link to={createPageUrl("Medications")}>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Plus className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {todaysReminders.length === 0 ? (
            <div className="text-center py-6">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No medication schedule today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysReminders.map((med, index) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-xl border transition-all duration-200 ${
                    med.isNext
                      ? 'bg-gradient-to-r from-blue-50 to-green-50 border-blue-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Pill className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">
                        {med.medication_name}
                      </p>
                      <p className="text-xs text-slate-600">{med.dosage}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          med.isNext 
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {med.nextTime}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Refill Reminders */}
      {needRefill.length > 0 && (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertTriangle className="w-5 h-5" />
              Refill Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {needRefill.map((med, index) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-white/60 rounded-xl border border-orange-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-orange-900 text-sm">
                        {med.medication_name}
                      </p>
                      <p className="text-xs text-orange-700">{med.dosage}</p>
                    </div>
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                      Refill Now
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}