
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { User, Patient, Doctor, api } from "@/services/api";
import { Loader2, Save } from "lucide-react";
import PaymentMethodsManager from "@/components/payments/PaymentMethodsManager";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Patient specific fields
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [insuranceId, setInsuranceId] = useState("");
  
  // Doctor specific fields
  const [specialty, setSpecialty] = useState("");
  const [license, setLicense] = useState("");
  const [bio, setBio] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  
  useEffect(() => {
    const loadUserProfile = () => {
      setIsLoading(true);
      const currentUser = api.getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.name);
        setEmail(currentUser.email);
        
        if (currentUser.role === 'patient') {
          const patient = currentUser as Patient;
          setDateOfBirth(patient.dateOfBirth || "");
          setAllergies(patient.allergies?.join(", ") || "");
          setMedications(patient.medications?.join(", ") || "");
          setInsuranceProvider(patient.insuranceProvider || "");
          setInsuranceId(patient.insuranceId || "");
          
          if (patient.emergencyContact) {
            setEmergencyContactName(patient.emergencyContact.name);
            setEmergencyContactRelationship(patient.emergencyContact.relationship);
            setEmergencyContactPhone(patient.emergencyContact.phone);
          }
        } else if (currentUser.role === 'doctor') {
          const doctor = currentUser as Doctor;
          setSpecialty(doctor.specialty || "");
          setLicense(doctor.license || "");
          setBio(doctor.bio || "");
          setEducation(doctor.education?.join("\n") || "");
          setExperience(String(doctor.experience || ""));
          setConsultationFee(String(doctor.consultationFee || ""));
        }
      }
      
      setIsLoading(false);
    };
    
    loadUserProfile();
  }, []);
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (!user) return;
      
      if (user.role === 'patient') {
        const updatedPatient: Partial<Patient> = {
          name,
          dateOfBirth,
          allergies: allergies ? allergies.split(",").map(a => a.trim()) : [],
          medications: medications ? medications.split(",").map(m => m.trim()) : [],
          insuranceProvider,
          insuranceId,
          emergencyContact: {
            name: emergencyContactName,
            relationship: emergencyContactRelationship,
            phone: emergencyContactPhone
          }
        };
        
        await api.updateProfile(updatedPatient);
      } else if (user.role === 'doctor') {
        const updatedDoctor: Partial<Doctor> = {
          name,
          specialty,
          license,
          bio,
          education: education ? education.split("\n").map(e => e.trim()).filter(e => e) : [],
          experience: parseInt(experience) || 0,
          consultationFee: parseFloat(consultationFee) || 0
        };
        
        await api.updateProfile(updatedDoctor);
      }
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information
        </p>
      </div>
      
      <Separator />
      
      <form onSubmit={handleSaveProfile}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and profile information
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  value={email}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  To change your email, please contact support
                </p>
              </div>
            </div>
            
            {user?.role === 'patient' && (
              <>
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input 
                    id="dateOfBirth" 
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea 
                    id="allergies" 
                    placeholder="Enter allergies separated by commas"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea 
                    id="medications" 
                    placeholder="Enter medications separated by commas"
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName">Name</Label>
                      <Input 
                        id="emergencyContactName" 
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                      <Input 
                        id="emergencyContactRelationship" 
                        value={emergencyContactRelationship}
                        onChange={(e) => setEmergencyContactRelationship(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone">Phone</Label>
                      <Input 
                        id="emergencyContactPhone" 
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Insurance Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                      <Input 
                        id="insuranceProvider" 
                        value={insuranceProvider}
                        onChange={(e) => setInsuranceProvider(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="insuranceId">Policy/Member ID</Label>
                      <Input 
                        id="insuranceId" 
                        value={insuranceId}
                        onChange={(e) => setInsuranceId(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {user?.role === 'doctor' && (
              <>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Select 
                      value={specialty} 
                      onValueChange={setSpecialty}
                    >
                      <SelectTrigger id="specialty">
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Dermatology">Dermatology</SelectItem>
                        <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                        <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                        <SelectItem value="Neurology">Neurology</SelectItem>
                        <SelectItem value="Obstetrics">Obstetrics</SelectItem>
                        <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                        <SelectItem value="Urology">Urology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="license">License Number</Label>
                    <Input 
                      id="license" 
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input 
                      id="experience" 
                      type="number"
                      min="0"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
                    <Input 
                      id="consultationFee" 
                      type="number"
                      min="0"
                      step="0.01"
                      value={consultationFee}
                      onChange={(e) => setConsultationFee(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Write a brief description about your professional background"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="min-h-32"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="education">Education & Qualifications</Label>
                  <Textarea 
                    id="education" 
                    placeholder="Enter each qualification on a new line"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="min-h-32"
                  />
                  <p className="text-xs text-muted-foreground">
                    List each qualification on a new line (e.g., MD Harvard Medical School)
                  </p>
                </div>
              </>
            )}
          </CardContent>
          
          <div className="p-6 pt-0">
            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </Card>
      </form>
      
      {user?.role === 'patient' && (
        <div className="mt-6">
          <PaymentMethodsManager />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
