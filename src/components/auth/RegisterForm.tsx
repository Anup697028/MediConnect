
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, Mail, User, KeyRound, Phone } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyMethod, setVerifyMethod] = useState<"email" | "phone">("email");
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    
    try {
      await api.sendOtp(verifyMethod === "email" ? email : phone, verifyMethod);
      
      // Set cooldown for 60 seconds
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Set OTP expiry for 10 minutes from now
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 10);
      setOtpExpiry(expiryTime);
      
      toast.success(`OTP sent to your ${verifyMethod}`);
    } catch (error) {
      console.error(error);
      uiToast({
        variant: "destructive",
        title: "Failed to send OTP",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!showOtpInput) {
        // First step: request OTP
        await api.sendOtp(verifyMethod === "email" ? email : phone, verifyMethod);
        setShowOtpInput(true);
        
        // Set OTP expiry for 10 minutes from now
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 10);
        setOtpExpiry(expiryTime);
        
        // Start cooldown
        setCooldown(60);
        const interval = setInterval(() => {
          setCooldown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        toast.success(`OTP sent to your ${verifyMethod}`);
      } else {
        // Second step: verify OTP and register
        if (!otp) {
          throw new Error("Please enter the OTP");
        }
        
        if (otpExpiry && new Date() > otpExpiry) {
          throw new Error("OTP has expired. Please request a new one");
        }
        
        // Use the API service for registration with OTP
        await api.registerWithOtp(
          email, 
          password, 
          name, 
          userType as 'patient' | 'doctor', 
          otp,
          phone,
          verifyMethod
        );
        
        toast.success("Account created successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      uiToast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVerifyMethod = () => {
    setVerifyMethod(prev => prev === "email" ? "phone" : "email");
  };

  return (
    <Card className="w-full max-w-md glass animate-scale-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">Create an account</CardTitle>
        <CardDescription>
          {!showOtpInput ? "Enter your information to create your account" : `Enter the OTP sent to your ${verifyMethod}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!showOtpInput ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    placeholder="m@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="phone"
                    placeholder="+1234567890"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Account Type</Label>
                <RadioGroup value={userType} onValueChange={setUserType} className="flex space-x-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="patient" id="patient" />
                    <Label htmlFor="patient" className="cursor-pointer">Patient</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="doctor" id="doctor" />
                    <Label htmlFor="doctor" className="cursor-pointer">Healthcare Provider</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Verification Method</Label>
                <RadioGroup value={verifyMethod} onValueChange={setVerifyMethod as any} className="flex space-x-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email-verify" />
                    <Label htmlFor="email-verify" className="cursor-pointer">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="phone-verify" />
                    <Label htmlFor="phone-verify" className="cursor-pointer">Phone SMS</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {otpExpiry && (
                  <p>OTP expires at {otpExpiry.toLocaleTimeString()}</p>
                )}
                <p>
                  Verifying via: {verifyMethod === "email" ? email : phone}
                  <Button 
                    type="button" 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto" 
                    onClick={toggleVerifyMethod}
                    disabled={isLoading || showOtpInput}
                  >
                    Change
                  </Button>
                </p>
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={cooldown > 0}
                    onClick={handleResendOtp}
                  >
                    {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Please wait..." : showOtpInput ? "Verify & Create account" : "Continue"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-center text-muted-foreground w-full">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Sign in
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
