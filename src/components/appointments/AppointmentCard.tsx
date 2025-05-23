import React, { useEffect, useState } from "react";
import { Calendar, Clock, Video, Bell, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment, api, Doctor } from "@/services/api";
import { useNavigate } from "react-router-dom";

interface AppointmentCardProps {
  appointment: Appointment;
  onSetReminder: (appointment: Appointment) => void;
  onCancelAppointment: (appointment: Appointment) => void;
  onViewDetails: (appointment: Appointment) => void;
}

export const AppointmentCard = ({
  appointment,
  onSetReminder,
  onCancelAppointment,
  onViewDetails,
}: AppointmentCardProps) => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setIsLoading(true);
        const doctorData = await api.getDoctorById(appointment.doctorId);
        setDoctor(doctorData);
      } catch (error) {
        console.error("Failed to fetch doctor:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [appointment.doctorId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div 
      className="mb-4 hover:shadow-md transition-shadow rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer"
      onClick={() => onViewDetails(appointment)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Appointment with {doctor?.name || "Loading doctor..."}</h3>
              <div className="text-sm text-muted-foreground mt-1">
                <span className="text-primary-600">{doctor?.specialty || ""}</span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{appointment.time}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                {appointment.status === "scheduled" && (
                  <div className="text-xs bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full dark:bg-blue-800/20 dark:text-blue-300">
                    Upcoming
                  </div>
                )}
                {appointment.status === "completed" && (
                  <div className="text-xs bg-green-100 text-green-800 py-0.5 px-2 rounded-full dark:bg-green-800/20 dark:text-green-300">
                    Completed
                  </div>
                )}
                {appointment.status === "cancelled" && (
                  <div className="text-xs bg-red-100 text-red-800 py-0.5 px-2 rounded-full dark:bg-red-800/20 dark:text-red-300">
                    Cancelled
                  </div>
                )}
                <div className="text-xs bg-gray-100 text-gray-800 py-0.5 px-2 rounded-full dark:bg-gray-800/20 dark:text-gray-300">
                  {appointment.paymentStatus === "completed" ? "Paid" : "Payment Pending"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            {appointment.status === "scheduled" && (
              <>
                <Button 
                  size="sm" 
                  variant="default"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/consultations?appointmentId=${appointment.id}`);
                  }}
                >
                  <Video className="h-4 w-4 mr-1" /> Join
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetReminder(appointment);
                  }}
                >
                  <Bell className="h-4 w-4 mr-1" /> Reminder
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full text-destructive border-destructive/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelAppointment(appointment);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </>
            )}
            {appointment.status === "completed" && (
              <Button 
                size="sm" 
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(appointment);
                }}
              >
                <FileText className="h-4 w-4 mr-1" /> View Notes
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
