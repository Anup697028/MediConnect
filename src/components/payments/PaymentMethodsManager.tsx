import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api, PaymentMethod } from "@/services/api";
import { CreditCard, Trash2, Plus, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const PaymentMethodsManager = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [cardType, setCardType] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [holderName, setHolderName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  
  useEffect(() => {
    loadPaymentMethods();
  }, []);
  
  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const methods = await api.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      console.error("Failed to load payment methods:", error);
      toast.error("Failed to load payment methods");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!cardType || !cardNumber || !expiryDate || !holderName) {
        throw new Error("Please fill in all fields");
      }
      
      // Process card number - keep only last 4 digits
      const lastFour = cardNumber.replace(/\s/g, "").slice(-4);
      
      const newPaymentMethod = await api.addPaymentMethod({
        type: "credit_card",
        cardType,
        lastFour,
        expiryDate,
        holder: holderName,
        isDefault
      });
      
      // Update the list
      setPaymentMethods([...paymentMethods, newPaymentMethod]);
      toast.success("Payment method added successfully");
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error("Failed to add payment method:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add payment method");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRemovePaymentMethod = async (id: string) => {
    try {
      await api.removePaymentMethod(id);
      
      // Update the list
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
      toast.success("Payment method removed");
    } catch (error) {
      console.error("Failed to remove payment method:", error);
      toast.error("Failed to remove payment method");
    }
  };
  
  const resetForm = () => {
    setCardType("");
    setCardNumber("");
    setExpiryDate("");
    setHolderName("");
    setIsDefault(false);
    setIsAdding(false);
  };
  
  // Helper function to format card number with spaces
  const formatCardNumber = (input: string) => {
    const numbers = input.replace(/\D/g, "");
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your payment methods for consultations</CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {paymentMethods.length === 0 && !isAdding && (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>You haven't added any payment methods yet.</p>
              </div>
            )}
            
            {paymentMethods.length > 0 && (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {method.cardType} 
                          {method.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary py-0.5 px-2 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          •••• •••• •••• {method.lastFour}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Expires {method.expiryDate}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemovePaymentMethod(method.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {isAdding && (
              <form onSubmit={handleAddPaymentMethod} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="cardType">Card Type</Label>
                  <Select 
                    value={cardType} 
                    onValueChange={setCardType}
                  >
                    <SelectTrigger id="cardType">
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Visa">Visa</SelectItem>
                      <SelectItem value="Mastercard">Mastercard</SelectItem>
                      <SelectItem value="American Express">American Express</SelectItem>
                      <SelectItem value="Discover">Discover</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    placeholder="1234 5678 9012 3456" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input 
                    id="expiryDate" 
                    placeholder="MM/YY" 
                    value={expiryDate}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 4) {
                        if (value.length > 2) {
                          setExpiryDate(`${value.slice(0, 2)}/${value.slice(2)}`);
                        } else {
                          setExpiryDate(value);
                        }
                      }
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="holderName">Cardholder Name</Label>
                  <Input 
                    id="holderName" 
                    placeholder="John Doe" 
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isDefault" 
                    checked={isDefault} 
                    onCheckedChange={setIsDefault} 
                  />
                  <Label htmlFor="isDefault">Make this my default payment method</Label>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Card
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="justify-between">
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Payment Method
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentMethodsManager;
