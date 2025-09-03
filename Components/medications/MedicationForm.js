import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pill, X, Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function MedicationForm({ medication, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState(medication || {
    medication_name: "",
    dosage: "",
    frequency: "once_daily",
    times_to_take: [],
    start_date: "",
    end_date: "",
    prescribed_by: "",
    purpose: "",
    side_effects_noted: [],
    refill_reminder_date: "",
    is_active: true
  });

  const [newTime, setNewTime] = useState("");
  const [newSideEffect, setNewSideEffect] = useState("");

  const addTime = () => {
    if (newTime && !formData.times_to_take.includes(newTime)) {
      setFormData(prev => ({
        ...prev,
        times_to_take: [...prev.times_to_take, newTime].sort()
      }));
      setNewTime("");
    }
  };

  const removeTime = (time) => {
    setFormData(prev => ({
      ...prev,
      times_to_take: prev.times_to_take.filter(t => t !== time)
    }));
  };

  const addSideEffect = () => {
    if (newSideEffect.trim() && !formData.side_effects_noted.includes(newSideEffect.trim())) {
      setFormData(prev => ({
        ...prev,
        side_effects_noted: [...prev.side_effects_noted, newSideEffect.trim()]
      }));
      setNewSideEffect("");
    }
  };
