
import React, { useState, useEffect, useCallback } from "react";
import { Medication } from "@/entities/Medication";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, Plus, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import MedicationForm from "../components/medications/MedicationForm";
import MedicationList from "../components/medications/MedicationList";
import MedicationReminders from "../components/medications/MedicationReminders";

export default function Medications({ user }) { // Accept user prop
  const [medications, setMedications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadMedications = useCallback(async () => {
    if (!user) return; // Add this check to prevent issues if user is not available yet
    setIsLoading(true);
    try {
      // Filter medications by the current user's email for data privacy
      const medicationList = await Medication.filter({ created_by: user.email }, '-created_date');
      setMedications(medicationList);
    } catch (error) {
      console.error('Error loading medications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Dependency array includes 'user' because user.email is used

  useEffect(() => {
    loadMedications();
  }, [loadMedications]); // Rerun when loadMedications itself changes (which only happens if its dependencies change)

  const handleSubmit = async (medicationData) => {
    // Add or update the 'created_by' field with the current user's email
    const dataToSave = { ...medicationData, created_by: user.email };

    if (editingMedication) {
      await Medication.update(editingMedication.id, dataToSave);
    } else {
      await Medication.create(dataToSave);
    }
    
    loadMedications();
    setShowForm(false);
    setEditingMedication(null);
  };

  const handleEdit = (medication) => {
    setEditingMedication(medication);
    setShowForm(true);
  };

  const handleToggleActive = async (medication) => {
    // When toggling active status, ensure 'created_by' is preserved
    await Medication.update(medication.id, {
      ...medication,
      is_active: !medication.is_active,
      created_by: user.email // Ensure created_by is explicitly passed
    });
    loadMedications();
  };

  const getActiveMedications = () => medications.filter(med => med.is_active);
  const getInactiveMedications = () => medications.filter(med => !med.is_active);
  
  const getMedicationsNeedingRefill = () => {
    return medications.filter(med => 
      med.is_active && 
      med.refill_reminder_date && 
      new Date(med.refill_reminder_date) <= new Date()
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-blue-50/20 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Medication Management
            </h1>
            <p className="text-slate-600 text-lg">
              Track your medications, set reminders, and never miss a dose
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 shadow-lg"
            size="lg"
            disabled={!user} // Disable button if no user is logged in
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Medication
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm shadow-md border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {getActiveMedications().length}
              </div>
              <div className="text-sm text-slate-600">Active</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm shadow-md border-slate-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-600 mb-1">
                {getInactiveMedications().length}
              </div>
              <div className="text-sm text-slate-600">Inactive</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-md border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {getMedicationsNeedingRefill().length}
              </div>
              <div className="text-sm text-slate-600">Need Refill</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-md border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {medications.reduce((total, med) => total + (med.times_to_take?.length || 0), 0)}
              </div>
              <div className="text-sm text-slate-600">Daily Doses</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {showForm && (
                <MedicationForm
                  medication={editingMedication}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingMedication(null);
                  }}
                  // Pass user prop to form if needed for internal logic (e.g., default values)
                  user={user} 
                />
              )}
            </AnimatePresence>
            
            <MedicationList
              medications={medications}
              isLoading={isLoading}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              user={user} // Pass user prop if any actions within the list depend on it
            />
          </div>

          <div>
            <MedicationReminders 
              medications={getActiveMedications()}
              needRefill={getMedicationsNeedingRefill()}
              user={user} // Pass user prop if any actions within reminders depend on it
            />
          </div>
        </div>
      </div>
    </div>
  );
}
