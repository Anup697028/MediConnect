import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Bell, Globe, Lock, Shield, CreditCard, Mail, Phone, AlertTriangle } from "lucide-react";
import PaymentMethodsManager from "@/components/payments/PaymentMethodsManager";

const SettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    appointments: true,
    reminders: true,
    updates: false,
    marketing: false
  });
  
  const [appNotifications, setAppNotifications] = useState({
    appointments: true,
    messages: true,
    reminders: true,
    updates: true
  });
  
  const [language, setLanguage] = useState("english");
  
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your basic account preferences and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Language & Region</h3>
                
                <div className="grid gap-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select defaultValue="auto">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Detect Automatically</SelectItem>
                      <SelectItem value="gmt-8">Pacific Time (GMT-8)</SelectItem>
                      <SelectItem value="gmt-5">Eastern Time (GMT-5)</SelectItem>
                      <SelectItem value="gmt+0">Greenwich Mean Time (GMT+0)</SelectItem>
                      <SelectItem value="gmt+1">Central European Time (GMT+1)</SelectItem>
                      <SelectItem value="gmt+5.5">Indian Standard Time (GMT+5:30)</SelectItem>
                      <SelectItem value="gmt+8">China Standard Time (GMT+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        placeholder="your.email@example.com"
                        type="email"
                        className="pl-10"
                        defaultValue="john.doe@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        type="tel"
                        className="pl-10"
                        defaultValue="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-muted-foreground text-sm">
                    Switch between light and dark theme
                  </p>
                </div>
                <ThemeToggle />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Theme Color</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Choose your preferred accent color
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {["#9b87f5", "#38bdf8", "#f87171", "#4ade80", "#fb923c", "#f471b5"].map(
                    (color) => (
                      <button
                        key={color}
                        className="size-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        style={{ backgroundColor: color }}
                        aria-label={`Color ${color}`}
                      />
                    )
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Text Size</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Adjust the size of text throughout the application
                </p>
                
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    A-
                  </Button>
                  <div className="flex-1">
                    <div className="h-2 bg-secondary rounded-full">
                      <div className="h-2 w-1/2 bg-primary rounded-full"></div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    A+
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Notifications
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-appointments" className="flex-1">
                      Appointment Reminders
                      <p className="text-sm font-normal text-muted-foreground">
                        Get email reminders about upcoming appointments
                      </p>
                    </Label>
                    <Switch
                      id="email-appointments"
                      checked={emailNotifications.appointments}
                      onCheckedChange={(checked) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          appointments: checked
                        })
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-reminders" className="flex-1">
                      Medication Reminders
                      <p className="text-sm font-normal text-muted-foreground">
                        Get reminded when it's time to take your medication
                      </p>
                    </Label>
                    <Switch
                      id="email-reminders"
                      checked={emailNotifications.reminders}
                      onCheckedChange={(checked) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          reminders: checked
                        })
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-updates" className="flex-1">
                      Account Updates
                      <p className="text-sm font-normal text-muted-foreground">
                        Get notified about important changes to your account
                      </p>
                    </Label>
                    <Switch
                      id="email-updates"
                      checked={emailNotifications.updates}
                      onCheckedChange={(checked) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          updates: checked
                        })
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-marketing" className="flex-1">
                      Marketing & Promotions
                      <p className="text-sm font-normal text-muted-foreground">
                        Receive updates about new features and special offers
                      </p>
                    </Label>
                    <Switch
                      id="email-marketing"
                      checked={emailNotifications.marketing}
                      onCheckedChange={(checked) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          marketing: checked
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  In-App Notifications
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-appointments" className="flex-1">
                      Appointment Updates
                    </Label>
                    <Switch
                      id="app-appointments"
                      checked={appNotifications.appointments}
                      onCheckedChange={(checked) =>
                        setAppNotifications({
                          ...appNotifications,
                          appointments: checked
                        })
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-messages" className="flex-1">
                      New Messages
                    </Label>
                    <Switch
                      id="app-messages"
                      checked={appNotifications.messages}
                      onCheckedChange={(checked) =>
                        setAppNotifications({
                          ...appNotifications,
                          messages: checked
                        })
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-reminders" className="flex-1">
                      Medication Reminders
                    </Label>
                    <Switch
                      id="app-reminders"
                      checked={appNotifications.reminders}
                      onCheckedChange={(checked) =>
                        setAppNotifications({
                          ...appNotifications,
                          reminders: checked
                        })
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-updates" className="flex-1">
                      System Updates
                    </Label>
                    <Switch
                      id="app-updates"
                      checked={appNotifications.updates}
                      onCheckedChange={(checked) =>
                        setAppNotifications({
                          ...appNotifications,
                          updates: checked
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentMethodsManager />
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Account Security
                </h3>
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <Button className="mt-2">Change Password</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Two-Factor Authentication
                </h3>
                
                <div className="bg-muted/50 p-4 rounded-md flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Enhance Your Account Security</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password.
                    </p>
                    <Button variant="outline" className="mt-3">
                      Enable Two-Factor Authentication
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Session Management</h3>
                
                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">
                        Chrome on Windows • 192.168.1.1
                      </p>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300">
                      Active Now
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Sign Out of All Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
