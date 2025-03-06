
import React from "react";
import { Calendar, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface EmptyAppointmentStateProps {
  type: "upcoming" | "past" | "cancelled";
}

export const EmptyAppointmentState = ({ type }: EmptyAppointmentStateProps) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (type) {
      case "upcoming":
        return <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />;
      case "past":
        return <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />;
      case "cancelled":
        return <XCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />;
    }
  };

  const getMessage = () => {
    switch (type) {
      case "upcoming":
        return "You don't have any upcoming appointments.";
      case "past":
        return "You don't have any past appointments.";
      case "cancelled":
        return "You don't have any cancelled appointments.";
    }
  };

  return (
    <Card>
      <CardContent className="p-8 text-center">
        {getIcon()}
        <p className="text-muted-foreground">{getMessage()}</p>
        {type === "upcoming" && (
          <Button className="mt-4" onClick={() => navigate("/appointments/new")}>
            Schedule an Appointment
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
