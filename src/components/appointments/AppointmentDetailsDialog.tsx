
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, FileText, AlertCircle, Clipboard, User, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/services/api";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateSymptoms?: (appointment: Appointment, symptoms: string) => Promise<void>;
}

export const AppointmentDetailsDialog = ({
  appointment,
  open,
  onOpenChange,
  onUpdateSymptoms,
}: AppointmentDetailsDialogProps) => {
  const [editingSymptoms, setEditingSymptoms] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize symptoms when appointment changes
  React.useEffect(() => {
    if (appointment) {
      setSymptoms(appointment.symptoms || "");
    }
  }, [appointment]);

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

  const handleSaveSymptoms = async () => {
    if (!appointment || !onUpdateSymptoms) return;
    
    try {
      setIsSaving(true);
      await onUpdateSymptoms(appointment, symptoms);
      setEditingSymptoms(false);
      toast.success("Symptoms updated successfully");
    } catch (error) {
      console.error("Failed to update symptoms:", error);
      toast.error("Failed to update symptoms");
    } finally {
      setIsSaving(false);
    }
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

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="w-full">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Symptoms</h3>
                {appointment.status === "scheduled" && !editingSymptoms && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditingSymptoms(true)}
                    className="h-7 text-xs"
                  >
                    Edit
                  </Button>
                )}
              </div>
              
              {editingSymptoms ? (
                <div className="mt-2 space-y-2">
                  <Textarea
                    placeholder="Describe your symptoms in detail..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setEditingSymptoms(false);
                        setSymptoms(appointment.symptoms || "");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSaveSymptoms}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5 mr-1" /> Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {appointment.symptoms ? appointment.symptoms : "No symptoms reported yet."}
                </p>
              )}
            </div>
          </div>

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
