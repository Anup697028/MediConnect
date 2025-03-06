
import React from "react";

export const AppointmentLoadingState = () => {
  return (
    <div className="flex justify-center p-8">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/30"></div>
        <div className="h-4 w-32 rounded bg-primary/30"></div>
      </div>
    </div>
  );
};
