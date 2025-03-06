
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
import AppointmentsPage from "./pages/AppointmentsPage";
import NewAppointmentPage from "./pages/NewAppointmentPage";
import MedicalShopsPage from "./pages/MedicalShopsPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import SettingsPage from "./pages/SettingsPage";
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
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/appointments/new" element={<NewAppointmentPage />} />
            <Route path="/messages" element={<Dashboard />} />
            <Route path="/records" element={<Dashboard />} />
            <Route path="/prescriptions" element={<Dashboard />} />
            <Route path="/medical-shops" element={<MedicalShopsPage />} />
            <Route path="/order-tracking" element={<OrderTrackingPage />} />
            <Route path="/payments" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
