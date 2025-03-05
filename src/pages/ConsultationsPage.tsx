
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Video, Users, Share, Mic, MicOff, Camera, CameraOff, PhoneOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ConsultationsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isInCall, setIsInCall] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  
  const mockConsultations = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "Today",
      time: "2:30 PM",
      status: "upcoming",
      avatar: "S"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "May 15, 2023",
      time: "10:00 AM",
      status: "completed",
      avatar: "M"
    },
    {
      id: 3,
      doctor: "Dr. Emily Rodriguez",
      specialty: "Neurologist",
      date: "April 28, 2023",
      time: "3:15 PM",
      status: "completed",
      avatar: "E"
    }
  ];
  
  const startConsultation = () => {
    setIsInCall(true);
    toast({
      title: "Video call started",
      description: "You've joined the consultation with Dr. Sarah Johnson.",
    });
  };
  
  const endConsultation = () => {
    setIsInCall(false);
    toast({
      title: "Video call ended",
      description: "Your consultation has ended. A summary will be available in your records.",
    });
  };
  
  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    toast({
      title: isMicOn ? "Microphone muted" : "Microphone unmuted",
      description: isMicOn ? "Others cannot hear you now." : "Others can hear you now.",
    });
  };
  
  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    toast({
      title: isCameraOn ? "Camera turned off" : "Camera turned on",
      description: isCameraOn ? "Others cannot see you now." : "Others can see you now.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Consultations</h1>
          <p className="text-muted-foreground">Manage your virtual consultations with healthcare providers.</p>
        </div>
        <Button onClick={() => navigate("/appointments/new")} variant="outline" className="flex items-center gap-2">
          <Video className="h-4 w-4" />
          <span>Schedule New Consultation</span>
        </Button>
      </div>
      
      {isInCall ? (
        <Card className="glass overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <div className="aspect-video bg-black">
                <div className="w-full h-full flex items-center justify-center">
                  {isCameraOn ? (
                    <img 
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                      alt="Doctor in consultation"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Avatar className="h-32 w-32 mb-4">
                        <AvatarFallback className="text-4xl">S</AvatarFallback>
                      </Avatar>
                      <h3 className="text-white text-2xl">Dr. Sarah Johnson</h3>
                    </div>
                  )}
                </div>
                
                {/* Self view */}
                <div className="absolute right-4 bottom-4 w-48 h-36 bg-gray-900 rounded-lg border-2 border-gray-800 overflow-hidden shadow-lg">
                  {isCameraOn ? (
                    <img 
                      src="https://images.unsplash.com/photo-1596875565590-b459ce2e6c8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                      alt="Self view"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <CameraOff className="h-8 w-8 text-white/70" />
                    </div>
                  )}
                </div>
                
                {/* Controls */}
                <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent py-6">
                  <div className="flex items-center justify-center gap-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`h-12 w-12 rounded-full border-2 ${isMicOn ? 'bg-white/20 border-white/30' : 'bg-destructive/90 border-destructive'}`}
                      onClick={toggleMic}
                    >
                      {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`h-12 w-12 rounded-full border-2 ${isCameraOn ? 'bg-white/20 border-white/30' : 'bg-destructive/90 border-destructive'}`}
                      onClick={toggleCamera}
                    >
                      {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-14 w-14 rounded-full"
                      onClick={endConsultation}
                    >
                      <PhoneOff className="h-6 w-6" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-12 w-12 rounded-full bg-white/20 border-white/30 border-2"
                    >
                      <Share className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-12 w-12 rounded-full bg-white/20 border-white/30 border-2"
                    >
                      <Users className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Consultation with Dr. Sarah Johnson</h2>
                  <p className="text-muted-foreground">Cardiologist • Today, 2:30 PM</p>
                </div>
                <Badge variant="outline" className="px-3 py-1 text-sm bg-green-500/10 text-green-600 border-green-200">
                  In Progress
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Consultation Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-muted-foreground text-sm">Dr. Johnson is reviewing your latest test results. You can discuss your symptoms during the call.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Recent Vitals</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Blood Pressure:</span>
                        <span>120/80</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Heart Rate:</span>
                        <span>72 bpm</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-muted-foreground text-sm">After the consultation, you'll receive a summary and any prescriptions in your health records.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="upcoming">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {mockConsultations
              .filter(cons => cons.status === 'upcoming')
              .map(consultation => (
                <Card key={consultation.id} className="glass overflow-hidden">
                  <div className="md:flex">
                    <div className="p-6 md:flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{consultation.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{consultation.doctor}</h3>
                            <p className="text-muted-foreground">{consultation.specialty}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="px-3 py-1 text-sm bg-blue-500/10 text-blue-600 border-blue-200">
                          Upcoming
                        </Badge>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Date</div>
                          <div className="font-medium">{consultation.date}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Time</div>
                          <div className="font-medium">{consultation.time}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-secondary/50 p-6 md:w-72 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l">
                      <p className="text-center mb-4 text-sm text-muted-foreground">This consultation is scheduled to start soon.</p>
                      <Button className="w-full mb-2" onClick={startConsultation}>
                        <Video className="mr-2 h-4 w-4" />
                        Join Consultation
                      </Button>
                      <Button variant="outline" className="w-full">Reschedule</Button>
                    </div>
                  </div>
                </Card>
              ))}
            
            {mockConsultations.filter(cons => cons.status === 'upcoming').length === 0 && (
              <Card className="glass p-8 text-center">
                <CardContent className="pt-6 flex flex-col items-center">
                  <Video className="h-12 w-12 text-muted-foreground mb-4" />
                  <CardTitle className="mb-2">No upcoming consultations</CardTitle>
                  <CardDescription className="mb-6">
                    You don't have any upcoming video consultations scheduled.
                  </CardDescription>
                  <Button onClick={() => navigate("/appointments/new")}>
                    Schedule Consultation
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {mockConsultations
              .filter(cons => cons.status === 'completed')
              .map(consultation => (
                <Card key={consultation.id} className="glass overflow-hidden">
                  <div className="md:flex">
                    <div className="p-6 md:flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{consultation.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{consultation.doctor}</h3>
                            <p className="text-muted-foreground">{consultation.specialty}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="px-3 py-1 text-sm bg-green-500/10 text-green-600 border-green-200">
                          Completed
                        </Badge>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Date</div>
                          <div className="font-medium">{consultation.date}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Time</div>
                          <div className="font-medium">{consultation.time}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-secondary/50 p-6 md:w-72 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l">
                      <p className="text-center mb-4 text-sm text-muted-foreground">This consultation has been completed.</p>
                      <Button className="w-full mb-2" variant="outline">
                        View Summary
                      </Button>
                      <Button variant="outline" className="w-full">Book Follow-up</Button>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            {mockConsultations.map(consultation => (
              <Card key={consultation.id} className="glass overflow-hidden">
                <div className="md:flex">
                  <div className="p-6 md:flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{consultation.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{consultation.doctor}</h3>
                          <p className="text-muted-foreground">{consultation.specialty}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`px-3 py-1 text-sm ${
                          consultation.status === 'upcoming' 
                            ? 'bg-blue-500/10 text-blue-600 border-blue-200' 
                            : 'bg-green-500/10 text-green-600 border-green-200'
                        }`}
                      >
                        {consultation.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Date</div>
                        <div className="font-medium">{consultation.date}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Time</div>
                        <div className="font-medium">{consultation.time}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/50 p-6 md:w-72 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l">
                    {consultation.status === 'upcoming' ? (
                      <>
                        <p className="text-center mb-4 text-sm text-muted-foreground">This consultation is scheduled to start soon.</p>
                        <Button className="w-full mb-2" onClick={startConsultation}>
                          <Video className="mr-2 h-4 w-4" />
                          Join Consultation
                        </Button>
                        <Button variant="outline" className="w-full">Reschedule</Button>
                      </>
                    ) : (
                      <>
                        <p className="text-center mb-4 text-sm text-muted-foreground">This consultation has been completed.</p>
                        <Button className="w-full mb-2" variant="outline">
                          View Summary
                        </Button>
                        <Button variant="outline" className="w-full">Book Follow-up</Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ConsultationsPage;
