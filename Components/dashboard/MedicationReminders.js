import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Pill, Clock, AlertCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function MedicationReminders({ medications }) {
  const getTodaysMedications = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return medications
      .filter(med => med.is_active && med.times_to_take?.length > 0)
      .map(med => ({
        ...med,
        nextDose: med.times_to_take?.find(time => {
          const [hours, minutes] = time.split(':').map(Number);
          const scheduleTime = hours * 60 + minutes;
          return scheduleTime > currentTime;
        }) || med.times_to_take[0]
      }))
      .slice(0, 3);
  };

  const todaysMedications = getTodaysMedications();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Pill className="w-5 h-5 text-slate-600" />
            Medication Reminders
          </CardTitle>
          <Link to={createPageUrl("Medications")}>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Plus className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {todaysMedications.length === 0 ? (
          <div className="text-center py-6">
            <Pill className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No medications scheduled</p>
            <Link to={createPageUrl("Medications")}>
              <Button variant="outline" size="sm" className="mt-2">
                Add Medication
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {todaysMedications.map((medication, index) => {
              const needsRefill = medication.refill_reminder_date && 
                new Date(medication.refill_reminder_date) <= new Date();
              
              return (
                <motion.div
                  key={medication.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 border border-green-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Pill className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">{medication.medication_name}</p>
                      <p className="text-xs text-slate-600 mb-2">{medication.dosage} - {medication.purpose}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs bg-white">
                          <Clock className="w-3 h-3 mr-1" />
                          Next: {medication.nextDose}
                        </Badge>
                        {needsRefill && (
                          <Badge variant="outline" className="text-xs border-yellow-200 bg-yellow-50 text-yellow-700">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Refill needed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}