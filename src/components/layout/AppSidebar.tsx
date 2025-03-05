
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, Home, MessageSquare, FileText, Clock, Video, UserCircle, Settings, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  // Check if current route matches a menu item
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const menuItems = [
    { title: "Dashboard", path: "/dashboard", icon: Home },
    { title: "Appointments", path: "/appointments", icon: Calendar },
    { title: "Consultations", path: "/consultations", icon: Video },
    { title: "Messages", path: "/messages", icon: MessageSquare },
    { title: "Health Records", path: "/records", icon: FileText },
    { title: "Prescriptions", path: "/prescriptions", icon: Clock },
    { title: "Profile", path: "/profile", icon: UserCircle },
    { title: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            MC
          </div>
          <div className="font-semibold text-lg">MediConnect</div>
        </div>
        <SidebarTrigger className="md:hidden absolute right-4 top-4" />
      </SidebarHeader>
      
      <SidebarContent>
        <div className="px-4 py-2">
          <div className="flex items-center gap-3 p-2 glass rounded-lg mb-4">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>{user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user?.email?.split('@')?.[0] || "User"}</span>
              <span className="text-xs text-muted-foreground capitalize">{user?.role || "Patient"}</span>
            </div>
          </div>
          
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  className={isActive(item.path) ? "bg-primary/10 text-primary" : ""}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 justify-start bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
