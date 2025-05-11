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
    risk: "medium"
  });

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
    setFormData(investment);
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
      risk: "medium"
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