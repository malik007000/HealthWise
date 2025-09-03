import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Stethoscope, BookOpen, Activity, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function RecentActivity({ symptoms, journalEntries }) {
  const allActivity = [
    ...symptoms.map(s => ({
      type: 'symptom',
      title: s.symptoms_description.substring(0, 50) + '...',
      date: s.created_date,
      severity: s.severity_level,
      icon: Stethoscope,
      color: 'text-red-500'
    })),
    ...journalEntries.map(j => ({
      type: 'journal',
      title: `Mood: ${j.mood_rating}/10, Energy: ${j.energy_level}/10`,
      date: j.created_date,
      wellness: j.wellness_score,
      icon: BookOpen, 
      color: 'text-blue-500'
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Activity className="w-5 h-5 text-slate-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allActivity.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No recent activity</p>
            <p className="text-xs text-slate-400 mt-1">Start by logging symptoms or adding a journal entry</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allActivity.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors duration-200"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm leading-tight">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-slate-500">
                      {format(new Date(item.date), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                    {item.severity && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          item.severity === 'critical' ? 'border-red-200 bg-red-50 text-red-700' :
                          item.severity === 'severe' ? 'border-orange-200 bg-orange-50 text-orange-700' :
                          item.severity === 'moderate' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                          'border-green-200 bg-green-50 text-green-700'
                        }`}
                      >
                        {item.severity}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}