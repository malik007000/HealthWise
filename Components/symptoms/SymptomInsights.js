import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Calendar, Target } from "lucide-react";

export default function SymptomInsights({ symptoms }) {
  const getFrequentBodyParts = () => {
    const bodyParts = {};
    symptoms.forEach(symptom => {
      symptom.affected_body_parts?.forEach(part => {
        bodyParts[part] = (bodyParts[part] || 0) + 1;
      });
    });
    return Object.entries(bodyParts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getSeverityDistribution = () => {
    const distribution = { mild: 0, moderate: 0, severe: 0, critical: 0 };
    symptoms.forEach(symptom => {
      if (symptom.severity_level) {
        distribution[symptom.severity_level]++;
      }
    });
    return distribution;
  };

  const getUrgentSymptoms = () => {
    return symptoms.filter(s => 
      s.urgency_classification === 'seek_urgent_care' || 
      s.urgency_classification === 'emergency'
    ).length;
  };

  const severityDistribution = getSeverityDistribution();
  const frequentBodyParts = getFrequentBodyParts();
  const urgentCount = getUrgentSymptoms();

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <TrendingUp className="w-5 h-5" />
            Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{symptoms.length}</div>
              <div className="text-sm text-blue-600">Total Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
              <div className="text-sm text-red-500">Urgent Cases</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Severity Distribution */}
      {symptoms.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Severity Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(severityDistribution).map(([severity, count]) => {
                if (count === 0) return null;
                const colors = {
                  mild: "bg-green-100 text-green-800",
                  moderate: "bg-yellow-100 text-yellow-800", 
                  severe: "bg-orange-100 text-orange-800",
                  critical: "bg-red-100 text-red-800"
                };
                return (
                  <div key={severity} className="flex items-center justify-between">
                    <Badge className={colors[severity]}>
                      {severity}
                    </Badge>
                    <div className="text-sm font-medium text-slate-700">{count}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Frequent Body Parts */}
      {frequentBodyParts.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Common Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {frequentBodyParts.map(([bodyPart, count]) => (
                <div key={bodyPart} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 capitalize">
                    {bodyPart}
                  </span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    {count} times
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Tips */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Calendar className="w-5 h-5" />
            Health Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-green-800">
            <p>• Track symptoms consistently to identify patterns</p>
            <p>• Note triggers and environmental factors</p>
            <p>• Always consult healthcare providers for serious concerns</p>
            <p>• Keep a detailed record for medical appointments</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}