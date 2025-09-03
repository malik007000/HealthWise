import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Activity, Moon, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function HealthMetrics({ vitals, journalEntries }) {
  const getLatestVital = (type) => {
    if (!vitals || vitals.length === 0) return null;
    return vitals.find(v => v[type] !== undefined && v[type] !== null);
  };

  const getAverageJournalMetric = (metric) => {
    if (!journalEntries || journalEntries.length === 0) return 0;
    const recent = journalEntries.slice(0, 7);
    const sum = recent.reduce((acc, entry) => acc + (entry[metric] || 0), 0);
    return Math.round(sum / recent.length * 10) / 10;
  };

  const metrics = [
    {
      title: "Heart Rate",
      value: getLatestVital('heart_rate') ? `${getLatestVital('heart_rate').heart_rate} bpm` : "No data",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-100"
    },
    {
      title: "Blood Pressure", 
      value: getLatestVital('blood_pressure_systolic') ? 
        `${getLatestVital('blood_pressure_systolic').blood_pressure_systolic}/${getLatestVital('blood_pressure_systolic').blood_pressure_diastolic}` 
        : "No data",
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-50", 
      borderColor: "border-blue-100"
    },
    {
      title: "Sleep Quality",
      value: getAverageJournalMetric('sleep_quality') ? `${getAverageJournalMetric('sleep_quality')}/10` : "No data",
      icon: Moon,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100"
    },
    {
      title: "Energy Level",
      value: getAverageJournalMetric('energy_level') ? `${getAverageJournalMetric('energy_level')}/10` : "No data",
      icon: Zap,
      color: "text-yellow-500", 
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`relative overflow-hidden bg-white/80 backdrop-blur-sm border ${metric.borderColor} hover:shadow-lg transition-all duration-300 group`}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 md:p-3 rounded-xl ${metric.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                  <metric.icon className={`w-4 h-4 md:w-5 md:h-5 ${metric.color}`} />
                </div>
                <h3 className="font-semibold text-slate-700 text-sm md:text-base">{metric.title}</h3>
              </div>
              <p className="text-xl md:text-2xl font-bold text-slate-900 mb-1">{metric.value}</p>
              <p className="text-xs text-slate-500">
                {metric.value !== "No data" ? "Latest measurement" : "Add your first measurement"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}