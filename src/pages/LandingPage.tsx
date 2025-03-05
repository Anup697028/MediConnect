
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Calendar, FileText, Clock, MessageSquare, Shield, MapPin } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Video className="h-6 w-6 text-primary" />,
      title: "Virtual Consultations",
      description: "Connect with healthcare providers through high-quality video calls from anywhere."
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Easy Scheduling",
      description: "Book appointments with real-time availability and get instant confirmations."
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Health Records",
      description: "Access and manage your medical history securely in one place."
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Prescription Management",
      description: "Get electronic prescriptions and request refills directly through the app."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Secure Messaging",
      description: "Communicate with your healthcare team through encrypted messaging."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "HIPAA Compliant",
      description: "Your data is protected with industry-standard security measures."
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Geolocation Services",
      description: "Locate nearby pharmacies and hospitals with ease."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b bg-background/80 backdrop-blur-md fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              MC
            </div>
            <span className="font-semibold text-xl">MediConnect</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
            <a href="#about" className="text-sm hover:text-primary transition-colors">How it works</a>
            <a href="#testimonials" className="text-sm hover:text-primary transition-colors">Testimonials</a>
            <a href="#faq" className="text-sm hover:text-primary transition-colors">FAQ</a>
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign in
            </Button>
            <Button onClick={() => navigate("/register")}>Get Started</Button>
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => navigate("/login")}>
              <span className="sr-only">Menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 mt-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Healthcare at your fingertips
            </h1>
            <p className="text-xl text-muted-foreground mb-8 md:pr-10">
              Connect with healthcare providers, manage appointments, and access your medical records - all in one secure platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base" onClick={() => navigate("/register")}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-base" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 animate-float">
            <div className="glass rounded-2xl p-4 md:ml-10">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Telemedicine consultation"
                className="rounded-lg object-cover w-full h-[300px] md:h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Healthcare Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform offers everything you need for a complete telehealth experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass hover:translate-y-[-5px] transition-transform duration-300">
                <CardContent className="p-6 flex flex-col items-start">
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your healthcare experience?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-primary-foreground/90">
            Join thousands of patients and healthcare providers already using MediConnect.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate("/register")}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  MC
                </div>
                <span className="font-semibold text-xl">MediConnect</span>
              </div>
              <p className="text-muted-foreground max-w-xs">
                Transforming healthcare with accessible telehealth solutions for everyone.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Features</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Security</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">For Patients</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">For Providers</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">About Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Careers</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">HIPAA Compliance</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} MediConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
