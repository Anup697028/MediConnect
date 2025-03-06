
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Search, 
  ChevronRight,
  Building, 
  Stethoscope
} from "lucide-react";
import { api, Doctor } from "@/services/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const NewAppointmentPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Available specialties
  const specialties = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "General Medicine",
    "Neurology",
    "Obstetrics & Gynecology",
    "Ophthalmology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Urology"
  ];

  useEffect(() => {
    if (specialty) {
      loadDoctors();
    }
  }, [specialty]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      generateAvailableTimes();
    }
  }, [selectedDoctor, selectedDate]);

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      const doctorsList = await api.getDoctors(specialty);
      setDoctors(doctorsList);
    } catch (error) {
      console.error("Failed to load doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setIsLoading(false);
    }
  };

  const generateAvailableTimes = () => {
    if (!selectedDoctor || !selectedDate) return;

    setIsLoading(true);
    
    // Get the day of the week
    const dayOfWeek = format(selectedDate, 'EEEE');
    
    // Check if the doctor has availability for this day
    const doctorAvailability = selectedDoctor.availability?.[dayOfWeek] || [];
    
    // Generate time slots based on doctor's availability
    const times: string[] = [];
    
    doctorAvailability.forEach(slot => {
      const startHour = parseInt(slot.start.split(':')[0]);
      const startMinute = parseInt(slot.start.split(':')[1]);
      const endHour = parseInt(slot.end.split(':')[0]);
      const endMinute = parseInt(slot.end.split(':')[1]);
      
      // Generate 30-minute slots
      for (let h = startHour; h <= endHour; h++) {
        for (let m = 0; m < 60; m += 30) {
          // Skip times before start time or after end time
          if (h === startHour && m < startMinute) continue;
          if (h === endHour && m > endMinute) continue;
          
          const formattedHour = h.toString().padStart(2, '0');
          const formattedMinute = m.toString().padStart(2, '0');
          times.push(`${formattedHour}:${formattedMinute}`);
        }
      }
    });
    
    setAvailableTimes(times);
    setIsLoading(false);
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error("Please select a doctor, date, and time");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Format the date string
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      await api.bookAppointment({
        doctorId: selectedDoctor.id,
        date: formattedDate,
        time: selectedTime,
        symptoms
      });
      
      toast.success("Appointment booked successfully");
      navigate("/appointments");
    } catch (error) {
      console.error("Failed to book appointment:", error);
      toast.error("Failed to book appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Choose a Specialty</CardTitle>
              <CardDescription>
                Select a medical specialty for your consultation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {specialties.map((spec) => (
                  <Button
                    key={spec}
                    variant={specialty === spec ? "default" : "outline"}
                    className="justify-start h-auto py-3 px-4"
                    onClick={() => setSpecialty(spec)}
                  >
                    <Stethoscope className="mr-2 h-4 w-4" />
                    {spec}
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/appointments")}>
                Cancel
              </Button>
              <Button 
                onClick={() => setStep(2)} 
                disabled={!specialty}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Choose a Doctor</CardTitle>
              <CardDescription>
                Select a doctor for your {specialty} consultation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/30"></div>
                    <div className="h-4 w-32 rounded bg-primary/30"></div>
                  </div>
                </div>
              ) : doctors.length > 0 ? (
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`border p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedDoctor?.id === doctor.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{doctor.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {doctor.specialty}
                            {doctor.experience && ` • ${doctor.experience} years experience`}
                          </p>
                          {doctor.bio && (
                            <p className="text-sm mt-2">{doctor.bio}</p>
                          )}
                          <div className="flex items-center mt-2">
                            <div className="text-sm bg-primary/10 text-primary py-0.5 px-2 rounded-full">
                              ${doctor.consultationFee}/consultation
                            </div>
                            {doctor.rating && (
                              <div className="ml-2 flex items-center text-amber-500 text-sm">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 h-4 mr-1"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {doctor.rating.toFixed(1)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No doctors found for {specialty}. Please try another specialty.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={!selectedDoctor}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Choose a Date & Time</CardTitle>
              <CardDescription>
                Select your preferred date and time for the appointment with {selectedDoctor?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3 flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" /> Select Date
                  </h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        disabled={(date) => {
                          // Disable dates in the past
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          
                          // Disable weekends if the doctor doesn't work on them
                          const dayName = format(date, 'EEEE');
                          const doctorWorks = selectedDoctor?.availability?.[dayName];
                          
                          return date < today || !doctorWorks;
                        }}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3 flex items-center">
                    <Clock className="mr-2 h-4 w-4" /> Select Time
                  </h3>
                  {selectedDate ? (
                    isLoading ? (
                      <div className="flex justify-center p-4">
                        <div className="animate-pulse h-10 w-full rounded bg-primary/30"></div>
                      </div>
                    ) : availableTimes.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            className="text-sm"
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No available times for this date
                      </div>
                    )
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Please select a date first
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Describe Your Symptoms (Optional)</h3>
                <Textarea
                  placeholder="Please describe any symptoms or concerns you would like to discuss..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button 
                onClick={handleBookAppointment} 
                disabled={!selectedDate || !selectedTime || isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                  </>
                ) : (
                  "Book Appointment"
                )}
              </Button>
            </CardFooter>
          </Card>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/appointments")}
          className="mb-2"
        >
          ← Back to Appointments
        </Button>
        <h1 className="text-3xl font-bold">Book an Appointment</h1>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
              step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              1
            </div>
            <span className="text-xs">Specialty</span>
          </div>
          <div className={`h-1 flex-1 mx-2 ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
              step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              2
            </div>
            <span className="text-xs">Doctor</span>
          </div>
          <div className={`h-1 flex-1 mx-2 ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
              step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              3
            </div>
            <span className="text-xs">Schedule</span>
          </div>
        </div>
      </div>
      
      {renderStep()}
    </div>
  );
};

export default NewAppointmentPage;
