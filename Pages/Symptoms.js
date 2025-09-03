
import React, { useState, useEffect, useCallback } from "react";
import { SymptomEntry } from "@/entities/SymptomEntry";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Brain, AlertTriangle, Clock, TrendingUp, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import SymptomAnalysisForm from "../components/symptoms/SymptomAnalysisForm";
import SymptomHistory from "../components/symptoms/SymptomHistory";
import SymptomInsights from "../components/symptoms/SymptomInsights";

export default function Symptoms({ user }) { // Accept user prop
  const [symptoms, setSymptoms] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadSymptoms = useCallback(async () => {
    if (!user) { // Check if user exists before attempting to load
      setIsLoading(false); // Ensure loading state is reset if user is null
      return;
    }
    setIsLoading(true);
    try {
      // Filter symptoms by the current user's email for data privacy
      const symptomList = await SymptomEntry.filter({ created_by: user.email }, '-created_date');
      setSymptoms(symptomList);
    } catch (error) {
      console.error('Error loading symptoms:', error);
      // Optionally handle error state
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Rerun when user prop is available for useCallback memoization

  useEffect(() => {
    loadSymptoms();
  }, [loadSymptoms]); // Rerun when loadSymptoms (memoized) changes

  const analyzeSymptoms = async (symptomData) => {
    setIsAnalyzing(true);
    
    try {
      const analysisPrompt = `
        As a medical AI assistant, analyze the following symptoms and provide a comprehensive assessment.
        
        Symptoms: ${symptomData.symptoms_description}
        Duration: ${symptomData.duration || 'Not specified'}
        Affected areas: ${symptomData.affected_body_parts?.join(', ') || 'Not specified'}
        Triggers: ${symptomData.triggers || 'Not specified'}
        
        Please provide:
        1. A detailed analysis of the symptoms
        2. Possible causes or conditions
        3. Severity assessment (mild, moderate, severe, critical)
        4. Urgency classification (monitor, schedule_appointment, seek_urgent_care, emergency)
        5. Specific recommendations for care
        6. When to seek medical attention
        7. Self-care suggestions if appropriate
        
        IMPORTANT: Always recommend consulting healthcare professionals for proper diagnosis.
        Be thorough but avoid providing definitive diagnoses.
      `;

      const aiResponse = await InvokeLLM({
        prompt: analysisPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            analysis: { type: "string" },
            possible_causes: { type: "array", items: { type: "string" } },
            severity_level: { 
              type: "string", 
              enum: ["mild", "moderate", "severe", "critical"] 
            },
            urgency_classification: { 
              type: "string", 
              enum: ["monitor", "schedule_appointment", "seek_urgent_care", "emergency"] 
            },
            recommendations: { type: "string" },
            when_to_seek_help: { type: "string" },
            self_care_tips: { type: "array", items: { type: "string" } }
          }
        }
      });

      const analysisData = {
        ...symptomData,
        ai_analysis: aiResponse.analysis,
        severity_level: aiResponse.severity_level,
        urgency_classification: aiResponse.urgency_classification,
        recommendations: aiResponse.recommendations,
        // Add created_by to link symptoms to the user
        created_by: user.email, 
        follow_up_date: aiResponse.urgency_classification === 'emergency' ? 
          new Date().toISOString().split('T')[0] :
          aiResponse.urgency_classification === 'seek_urgent_care' ?
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
          aiResponse.urgency_classification === 'schedule_appointment' ?
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
          new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      await SymptomEntry.create(analysisData);
      loadSymptoms(); // Call the memoized function
      setShowForm(false);
      
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
    }
    
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      mild: "bg-green-100 text-green-800 border-green-200",
      moderate: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      severe: "bg-orange-100 text-orange-800 border-orange-200",
      critical: "bg-red-100 text-red-800 border-red-200"
    };
    return colors[severity] || "bg-gray-100 text-gray-800";
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      monitor: "bg-blue-100 text-blue-800 border-blue-200",
      schedule_appointment: "bg-purple-100 text-purple-800 border-purple-200",
      seek_urgent_care: "bg-orange-100 text-orange-800 border-orange-200", 
      emergency: "bg-red-100 text-red-800 border-red-200"
    };
    return colors[urgency] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-pink-50/20 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              AI Symptom Analysis
            </h1>
            <p className="text-slate-600 text-lg">
              Get intelligent insights about your symptoms and health concerns
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-red-600 hover:bg-red-700 shadow-lg"
            size="lg"
          >
            <Stethoscope className="w-5 h-5 mr-2" />
            Analyze Symptoms
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {showForm && (
                <SymptomAnalysisForm
                  onSubmit={analyzeSymptoms}
                  onCancel={() => setShowForm(false)}
                  isAnalyzing={isAnalyzing}
                />
              )}
            </AnimatePresence>
            
            <SymptomHistory 
              symptoms={symptoms}
              isLoading={isLoading}
              getSeverityColor={getSeverityColor}
              getUrgencyColor={getUrgencyColor}
            />
          </div>

          <div>
            <SymptomInsights symptoms={symptoms} />
          </div>
        </div>
      </div>
    </div>
  );
}
