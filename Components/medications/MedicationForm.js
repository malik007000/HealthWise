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

  const removeSideEffect = (sideEffect) => {
    setFormData(prev => ({
      ...prev,
      side_effects_noted: prev.side_effects_noted.filter(se => se !== sideEffect)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Pill className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {medication ? 'Edit Medication' : 'Add New Medication'}
                </h3>
                <p className="text-sm text-slate-600 font-normal">Track dosage and timing</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-5 h-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-base font-semibold mb-2 block">
                  Medication Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Ibuprofen, Vitamin D"
                  value={formData.medication_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, medication_name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="dosage" className="text-base font-semibold mb-2 block">
                  Dosage *
                </Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 400mg, 2 tablets"
                  value={formData.dosage}
                  onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequency" className="text-base font-semibold mb-2 block">
                  Frequency *
                </Label>
                <Select 
                  value={formData.frequency}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once_daily">Once Daily</SelectItem>
                    <SelectItem value="twice_daily">Twice Daily</SelectItem>
                    <SelectItem value="three_times_daily">Three Times Daily</SelectItem>
                    <SelectItem value="four_times_daily">Four Times Daily</SelectItem>
                    <SelectItem value="as_needed">As Needed</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="purpose" className="text-base font-semibold mb-2 block">
                  Purpose
                </Label>
                <Input
                  id="purpose"
                  placeholder="e.g., Pain relief, Blood pressure"
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-2 block">
                Times to Take
              </Label>
              <div className="flex gap-2 mb-3">
                <Input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
                <Button type="button" onClick={addTime} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.times_to_take.map((time, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeTime(time)}
                  >
                    {time}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date" className="text-base font-semibold mb-2 block">
                  Start Date
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="refill_date" className="text-base font-semibold mb-2 block">
                  Refill Reminder Date
                </Label>
                <Input
                  id="refill_date"
                  type="date"
                  value={formData.refill_reminder_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, refill_reminder_date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="prescribed_by" className="text-base font-semibold mb-2 block">
                Prescribed By
              </Label>
              <Input
                id="prescribed_by"
                placeholder="e.g., Dr. Smith"
                value={formData.prescribed_by}
                onChange={(e) => setFormData(prev => ({ ...prev, prescribed_by: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !formData.medication_name || !formData.dosage}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Pill className="w-4 h-4 mr-2" />
                    {medication ? 'Update' : 'Add'} Medication
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}