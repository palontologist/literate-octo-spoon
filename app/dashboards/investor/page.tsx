"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown, Filter, Download, DollarSign, TrendingUp, BarChart3, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";

// Historical financial data for charts
const financialTrendData = [
  { month: 'Jan', value: 12800000, return: 5.2, risk: 15.4 },
  { month: 'Feb', value: 13100000, return: 5.8, risk: 15.2 },
  { month: 'Mar', value: 12900000, return: 5.1, risk: 15.8 },
  { month: 'Apr', value: 13500000, return: 5.7, risk: 14.9 },
  { month: 'May', value: 14200000, return: 6.2, risk: 14.5 },
  { month: 'Jun', value: 15300000, return: 7.3, risk: 14.8 },
];

const chartConfig = {
  value: {
    label: 'Portfolio Value ($)',
    color: 'hsl(var(--chart-1))',
  },
  return: {
    label: 'Annual Return (%)',
    color: 'hsl(var(--chart-2))',
  },
  risk: {
    label: 'Risk Score',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export default function InvestorDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userPreferences, setUserPreferences] = useState<{
    investorName: string;
    organization: string;
    selectedSDGs: number[];
    selectedTopics: string[];
    preferredFrameworks: string[];
    riskTolerance: string;
    financialReturnExpectation: string;
    timeHorizon: string;
  } | null>(null);
  
  interface PortfolioCompany {
    id: number;
    name: string;
    sector: string;
    investment: number;
    currentValue: number;
    roi: number;
    annualReturn: number;
    volatility: number;
    esgScore: number;
    trend: string | number;
    sdgs: number[];
    impactTopics: string[];
    impactMetrics?: Array<{id: string, value: string, unit: string}>;
  }
  
  const [portfolioCompanies, setPortfolioCompanies] = useState<PortfolioCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user preferences and investments from localStorage
    const savedPreferences = localStorage.getItem('investorPreferences');
    const savedInvestments = localStorage.getItem('investorInvestments');
    
    if (savedPreferences) {
      setUserPreferences(JSON.parse(savedPreferences));
    } else {
      // If no preferences found, redirect to setup page
      router.push('/dashboards/investor/setup');
    }
    
    if (savedInvestments) {
      const investments = JSON.parse(savedInvestments);
      
      // Transform investments to match the portfolioCompanies structure
      const transformedInvestments = investments.map((investment: {
        id: number;
        companyName: string;
        sector: string;
        investmentAmount: string;
        expectedReturn: string;
        risk: string;
        sdgs: number[];
        impactTopics: string[];
        impactMetrics?: Array<{id: string, value: string, unit: string}>;
      }) => {
        // Convert string values to numbers safely
        const investmentAmount = parseFloat(investment.investmentAmount) || 0;
        const expectedReturn = parseFloat(investment.expectedReturn) || 0;
        
        return {
          id: investment.id,
          name: investment.companyName,
          sector: investment.sector,
          investment: investmentAmount,
          currentValue: calculateCurrentValue(investmentAmount, expectedReturn),
          roi: expectedReturn,
          annualReturn: expectedReturn / 2, // Simplified for demo
          volatility: investment.risk === 'high' ? 20 : investment.risk === 'medium' ? 15 : 10,
          esgScore: 65 + Math.floor(Math.random() * 20), // Random ESG score between 65-85
          trend: (Math.random() * 10 - 3).toFixed(1), // Random trend between -3 and +7
          sdgs: investment.sdgs || [],
          impactTopics: investment.impactTopics || [],
          impactMetrics: investment.impactMetrics || []
        };
      });
      
      setPortfolioCompanies(transformedInvestments);
    }
    
    setIsLoading(false);
  }, [router]);
  
  // Helper function to calculate current value based on investment amount and return
  const calculateCurrentValue = (investment: number, expectedReturn: number) => {
    return investment * (1 + (expectedReturn / 100));
  };

  // Calculate total impact metrics across all investments
  const calculateImpactTotals = () => {
    const totals: Record<string, {value: number, unit: string}> = {};
    
    portfolioCompanies.forEach(company => {
      if (company.impactMetrics) {
        company.impactMetrics.forEach(metric => {
          if (metric.value) {
            const numericValue = parseFloat(metric.value);
            if (!isNaN(numericValue)) {
              if (!totals[metric.id]) {
                totals[metric.id] = { value: 0, unit: metric.unit };
              }
              totals[metric.id].value += numericValue;
            }
          }
        });
      }
    });
    
    return totals;
  };
  
  const impactTotals = calculateImpactTotals();
  
  // Helper function to get metric name
  const getMetricName = (metricId: string) => {
    // This utility function helps display the user-friendly name for a metric ID
    const allMetrics = [
      { id: "students_reached", name: "Students Reached" },
      { id: "patients_treated", name: "Patients Treated" },
      { id: "renewable_capacity", name: "Renewable Energy Capacity" },
      { id: "emissions_avoided", name: "CO2 Emissions Avoided" },
      { id: "housing_units", name: "Housing Units Created" },
      { id: "people_housed", name: "People Housed" },
      { id: "clean_water_access", name: "Clean Water Access" },
      { id: "farmers_supported", name: "Farmers Supported" },
      { id: "poverty_reduction", name: "People Lifted from Poverty" },
      { id: "financial_literacy", name: "Financial Literacy" }
    ];
    
    const metric = allMetrics.find(m => m.id === metricId);
    return metric ? metric.name : metricId;
  };

  const filteredCompanies = portfolioCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || company.sector.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSDGs = userPreferences && userPreferences.selectedSDGs.length > 0 ? 
                      company.sdgs.some((sdg: number) => userPreferences.selectedSDGs.includes(sdg)) : true;
    const matchesTopics = userPreferences && userPreferences.selectedTopics.length > 0 ? 
                      company.impactTopics.some((topic: string) => userPreferences.selectedTopics.includes(topic)) : true;
    return matchesSearch && matchesCategory && matchesSDGs && matchesTopics;
  });

  const totalInvestment = portfolioCompanies.reduce((sum, company) => sum + company.investment, 0);
  const totalCurrentValue = portfolioCompanies.reduce((sum, company) => sum + company.currentValue, 0);
  const totalROI = totalInvestment > 0 ? ((totalCurrentValue - totalInvestment) / totalInvestment) * 100 : 0;
  const weightedReturn = totalCurrentValue > 0 ? 
    portfolioCompanies.reduce((sum, company) => sum + (company.annualReturn * company.currentValue), 0) / totalCurrentValue : 0;

  const sectorDistribution = portfolioCompanies.reduce((acc, company) => {
    if (!acc[company.sector]) {
      acc[company.sector] = 0;
    }
    acc[company.sector] += company.investment;
    return acc;
  }, {} as Record<string, number>);

  const sectorChartData = Object.entries(sectorDistribution).map(([sector, amount]) => ({
    sector,
    amount,
    percentage: totalInvestment > 0 ? Math.round((amount / totalInvestment) * 100) : 0
  }));

  if (isLoading) {
    return <div className="p-8 text-center">Loading your investment portfolio...</div>;
  }

  if (portfolioCompanies.length === 0) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Investment Portfolio</h1>
            <p className="text-muted-foreground">
              {userPreferences ? 
                `Welcome, ${userPreferences.investorName}` :
                'Your impact investment portfolio'
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.push("/dashboards/investor/investments")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Investments
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboards")}>
              Dashboard Selection
            </Button>
          </div>
        </div>
        
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No investments found</h2>
          <p className="text-muted-foreground mb-6">Start building your impact portfolio by adding your first investment</p>
          <Button 
            onClick={() => router.push("/dashboards/investor/investments")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Investment
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Investment Portfolio Performance</h1>
          <p className="text-muted-foreground">
            {userPreferences ? 
              `Customized dashboard for ${userPreferences.investorName}` :
              'Financial performance of your impact investments'
            }
          </p>
          {userPreferences && userPreferences.selectedSDGs.length > 0 && (
            <div className="flex gap-2 mt-2">
              {userPreferences.selectedSDGs.map(sdgId => (
                <Badge key={sdgId} variant="secondary">
                  SDG {sdgId}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push("/dashboards/investor/investments")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Manage Investments
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboards")}>
            Dashboard Selection
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboards/investor/setup")}>
            Update Preferences
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Portfolio Value
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalCurrentValue / 1000).toFixed(2)}K</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
              +${((totalCurrentValue - totalInvestment) / 1000).toFixed(2)}K from initial investment
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total ROI
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {totalROI.toFixed(2)}%
              <ArrowUp className="h-4 w-4 ml-2 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">Since initial investment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Annual Return
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {weightedReturn.toFixed(2)}%
              <ArrowUp className="h-4 w-4 ml-2 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">Weighted average</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Impact Metrics Summary */}
      {Object.keys(impactTotals).length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Portfolio Impact Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(impactTotals).map(([metricId, data]) => (
              <Card key={metricId}>
                <CardContent className="pt-6">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    {getMetricName(metricId)}
                  </div>
                  <div className="text-2xl font-bold">
                    {data.value.toLocaleString()} <span className="text-sm">{data.unit}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            These metrics represent the combined impact across your investments.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>6-month trend of portfolio value and returns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <AreaChart data={financialTrendData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartConfig.value.color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={chartConfig.value.color} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartConfig.return.color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={chartConfig.return.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#888888" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="value"
                    stroke={chartConfig.value.color}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    name="Portfolio Value"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="return"
                    stroke={chartConfig.return.color}
                    fillOpacity={1}
                    fill="url(#colorReturn)"
                    name="Return %"
                  />
                  <Legend />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investment by Sector</CardTitle>
            <CardDescription>Portfolio allocation across impact sectors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart width={500} height={300} data={sectorChartData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="sector" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Legend />
                <Bar dataKey="amount" name="Investment Amount ($)" fill="hsl(var(--chart-1))" />
              </BarChart>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Investment Performance</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Search investments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-[200px]"
              />
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="all">All Sectors</TabsTrigger>
                  <TabsTrigger value="clean">Clean Energy</TabsTrigger>
                  <TabsTrigger value="water">Water</TabsTrigger>
                  <TabsTrigger value="agri">Agriculture</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2">Company</th>
                  <th className="text-left py-2">Sector</th>
                  <th className="text-right py-2">Investment</th>
                  <th className="text-right py-2">Current Value</th>
                  <th className="text-right py-2">ROI</th>
                  <th className="text-right py-2">Annual Return</th>
                  <th className="text-right py-2">Volatility</th>
                  <th className="text-right py-2">ESG Score</th>
                  <th className="text-right py-2">Impact</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="border-t hover:bg-muted/30">
                    <td className="py-3">{company.name}</td>
                    <td className="py-3">{company.sector}</td>
                    <td className="text-right py-3">${(company.investment / 1000).toFixed(2)}K</td>
                    <td className="text-right py-3">${(company.currentValue / 1000).toFixed(2)}K</td>
                    <td className="text-right py-3">
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-medium">{company.roi}%</span>
                        {company.roi > 0 ? (
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="text-right py-3">
                      <span className={company.annualReturn > 0 ? "text-green-500" : "text-red-500"}>
                        {company.annualReturn}%
                      </span>
                    </td>
                    <td className="text-right py-3">{company.volatility}%</td>
                    <td className="text-right py-3">{company.esgScore}/100</td>
                    <td className="text-right py-3">
                      {company.impactMetrics && company.impactMetrics.length > 0 ? (
                        <div className="flex justify-end">
                          <Badge variant="outline" className="cursor-pointer hover:bg-secondary group relative">
                            {company.impactMetrics.filter(m => m.value).length} metrics
                            <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-popover rounded-md shadow-md border z-50 hidden group-hover:block">
                              <h4 className="text-sm font-medium mb-1">Impact Metrics</h4>
                              {company.impactMetrics
                                .filter(metric => metric.value)
                                .map(metric => (
                                  <div key={metric.id} className="flex justify-between text-xs py-1">
                                    <span>{getMetricName(metric.id)}:</span>
                                    <span className="font-medium">{metric.value} {metric.unit}</span>
                                  </div>
                                ))
                              }
                            </div>
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" className="flex gap-2 items-center">
          <Filter className="h-4 w-4" />
          Performance Analysis
        </Button>
        <Button variant="outline" className="flex gap-2 items-center">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>
    </div>
  );
} 