import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FileText, Download, Calendar, Pill, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Prescription {
  id: string;
  doctor: {
    name: string;
    imcId: string;
    specialization: string;
  };
  date: Date;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  diagnosis: string;
  notes?: string;
  status: "active" | "completed" | "expired";
}

const PrescriptionsPage = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Mock data - replace with actual API calls
  const prescriptions: Prescription[] = [
    {
      id: "1",
      doctor: {
        name: "Dr. Rajesh Kumar",
        imcId: "KMC/AP/123456",
        specialization: "General Physician",
      },
      date: new Date("2024-03-01"),
      medications: [
        {
          name: "Azithromycin",
          dosage: "500mg",
          frequency: "Once daily",
          duration: "5 days",
        },
        {
          name: "Dolo",
          dosage: "650mg",
          frequency: "As needed",
          duration: "5 days",
        },
      ],
      diagnosis: "Upper Respiratory Tract Infection",
      notes: "Take medicine after food. Avoid cold beverages.",
      status: "active",
    },
    {
      id: "2",
      doctor: {
        name: "Dr. Priya Sharma",
        imcId: "DMC/DL/789012",
        specialization: "Cardiologist",
      },
      date: new Date("2024-02-15"),
      medications: [
        {
          name: "Telma",
          dosage: "40mg",
          frequency: "Once daily",
          duration: "30 days",
        },
      ],
      diagnosis: "Hypertension",
      notes: "Monitor BP daily. Reduce salt intake.",
      status: "active",
    },
  ];

  const getStatusColor = (status: Prescription["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500";
      case "completed":
        return "bg-gray-500/10 text-gray-500";
      case "expired":
        return "bg-red-500/10 text-red-500";
    }
  };

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.medications.some((med) =>
        med.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Prescriptions</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prescriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">
                        {prescription.diagnosis}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(prescription.status)}
                      >
                        {prescription.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {prescription.doctor.name} • {prescription.doctor.specialization}
                      </p>
                      <p>IMC ID: {prescription.doctor.imcId}</p>
                      <p className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {prescription.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      Medications
                    </h4>
                    <div className="grid gap-3">
                      {prescription.medications.map((med, index) => (
                        <div
                          key={index}
                          className="bg-accent/50 p-3 rounded-lg space-y-1"
                        >
                          <p className="font-medium">{med.name}</p>
                          <div className="text-sm text-muted-foreground">
                            <p>Dosage: {med.dosage}</p>
                            <p className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {med.frequency} • Duration: {med.duration}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {prescription.notes && (
                    <div>
                      <h4 className="font-semibold mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground">
                        {prescription.notes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PrescriptionsPage;
