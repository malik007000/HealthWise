import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Brain, X, Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SymptomAnalysisForm({ onSubmit, onCancel, isAnalyzing }) {
  const [formData, setFormData] = useState({
    symptoms_description: "",
    duration: "",
    affected_body_parts: [],
    triggers: ""
  });

  const [newBodyPart, setNewBodyPart] = useState("");

  const addBodyPart = () => {
    if (newBodyPart.trim() && !formData.affected_body_parts.includes(newBodyPart.trim())) {
      setFormData(prev => ({
        ...prev,
        affected_body_parts: [...prev.affected_body_parts, newBodyPart.trim()]
      }));
      setNewBodyPart("");
    }
  };

  const removeBodyPart = (bodyPart) => {
    setFormData(prev => ({
      ...prev,
      affected_body_parts: prev.affected_body_parts.filter(part => part !== bodyPart)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.symptoms_description.trim()) return;
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-red-200 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Brain className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Describe Your Symptoms</h3>
                <p className="text-sm text-slate-600 font-normal">AI will analyze and provide insights</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-5 h-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="symptoms" className="text-base font-semibold mb-2 block">
                What symptoms are you experiencing?
              </Label>
              <Textarea
                id="symptoms"
                placeholder="Describe your symptoms in detail... (e.g., 'I have been experiencing a persistent headache with sensitivity to light for the past 2 days')"
                value={formData.symptoms_description}
                onChange={(e) => setFormData(prev => ({ ...prev, symptoms_description: e.target.value }))}
                className="min-h-[100px] text-base"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration" className="text-base font-semibold mb-2 block">
                  How long have you had these symptoms?
                </Label>
                <Input
                  id="duration"
                  placeholder="e.g., 2 days, 1 week, since this morning"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="triggers" className="text-base font-semibold mb-2 block">
                  Any triggers you noticed?
                </Label>
                <Input
                  id="triggers"
                  placeholder="e.g., after eating, during stress, in the morning"
                  value={formData.triggers}
                  onChange={(e) => setFormData(prev => ({ ...prev, triggers: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-2 block">
                Affected body parts
              </Label>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="e.g., head, stomach, chest"
                  value={newBodyPart}
                  onChange={(e) => setNewBodyPart(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBodyPart())}
                />
                <Button type="button" onClick={addBodyPart} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.affected_body_parts.map((part, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeBodyPart(part)}
                  >
                    {part}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isAnalyzing || !formData.symptoms_description.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze with AI
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