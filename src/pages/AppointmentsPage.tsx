
import React, { useState, useEffect } from "react";
import { api, Appointment } from "@/services/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppointmentTabs } from "@/components/appointments/AppointmentTabs";
import { CancelAppointmentDialog } from "@/components/appointments/CancelAppointmentDialog";
import { ReminderDialog } from "@/components/appointments/ReminderDialog";
import { AppointmentDetailsDialog } from "@/components/appointments/AppointmentDetailsDialog";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setIsLoading(true);
        const data = await api.getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to load appointments:", error);
        toast.error("Failed to load appointments");
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Filter appointments by status
  const upcomingAppointments = appointments.filter(
    (app) => app.status === "scheduled"
  );
  const pastAppointments = appointments.filter(
    (app) => app.status === "completed"
  );
  const cancelledAppointments = appointments.filter(
    (app) => app.status === "cancelled"
  );

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      // In a real app, we would call the API to cancel the appointment
      // For now, we'll just update the local state
      const updatedAppointments = appointments.map(app => 
        app.id === selectedAppointment.id 
          ? { ...app, status: "cancelled" as const } 
          : app
      );
      
      setAppointments(updatedAppointments);
      setCancelDialogOpen(false);
      setSelectedAppointment(null);
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  const handleSetReminder = () => {
    if (!selectedAppointment) return;
    
    // In a real app, we would set up a reminder for this appointment
    // For now, we'll just show a success message
    toast.success(`Reminder set for your appointment on ${formatDate(selectedAppointment.date)} at ${selectedAppointment.time}`);
    setReminderDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleUpdateSymptoms = async (appointment: Appointment, symptoms: string) => {
    // In a real app, we would call the API to update the symptoms
    // For now, we'll just update the local state
    const updatedAppointments = appointments.map(app => 
      app.id === appointment.id 
        ? { ...app, symptoms } 
        : app
    );
    
    setAppointments(updatedAppointments);
    
    // Update the selected appointment to reflect changes immediately in the dialog
    if (selectedAppointment && selectedAppointment.id === appointment.id) {
      setSelectedAppointment({ ...appointment, symptoms });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleCancelAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const handleSetReminderClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setReminderDialogOpen(true);
  };

  const handleViewDetailsClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailsDialogOpen(true);
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <Button onClick={() => navigate("/appointments/new")}>
          New Appointment
        </Button>
      </div>

      <AppointmentTabs 
        isLoading={isLoading}
        upcomingAppointments={upcomingAppointments}
        pastAppointments={pastAppointments}
        cancelledAppointments={cancelledAppointments}
        onSetReminder={handleSetReminderClick}
        onCancelAppointment={handleCancelAppointmentClick}
        onViewDetails={handleViewDetailsClick}
      />

      <CancelAppointmentDialog 
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelAppointment}
      />

      <ReminderDialog 
        open={reminderDialogOpen}
        onOpenChange={setReminderDialogOpen}
        onSetReminder={handleSetReminder}
      />

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onUpdateSymptoms={handleUpdateSymptoms}
      />
    </div>
  );
};

export default AppointmentsPage;
