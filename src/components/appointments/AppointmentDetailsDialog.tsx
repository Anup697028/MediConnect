
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, FileText, AlertCircle, Clipboard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/services/api";
import { Separator } from "@/components/ui/separator";

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AppointmentDetailsDialog = ({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailsDialogProps) => {
  if (!appointment) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Appointment Details</DialogTitle>
          <DialogDescription>
            View information about your appointment with Dr. Smith
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Date & Time</h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(appointment.date)} at {appointment.time}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Doctor</h3>
              <p className="text-sm text-muted-foreground">Dr. Smith</p>
              <p className="text-xs text-muted-foreground">Specialization: General Medicine</p>
            </div>
          </div>

          {appointment.symptoms && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Symptoms</h3>
                <p className="text-sm text-muted-foreground">{appointment.symptoms}</p>
              </div>
            </div>
          )}

          {appointment.notes && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Doctor's Notes</h3>
                <p className="text-sm text-muted-foreground">{appointment.notes}</p>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Clipboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Preparation Instructions</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1 space-y-1">
                <li>Please arrive 15 minutes before your appointment time</li>
                <li>Bring any previous medical records or test results</li>
                <li>Have a list of current medications ready</li>
                <li>Prepare questions you want to ask the doctor</li>
                {appointment.status === "scheduled" && (
                  <li className="text-primary-foreground font-medium">
                    Don't forget to join the video call on time
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
