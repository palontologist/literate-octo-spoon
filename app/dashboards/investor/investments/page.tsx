"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, Edit, Trash2, DollarSign, ArrowUp, Building, Save,
} from "lucide-react";

// Sample SDGs for selection
const sdgOptions = [
  { id: 1, name: "No Poverty" },
  { id: 2, name: "Zero Hunger" },
  { id: 3, name: "Good Health & Well-being" },
  { id: 4, name: "Quality Education" },
  { id: 7, name: "Affordable and Clean Energy" },
  { id: 13, name: "Climate Action" }
];

// Impact topics
const impactTopicsOptions = [
  { id: "education", name: "Education" },
  { id: "healthcare", name: "Healthcare" },
  { id: "climate", name: "Climate Change" },
  { id: "housing", name: "Affordable Housing" },
  { id: "financial", name: "Financial Inclusion" }
];

// Impact metrics by sector
const sectorMetrics = {
  "Education": [
    { id: "students_reached", name: "Students Reached", unit: "people", sdgs: [4] },
    { id: "graduation_rate", name: "Graduation Rate Improvement", unit: "%", sdgs: [4] },
    { id: "teacher_training", name: "Teachers Trained", unit: "people", sdgs: [4] },
    { id: "scholarships", name: "Scholarships Provided", unit: "count", sdgs: [4, 1] },
    { id: "digital_access", name: "Digital Access Provided", unit: "people", sdgs: [4, 9] }
  ],
  "Healthcare": [
    { id: "patients_treated", name: "Patients Treated", unit: "people", sdgs: [3] },
    { id: "disease_reduction", name: "Disease Prevalence Reduction", unit: "%", sdgs: [3] },
    { id: "healthcare_facilities", name: "Healthcare Facilities Built/Improved", unit: "count", sdgs: [3, 9] },
    { id: "medical_professionals", name: "Medical Professionals Trained", unit: "people", sdgs: [3, 4] }
  ],
  "Clean Energy": [
    { id: "renewable_capacity", name: "Renewable Energy Capacity Added", unit: "MW", sdgs: [7, 13] },
    { id: "emissions_avoided", name: "CO2 Emissions Avoided", unit: "tons", sdgs: [7, 13] },
    { id: "energy_access", name: "People Gaining Energy Access", unit: "people", sdgs: [7, 1] }
  ],
  "Water Management": [
    { id: "clean_water_access", name: "People Gaining Clean Water Access", unit: "people", sdgs: [6] },
    { id: "water_saved", name: "Water Saved/Purified", unit: "cubic meters", sdgs: [6, 12] }
  ],
  "Sustainable Agriculture": [
    { id: "farmers_supported", name: "Farmers Supported", unit: "people", sdgs: [2, 1] },
    { id: "land_restored", name: "Land Restored/Protected", unit: "hectares", sdgs: [2, 15] },
    { id: "crop_yield_increase", name: "Crop Yield Increase", unit: "%", sdgs: [2, 12] }
  ],
  "Affordable Housing": [
    { id: "housing_units", name: "Affordable Housing Units Created", unit: "count", sdgs: [11, 1] },
    { id: "people_housed", name: "People Housed", unit: "people", sdgs: [11, 1] }
  ],
  "Financial Inclusion": [
    { id: "microloans", name: "Microloans Provided", unit: "count", sdgs: [1, 8] },
    { id: "financial_literacy", name: "People Receiving Financial Literacy Training", unit: "people", sdgs: [1, 4, 8] },
    { id: "small_businesses", name: "Small Businesses Supported", unit: "count", sdgs: [8, 9] }
  ]
};

// SDG-specific metrics
const sdgMetrics = {
  1: [{ id: "poverty_reduction", name: "People Lifted from Poverty", unit: "people" }],
  2: [{ id: "food_security", name: "People with Improved Food Security", unit: "people" }],
  3: [{ id: "mortality_reduction", name: "Mortality Rate Reduction", unit: "%" }],
  4: [{ id: "education_quality", name: "Education Quality Improvement", unit: "%" }],
  7: [{ id: "energy_efficiency", name: "Energy Efficiency Improvement", unit: "%" }],
  13: [{ id: "climate_resilience", name: "Communities with Climate Resilience", unit: "count" }]
};

// Define interfaces for type safety
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface InvestorPreferences {
  investorName: string;
  organization: string;
  selectedSDGs: number[];
  selectedTopics: string[];
  preferredFrameworks: string[];
  riskTolerance: string;
  financialReturnExpectation: string;
  timeHorizon: string;
}

interface ImpactMetric {
  id: string;
  value: string;
  unit: string;
}

interface Investment {
  id: number;
  companyName: string;
  sector: string;
  description: string;
  investmentAmount: string;
  investmentDate: string;
  sdgs: number[];
  impactTopics: string[];
  irisMetrics: string[];
  expectedReturn: string;
  risk: string;
  impactMetrics?: ImpactMetric[];
}

export default function InvestmentManager() {
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    id: Date.now(),
    companyName: "",
    sector: "",
    description: "",
    investmentAmount: "",
    investmentDate: "",
    sdgs: [] as number[],
    impactTopics: [] as string[],
    irisMetrics: [] as string[],
    expectedReturn: "",
    risk: "medium",
    impactMetrics: [] as ImpactMetric[]
  });
  
  // State to store the relevant metrics for the current form
  const [relevantMetrics, setRelevantMetrics] = useState<Array<{id: string, name: string, unit: string}>>([]);
  
  // Update relevant metrics when sector or SDGs change
  useEffect(() => {
    const newRelevantMetrics: Array<{id: string, name: string, unit: string}> = [];
    
    // Add sector-specific metrics if sector matches
    const sectorSpecificMetrics = Object.entries(sectorMetrics).find(
      ([sector]) => formData.sector.toLowerCase().includes(sector.toLowerCase())
    );
    
    if (sectorSpecificMetrics) {
      sectorSpecificMetrics[1].forEach(metric => {
        // Add if either no SDGs are specified for the metric, or if at least one SDG matches
        if (!metric.sdgs || metric.sdgs.some(sdg => formData.sdgs.includes(sdg))) {
          if (!newRelevantMetrics.some(m => m.id === metric.id)) {
            newRelevantMetrics.push(metric);
          }
        }
      });
    }
    
    // Add SDG-specific metrics
    formData.sdgs.forEach(sdgId => {
      if (sdgMetrics[sdgId as keyof typeof sdgMetrics]) {
        sdgMetrics[sdgId as keyof typeof sdgMetrics].forEach(metric => {
          if (!newRelevantMetrics.some(m => m.id === metric.id)) {
            newRelevantMetrics.push(metric);
          }
        });
      }
    });
    
    setRelevantMetrics(newRelevantMetrics);
    
    // Update formData.impactMetrics to contain all the new metrics (preserving existing values)
    const updatedImpactMetrics = newRelevantMetrics.map(metric => {
      const existing = formData.impactMetrics.find(m => m.id === metric.id);
      return existing || { id: metric.id, value: "", unit: metric.unit };
    });
    
    setFormData(prev => ({ ...prev, impactMetrics: updatedImpactMetrics }));
  }, [formData.sector, formData.sdgs]);

  useEffect(() => {
    // Load user preferences and investments from localStorage
    const savedPreferences = localStorage.getItem('investorPreferences');
    const savedInvestments = localStorage.getItem('investorInvestments');
    
    if (!savedPreferences) {
      router.push('/dashboards/investor/setup');
    }
    
    if (savedInvestments) {
      setInvestments(JSON.parse(savedInvestments));
    }
  }, [router]);

  const handleSaveInvestment = () => {
    if (formData.companyName && formData.investmentAmount) {
      const newInvestments = [...investments];
      const existingIndex = newInvestments.findIndex(inv => inv.id === formData.id);
      
      if (existingIndex >= 0) {
        // Update existing investment
        newInvestments[existingIndex] = formData;
      } else {
        // Add new investment
        newInvestments.push(formData);
      }
      
      setInvestments(newInvestments);
      localStorage.setItem('investorInvestments', JSON.stringify(newInvestments));
      resetForm();
      setShowAddForm(false);
    }
  };

  const handleEditInvestment = (investment: Investment) => {
    setFormData({
      ...investment,
      impactMetrics: investment.impactMetrics || []
    });
    setShowAddForm(true);
  };

  const handleDeleteInvestment = (id: number) => {
    setSelectedInvestmentId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteInvestment = () => {
    if (selectedInvestmentId !== null) {
      const newInvestments = investments.filter(inv => inv.id !== selectedInvestmentId);
      setInvestments(newInvestments);
      localStorage.setItem('investorInvestments', JSON.stringify(newInvestments));
      setShowDeleteConfirm(false);
      setSelectedInvestmentId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      id: Date.now(),
      companyName: "",
      sector: "",
      description: "",
      investmentAmount: "",
      investmentDate: "",
      sdgs: [],
      impactTopics: [],
      irisMetrics: [],
      expectedReturn: "",
      risk: "medium",
      impactMetrics: []
    });
  };

  const toggleSDG = (sdgId: number) => {
    setFormData(prev => {
      if (prev.sdgs.includes(sdgId)) {
        return { ...prev, sdgs: prev.sdgs.filter(id => id !== sdgId) };
      } else {
        return { ...prev, sdgs: [...prev.sdgs, sdgId] };
      }
    });
  };

  const toggleImpactTopic = (topicId: string) => {
    setFormData(prev => {
      if (prev.impactTopics.includes(topicId)) {
        return { ...prev, impactTopics: prev.impactTopics.filter(id => id !== topicId) };
      } else {
        return { ...prev, impactTopics: [...prev.impactTopics, topicId] };
      }
    });
  };
  
  const updateImpactMetricValue = (metricId: string, value: string) => {
    setFormData(prev => {
      const updatedMetrics = prev.impactMetrics.map(metric => 
        metric.id === metricId ? { ...metric, value } : metric
      );
      return { ...prev, impactMetrics: updatedMetrics };
    });
  };
  
  // Helper to format and display impact metrics in the card view
  const displayImpactMetrics = (investment: Investment) => {
    if (!investment.impactMetrics || investment.impactMetrics.length === 0) {
      return <p className="text-sm text-muted-foreground">No impact metrics recorded</p>;
    }
    
    return (
      <div className="grid grid-cols-1 gap-1 mt-2">
        {investment.impactMetrics
          .filter(metric => metric.value)
          .map(metric => {
            const metricInfo = relevantMetrics.find(m => m.id === metric.id) || 
              Object.values(sectorMetrics).flat().find(m => m.id === metric.id) ||
              Object.values(sdgMetrics).flat().find(m => m.id === metric.id);
            
            return (
              <div key={metric.id} className="flex justify-between">
                <span className="text-sm">{metricInfo?.name || metric.id}:</span>
                <span className="text-sm font-medium">{metric.value} {metric.unit}</span>
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Investment Portfolio Management</h1>
          <p className="text-muted-foreground">Add and manage your impact investments</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push("/dashboards/investor")}
          >
            Back to Dashboard
          </Button>
          <Button 
            onClick={() => { resetForm(); setShowAddForm(true); }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Investment
          </Button>
        </div>
      </div>

      {showAddForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{formData.id === Date.now() ? "Add New Investment" : "Edit Investment"}</CardTitle>
            <CardDescription>Enter details about your impact investment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company/Fund Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company or fund name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Input
                    id="sector"
                    placeholder="e.g. Clean Energy, Healthcare, Education"
                    value={formData.sector}
                    onChange={(e) => setFormData({...formData, sector: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    placeholder="Briefly describe the investment and its impact goals"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="investmentAmount">Investment Amount ($)</Label>
                  <Input
                    id="investmentAmount"
                    type="number"
                    placeholder="Enter amount in USD"
                    value={formData.investmentAmount}
                    onChange={(e) => setFormData({...formData, investmentAmount: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="investmentDate">Investment Date</Label>
                  <Input
                    id="investmentDate"
                    type="date"
                    value={formData.investmentDate}
                    onChange={(e) => setFormData({...formData, investmentDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                  <Input
                    id="expectedReturn"
                    type="number"
                    placeholder="e.g. 8.5"
                    value={formData.expectedReturn}
                    onChange={(e) => setFormData({...formData, expectedReturn: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="risk">Risk Level</Label>
                  <Select
                    value={formData.risk}
                    onValueChange={(value) => setFormData({...formData, risk: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Sustainable Development Goals</Label>
                <div className="flex flex-wrap gap-2">
                  {sdgOptions.map((sdg) => (
                    <Badge
                      key={sdg.id}
                      variant={formData.sdgs.includes(sdg.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSDG(sdg.id)}
                    >
                      SDG {sdg.id}: {sdg.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Impact Topics</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {impactTopicsOptions.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`topic-${topic.id}`}
                        checked={formData.impactTopics.includes(topic.id)}
                        onCheckedChange={() => toggleImpactTopic(topic.id)}
                      />
                      <Label
                        htmlFor={`topic-${topic.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {topic.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {relevantMetrics.length > 0 && (
                <div className="space-y-4 mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg">Impact Metrics</Label>
                    <span className="text-sm text-muted-foreground">
                      Based on your selected sector and SDGs
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relevantMetrics.map((metric) => {
                      const impactMetric = formData.impactMetrics.find(m => m.id === metric.id);
                      return (
                        <div key={metric.id} className="space-y-2">
                          <Label htmlFor={`metric-${metric.id}`} className="flex items-center">
                            {metric.name} 
                            <span className="text-xs text-muted-foreground ml-2">
                              ({metric.unit})
                            </span>
                          </Label>
                          <div className="flex items-center">
                            <Input
                              id={`metric-${metric.id}`}
                              type="text"
                              placeholder={`Enter value in ${metric.unit}`}
                              value={impactMetric?.value || ""}
                              onChange={(e) => updateImpactMetricValue(metric.id, e.target.value)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    These metrics will help track and report the actual impact of your investment.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t p-4">
            <Button
              variant="outline"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveInvestment}
              className="bg-green-600 hover:bg-green-700"
              disabled={!formData.companyName || !formData.investmentAmount}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Investment
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          {investments.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <Building className="h-12 w-12 text-gray-400" />
                <h3 className="text-xl font-medium">No investments added yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Add your first impact investment to start tracking its financial and impact performance.
                </p>
                <Button 
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => { resetForm(); setShowAddForm(true); }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Investment
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {investments.map((investment) => (
                <Card key={investment.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-medium">{investment.companyName}</h3>
                          <p className="text-muted-foreground">{investment.sector}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditInvestment(investment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteInvestment(investment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="mt-2 text-sm">
                        {investment.description || "No description provided."}
                      </p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {investment.sdgs.map((sdgId: number) => {
                          const sdg = sdgOptions.find(s => s.id === sdgId);
                          return sdg ? (
                            <Badge key={sdgId} variant="secondary">
                              SDG {sdgId}: {sdg.name}
                            </Badge>
                          ) : null;
                        })}
                        
                        {investment.impactTopics.map((topicId: string) => {
                          const topic = impactTopicsOptions.find(t => t.id === topicId);
                          return topic ? (
                            <Badge key={topicId} variant="outline">
                              {topic.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                      
                      {investment.impactMetrics && investment.impactMetrics.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Impact Metrics</h4>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
                            {displayImpactMetrics(investment)}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 md:w-64">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Investment Amount</div>
                          <div className="text-xl font-bold flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {Number(investment.investmentAmount).toLocaleString()}
                          </div>
                        </div>
                        
                        {investment.expectedReturn && (
                          <div>
                            <div className="text-sm text-muted-foreground">Expected Return</div>
                            <div className="text-lg font-medium flex items-center text-green-600">
                              <ArrowUp className="h-4 w-4 mr-1" />
                              {investment.expectedReturn}%
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <div className="text-sm text-muted-foreground">Risk Level</div>
                          <Badge variant={
                            investment.risk === "low" ? "outline" : 
                            investment.risk === "medium" ? "secondary" : 
                            "destructive"
                          }>
                            {investment.risk.charAt(0).toUpperCase() + investment.risk.slice(1)}
                          </Badge>
                        </div>
                        
                        {investment.investmentDate && (
                          <div>
                            <div className="text-sm text-muted-foreground">Investment Date</div>
                            <div className="text-sm">{investment.investmentDate}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
      
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this investment from your portfolio.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteInvestment} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 