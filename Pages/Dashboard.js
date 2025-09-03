
import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { HealthProfile, SymptomEntry, Medication, HealthJournal, VitalSigns, Appointment } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Activity, 
  Heart, 
  Pill, 
  Calendar, 
  BookOpen, 
  Stethoscope,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

import WelcomeCard from "../components/dashboard/WelcomeCard";
import HealthMetrics from "../components/dashboard/HealthMetrics";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";
import UpcomingAppointments from "../components/dashboard/UpcomingAppointments";
import MedicationReminders from "../components/dashboard/MedicationReminders";

export default function Dashboard({ user }) { // Accept user prop
  const [healthData, setHealthData] = useState({
    profile: null,
    symptoms: [],
    medications: [],
    journal: [],
    vitals: [],
    appointments: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadHealthData = useCallback(async () => {
    if (!user) { // Only fetch if user is available
      setIsLoading(false); // Ensure loading state is reset if no user
      return;
    }
    setIsLoading(true);
    try {
      const [profile, symptoms, medications, journal, vitals, appointments] = await Promise.all([
        HealthProfile.list().then(profiles => profiles.find(p => p.created_by === user.email)),
        SymptomEntry.filter({ created_by: user.email }, '-created_date', 5),
        Medication.filter({is_active: true, created_by: user.email}),
        HealthJournal.filter({ created_by: user.email }, '-entry_date', 7),
        VitalSigns.filter({ created_by: user.email }, '-measurement_date', 10),
        Appointment.filter({status: 'scheduled', created_by: user.email}, '-appointment_date', 5)
      ]);

      setHealthData({
        profile,
        symptoms,
        medications,
        journal,
        vitals,
        appointments
      });
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Dependency on user prop

  useEffect(() => {
    loadHealthData();
  }, [loadHealthData]); // Rerun when loadHealthData function changes (which happens when user changes)

  const getWellnessScore = () => {
    if (healthData.journal.length === 0) return 0;
    const recentEntries = healthData.journal.slice(0, 7);
    const avgMood = recentEntries.reduce((sum, entry) => sum + (entry.mood_rating || 5), 0) / recentEntries.length;
    const avgEnergy = recentEntries.reduce((sum, entry) => sum + (entry.energy_level || 5), 0) / recentEntries.length;
    const avgSleep = recentEntries.reduce((sum, entry) => sum + (entry.sleep_quality || 5), 0) / recentEntries.length;
    return Math.round((avgMood + avgEnergy + avgSleep) / 3 * 10);
  };

  const getHealthAlerts = () => {
    const alerts = [];
    
    // Check for overdue medications
    const overdueMeds = healthData.medications.filter(med => {
      const refillDate = new Date(med.refill_reminder_date);
      return refillDate <= new Date();
    });
    
    if (overdueMeds.length > 0) {
      alerts.push({
        type: 'warning',
        message: `${overdueMeds.length} medication${overdueMeds.length > 1 ? 's' : ''} need refill`,
        action: 'medications'
      });
    }

    // Check for upcoming appointments
    const upcomingAppts = healthData.appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return aptDate <= tomorrow;
    });

    if (upcomingAppts.length > 0) {
      alerts.push({
        type: 'info',
        message: `${upcomingAppts.length} appointment${upcomingAppts.length > 1 ? 's' : ''} coming up`,
        action: 'appointments'
      });
    }

    return alerts;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-white/60 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <WelcomeCard 
          user={user} 
          wellnessScore={getWellnessScore()}
          alerts={getHealthAlerts()}
        />

        <HealthMetrics 
          vitals={healthData.vitals}
          journalEntries={healthData.journal}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecentActivity 
              symptoms={healthData.symptoms}
              journalEntries={healthData.journal}
            />
          </div>

          <div className="space-y-6">
            <QuickActions />
            
            <UpcomingAppointments 
              appointments={healthData.appointments}
            />
            
            <MedicationReminders 
              medications={healthData.medications}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
