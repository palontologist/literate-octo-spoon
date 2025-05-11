"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Globe, ArrowRight, Check, GraduationCap, HeartPulse, Leaf, 
  Home, DollarSign, Users, Droplet, Zap, Briefcase 
} from "lucide-react";

// SDG data
const sdgData = [
  { id: 1, name: "No Poverty", color: "#E5243B", icon: <Home className="h-4 w-4" /> },
  { id: 2, name: "Zero Hunger", color: "#DDA63A", icon: <Home className="h-4 w-4" /> },
  { id: 3, name: "Good Health & Well-being", color: "#4C9F38", icon: <HeartPulse className="h-4 w-4" /> },
  { id: 4, name: "Quality Education", color: "#C5192D", icon: <GraduationCap className="h-4 w-4" /> },
  { id: 5, name: "Gender Equality", color: "#FF3A21", icon: <Users className="h-4 w-4" /> },
  { id: 6, name: "Clean Water and Sanitation", color: "#26BDE2", icon: <Droplet className="h-4 w-4" /> },
  { id: 7, name: "Affordable and Clean Energy", color: "#FCC30B", icon: <Zap className="h-4 w-4" /> },
  { id: 8, name: "Decent Work and Economic Growth", color: "#A21942", icon: <Briefcase className="h-4 w-4" /> },
  { id: 13, name: "Climate Action", color: "#3F7E44", icon: <Leaf className="h-4 w-4" /> }
];

// Impact topics
const impactTopics = [
  { id: "education", name: "Education", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "healthcare", name: "Healthcare", icon: <HeartPulse className="h-4 w-4" /> },
  { id: "climate", name: "Climate Change", icon: <Leaf className="h-4 w-4" /> },
  { id: "housing", name: "Affordable Housing", icon: <Home className="h-4 w-4" /> },
  { id: "financial", name: "Financial Inclusion", icon: <DollarSign className="h-4 w-4" /> }
];

// Measurement frameworks
const measurementFrameworks = [
  { id: "iris", name: "IRIS+", description: "Global Impact Investing Network&apos;s system for impact measurement" },
  { id: "gri", name: "GRI Standards", description: "Global Reporting Initiative&apos;s sustainability reporting standards" },
  { id: "sasb", name: "SASB", description: "Sustainability Accounting Standards Board metrics" },
  { id: "idi", name: "Impact-Weighted Accounts", description: "Harvard Business School&apos;s methodology for monetary valuation of impact" }
];

export default function InvestorSetup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    investorName: "",
    organization: "",
    selectedSDGs: [] as number[],
    selectedTopics: [] as string[],
    preferredFrameworks: [] as string[],
    riskTolerance: "moderate",
    financialReturnExpectation: "market",
    timeHorizon: "long"
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleSDGToggle = (sdgId: number) => {
    setFormData(prev => {
      if (prev.selectedSDGs.includes(sdgId)) {
        return { ...prev, selectedSDGs: prev.selectedSDGs.filter(id => id !== sdgId) };
      } else {
        return { ...prev, selectedSDGs: [...prev.selectedSDGs, sdgId] };
      }
    });
  };

  const handleTopicToggle = (topicId: string) => {
    setFormData(prev => {
      if (prev.selectedTopics.includes(topicId)) {
        return { ...prev, selectedTopics: prev.selectedTopics.filter(id => id !== topicId) };
      } else {
        return { ...prev, selectedTopics: [...prev.selectedTopics, topicId] };
      }
    });
  };

  const handleFrameworkToggle = (frameworkId: string) => {
    setFormData(prev => {
      if (prev.preferredFrameworks.includes(frameworkId)) {
        return { ...prev, preferredFrameworks: prev.preferredFrameworks.filter(id => id !== frameworkId) };
      } else {
        return { ...prev, preferredFrameworks: [...prev.preferredFrameworks, frameworkId] };
      }
    });
  };

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save preferences to localStorage
      localStorage.setItem('investorPreferences', JSON.stringify(formData));
      // Navigate to the investor dashboard
      router.push('/dashboards/investor');
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold">Impact Investment Dashboard Setup</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tell us about your impact investment preferences so we can customize your dashboard experience
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Step {step} of {totalSteps}</CardTitle>
                <CardDescription>
                  {step === 1 && "Basic Information"}
                  {step === 2 && "SDG Selection"}
                  {step === 3 && "Impact Topics"}
                  {step === 4 && "Measurement Preferences"}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {Math.round(progress)}% complete
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>

          <CardContent className="pt-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="investorName">Your Name</Label>
                  <Input 
                    id="investorName"
                    placeholder="Enter your full name"
                    value={formData.investorName}
                    onChange={(e) => setFormData({...formData, investorName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization (Optional)</Label>
                  <Input 
                    id="organization"
                    placeholder="Enter your organization name"
                    value={formData.organization}
                    onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Investment Preferences</Label>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                      <select
                        id="riskTolerance"
                        className="w-full border border-gray-300 rounded-md p-2 dark:bg-gray-800 dark:border-gray-600"
                        value={formData.riskTolerance}
                        onChange={(e) => setFormData({...formData, riskTolerance: e.target.value})}
                      >
                        <option value="conservative">Conservative (Lower risk, lower returns)</option>
                        <option value="moderate">Moderate (Balanced risk and returns)</option>
                        <option value="aggressive">Aggressive (Higher risk, higher potential returns)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="financialReturnExpectation">Financial Return Expectations</Label>
                      <select
                        id="financialReturnExpectation"
                        className="w-full border border-gray-300 rounded-md p-2 dark:bg-gray-800 dark:border-gray-600"
                        value={formData.financialReturnExpectation}
                        onChange={(e) => setFormData({...formData, financialReturnExpectation: e.target.value})}
                      >
                        <option value="below">Below Market Rate (Impact First)</option>
                        <option value="market">Market Rate (Blended Value)</option>
                        <option value="above">Above Market Rate (Finance First)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeHorizon">Investment Time Horizon</Label>
                      <select
                        id="timeHorizon"
                        className="w-full border border-gray-300 rounded-md p-2 dark:bg-gray-800 dark:border-gray-600"
                        value={formData.timeHorizon}
                        onChange={(e) => setFormData({...formData, timeHorizon: e.target.value})}
                      >
                        <option value="short">Short-term (1-3 years)</option>
                        <option value="medium">Medium-term (3-7 years)</option>
                        <option value="long">Long-term (7+ years)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: SDG Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select the Sustainable Development Goals that align with your impact investment thesis.
                  You can select multiple SDGs.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sdgData.map(sdg => (
                    <div 
                      key={sdg.id}
                      onClick={() => handleSDGToggle(sdg.id)}
                      className={`flex items-center gap-3 p-3 rounded-md cursor-pointer border transition-colors ${
                        formData.selectedSDGs.includes(sdg.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      style={
                        formData.selectedSDGs.includes(sdg.id) 
                          ? { borderColor: sdg.color, backgroundColor: `${sdg.color}10` } 
                          : {}
                      }
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center" 
                        style={{ backgroundColor: sdg.color }}
                      >
                        {sdg.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">SDG {sdg.id}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{sdg.name}</p>
                      </div>
                      {formData.selectedSDGs.includes(sdg.id) && (
                        <Check className="h-5 w-5 text-primary" style={{ color: sdg.color }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Impact Topics */}
            {step === 3 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select the specific impact topics you re most passionate about investing in.
                  Your dashboard will highlight investments in these areas.
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  {impactTopics.map(topic => (
                    <div 
                      key={topic.id}
                      onClick={() => handleTopicToggle(topic.id)}
                      className={`flex items-center gap-3 p-4 rounded-md cursor-pointer border transition-colors ${
                        formData.selectedTopics.includes(topic.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {topic.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{topic.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Investments focused on {topic.name.toLowerCase()} outcomes
                        </p>
                      </div>
                      <Checkbox 
                        checked={formData.selectedTopics.includes(topic.id)}
                        onCheckedChange={() => handleTopicToggle(topic.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Measurement Frameworks */}
            {step === 4 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select which impact measurement frameworks you prefer to use for tracking your investments.
                </p>
                
                <div className="space-y-4">
                  {measurementFrameworks.map(framework => (
                    <div 
                      key={framework.id}
                      className={`flex items-center gap-3 p-4 rounded-md cursor-pointer border transition-colors ${
                        formData.preferredFrameworks.includes(framework.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => handleFrameworkToggle(framework.id)}
                    >
                      <div>
                        <Checkbox 
                          id={`framework-${framework.id}`}
                          checked={formData.preferredFrameworks.includes(framework.id)}
                          onCheckedChange={() => handleFrameworkToggle(framework.id)}
                        />
                      </div>
                      <div className="flex-1">
                        <Label 
                          htmlFor={`framework-${framework.id}`}
                          className="text-base font-medium cursor-pointer"
                        >
                          {framework.name}
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {framework.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t p-6">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button
              onClick={handleNextStep}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={
                (step === 1 && !formData.investorName) ||
                (step === 2 && formData.selectedSDGs.length === 0) ||
                (step === 3 && formData.selectedTopics.length === 0)
              }
            >
              {step === totalSteps ? (
                <span className="flex items-center gap-2">
                  Complete Setup <ArrowRight className="h-4 w-4" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Next Step <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Progress steps indicator */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full ${
                index + 1 <= step ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 