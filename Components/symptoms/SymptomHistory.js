import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { History, Eye, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SymptomHistory({ symptoms, isLoading, getSeverityColor, getUrgencyColor }) {
  const [selectedSymptom, setSelectedSymptom] = useState(null);

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle>Symptom History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-600" />
            Symptom History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {symptoms.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg font-medium">No symptoms recorded yet</p>
              <p className="text-slate-400 mt-2">Start by analyzing your first symptoms above</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {symptoms.map((symptom, index) => (
                  <motion.div
                    key={symptom.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-4 border border-slate-200 rounded-xl hover:shadow-md hover:border-red-200 transition-all duration-200 cursor-pointer bg-gradient-to-r from-white to-slate-50/50"
                    onClick={() => setSelectedSymptom(symptom)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-4">
                        <p className="font-medium text-slate-900 line-clamp-2 mb-2">
                          {symptom.symptoms_description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                          <Clock className="w-4 h-4" />
                          {format(new Date(symptom.created_date), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getSeverityColor(symptom.severity_level)}>
                        {symptom.severity_level}
                      </Badge>
                      <Badge className={getUrgencyColor(symptom.urgency_classification)}>
                        {symptom.urgency_classification?.replace(/_/g, ' ')}
                      </Badge>
                      {symptom.affected_body_parts?.slice(0, 2).map(part => (
                        <Badge key={part} variant="outline" className="bg-blue-50">
                          {part}
                        </Badge>
                      ))}
                      {symptom.affected_body_parts?.length > 2 && (
                        <Badge variant="outline" className="bg-slate-50">
                          +{symptom.affected_body_parts.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
 