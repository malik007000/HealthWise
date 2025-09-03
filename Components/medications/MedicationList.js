import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { Pill, Edit, Clock, User, AlertTriangle, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MedicationList({ medications, isLoading, onEdit, onToggleActive }) {
  const [filter, setFilter] = useState('all');

  const filteredMedications = medications.filter(med => {
    if (filter === 'active') return med.is_active;
    if (filter === 'inactive') return !med.is_active;
    return true;
  });

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle>Your Medications</CardTitle>
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
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-slate-600" />
            Your Medications
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button
              variant={filter === 'inactive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('inactive')}
            >
              Inactive
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredMedications.length === 0 ? (
          <div className="text-center py-8">
            <Pill className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium">No medications found</p>
            <p className="text-slate-400 mt-2">Add your first medication to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredMedications.map((medication, index) => {
                const needsRefill = medication.refill_reminder_date && 
                  new Date(medication.refill_reminder_date) <= new Date();
                
                return (
                  <motion.div
                    key={medication.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 border rounded-xl transition-all duration-200 ${
                      medication.is_active 
                        ? 'bg-gradient-to-r from-white to-green-50/50 border-green-200 hover:shadow-md' 
                        : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`font-semibold text-lg ${
                            medication.is_active ? 'text-slate-900' : 'text-slate-500'
                          }`}>
                            {medication.medication_name}
                          </h3>
                          <Switch
                            checked={medication.is_active}
                            onCheckedChange={() => onToggleActive(medication)}
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-slate-600">
                              <strong>Dosage:</strong> {medication.dosage}
                            </p>
                            <p className="text-sm text-slate-600">
                              <strong>Frequency:</strong> {medication.frequency?.replace(/_/g, ' ')}
                            </p>
                          </div>
                          <div>
                            {medication.purpose && (
                              <p className="text-sm text-slate-600">
                                <strong>Purpose:</strong> {medication.purpose}
                              </p>
                            )}
                            {medication.prescribed_by && (
                              <p className="text-sm text-slate-600">
                                <strong>Prescribed by:</strong> {medication.prescribed_by}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {medication.times_to_take?.map((time, i) => (
                            <Badge key={i} variant="outline" className="bg-blue-50">
                              <Clock className="w-3 h-3 mr-1" />
                              {time}
                            </Badge>
                          ))}
                          {needsRefill && (
                            <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Refill needed
                            </Badge>
                          )}
                        </div>

                        {medication.side_effects_noted?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-slate-600 mb-1">Side effects noted:</p>
                            <div className="flex flex-wrap gap-1">
                              {medication.side_effects_noted.map((effect, i) => (
                                <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  {effect}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(medication)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <History className="w-3 h-3" />
                        Added {format(new Date(medication.created_date), "MMM d, yyyy")}
                      </div>
                      {medication.start_date && (
                        <div>
                          Started {format(new Date(medication.start_date), "MMM d, yyyy")}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}