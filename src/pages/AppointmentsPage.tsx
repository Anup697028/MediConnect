
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, Appointment } from "@/services/api";
import { Calendar, Clock, Video, User, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setIsLoading(true);
        const data = await api.getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to load appointments:", error);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Appointment with Dr. Smith</h3>
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
          <div className="flex flex-col gap-2">
            {appointment.status === "scheduled" && (
              <>
                <Button 
                  size="sm" 
                  variant="default"
                  className="w-full"
                  onClick={() => navigate(`/consultations?appointmentId=${appointment.id}`)}
                >
                  <Video className="h-4 w-4 mr-1" /> Join
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full text-destructive border-destructive/20"
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
              >
                <FileText className="h-4 w-4 mr-1" /> View Notes
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <Button onClick={() => navigate("/appointments/new")}>
          New Appointment
        </Button>
      </div>

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
            <div className="flex justify-center p-8">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/30"></div>
                <div className="h-4 w-32 rounded bg-primary/30"></div>
              </div>
            </div>
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  You don't have any upcoming appointments.
                </p>
                <Button className="mt-4" onClick={() => navigate("/appointments/new")}>
                  Schedule an Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/30"></div>
                <div className="h-4 w-32 rounded bg-primary/30"></div>
              </div>
            </div>
          ) : pastAppointments.length > 0 ? (
            pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  You don't have any past appointments.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/30"></div>
                <div className="h-4 w-32 rounded bg-primary/30"></div>
              </div>
            </div>
          ) : cancelledAppointments.length > 0 ? (
            cancelledAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  You don't have any cancelled appointments.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentsPage;
