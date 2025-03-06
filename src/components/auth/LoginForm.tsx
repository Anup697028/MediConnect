
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, Mail, KeyRound } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    
    try {
      await api.sendOtp(email);
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
      
      toast.success("OTP sent successfully");
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
        await api.sendOtp(email);
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
        
        toast.success("OTP sent successfully");
      } else {
        // Second step: verify OTP and login
        if (!otp) {
          throw new Error("Please enter the OTP");
        }
        
        if (otpExpiry && new Date() > otpExpiry) {
          throw new Error("OTP has expired. Please request a new one");
        }
        
        // Use the API service for login with OTP
        const user = await api.loginWithOtp(email, password, otp);
        
        toast.success(`Welcome back, ${user.name}`);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      uiToast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      setIsLoading(true);
      
      // Check if biometric authentication is available
      if (!api.isBiometricAvailable()) {
        throw new Error("Biometric authentication is not available on this device");
      }
      
      // Authenticate with biometric
      const user = await api.loginWithBiometric();
      
      toast.success(`Welcome back, ${user.name}`);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      uiToast({
        variant: "destructive",
        title: "Biometric login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md glass animate-scale-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
        <CardDescription>
          {!showOtpInput ? "Enter your credentials to access your account" : "Enter the OTP sent to your email"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!showOtpInput ? (
            <>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-sm text-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      toast("Password reset feature is coming soon.");
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
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
            {isLoading ? "Please wait..." : showOtpInput ? "Verify & Sign in" : "Continue"}
          </Button>
        </form>
        
        {api.isBiometricAvailable() && (
          <div className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleBiometricLogin}
              disabled={isLoading}
            >
              Sign in with Biometric
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
          >
            Sign up
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
