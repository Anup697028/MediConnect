
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, MapPin, CheckCircle, Truck, Store, ShoppingBag, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Simulated order data
const orders = [
  {
    id: "ORD12345",
    shop: "LifeCare Pharmacy",
    items: [
      { name: "Paracetamol 500mg", quantity: 20, price: 5.99 },
      { name: "Vitamin C 1000mg", quantity: 30, price: 12.99 }
    ],
    totalAmount: 18.98,
    status: "in-transit",
    orderDate: "2023-06-15T10:30:00",
    estimatedDelivery: "2023-06-15T14:30:00",
    currentLocation: {
      address: "En route to your location",
      coordinates: { lat: 37.7833, lng: -122.4167 }
    },
    trackingSteps: [
      { status: "ordered", completed: true, time: "2023-06-15T10:30:00" },
      { status: "processing", completed: true, time: "2023-06-15T11:15:00" },
      { status: "shipped", completed: true, time: "2023-06-15T12:30:00" },
      { status: "in-transit", completed: true, time: "2023-06-15T13:00:00" },
      { status: "delivered", completed: false, time: null }
    ]
  },
  {
    id: "ORD67890",
    shop: "Wellness Medications",
    items: [
      { name: "Cough Syrup 200ml", quantity: 1, price: 8.50 },
      { name: "Allergy Pills", quantity: 10, price: 15.99 }
    ],
    totalAmount: 24.49,
    status: "delivered",
    orderDate: "2023-06-10T09:15:00",
    estimatedDelivery: "2023-06-10T13:30:00",
    deliveredAt: "2023-06-10T12:45:00",
    trackingSteps: [
      { status: "ordered", completed: true, time: "2023-06-10T09:15:00" },
      { status: "processing", completed: true, time: "2023-06-10T09:45:00" },
      { status: "shipped", completed: true, time: "2023-06-10T10:30:00" },
      { status: "in-transit", completed: true, time: "2023-06-10T11:15:00" },
      { status: "delivered", completed: true, time: "2023-06-10T12:45:00" }
    ]
  },
  {
    id: "ORD54321",
    shop: "MediPlus Drugstore",
    items: [
      { name: "Blood Pressure Monitor", quantity: 1, price: 45.99 },
      { name: "Digital Thermometer", quantity: 1, price: 12.50 }
    ],
    totalAmount: 58.49,
    status: "processing",
    orderDate: "2023-06-14T16:20:00",
    estimatedDelivery: "2023-06-16T12:00:00",
    trackingSteps: [
      { status: "ordered", completed: true, time: "2023-06-14T16:20:00" },
      { status: "processing", completed: true, time: "2023-06-15T09:30:00" },
      { status: "shipped", completed: false, time: null },
      { status: "in-transit", completed: false, time: null },
      { status: "delivered", completed: false, time: null }
    ]
  }
];

const OrderTrackingPage = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  useEffect(() => {
    // Select the first active order by default for tracking view
    const activeOrders = orders.filter(
      order => order.status !== "delivered" && order.status !== "cancelled"
    );
    
    if (activeOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(activeOrders[0]);
    }
  }, [selectedOrder]);
  
  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === "active") {
      return order.status !== "delivered" && order.status !== "cancelled";
    }
    if (activeTab === "completed") {
      return order.status === "delivered";
    }
    return true; // all orders
  });
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ordered":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-800/20 dark:text-blue-300 dark:hover:bg-blue-800/30">Ordered</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-800/20 dark:text-yellow-300 dark:hover:bg-yellow-800/30">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-800/20 dark:text-purple-300 dark:hover:bg-purple-800/30">Shipped</Badge>;
      case "in-transit":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-800/20 dark:text-orange-300 dark:hover:bg-orange-800/30">In Transit</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-800/20 dark:text-green-300 dark:hover:bg-green-800/30">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-800/20 dark:text-red-300 dark:hover:bg-red-800/30">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ordered":
        return <ShoppingBag className="h-5 w-5" />;
      case "processing":
        return <Store className="h-5 w-5" />;
      case "shipped":
        return <Package className="h-5 w-5" />;
      case "in-transit":
        return <Truck className="h-5 w-5" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };
  
  const getProgressPercentage = (order: any) => {
    const totalSteps = order.trackingSteps.length;
    const completedSteps = order.trackingSteps.filter((step: any) => step.completed).length;
    return (completedSteps / totalSteps) * 100;
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Tracking</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Tabs 
            defaultValue="active" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList className="w-full">
              <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="space-y-4 h-[400px] overflow-y-auto pr-2">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No orders found in this category.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <Card 
                  key={order.id}
                  className={`hover:shadow-md transition-shadow cursor-pointer ${
                    selectedOrder?.id === order.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{order.id}</CardTitle>
                      {getStatusBadge(order.status)}
                    </div>
                    <CardDescription>{order.shop}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 pb-2">
                    <div className="text-sm">
                      <p>{order.items.length} items</p>
                      <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="mt-2">
                      <Progress value={getProgressPercentage(order)} className="h-1" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                    Ordered: {formatDate(order.orderDate)}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
        
        <div className="md:col-span-2">
          {selectedOrder ? (
            <Card className="h-[500px] overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Tracking Order {selectedOrder.id}</CardTitle>
                    <CardDescription>{selectedOrder.shop}</CardDescription>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Delivery Progress</h3>
                    <span className="text-sm text-muted-foreground">
                      Estimated: {formatDate(selectedOrder.estimatedDelivery)}
                    </span>
                  </div>
                  <Progress value={getProgressPercentage(selectedOrder)} className="h-2" />
                </div>
                
                <div className="relative pl-8 space-y-6">
                  {/* Timeline track */}
                  <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
                  
                  {selectedOrder.trackingSteps.map((step: any, index: number) => (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-5 top-0 size-4 rounded-full border-2 ${
                        step.completed 
                          ? 'bg-primary border-primary' 
                          : 'bg-background border-gray-300 dark:border-gray-700'
                      }`}></div>
                      
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${
                          step.completed ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                        }`}>
                          {getStatusIcon(step.status)}
                        </div>
                        <div>
                          <h4 className={`font-medium capitalize ${
                            !step.completed ? 'text-muted-foreground' : ''
                          }`}>
                            {step.status.replace('-', ' ')}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {step.completed 
                              ? formatDate(step.time) 
                              : step.status === selectedOrder.status 
                                ? "In progress..." 
                                : "Pending"}
                          </p>
                          
                          {step.status === "in-transit" && step.completed && selectedOrder.currentLocation && (
                            <div className="mt-2 bg-secondary/50 p-2 rounded-md flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-sm">{selectedOrder.currentLocation.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t bg-secondary/30">
                <div className="w-full">
                  <h3 className="font-medium mb-2">Order Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Items</h4>
                      <ul className="text-sm text-muted-foreground">
                        {selectedOrder.items.map((item: any, index: number) => (
                          <li key={index}>
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Order Information</h4>
                      <p className="text-sm text-muted-foreground">
                        Total: ${selectedOrder.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Ordered: {formatDate(selectedOrder.orderDate)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      Contact Driver
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-[500px] flex items-center justify-center">
              <CardContent className="text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select an order to view its tracking details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
