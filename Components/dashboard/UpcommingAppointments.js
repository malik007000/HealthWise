import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { Calendar, Clock, User, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function UpcomingAppointments({ appointments }) {
  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.appointment_date) >= new Date())
    .slice(0, 3);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Calendar className="w-5 h-5 text-slate-600" />
            Upcoming Appointments
          </CardTitle>
          <Link to={createPageUrl("Appointments")}>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Plus className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No upcoming appointments</p>
            <Link to={createPageUrl("Appointments")}>
              <Button variant="outline" size="sm" className="mt-2">
                Schedule Appointment
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{appointment.doctor_name}</p>
                    <p className="text-xs text-slate-600 mb-1">{appointment.specialty || appointment.reason}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(appointment.appointment_date), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(appointment.appointment_date), "h:mm a")}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}