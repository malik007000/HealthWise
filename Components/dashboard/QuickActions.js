import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Stethoscope, Pill, BookOpen, Heart, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function QuickActions() {
  const actions = [
    {
      title: "Log Symptoms",
      description: "AI-powered symptom analysis",
      icon: Stethoscope,
      link: "Symptoms",
      color: "text-red-500",
      bgColor: "bg-red-50 hover:bg-red-100"
    },
    {
      title: "Add Medication", 
      description: "Track your medications",
      icon: Pill,
      link: "Medications", 
      color: "text-green-500",
      bgColor: "bg-green-50 hover:bg-green-100"
    },
    {
      title: "Journal Entry",
      description: "Record your daily wellness", 
      icon: BookOpen,
      link: "Journal",
      color: "text-purple-500",
      bgColor: "bg-purple-50 hover:bg-purple-100"
    },
    {
      title: "Record Vitals",
      description: "Track vital signs",
      icon: Heart,
      link: "Vitals",
      color: "text-pink-500", 
      bgColor: "bg-pink-50 hover:bg-pink-100"
    }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Plus className="w-5 h-5 text-slate-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={createPageUrl(action.link)}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 h-auto p-4 ${action.bgColor} border border-slate-100 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-md`}
              >
                <action.icon className={`w-5 h-5 ${action.color}`} />
                <div className="text-left">
                  <div className="font-semibold text-slate-900">{action.title}</div>
                  <div className="text-xs text-slate-500">{action.description}</div>
                </div>
              </Button>
            </Link>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}