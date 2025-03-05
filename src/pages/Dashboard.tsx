
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, Video, MessageSquare, FileText, Plus, Heart, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const upcomingAppointments = [
    { 
      id: 1, 
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "Today",
      time: "2:30 PM",
      status: "Upcoming",
      avatar: "S"
    },
    { 
      id: 2, 
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "Tomorrow",
      time: "10:00 AM",
      status: "Upcoming",
      avatar: "M"
    }
  ];
  
  const healthMetrics = [
    { name: "Blood Pressure", value: "120/80", status: "normal", icon: <Activity className="h-5 w-5 text-green-500" /> },
    { name: "Heart Rate", value: "72 bpm", status: "normal", icon: <Heart className="h-5 w-5 text-red-500" /> },
    { name: "Weight", value: "160 lbs", status: "normal", icon: <Activity className="h-5 w-5 text-blue-500" /> }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your health.</p>
        </div>
        <Button onClick={() => navigate("/appointments/new")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Appointment</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <CalendarCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">2</CardTitle>
            <CardDescription>Upcoming Appointments</CardDescription>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">1</CardTitle>
            <CardDescription>Active Prescriptions</CardDescription>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">5</CardTitle>
            <CardDescription>Past Consultations</CardDescription>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">3</CardTitle>
            <CardDescription>New Messages</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upcoming Appointments</span>
              <Button variant="outline" size="sm" onClick={() => navigate("/appointments")}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                        {appointment.avatar}
                      </div>
                      <div>
                        <h4 className="font-medium">{appointment.doctor}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{appointment.date}, {appointment.time}</div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" className="h-8">
                          Reschedule
                        </Button>
                        <Button size="sm" className="h-8 flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          Join
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarCheck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No upcoming appointments</h3>
                <p className="text-muted-foreground mb-4">Schedule your next consultation with a healthcare provider.</p>
                <Button onClick={() => navigate("/appointments/new")}>Book Appointment</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Health Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    {metric.icon}
                    <span>{metric.name}</span>
                  </div>
                  <div className="font-medium">{metric.value}</div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2" onClick={() => navigate("/records")}>
                View Health Records
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Messages</span>
              <Button variant="outline" size="sm" onClick={() => navigate("/messages")}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No recent messages</h3>
              <p className="text-muted-foreground mb-4">Start a conversation with your healthcare provider.</p>
              <Button onClick={() => navigate("/messages")}>Send Message</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Documents</span>
              <Button variant="outline" size="sm" onClick={() => navigate("/records")}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No recent documents</h3>
              <p className="text-muted-foreground mb-4">Upload and manage your health documents.</p>
              <Button onClick={() => navigate("/records")}>Upload Document</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
