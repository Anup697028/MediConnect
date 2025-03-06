
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetReminder: () => void;
}

export const ReminderDialog = ({
  open,
  onOpenChange,
  onSetReminder,
}: ReminderDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Appointment Reminder</DialogTitle>
          <DialogDescription>
            Choose when you would like to receive a reminder for your appointment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="reminder-1day" className="rounded" defaultChecked />
            <label htmlFor="reminder-1day">1 day before</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="reminder-1hour" className="rounded" defaultChecked />
            <label htmlFor="reminder-1hour">1 hour before</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="reminder-15min" className="rounded" defaultChecked />
            <label htmlFor="reminder-15min">15 minutes before</label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSetReminder}>Set Reminder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
