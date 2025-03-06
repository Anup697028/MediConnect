import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Calendar, CreditCard, QrCode } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  date: Date;
  type: "consultation" | "medicine" | "test";
  status: "completed" | "pending" | "failed";
  provider: string;
  description: string;
  paymentMethod: "upi" | "card" | "netbanking";
  invoiceNo: string;
}

const PaymentsPage = () => {
  // Mock data - replace with actual API calls
  const payments: Payment[] = [
    {
      id: "1",
      amount: 500,
      date: new Date("2024-03-01"),
      type: "consultation",
      status: "completed",
      provider: "Dr. Rajesh Kumar",
      description: "Online Consultation",
      paymentMethod: "upi",
      invoiceNo: "INV/2024/03/001",
    },
    {
      id: "2",
      amount: 1250,
      date: new Date("2024-02-28"),
      type: "medicine",
      status: "completed",
      provider: "MedPlus Pharmacy, Hyderabad",
      description: "Prescription Medicines",
      paymentMethod: "card",
      invoiceNo: "INV/2024/02/089",
    },
    {
      id: "3",
      amount: 2100,
      date: new Date("2024-02-25"),
      type: "test",
      status: "completed",
      provider: "Thyrocare Diagnostics",
      description: "Blood Test - Complete Health Package",
      paymentMethod: "netbanking",
      invoiceNo: "INV/2024/02/045",
    },
  ];

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "failed":
        return "bg-red-500/10 text-red-500";
    }
  };

  const getPaymentMethodIcon = (method: Payment["paymentMethod"]) => {
    switch (method) {
      case "upi":
        return <QrCode className="h-4 w-4" />;
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "netbanking":
        return <IndianRupee className="h-4 w-4" />;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderPaymentCard = (payment: Payment) => (
    <Card key={payment.id} className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{payment.description}</h3>
              <Badge variant="secondary" className={getStatusColor(payment.status)}>
                {payment.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>{payment.provider}</p>
              <p className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {payment.date.toLocaleDateString("en-IN")}
              </p>
              <p>Invoice No: {payment.invoiceNo}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold flex items-center gap-1 justify-end">
              <IndianRupee className="h-4 w-4" />
              {formatAmount(payment.amount)}
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              {getPaymentMethodIcon(payment.paymentMethod)}
              {payment.paymentMethod === "upi"
                ? "UPI"
                : payment.paymentMethod === "card"
                ? "Card"
                : "Net Banking"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Manage your medical expenses</p>
        </div>
        <Button>
          <IndianRupee className="h-4 w-4 mr-2" />
          Download Statement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(3850)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(1750)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(0)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="consultation">Consultations</TabsTrigger>
          <TabsTrigger value="medicine">Medicines</TabsTrigger>
          <TabsTrigger value="test">Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ScrollArea className="h-[calc(100vh-22rem)]">
            {payments.map(renderPaymentCard)}
          </ScrollArea>
        </TabsContent>

        {["consultation", "medicine", "test"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <ScrollArea className="h-[calc(100vh-22rem)]">
              {payments
                .filter((payment) => payment.type === tab)
                .map(renderPaymentCard)}
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PaymentsPage;
