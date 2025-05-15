"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Truck, 
  Factory,
  Info, 
  AlertCircle, 
  LineChart, 
  Globe, 
  CloudCog,
  Database,
  Repeat,
  Upload,
  Link2,
  Users,
  BarChart
} from "lucide-react";
import { useRouter } from "next/navigation";

const SCOPE_DEFINITIONS = {
  scope1: "Direct emissions from owned or controlled sources (e.g., company facilities, vehicles)",
  scope2: "Indirect emissions from purchased electricity, steam, heating, and cooling",
  scope3: "All other indirect emissions in a company's value chain (e.g., purchased goods, transportation, waste)"
};

const SDG_OPTIONS = [
  { value: "sdg12", label: "SDG 12: Responsible Consumption and Production", color: "green" },
  { value: "sdg13", label: "SDG 13: Climate Action", color: "blue" },
  { value: "sdg6", label: "SDG 6: Clean Water and Sanitation", color: "cyan" },
  { value: "sdg8", label: "SDG 8: Decent Work and Economic Growth", color: "amber" },
  { value: "sdg15", label: "SDG 15: Life on Land", color: "emerald" },
  { value: "sdg5", label: "SDG 5: Gender Equality", color: "pink" },
  { value: "sdg7", label: "SDG 7: Affordable and Clean Energy", color: "yellow" },
  { value: "sdg11", label: "SDG 11: Sustainable Cities and Communities", color: "indigo" }
];

const MATERIAL_OPTIONS = [
  { value: "organic_cotton", label: "Organic Cotton" },
  { value: "recycled_polyester", label: "Recycled Polyester" },
  { value: "hemp", label: "Hemp" },
  { value: "tencel", label: "Tencel/Lyocell" },
  { value: "linen", label: "Linen" },
  { value: "bamboo", label: "Bamboo" },
  { value: "deadstock", label: "Deadstock Fabric" },
  { value: "recycled_cotton", label: "Recycled Cotton" },
  { value: "recycled_wool", label: "Recycled Wool" },
  { value: "other", label: "Other Sustainable Materials" }
];

const DATA_SOURCE_OPTIONS = [
  { value: "manual", label: "Manual Input", description: "Enter data manually through our dashboard" },
  { value: "csv", label: "CSV Upload", description: "Upload your data via CSV files" },
  { value: "api", label: "API Integration", description: "Connect directly to your existing systems" },
  { value: "sensors", label: "IoT Sensors", description: "Use connected devices for real-time tracking" },
  { value: "erp", label: "ERP/Software Integration", description: "Connect to your enterprise software" }
];

const UPDATE_FREQUENCY_OPTIONS = [
  { value: "realtime", label: "Real-time" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" }
];

const BENCHMARK_OPTIONS = [
  { value: "industry_average", label: "Industry Average" },
  { value: "best_in_class", label: "Best-in-Class" },
  { value: "regulatory", label: "Regulatory Standards" },
  { value: "historical", label: "Your Historical Data" },
  { value: "custom", label: "Custom Targets" }
];

// Industry categories for benchmarking
const INDUSTRY_SEGMENTS = [
  { value: "apparel", label: "Apparel & Clothing" },
  { value: "footwear", label: "Footwear" },
  { value: "accessories", label: "Accessories" },
  { value: "textiles", label: "Textile Manufacturing" },
  { value: "retail", label: "Fashion Retail" }
];

// Custom switch component using checkbox
const Switch = ({ checked, onCheckedChange, id }: { checked: boolean, onCheckedChange: (checked: boolean) => void, id: string }) => {
  return (
    <div 
      className={`flex items-center w-11 h-6 rounded-full cursor-pointer ${checked ? 'bg-primary justify-end' : 'bg-gray-200 dark:bg-gray-700'}`}
      onClick={() => onCheckedChange(!checked)}
    >
      <div className="bg-white dark:bg-gray-300 rounded-full h-5 w-5 shadow-md transform mx-0.5"></div>
      <input 
        type="checkbox" 
        className="sr-only" 
        id={id} 
        checked={checked} 
        onChange={() => {}} 
      />
    </div>
  );
};

// Simple slider component
const Slider = ({
  id,
  min,
  max,
  step,
  value,
  onValueChange
}: {
  id: string;
  min: number;
  max: number;
  step: number;
  value: number[];
  onValueChange: (value: number[]) => void;
}) => {
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([parseInt(e.target.value)])}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
    />
  );
};

// Custom textarea component
const Textarea = ({
  id,
  placeholder,
  value,
  onChange,
  className
}: {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}) => {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
};

export default function SustainableFashionOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  // Brand information
  const [brandName, setBrandName] = useState("");
  const [brandWebsite, setBrandWebsite] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [industrySegment, setIndustrySegment] = useState("");
  const [foundingYear, setFoundingYear] = useState("");
  const [companySize, setCompanySize] = useState("");
  
  // Emissions data
  const [scope1Data, setScope1Data] = useState({
    facilities: "",
    vehicles: "",
    other: ""
  });
  
  const [scope2Data, setScope2Data] = useState({
    electricity: "",
    heating: "",
    cooling: ""
  });
  
  const [scope3Data, setScope3Data] = useState({
    purchasedGoods: "",
    transportation: "",
    waste: "",
    business_travel: "",
    employee_commuting: "",
    other: ""
  });
  
  // Materials usage
  const [materialsUsage, setMaterialsUsage] = useState({
    organic_cotton: 0,
    recycled_polyester: 0,
    hemp: 0,
    tencel: 0,
    linen: 0,
    bamboo: 0,
    deadstock: 0,
    recycled_cotton: 0,
    recycled_wool: 0,
    other: 0
  });
  
  // SDG alignment
  const [selectedSDGs, setSelectedSDGs] = useState<string[]>([]);
  const [sdgTargets, setSdgTargets] = useState<Record<string, number>>({});
  
  // Delivery information
  const [deliveryTypes, setDeliveryTypes] = useState({
    standard: true,
    express: false,
    carbon_neutral: true
  });
  
  const [deliveryEmissions, setDeliveryEmissions] = useState({
    standard: "2.5", // kg CO2e per package
    express: "4.8",
    carbon_neutral: "0"
  });

  // Data integration settings
  const [dataSources, setDataSources] = useState<string[]>([]);
  const [updateFrequency, setUpdateFrequency] = useState("monthly");
  const [autoSync, setAutoSync] = useState(false);
  const [apiEndpoints, setApiEndpoints] = useState({
    erp: "",
    inventory: "",
    logistics: ""
  });
  
  // Benchmarking preferences
  const [benchmarkPreferences, setBenchmarkPreferences] = useState<string[]>([]);
  const [targetReductions, setTargetReductions] = useState({
    emissions: 30,
    water: 25,
    waste: 40
  });
  
  // Dashboard preferences
  const [dashboardPreferences, setDashboardPreferences] = useState({
    showEmissions: true,
    showMaterials: true,
    showSDGs: true,
    showBenchmarks: true,
    showTrends: true,
    showPredictions: false,
    publicProfile: false
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Simulate saving data to API for real-time dashboard
      const brandData = {
        brandInfo: {
          name: brandName,
          website: brandWebsite,
          description: brandDescription,
          industrySegment,
          foundingYear,
          companySize
        },
        emissions: {
          scope1: scope1Data,
          scope2: scope2Data,
          scope3: scope3Data
        },
        materials: materialsUsage,
        sdgs: {
          selected: selectedSDGs,
          targets: sdgTargets
        },
        delivery: {
          types: deliveryTypes,
          emissions: deliveryEmissions
        },
        dataIntegration: {
          sources: dataSources,
          frequency: updateFrequency,
          autoSync,
          endpoints: apiEndpoints
        },
        benchmarking: {
          preferences: benchmarkPreferences,
          targets: targetReductions
        },
        dashboardPrefs: dashboardPreferences
      };
      
      console.log("Saving brand data:", brandData);
      
      // Save to localStorage to indicate onboarding is complete
      if (typeof window !== 'undefined') {
        localStorage.setItem('sustainableFashionOnboarding', 'completed');
        localStorage.setItem('sustainableFashionBrandData', JSON.stringify(brandData));
      }
      
      // Redirect to dashboard with real-time data
      router.push("/dashboards/impact/sustainability?tab=fashion&realtime=true&brand=" + encodeURIComponent(brandName));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleSDG = (sdg: string) => {
    if (selectedSDGs.includes(sdg)) {
      setSelectedSDGs(selectedSDGs.filter(item => item !== sdg));
      
      // Remove target when unselecting an SDG
      const updatedTargets = { ...sdgTargets };
      delete updatedTargets[sdg];
      setSdgTargets(updatedTargets);
    } else {
      setSelectedSDGs([...selectedSDGs, sdg]);
      
      // Set default target when selecting a new SDG
      setSdgTargets({
        ...sdgTargets,
        [sdg]: 25 // Default target: 25% improvement
      });
    }
  };

  const handleSDGTargetChange = (sdg: string, value: number) => {
    setSdgTargets({
      ...sdgTargets,
      [sdg]: value
    });
  };

  const handleMaterialChange = (material: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setMaterialsUsage({ 
      ...materialsUsage, 
      [material]: Math.min(numValue, 100) 
    });
  };

  const handleScope1Change = (field: string, value: string) => {
    setScope1Data({ ...scope1Data, [field]: value });
  };

  const handleScope2Change = (field: string, value: string) => {
    setScope2Data({ ...scope2Data, [field]: value });
  };

  const handleScope3Change = (field: string, value: string) => {
    setScope3Data({ ...scope3Data, [field]: value });
  };

  const handleDeliveryTypeToggle = (type: string) => {
    setDeliveryTypes({
      ...deliveryTypes,
      [type]: !deliveryTypes[type as keyof typeof deliveryTypes]
    });
  };

  const toggleDataSource = (source: string) => {
    if (dataSources.includes(source)) {
      setDataSources(dataSources.filter(item => item !== source));
    } else {
      setDataSources([...dataSources, source]);
    }
  };

  const toggleBenchmark = (benchmark: string) => {
    if (benchmarkPreferences.includes(benchmark)) {
      setBenchmarkPreferences(benchmarkPreferences.filter(item => item !== benchmark));
    } else {
      setBenchmarkPreferences([...benchmarkPreferences, benchmark]);
    }
  };

  const handleApiEndpointChange = (field: keyof typeof apiEndpoints, value: string) => {
    setApiEndpoints({
      ...apiEndpoints,
      [field]: value
    });
  };

  const handleTargetChange = (field: keyof typeof targetReductions, value: number) => {
    setTargetReductions({
      ...targetReductions,
      [field]: value
    });
  };

  const toggleDashboardPreference = (pref: keyof typeof dashboardPreferences) => {
    setDashboardPreferences({
      ...dashboardPreferences,
      [pref]: !dashboardPreferences[pref]
    });
  };

  const calculateProgress = () => {
    return (currentStep / totalSteps) * 100;
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sustainable Brand Onboarding</h1>
        <p className="text-muted-foreground">
          Set up your sustainable brand metrics for real-time dashboard tracking
        </p>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(calculateProgress())}% Complete</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>
      </div>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Brand Information</CardTitle>
            <CardDescription>Tell us about your sustainable brand for personalized dashboard metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  placeholder="e.g., EcoThreads"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brandWebsite">Brand Website</Label>
                <Input
                  id="brandWebsite"
                  placeholder="e.g., https://ecothreads.com"
                  value={brandWebsite}
                  onChange={(e) => setBrandWebsite(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brandDescription">Brand Mission & Values</Label>
              <Textarea
                id="brandDescription"
                placeholder="Tell us about your brand's sustainability mission and core values..."
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industrySegment">Industry Segment</Label>
                <Select value={industrySegment} onValueChange={setIndustrySegment}>
                  <SelectTrigger id="industrySegment">
                    <SelectValue placeholder="Select your industry segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRY_SEGMENTS.map(segment => (
                      <SelectItem key={segment.value} value={segment.value}>
                        {segment.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="foundingYear">Founding Year</Label>
                <Input
                  id="foundingYear"
                  type="number"
                  placeholder="e.g., 2018"
                  value={foundingYear}
                  onChange={(e) => setFoundingYear(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companySize">Company Size</Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger id="companySize">
                  <SelectValue placeholder="Select your company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-1000">201-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">Real-Time Dashboard</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Your information will be used to create a personalized real-time sustainability dashboard
                    and benchmark your performance against industry leaders.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboards/impact/sustainability")}
            >
              Cancel
            </Button>
            <Button onClick={handleNext}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Carbon Emissions: Scope 1</CardTitle>
            <CardDescription>Direct emissions from owned or controlled sources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">About Scope 1 Emissions</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {SCOPE_DEFINITIONS.scope1}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="facilities">
                  Facilities Emissions (tons CO2e/year)
                </Label>
                <Input
                  id="facilities"
                  type="number"
                  placeholder="e.g., 25.5"
                  value={scope1Data.facilities}
                  onChange={(e) => handleScope1Change('facilities', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Emissions from company-owned factories, offices, and retail stores
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicles">
                  Company Vehicles (tons CO2e/year)
                </Label>
                <Input
                  id="vehicles"
                  type="number"
                  placeholder="e.g., 12.8"
                  value={scope1Data.vehicles}
                  onChange={(e) => handleScope1Change('vehicles', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Emissions from company-owned/leased vehicles
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherScope1">
                Other Direct Emissions (tons CO2e/year)
              </Label>
              <Input
                id="otherScope1"
                type="number"
                placeholder="e.g., 5.2"
                value={scope1Data.other}
                onChange={(e) => handleScope1Change('other', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Any other sources of direct emissions
              </p>
            </div>
            
            <div className="mt-4 pt-2 border-t">
              <h4 className="font-medium mb-3 flex items-center">
                <LineChart className="mr-2 h-4 w-4 text-green-600" />
                Real-Time Monitoring
              </h4>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="realtime-scope1"
                  checked={dataSources.includes('sensors')}
                  onCheckedChange={() => toggleDataSource('sensors')}
                />
                <Label htmlFor="realtime-scope1">Enable IoT sensor integration for real-time emissions tracking</Label>
              </div>
              <p className="text-sm text-muted-foreground ml-7">
                Connect your facility monitoring systems for automated data collection and real-time dashboard updates
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Carbon Emissions: Scope 2 & 3</CardTitle>
                <CardDescription>Indirect emissions from your operations and supply chain</CardDescription>
              </div>
              <Tabs defaultValue="scope2" className="w-[200px]">
                <TabsList>
                  <TabsTrigger value="scope2">Scope 2</TabsTrigger>
                  <TabsTrigger value="scope3">Scope 3</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-200 dark:border-blue-800 mb-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">Scope 2 & 3 Emissions</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    <strong>Scope 2:</strong> {SCOPE_DEFINITIONS.scope2}<br />
                    <strong>Scope 3:</strong> {SCOPE_DEFINITIONS.scope3}
                  </p>
                </div>
              </div>
            </div>

            <div data-scope="scope2" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="electricity">
                    Electricity (tons CO2e/year)
                  </Label>
                  <Input
                    id="electricity"
                    type="number"
                    placeholder="e.g., 45.3"
                    value={scope2Data.electricity}
                    onChange={(e) => handleScope2Change('electricity', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="heating">
                    Heating & Steam (tons CO2e/year)
                  </Label>
                  <Input
                    id="heating"
                    type="number"
                    placeholder="e.g., 32.1"
                    value={scope2Data.heating}
                    onChange={(e) => handleScope2Change('heating', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cooling">
                  Cooling (tons CO2e/year)
                </Label>
                <Input
                  id="cooling"
                  type="number"
                  placeholder="e.g., 18.5"
                  value={scope2Data.cooling}
                  onChange={(e) => handleScope2Change('cooling', e.target.value)}
                />
              </div>
              
              <div className="mt-4 pt-2 border-t">
                <h4 className="font-medium mb-3 flex items-center">
                  <Database className="mr-2 h-4 w-4 text-blue-600" />
                  Utility Data Integration
                </h4>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id="utility-integration"
                    checked={dataSources.includes('api')}
                    onCheckedChange={() => toggleDataSource('api')}
                  />
                  <Label htmlFor="utility-integration">Connect to utility provider APIs for automatic data updates</Label>
                </div>
                {dataSources.includes('api') && (
                  <div className="space-y-3 mt-3 ml-7">
                    <div className="space-y-2">
                      <Label htmlFor="utility-api">Utility Provider API Endpoint</Label>
                      <Input
                        id="utility-api"
                        placeholder="e.g., https://api.utilitycompany.com/v1/consumption"
                        value={apiEndpoints.erp}
                        onChange={(e) => handleApiEndpointChange('erp', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="auto-update-utility"
                        checked={autoSync}
                        onCheckedChange={(checked) => setAutoSync(checked === true)}
                      />
                      <Label htmlFor="auto-update-utility">Enable automatic data synchronization</Label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div data-scope="scope3" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="purchasedGoods">
                    Purchased Goods & Services (tons CO2e/year)
                  </Label>
                  <Input
                    id="purchasedGoods"
                    type="number"
                    placeholder="e.g., 350.7"
                    value={scope3Data.purchasedGoods}
                    onChange={(e) => handleScope3Change('purchasedGoods', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transportation">
                    Transportation & Distribution (tons CO2e/year)
                  </Label>
                  <Input
                    id="transportation"
                    type="number"
                    placeholder="e.g., 125.8"
                    value={scope3Data.transportation}
                    onChange={(e) => handleScope3Change('transportation', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="waste">
                    Waste Generated (tons CO2e/year)
                  </Label>
                  <Input
                    id="waste"
                    type="number"
                    placeholder="e.g., 42.3"
                    value={scope3Data.waste}
                    onChange={(e) => handleScope3Change('waste', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business_travel">
                    Business Travel (tons CO2e/year)
                  </Label>
                  <Input
                    id="business_travel"
                    type="number"
                    placeholder="e.g., 28.9"
                    value={scope3Data.business_travel}
                    onChange={(e) => handleScope3Change('business_travel', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="employee_commuting">
                    Employee Commuting (tons CO2e/year)
                  </Label>
                  <Input
                    id="employee_commuting"
                    type="number"
                    placeholder="e.g., 35.2"
                    value={scope3Data.employee_commuting}
                    onChange={(e) => handleScope3Change('employee_commuting', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otherScope3">
                    Other Indirect Emissions (tons CO2e/year)
                  </Label>
                  <Input
                    id="otherScope3"
                    type="number"
                    placeholder="e.g., 56.1"
                    value={scope3Data.other}
                    onChange={(e) => handleScope3Change('other', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mt-4 pt-2 border-t">
                <h4 className="font-medium mb-3 flex items-center">
                  <Link2 className="mr-2 h-4 w-4 text-indigo-600" />
                  Supply Chain Integration
                </h4>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id="supply-chain-integration"
                    checked={dataSources.includes('erp')}
                    onCheckedChange={() => toggleDataSource('erp')}
                  />
                  <Label htmlFor="supply-chain-integration">Connect to ERP or supply chain management systems</Label>
                </div>
                {dataSources.includes('erp') && (
                  <div className="space-y-3 mt-3 ml-7">
                    <div className="space-y-2">
                      <Label htmlFor="logistics-api">Logistics/Supply Chain API Endpoint</Label>
                      <Input
                        id="logistics-api"
                        placeholder="e.g., https://api.erp-system.com/logistics"
                        value={apiEndpoints.logistics}
                        onChange={(e) => handleApiEndpointChange('logistics', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inventory-api">Inventory Management API Endpoint</Label>
                      <Input
                        id="inventory-api"
                        placeholder="e.g., https://api.erp-system.com/inventory"
                        value={apiEndpoints.inventory}
                        onChange={(e) => handleApiEndpointChange('inventory', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Sustainable Materials & SDG Alignment</CardTitle>
            <CardDescription>Tell us about your materials usage and which SDGs you contribute to</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Factory className="mr-2 h-5 w-5 text-green-600" />
                Materials Composition (%)
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enter the percentage breakdown of materials used in your products
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MATERIAL_OPTIONS.map(material => (
                  <div key={material.value} className="space-y-2">
                    <Label htmlFor={material.value}>{material.label}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={material.value}
                        type="number"
                        min="0"
                        max="100"
                        value={materialsUsage[material.value as keyof typeof materialsUsage] || ""}
                        onChange={(e) => handleMaterialChange(material.value, e.target.value)}
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-2">
                <div className="flex items-center space-x-2 mb-3">
                  <Switch
                    id="materials-tracking"
                    checked={dataSources.includes('csv')}
                    onCheckedChange={() => toggleDataSource('csv')}
                  />
                  <Label htmlFor="materials-tracking">
                    Enable automated materials tracking through inventory system integration
                  </Label>
                </div>
                {dataSources.includes('csv') && (
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-md border border-green-200 dark:border-green-800 mt-2">
                    <div className="flex items-start gap-3">
                      <Upload className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800 dark:text-green-300">CSV Upload Setup</h4>
                        <p className="text-sm text-green-700 dark:text-green-400 mb-2">
                          Our system will automatically process your inventory reports to update materials tracking in real-time
                        </p>
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Material Template
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Globe className="mr-2 h-5 w-5 text-blue-600" />
                SDG Alignment & Targets
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select the Sustainable Development Goals your brand contributes to and set improvement targets
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {SDG_OPTIONS.map(sdg => {
                  // Determine color classes based on SDG color and selection state
                  const colorClasses = selectedSDGs.includes(sdg.value) 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/30 dark:border-green-700'
                    : 'border-gray-200 dark:border-gray-800';
                  
                  const circleColorClasses = selectedSDGs.includes(sdg.value)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700';
                  
                  return (
                    <div 
                      key={sdg.value}
                      className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-colors ${colorClasses}`}
                      onClick={() => toggleSDG(sdg.value)}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${circleColorClasses}`}>
                        {selectedSDGs.includes(sdg.value) && <Check className="h-3 w-3" />}
                      </div>
                      <span>{sdg.label}</span>
                    </div>
                  );
                })}
              </div>
              
              {selectedSDGs.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-medium">Set Improvement Targets</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set realistic improvement targets for each selected SDG to track on your dashboard
                  </p>
                  
                  <div className="space-y-6">
                    {selectedSDGs.map(sdgValue => {
                      const sdg = SDG_OPTIONS.find(s => s.value === sdgValue);
                      return (
                        <div key={sdgValue} className="space-y-2">
                          <div className="flex justify-between mb-1">
                            <Label htmlFor={`target-${sdgValue}`}>
                              {sdg?.label}
                            </Label>
                            <span className="text-sm font-medium">{sdgTargets[sdgValue] || 0}% Improvement Target</span>
                          </div>
                          <Slider
                            id={`target-${sdgValue}`}
                            min={5}
                            max={100}
                            step={5}
                            value={[sdgTargets[sdgValue] || 25]}
                            onValueChange={(values: number[]) => handleSDGTargetChange(sdgValue, values[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Conservative (5%)</span>
                            <span>Ambitious (50%)</span>
                            <span>Industry Leading (100%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md border border-blue-200 dark:border-blue-800 mt-2">
                    <div className="flex items-start gap-3">
                      <BarChart className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 dark:text-blue-300">Target Tracking</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          Your dashboard will include real-time tracking of progress toward these SDG targets,
                          with monthly reports and insights on how to improve.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery & Customer Impact</CardTitle>
            <CardDescription>Configure delivery options and customer sustainability information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Truck className="mr-2 h-5 w-5 text-slate-600" />
                Delivery Options
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure delivery options and their associated emissions
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start justify-between p-4 rounded-md border">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 mt-0.5 text-gray-500" />
                    <div>
                      <h4 className="font-medium">Standard Delivery</h4>
                      <p className="text-sm text-muted-foreground">
                        Regular shipping (5-7 business days)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="standard_emissions" className="text-xs">CO2e/Package (kg)</Label>
                      <Input
                        id="standard_emissions"
                        type="number"
                        className="w-20 h-8"
                        value={deliveryEmissions.standard}
                        onChange={(e) => setDeliveryEmissions({...deliveryEmissions, standard: e.target.value})}
                      />
                    </div>
                    <Button
                      variant={deliveryTypes.standard ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDeliveryTypeToggle('standard')}
                    >
                      {deliveryTypes.standard ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start justify-between p-4 rounded-md border">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 mt-0.5 text-gray-500" />
                    <div>
                      <h4 className="font-medium">Express Delivery</h4>
                      <p className="text-sm text-muted-foreground">
                        Expedited shipping (1-2 business days)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="express_emissions" className="text-xs">CO2e/Package (kg)</Label>
                      <Input
                        id="express_emissions"
                        type="number"
                        className="w-20 h-8"
                        value={deliveryEmissions.express}
                        onChange={(e) => setDeliveryEmissions({...deliveryEmissions, express: e.target.value})}
                      />
                    </div>
                    <Button
                      variant={deliveryTypes.express ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDeliveryTypeToggle('express')}
                    >
                      {deliveryTypes.express ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start justify-between p-4 rounded-md border">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 mt-0.5 text-gray-500" />
                    <div>
                      <h4 className="font-medium">Carbon Neutral Delivery</h4>
                      <p className="text-sm text-muted-foreground">
                        Offset shipping emissions (3-5 business days)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="carbon_neutral_emissions" className="text-xs">CO2e/Package (kg)</Label>
                      <Input
                        id="carbon_neutral_emissions"
                        type="number"
                        className="w-20 h-8"
                        value={deliveryEmissions.carbon_neutral}
                        onChange={(e) => setDeliveryEmissions({...deliveryEmissions, carbon_neutral: e.target.value})}
                      />
                    </div>
                    <Button
                      variant={deliveryTypes.carbon_neutral ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDeliveryTypeToggle('carbon_neutral')}
                    >
                      {deliveryTypes.carbon_neutral ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Switch
                    id="logistics-tracking"
                    checked={dataSources.includes('api') && apiEndpoints.logistics !== ""}
                    onCheckedChange={() => {
                      if (!dataSources.includes('api')) {
                        toggleDataSource('api');
                      }
                      handleApiEndpointChange('logistics', 
                        apiEndpoints.logistics ? "" : "https://api.logistics-provider.com/shipments"
                      );
                    }}
                  />
                  <Label htmlFor="logistics-tracking">
                    Enable real-time tracking of delivery emissions through logistics API
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground ml-7 mb-4">
                  Connect to your shipping provider&apos;s API to automatically calculate and report emissions per shipment
                </p>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-md border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300">Customer Emissions Information</h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Based on your provided data, we&apos;ll automatically calculate and display the emissions saved
                    when customers purchase your products compared to conventional alternatives.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {currentStep === 6 && (
        <Card>
          <CardHeader>
            <CardTitle>Real-Time Dashboard Configuration</CardTitle>
            <CardDescription>Configure your real-time sustainability dashboard and performance benchmarks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <CloudCog className="mr-2 h-5 w-5 text-blue-600" />
                Data Integration Preferences
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure how your sustainability data is collected and updated
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="updateFrequency">Data Update Frequency</Label>
                  <Select value={updateFrequency} onValueChange={setUpdateFrequency}>
                    <SelectTrigger id="updateFrequency">
                      <SelectValue placeholder="Select update frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {UPDATE_FREQUENCY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="block mb-2">Data Sources</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {DATA_SOURCE_OPTIONS.map(source => (
                      <div key={source.value} className="flex items-start space-x-2">
                        <Checkbox 
                          id={`source-${source.value}`}
                          checked={dataSources.includes(source.value)}
                          onCheckedChange={() => toggleDataSource(source.value)}
                          className="mt-1"
                        />
                        <div>
                          <Label htmlFor={`source-${source.value}`} className="font-medium">{source.label}</Label>
                          <p className="text-xs text-muted-foreground">{source.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Users className="mr-2 h-5 w-5 text-indigo-600" />
                Benchmarking Preferences
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Set up benchmarking to compare your performance against industry standards
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <div className="space-y-2">
                  <Label className="block mb-2">Benchmarking Types</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {BENCHMARK_OPTIONS.map(benchmark => (
                      <div key={benchmark.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`benchmark-${benchmark.value}`}
                          checked={benchmarkPreferences.includes(benchmark.value)}
                          onCheckedChange={() => toggleBenchmark(benchmark.value)}
                        />
                        <Label htmlFor={`benchmark-${benchmark.value}`}>{benchmark.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="emissions-target">Emissions Reduction Target</Label>
                      <span className="text-sm font-medium">{targetReductions.emissions}% by 2030</span>
                    </div>
                    <Slider
                      id="emissions-target"
                      min={5}
                      max={100}
                      step={5}
                      value={[targetReductions.emissions]}
                      onValueChange={(values: number[]) => handleTargetChange('emissions', values[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="water-target">Water Conservation Target</Label>
                      <span className="text-sm font-medium">{targetReductions.water}% by 2030</span>
                    </div>
                    <Slider
                      id="water-target"
                      min={5}
                      max={100}
                      step={5}
                      value={[targetReductions.water]}
                      onValueChange={(values: number[]) => handleTargetChange('water', values[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="waste-target">Waste Reduction Target</Label>
                      <span className="text-sm font-medium">{targetReductions.waste}% by 2030</span>
                    </div>
                    <Slider
                      id="waste-target"
                      min={5}
                      max={100}
                      step={5}
                      value={[targetReductions.waste]}
                      onValueChange={(values: number[]) => handleTargetChange('waste', values[0])}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-green-600" />
                Dashboard Display Preferences
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Customize which metrics and visualizations appear on your dashboard
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-emissions"
                      checked={dashboardPreferences.showEmissions}
                      onCheckedChange={() => toggleDashboardPreference('showEmissions')}
                    />
                    <Label htmlFor="show-emissions">Show Emissions Metrics</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-materials"
                      checked={dashboardPreferences.showMaterials}
                      onCheckedChange={() => toggleDashboardPreference('showMaterials')}
                    />
                    <Label htmlFor="show-materials">Show Materials Breakdown</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-sdgs"
                      checked={dashboardPreferences.showSDGs}
                      onCheckedChange={() => toggleDashboardPreference('showSDGs')}
                    />
                    <Label htmlFor="show-sdgs">Show SDG Progress</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-benchmarks"
                      checked={dashboardPreferences.showBenchmarks}
                      onCheckedChange={() => toggleDashboardPreference('showBenchmarks')}
                    />
                    <Label htmlFor="show-benchmarks">Show Industry Benchmarks</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-trends"
                      checked={dashboardPreferences.showTrends}
                      onCheckedChange={() => toggleDashboardPreference('showTrends')}
                    />
                    <Label htmlFor="show-trends">Show Trend Charts</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-predictions"
                      checked={dashboardPreferences.showPredictions}
                      onCheckedChange={() => toggleDashboardPreference('showPredictions')}
                    />
                    <Label htmlFor="show-predictions">Show AI Predictions & Insights</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public-profile"
                      checked={dashboardPreferences.publicProfile}
                      onCheckedChange={() => toggleDashboardPreference('publicProfile')}
                    />
                    <Label htmlFor="public-profile">Create Public Sustainability Profile</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <Repeat className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-300">Real-Time Dashboard</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Your real-time sustainability dashboard will be created based on these preferences.
                    You can modify these settings anytime through the dashboard configuration menu.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dataSources.length > 0 && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                        {dataSources.length} Data Sources
                      </Badge>
                    )}
                    {selectedSDGs.length > 0 && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                        {selectedSDGs.length} SDGs Tracked
                      </Badge>
                    )}
                    {updateFrequency && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                        {UPDATE_FREQUENCY_OPTIONS.find(o => o.value === updateFrequency)?.label} Updates
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext}>
              Complete Setup
              <Check className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 