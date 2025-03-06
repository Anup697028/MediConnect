import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Download, Calendar } from "lucide-react";

interface MedicalRecord {
  id: string;
  title: string;
  type: string;
  date: Date;
  doctor: string;
  hospital: string;
  description: string;
  fileUrl?: string;
}

const RecordsPage = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Mock data - replace with actual API calls
  const records: MedicalRecord[] = [
    {
      id: "1",
      title: "Annual Health Checkup",
      type: "checkup",
      date: new Date("2024-02-15"),
      doctor: "Dr. Rajesh Kumar",
      hospital: "AIIMS Delhi",
      description: "Complete health checkup with blood work, ECG, and physical examination. Reports available in Hindi and English.",
      fileUrl: "#",
    },
    {
      id: "2",
      title: "Chest X-Ray Report",
      type: "radiology",
      date: new Date("2024-01-20"),
      doctor: "Dr. Priya Sharma",
      hospital: "Max Super Speciality Hospital, Mumbai",
      description: "Chest X-ray examination for respiratory assessment. Digital copy available.",
      fileUrl: "#",
    },
    {
      id: "3",
      title: "Blood Test Report",
      type: "lab",
      date: new Date("2024-03-01"),
      doctor: "Dr. Amit Patel",
      hospital: "Thyrocare Diagnostics, Bangalore",
      description: "Complete blood count, diabetes screening, and thyroid function test results.",
      fileUrl: "#",
    },
  ];

  const filteredRecords = records.filter(record =>
    record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRecord = (record: MedicalRecord) => (
    <Card key={record.id} className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">{record.title}</h3>
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              <p>{record.doctor} • {record.hospital}</p>
              <p className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {record.date.toLocaleDateString()}
              </p>
            </div>
            <p className="text-sm">{record.description}</p>
          </div>
          {record.fileUrl && (
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Medical Records</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="checkups">Checkups</TabsTrigger>
          <TabsTrigger value="lab">Lab Reports</TabsTrigger>
          <TabsTrigger value="radiology">Radiology</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            {filteredRecords.map(renderRecord)}
          </ScrollArea>
        </TabsContent>

        {["checkups", "lab", "radiology", "prescriptions"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {filteredRecords
                .filter((record) => record.type === tab)
                .map(renderRecord)}
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default RecordsPage;
