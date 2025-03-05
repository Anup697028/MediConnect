
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthCheck from "./components/auth/AuthCheck";
import AppLayout from "./components/layout/AppLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ConsultationsPage from "./pages/ConsultationsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route element={<AuthCheck><AppLayout /></AuthCheck>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/consultations" element={<ConsultationsPage />} />
            <Route path="/appointments" element={<Dashboard />} />
            <Route path="/appointments/new" element={<Dashboard />} />
            <Route path="/messages" element={<Dashboard />} />
            <Route path="/records" element={<Dashboard />} />
            <Route path="/prescriptions" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} /> {/* Updated route */}
            <Route path="/settings" element={<Dashboard />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
