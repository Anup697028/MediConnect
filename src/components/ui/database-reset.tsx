import React from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export function DatabaseReset() {
  const [open, setOpen] = React.useState(false);
  
  const handleReset = () => {
    api.resetDatabase();
    setOpen(false);
    // Reload the page to refresh all data
    window.location.reload();
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="absolute bottom-4 right-4 opacity-50 hover:opacity-100">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Reset DB
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            Reset Database
          </DialogTitle>
          <DialogDescription>
            This will reset the database to its initial state with sample doctors. All your appointments, prescriptions, and user data will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleReset}>Reset Database</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
