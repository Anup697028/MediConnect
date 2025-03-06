
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard } from "./AppointmentCard";
import { EmptyAppointmentState } from "./EmptyAppointmentState";
import { AppointmentLoadingState } from "./AppointmentLoadingState";
import { Appointment } from "@/services/api";

interface AppointmentTabsProps {
  isLoading: boolean;
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  cancelledAppointments: Appointment[];
  onSetReminder: (appointment: Appointment) => void;
  onCancelAppointment: (appointment: Appointment) => void;
  onViewDetails: (appointment: Appointment) => void;
}

export const AppointmentTabs = ({
  isLoading,
  upcomingAppointments,
  pastAppointments,
  cancelledAppointments,
  onSetReminder,
  onCancelAppointment,
  onViewDetails,
}: AppointmentTabsProps) => {
  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="mb-4">
        <TabsTrigger value="upcoming">
          Upcoming ({upcomingAppointments.length})
        </TabsTrigger>
        <TabsTrigger value="past">
          Past ({pastAppointments.length})
        </TabsTrigger>
        <TabsTrigger value="cancelled">
          Cancelled ({cancelledAppointments.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        {isLoading ? (
          <AppointmentLoadingState />
        ) : upcomingAppointments.length > 0 ? (
          upcomingAppointments.map((appointment) => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
              onSetReminder={onSetReminder}
              onCancelAppointment={onCancelAppointment}
              onViewDetails={onViewDetails}
            />
          ))
        ) : (
          <EmptyAppointmentState type="upcoming" />
        )}
      </TabsContent>

      <TabsContent value="past">
        {isLoading ? (
          <AppointmentLoadingState />
        ) : pastAppointments.length > 0 ? (
          pastAppointments.map((appointment) => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
              onSetReminder={onSetReminder}
              onCancelAppointment={onCancelAppointment}
              onViewDetails={onViewDetails}
            />
          ))
        ) : (
          <EmptyAppointmentState type="past" />
        )}
      </TabsContent>

      <TabsContent value="cancelled">
        {isLoading ? (
          <AppointmentLoadingState />
        ) : cancelledAppointments.length > 0 ? (
          cancelledAppointments.map((appointment) => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
              onSetReminder={onSetReminder}
              onCancelAppointment={onCancelAppointment}
              onViewDetails={onViewDetails}
            />
          ))
        ) : (
          <EmptyAppointmentState type="cancelled" />
        )}
      </TabsContent>
    </Tabs>
  );
};
