
import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/80 backdrop-blur-md fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              MC
            </div>
            <span className="font-semibold text-xl">MediConnect</span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 mt-16">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in securely with OTP verification
            </p>
          </div>
          <LoginForm />
        </div>
      </main>

      <footer className="py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MediConnect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
