"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function ReportPage() {
  
  const [reportContent, setReportContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Add sample data fallback
  const sampleMetrics = {
    environmental: {
      emissions: 10500,
      renewableEnergy: 42,
      financedEmissions: 2.1,
      greenFinancingRatio: 28
    },
    social: {
      gender: 42,
      ethnicity: 28,
      financialInclusion: 18
    },
    governance: {
      boardDiversity: 35,
      dataQuality: 92
    },
    issb: {
      climateVulnerability: 22
    }
  };

  const generateNewReport = async () => {
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ metrics: sampleMetrics }), // Use sample data
      });
      const { report } = await response.json();
      setReportContent(report || "Error generating sample report");
    } catch (err) {
      console.error("Error generating report:", err);
      setReportContent("Error generating sample report");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/save-report", {
        method: "POST",
        body: JSON.stringify({ content: reportContent }),
      });
      if (!response.ok) throw new Error("Save failed");
      alert("Report saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save report");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">ESG Report Preview</h1>
        <div className="space-x-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Report"}
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            Print
          </Button>
          <Button onClick={generateNewReport} className="mb-4">
            Generate New Report
          </Button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {!reportContent && (
          <div className="text-muted-foreground text-center py-8">
            <p>No report generated yet</p>
            <Button onClick={generateNewReport} className="mt-4">
              Generate Sample Report
            </Button>
          </div>
        )}
        {reportContent && <div className="whitespace-pre-wrap">{reportContent}</div>}
      </div>
    </div>
  );
}