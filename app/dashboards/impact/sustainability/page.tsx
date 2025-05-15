"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Leaf, 
  Droplets, 
  Sun, 
  BatteryCharging, 
  Factory, 
  ShoppingBag, 
  Settings, 
  BarChart2,
  TrendingUp,
  Users,
  Globe
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";
import { SDGMetrics } from "./components";
import SustainableFashionOnboarding from "./onboarding";

// Mock data for solar energy companies
const solarCompanyData = [
  { 
    id: 1, 
    name: "SunPower Solutions",
    productionCapacity: 250, // MW
    co2Avoided: 4250, // tons
    resourceEfficiency: 87, // %
    waterSaved: 12500, // gallons
    communityImpact: 75, // score
    trend: 6.8
  },
  { 
    id: 2, 
    name: "EcoSolar Industries",
    productionCapacity: 180, 
    co2Avoided: 3150, 
    resourceEfficiency: 81, 
    waterSaved: 9200, 
    communityImpact: 68, 
    trend: 4.2
  },
  { 
    id: 3, 
    name: "GreenRay Energy",
    productionCapacity: 320, 
    co2Avoided: 5750, 
    resourceEfficiency: 92, 
    waterSaved: 15800, 
    communityImpact: 82, 
    trend: 7.5
  }
];

// Mock data for sustainable fashion brands
const fashionBrandData = [
  { 
    id: 1, 
    name: "EcoThreads",
    recycledMaterials: 78, // %
    waterSaved: 18500, // gallons
    carbonFootprint: 65, // % reduction
    wasteReduction: 82, // %
    ethicalScore: 88, // score
    trend: 5.3
  },
  { 
    id: 2, 
    name: "GreenStitch Apparel",
    recycledMaterials: 62, 
    waterSaved: 15200, 
    carbonFootprint: 58, 
    wasteReduction: 71, 
    ethicalScore: 84, 
    trend: 3.8
  },
  { 
    id: 3, 
    name: "Sustainable Couture",
    recycledMaterials: 91, 
    waterSaved: 24700, 
    carbonFootprint: 76, 
    wasteReduction: 89, 
    ethicalScore: 92, 
    trend: 8.1
  }
];

// Historical sustainability metrics
const solarTrendData = [
  { month: 'Jan', production: 210, co2Avoided: 3600, waterSaved: 8500 },
  { month: 'Feb', production: 225, co2Avoided: 3850, waterSaved: 9100 },
  { month: 'Mar', production: 240, co2Avoided: 4100, waterSaved: 9700 },
  { month: 'Apr', production: 255, co2Avoided: 4350, waterSaved: 10300 },
  { month: 'May', production: 265, co2Avoided: 4500, waterSaved: 10800 },
  { month: 'Jun', production: 280, co2Avoided: 4750, waterSaved: 11400 },
];

const fashionTrendData = [
  { month: 'Jan', recycledUse: 65, waterSaved: 14200, wasteReduction: 68 },
  { month: 'Feb', recycledUse: 68, waterSaved: 15100, wasteReduction: 70 },
  { month: 'Mar', recycledUse: 70, waterSaved: 16300, wasteReduction: 73 },
  { month: 'Apr', recycledUse: 73, waterSaved: 17500, wasteReduction: 75 },
  { month: 'May', recycledUse: 76, waterSaved: 18700, wasteReduction: 78 },
  { month: 'Jun', recycledUse: 79, waterSaved: 19800, wasteReduction: 81 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Metric type definition
type Metric = {
  id: string;
  name: string;
  key: string;
  unit: string;
  enabled: boolean;
};

// Dashboard metrics configuration
type MetricsConfig = {
  solar: Metric[];
  fashion: Metric[];
};

const AVAILABLE_METRICS: MetricsConfig = {
  solar: [
    { id: "production_capacity", name: "Production Capacity", key: "productionCapacity", unit: "MW", enabled: true },
    { id: "co2_avoided", name: "CO2 Emissions Avoided", key: "co2Avoided", unit: "tons", enabled: true },
    { id: "water_saved", name: "Water Resources Saved", key: "waterSaved", unit: "gallons", enabled: true },
    { id: "resource_efficiency", name: "Resource Efficiency", key: "resourceEfficiency", unit: "%", enabled: true },
    { id: "community_impact", name: "Community Impact", key: "communityImpact", unit: "score", enabled: true }
  ],
  fashion: [
    { id: "recycled_materials", name: "Recycled Materials Usage", key: "recycledMaterials", unit: "%", enabled: true },
    { id: "water_saved", name: "Water Conservation", key: "waterSaved", unit: "gallons", enabled: true },
    { id: "carbon_footprint", name: "Carbon Footprint Reduction", key: "carbonFootprint", unit: "%", enabled: true },
    { id: "waste_reduction", name: "Waste Reduction", key: "wasteReduction", unit: "%", enabled: true },
    { id: "ethical_score", name: "Ethical Score", key: "ethicalScore", unit: "score", enabled: true }
  ]
};

type MetricCategory = keyof typeof AVAILABLE_METRICS;

// Market insight data
const marketInsightData = {
  totalBrands: 428,
  growthRate: 32,
  averageRevenue: 4.2, // in millions
  consumerPreferences: [
    { category: "Recycled Materials", percentage: 68 },
    { category: "Ethical Production", percentage: 62 },
    { category: "Carbon Neutral", percentage: 53 },
    { category: "Water Conservation", percentage: 47 },
    { category: "Waste Reduction", percentage: 41 }
  ],
  marketShare: 12, // percentage of total fashion market
  investmentGrowth: 45, // percentage YoY
  brandSurvival: 78 // percentage that survive 3+ years
};

export default function SustainabilityDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabParam === "fashion" ? "fashion" : "solar");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [metrics, setMetrics] = useState(AVAILABLE_METRICS);
  const [preferredViews, setPreferredViews] = useState({
    showSDGs: true,
    showCharts: true,
    showMarketInsights: true,
    showBrandInsights: true
  });
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Filter companies/brands based on search query
  const filteredSolarCompanies = solarCompanyData.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFashionBrands = fashionBrandData.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals for solar
  const totalSolarCapacity = solarCompanyData.reduce((sum, company) => sum + company.productionCapacity, 0);
  const totalCO2Avoided = solarCompanyData.reduce((sum, company) => sum + company.co2Avoided, 0);
  const totalWaterSaved = solarCompanyData.reduce((sum, company) => sum + company.waterSaved, 0);

  // Calculate totals for fashion
  const avgRecycledMaterials = Math.round(
    fashionBrandData.reduce((sum, brand) => sum + brand.recycledMaterials, 0) / fashionBrandData.length
  );
  const totalFashionWaterSaved = fashionBrandData.reduce((sum, brand) => sum + brand.waterSaved, 0);
  const avgCarbonReduction = Math.round(
    fashionBrandData.reduce((sum, brand) => sum + brand.carbonFootprint, 0) / fashionBrandData.length
  );

  // When tab parameter changes, update the active tab
  useEffect(() => {
    if (tabParam === "fashion") {
      setActiveTab("fashion");
      
      // Check if the user has completed the sustainable fashion onboarding
      if (typeof window !== 'undefined') {
        const hasCompletedFashionOnboarding = localStorage.getItem('sustainableFashionOnboarding');
        
        // If user hasn't completed onboarding, show the onboarding component
        if (!hasCompletedFashionOnboarding) {
          setShowOnboarding(true);
        } else {
          setShowOnboarding(false);
          // If realtime parameter is present, load the brand data from localStorage
          const realtimeParam = searchParams.get('realtime');
          const brandParam = searchParams.get('brand');
          
          if (realtimeParam === 'true' && brandParam) {
            const brandData = localStorage.getItem('sustainableFashionBrandData');
            if (brandData) {
              console.log('Loading brand data for real-time dashboard:', JSON.parse(brandData));
              // Here you would typically populate your state with this data
              // For example: setBrandMetrics(JSON.parse(brandData));
            }
          }
        }
      }
    } else if (tabParam === "solar") {
      setActiveTab("solar");
      setShowOnboarding(false);
    }
  }, [tabParam, searchParams]);

  // Handle tab change with URL update
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/dashboards/impact/sustainability?tab=${value}`);
  };

  // Toggle metric visibility
  const toggleMetric = (category: MetricCategory, id: string) => {
    setMetrics(prevMetrics => {
      const updatedMetrics = { ...prevMetrics };
      const metricIndex = updatedMetrics[category].findIndex(m => m.id === id);
      
      if (metricIndex !== -1) {
        updatedMetrics[category][metricIndex].enabled = !updatedMetrics[category][metricIndex].enabled;
      }
      
      return updatedMetrics;
    });
  };

  // Toggle dashboard view preference
  const toggleViewPreference = (key: keyof typeof preferredViews) => {
    setPreferredViews(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Get active enabled metrics
  const getEnabledMetrics = (category: MetricCategory) => {
    return metrics[category].filter(m => m.enabled);
  };

  // Render the dashboard metrics based on enabled configuration
  const renderMetricsCards = (category: MetricCategory) => {
    const enabledMetrics = getEnabledMetrics(category);
    
    if (category === "solar") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {enabledMetrics.map(metric => {
            // Custom rendering based on metric type
            if (metric.id === "production_capacity") {
              return (
                <Card key={metric.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Production Capacity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalSolarCapacity} MW</div>
                    <p className="text-xs text-muted-foreground">Across {solarCompanyData.length} companies</p>
                  </CardContent>
                </Card>
              );
            } else if (metric.id === "co2_avoided") {
              return (
                <Card key={metric.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      CO2 Emissions Avoided
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center">
                      {totalCO2Avoided.toLocaleString()} tons
                      <ArrowDown className="h-4 w-4 ml-2 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">Annual reduction</p>
                  </CardContent>
                </Card>
              );
            } else if (metric.id === "water_saved") {
              return (
                <Card key={metric.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Water Resources Saved
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center">
                      {totalWaterSaved.toLocaleString()} gallons
                      <ArrowDown className="h-4 w-4 ml-2 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">Compared to traditional energy</p>
                  </CardContent>
                </Card>
              );
            }
            return null;
          })}
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {enabledMetrics.map(metric => {
            // Custom rendering based on metric type
            if (metric.id === "recycled_materials") {
              return (
                <Card key={metric.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Recycled Materials Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{avgRecycledMaterials}%</div>
                    <p className="text-xs text-muted-foreground">Average across {fashionBrandData.length} brands</p>
                    <Progress value={avgRecycledMaterials} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              );
            } else if (metric.id === "water_saved") {
              return (
                <Card key={metric.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Water Conservation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center">
                      {totalFashionWaterSaved.toLocaleString()} gallons
                      <ArrowDown className="h-4 w-4 ml-2 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">Compared to traditional fashion</p>
                  </CardContent>
                </Card>
              );
            } else if (metric.id === "carbon_footprint") {
              return (
                <Card key={metric.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Carbon Footprint Reduction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center">
                      {avgCarbonReduction}%
                      <ArrowDown className="h-4 w-4 ml-2 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">Average reduction across brands</p>
                    <Progress value={avgCarbonReduction} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              );
            }
            return null;
          })}
        </div>
      );
    }
  };

  return (
    <div className="p-8">
      {showOnboarding ? (
        <SustainableFashionOnboarding />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Sustainability Metrics</h1>
              <p className="text-muted-foreground">Track environmental and social impact for sustainable brands</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
                Customize View
              </Button>
              <Button variant="outline" onClick={() => router.push("/dashboards/impact")}>
                Impact Dashboard
              </Button>
              <Button variant="outline" onClick={() => router.push("/report")}>
                Generate Report
              </Button>
            </div>
          </div>

          {showSettings && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Dashboard Preferences</CardTitle>
                <CardDescription>Customize which metrics and views are displayed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Displayed Metrics</h3>
                    <div className="space-y-2">
                      {metrics[activeTab as "solar" | "fashion"].map(metric => (
                        <div key={metric.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={metric.id} 
                            checked={metric.enabled}
                            onCheckedChange={() => toggleMetric(activeTab as MetricCategory, metric.id)}
                          />
                          <Label htmlFor={metric.id}>{metric.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Data Visualization</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="show_charts" 
                          checked={preferredViews.showCharts}
                          onCheckedChange={() => toggleViewPreference('showCharts')}
                        />
                        <Label htmlFor="show_charts">Show Trend Charts</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Additional Components</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="show_sdgs" 
                          checked={preferredViews.showSDGs}
                          onCheckedChange={() => toggleViewPreference('showSDGs')}
                        />
                        <Label htmlFor="show_sdgs">Show SDG Metrics</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="show_market_insights" 
                          checked={preferredViews.showMarketInsights}
                          onCheckedChange={() => toggleViewPreference('showMarketInsights')}
                        />
                        <Label htmlFor="show_market_insights">Show Market Insights</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="show_brand_insights" 
                          checked={preferredViews.showBrandInsights}
                          onCheckedChange={() => toggleViewPreference('showBrandInsights')}
                        />
                        <Label htmlFor="show_brand_insights">Show Brand Insights</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="solar" className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Solar Energy
              </TabsTrigger>
              <TabsTrigger value="fashion" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Sustainable Fashion
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "solar" ? (
            <>
              {renderMetricsCards("solar")}

              {preferredViews.showCharts && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Production & Impact Trends</CardTitle>
                      <CardDescription>6-month trend of key solar metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={solarTrendData}>
                            <defs>
                              <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                            <YAxis stroke="#888888" fontSize={12} />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="production"
                              name="Production (MW)"
                              stroke="#8884d8"
                              fillOpacity={1}
                              fill="url(#colorProduction)"
                            />
                            <Area
                              type="monotone"
                              dataKey="co2Avoided"
                              name="CO2 Avoided (tons)"
                              stroke="#82ca9d"
                              fillOpacity={1}
                              fill="url(#colorCO2)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Resource Efficiency</CardTitle>
                      <CardDescription>Performance across companies</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={solarCompanyData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                            <YAxis stroke="#888888" fontSize={12} />
                            <Tooltip />
                            <Bar dataKey="resourceEfficiency" name="Resource Efficiency (%)" fill="#8884d8" />
                            <Bar dataKey="communityImpact" name="Community Impact Score" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Solar Energy Companies</CardTitle>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-[200px]"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left py-2">Company</th>
                          <th className="text-right py-2">
                            <div className="flex items-center justify-end gap-1">
                              <Sun className="h-4 w-4" />
                              <span>Capacity (MW)</span>
                            </div>
                          </th>
                          <th className="text-right py-2">
                            <div className="flex items-center justify-end gap-1">
                              <Leaf className="h-4 w-4" />
                              <span>CO2 Avoided</span>
                            </div>
                          </th>
                          <th className="text-right py-2">
                            <div className="flex items-center justify-end gap-1">
                              <Droplets className="h-4 w-4" />
                              <span>Water Saved</span>
                            </div>
                          </th>
                          <th className="text-right py-2">
                            <div className="flex items-center justify-end gap-1">
                              <BatteryCharging className="h-4 w-4" />
                              <span>Efficiency</span>
                            </div>
                          </th>
                          <th className="text-right py-2">Community Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSolarCompanies.map((company) => (
                          <tr key={company.id} className="border-t hover:bg-muted/30">
                            <td className="py-3">{company.name}</td>
                            <td className="text-right py-3">{company.productionCapacity} MW</td>
                            <td className="text-right py-3">{company.co2Avoided.toLocaleString()} tons</td>
                            <td className="text-right py-3">{company.waterSaved.toLocaleString()} gallons</td>
                            <td className="text-right py-3">{company.resourceEfficiency}%</td>
                            <td className="text-right py-3">
                              <div className="flex items-center justify-end gap-1">
                                <span className="font-medium">{company.communityImpact}/100</span>
                                {company.trend > 0 ? (
                                  <ArrowUp className="h-4 w-4 text-green-500" />
                                ) : (
                                  <ArrowDown className="h-4 w-4 text-red-500" />
                                )}
                                <span className={company.trend > 0 ? "text-green-500" : "text-red-500"}>
                                  {Math.abs(company.trend)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {renderMetricsCards("fashion")}

              {preferredViews.showMarketInsights && (
                <div className="mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <BarChart2 className="h-5 w-5 text-blue-500" />
                        Sustainable Fashion Market Insights
                      </CardTitle>
                      <CardDescription>Industry trends and consumer preferences for sustainability-focused brands</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-center">
                              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{marketInsightData.totalBrands}</h3>
                              <p className="text-sm text-blue-600 dark:text-blue-500">Sustainable Brands</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg text-center">
                              <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">+{marketInsightData.growthRate}%</h3>
                              <p className="text-sm text-green-600 dark:text-green-500">Annual Growth</p>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg text-center">
                              <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-400">${marketInsightData.averageRevenue}M</h3>
                              <p className="text-sm text-amber-600 dark:text-amber-500">Avg Revenue</p>
                            </div>
                          </div>

                          <div className="pt-4">
                            <h4 className="font-medium mb-2">Success Metrics</h4>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Market Share of Sustainable Fashion</span>
                                  <span className="font-medium">{marketInsightData.marketShare}%</span>
                                </div>
                                <Progress value={marketInsightData.marketShare} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Investment Growth YoY</span>
                                  <span className="font-medium">{marketInsightData.investmentGrowth}%</span>
                                </div>
                                <Progress value={marketInsightData.investmentGrowth} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Brand Survival Rate (3+ years)</span>
                                  <span className="font-medium">{marketInsightData.brandSurvival}%</span>
                                </div>
                                <Progress value={marketInsightData.brandSurvival} className="h-2" />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-4">Consumer Preferences</h4>
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                layout="vertical"
                                data={marketInsightData.consumerPreferences}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="category" type="category" width={150} />
                                <Tooltip formatter={(value) => [`${value}%`, 'Consumers Prioritizing']} />
                                <Bar dataKey="percentage" fill="#8884d8" radius={[0, 4, 4, 0]}>
                                  {marketInsightData.consumerPreferences.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex items-center justify-end mt-2 text-sm text-muted-foreground">
                            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                            <span>Based on survey of 2,500 consumers in Q2 2023</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {preferredViews.showBrandInsights && (
                <div className="mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-indigo-500" />
                        Sustainability Brand Owner Insights
                      </CardTitle>
                      <CardDescription>Key insights for sustainable fashion brand owners</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-medium">Consumer Engagement Insights</h4>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                              <h5 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Top Conversion Drivers</h5>
                              <ul className="space-y-2 text-sm">
                                <li className="flex justify-between">
                                  <span>Transparent Supply Chain</span>
                                  <span className="font-medium">84%</span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Carbon Footprint Labeling</span>
                                  <span className="font-medium">72%</span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Recycling Programs</span>
                                  <span className="font-medium">68%</span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Ethical Labor Certification</span>
                                  <span className="font-medium">65%</span>
                                </li>
                              </ul>
                            </div>
                            
                            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                              <h5 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Customer Loyalty Factors</h5>
                              <ul className="space-y-2 text-sm">
                                <li className="flex justify-between">
                                  <span>Brand Values Alignment</span>
                                  <span className="font-medium">76%</span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Product Quality & Durability</span>
                                  <span className="font-medium">89%</span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Sustainability Innovation</span>
                                  <span className="font-medium">64%</span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Transparent Impact Reporting</span>
                                  <span className="font-medium">72%</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-medium">Market Positioning</h4>
                          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                            <h5 className="font-medium text-green-700 dark:text-green-300 mb-2">Best Performing Categories</h5>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Activewear</span>
                                  <span className="font-medium">78% YoY growth</span>
                                </div>
                                <Progress value={78} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Everyday Essentials</span>
                                  <span className="font-medium">65% YoY growth</span>
                                </div>
                                <Progress value={65} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Outdoor Apparel</span>
                                  <span className="font-medium">59% YoY growth</span>
                                </div>
                                <Progress value={59} className="h-2" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                            <h5 className="font-medium text-amber-700 dark:text-amber-300 mb-2">Regional Market Penetration</h5>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-amber-600" />
                                <span>North America:</span>
                                <span className="font-medium">42%</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-amber-600" />
                                <span>Europe:</span>
                                <span className="font-medium">38%</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-amber-600" />
                                <span>Asia Pacific:</span>
                                <span className="font-medium">15%</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-amber-600" />
                                <span>Rest of World:</span>
                                <span className="font-medium">5%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {preferredViews.showCharts && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sustainability Trends</CardTitle>
                      <CardDescription>6-month trend of key fashion metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={fashionTrendData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                            <YAxis stroke="#888888" fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="recycledUse" name="Recycled Materials (%)" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="wasteReduction" name="Waste Reduction (%)" stroke="#82ca9d" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Material Composition</CardTitle>
                      <CardDescription>Breakdown of sustainable materials used</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Organic Cotton', value: 35 },
                                { name: 'Recycled Polyester', value: 25 },
                                { name: 'Hemp', value: 15 },
                                { name: 'Tencel/Lyocell', value: 15 },
                                { name: 'Other Sustainable', value: 10 }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {[
                                { name: 'Organic Cotton', value: 35 },
                                { name: 'Recycled Polyester', value: 25 },
                                { name: 'Hemp', value: 15 },
                                { name: 'Tencel/Lyocell', value: 15 },
                                { name: 'Other Sustainable', value: 10 }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {preferredViews.showSDGs && (
                <div className="mb-8">
                  <SDGMetrics />
                </div>
              )}

              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Fashion Brands</CardTitle>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search brands..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-[200px]"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left py-2">Brand</th>
                          <th className="text-right py-2">
                            <div className="flex items-center justify-end gap-1">
                              <Factory className="h-4 w-4" />
                              <span>Recycled Materials</span>
                            </div>
                          </th>
                          <th className="text-right py-2">
                            <div className="flex items-center justify-end gap-1">
                              <Droplets className="h-4 w-4" />
                              <span>Water Saved</span>
                            </div>
                          </th>
                          <th className="text-right py-2">
                            <div className="flex items-center justify-end gap-1">
                              <Leaf className="h-4 w-4" />
                              <span>Carbon Reduction</span>
                            </div>
                          </th>
                          <th className="text-right py-2">Waste Reduction</th>
                          <th className="text-right py-2">Ethical Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFashionBrands.map((brand) => (
                          <tr key={brand.id} className="border-t hover:bg-muted/30">
                            <td className="py-3">{brand.name}</td>
                            <td className="text-right py-3">{brand.recycledMaterials}%</td>
                            <td className="text-right py-3">{brand.waterSaved.toLocaleString()} gallons</td>
                            <td className="text-right py-3">{brand.carbonFootprint}%</td>
                            <td className="text-right py-3">{brand.wasteReduction}%</td>
                            <td className="text-right py-3">
                              <div className="flex items-center justify-end gap-1">
                                <span className="font-medium">{brand.ethicalScore}/100</span>
                                {brand.trend > 0 ? (
                                  <ArrowUp className="h-4 w-4 text-green-500" />
                                ) : (
                                  <ArrowDown className="h-4 w-4 text-red-500" />
                                )}
                                <span className={brand.trend > 0 ? "text-green-500" : "text-red-500"}>
                                  {Math.abs(brand.trend)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Select defaultValue="month">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Checkbox id="compare" />
              <Label htmlFor="compare" className="ml-1">Compare Multiple Brands</Label>
            </div>
            <Button variant="outline" className="flex gap-2 items-center">
              <Download className="h-4 w-4" />
              Export Metrics
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 