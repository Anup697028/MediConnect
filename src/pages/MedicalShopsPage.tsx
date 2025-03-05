
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Phone, Clock, Search, Filter, Store } from "lucide-react";

const MedicalShopsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Sample medical shops data
  const medicalShops = [
    {
      id: 1,
      name: "LifeCare Pharmacy",
      address: "123 Health Street, Medical District",
      phone: "+1 (555) 123-4567",
      hours: "9:00 AM - 9:00 PM",
      rating: 4.8,
      distance: "0.5 km",
      open: true,
      services: ["Prescription", "OTC", "Home Delivery"],
      image: "https://placehold.co/400x300/9b87f5/white?text=LifeCare+Pharmacy"
    },
    {
      id: 2,
      name: "Wellness Medications",
      address: "456 Wellbeing Avenue, Health Park",
      phone: "+1 (555) 234-5678",
      hours: "8:00 AM - 10:00 PM",
      rating: 4.5,
      distance: "1.2 km",
      open: true,
      services: ["Prescription", "OTC", "Consultation"],
      image: "https://placehold.co/400x300/9b87f5/white?text=Wellness+Medications"
    },
    {
      id: 3,
      name: "MediPlus Drugstore",
      address: "789 Healing Road, Wellness Center",
      phone: "+1 (555) 345-6789",
      hours: "10:00 AM - 8:00 PM",
      rating: 4.2,
      distance: "2.0 km",
      open: false,
      services: ["Prescription", "OTC", "Vaccines"],
      image: "https://placehold.co/400x300/9b87f5/white?text=MediPlus+Drugstore"
    },
    {
      id: 4,
      name: "QuickMeds Pharmacy",
      address: "321 Recovery Lane, Treatment Plaza",
      phone: "+1 (555) 456-7890",
      hours: "24 Hours",
      rating: 4.7,
      distance: "3.5 km",
      open: true,
      services: ["Prescription", "OTC", "Emergency", "Consultation"],
      image: "https://placehold.co/400x300/9b87f5/white?text=QuickMeds+Pharmacy"
    }
  ];
  
  // Filter shops based on search term and active tab
  const filteredShops = medicalShops
    .filter(shop => 
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(shop => {
      if (activeTab === "all") return true;
      if (activeTab === "open") return shop.open;
      if (activeTab === "nearby") return parseFloat(shop.distance) < 2.0;
      if (activeTab === "rated") return shop.rating >= 4.5;
      return true;
    });
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 fill-[50%]" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Medical Shops</h1>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search for pharmacies, medicines, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">All Shops</TabsTrigger>
          <TabsTrigger value="open">Open Now</TabsTrigger>
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
          <TabsTrigger value="rated">Top Rated</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {filteredShops.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Store className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No medical shops found matching your criteria.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setActiveTab("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredShops.map((shop) => (
            <Card key={shop.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 overflow-hidden">
                <img 
                  src={shop.image} 
                  alt={shop.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{shop.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {shop.address}
                    </CardDescription>
                  </div>
                  <div className="bg-primary/10 px-2 py-1 rounded text-sm font-medium text-primary">
                    {shop.distance}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {renderStars(shop.rating)}
                  </div>
                  <span className="text-sm font-medium">{shop.rating}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {shop.services.map((service, index) => (
                    <span 
                      key={index} 
                      className="text-xs bg-secondary px-2 py-0.5 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                <div className="text-sm flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  {shop.phone}
                </div>
                <div className="text-sm flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {shop.hours}
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    shop.open 
                      ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300" 
                      : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300"
                  }`}>
                    {shop.open ? "Open" : "Closed"}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 w-full">
                  <Button className="flex-1">Order Medicine</Button>
                  <Button variant="outline" className="flex-1">View Details</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalShopsPage;
