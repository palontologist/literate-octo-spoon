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

// Mock portfolio data
const portfolioCompanies = [
  { 
    id: 1, 
    name: "EcoTech Solutions",
    sector: "Clean Energy",
    investment: 2500000,
    currentValue: 3100000,
    roi: 24,
    annualReturn: 7.8,
    volatility: 15.2,
    esgScore: 79,
    trend: 5.2
  },
  { 
    id: 2, 
    name: "AquaPure Systems",
    sector: "Water Management",
    investment: 1800000,
    currentValue: 2250000,
    roi: 25,
    annualReturn: 8.2,
    volatility: 12.5,
    esgScore: 69,
    trend: 3.1
  },
  { 
    id: 3, 
    name: "GreenBuild Inc.",
    sector: "Sustainable Construction",
    investment: 3200000,
    currentValue: 2880000,
    roi: -10,
    annualReturn: -3.5,
    volatility: 18.7,
    esgScore: 65,
    trend: -2.3
  },
  { 
    id: 4, 
    name: "SolarTech Industries",
    sector: "Clean Energy",
    investment: 4100000,
    currentValue: 5330000,
    roi: 30,
    annualReturn: 9.4,
    volatility: 17.8,
    esgScore: 82,
    trend: 7.8
  },
  { 
    id: 5, 
    name: "EcoHarvest Agriculture",
    sector: "Sustainable Agriculture",
    investment: 1950000,
    currentValue: 2150000,
    roi: 10.2,
    annualReturn: 3.4,
    volatility: 14.2,
    esgScore: 67,
    trend: 1.4
  }
];

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

  useEffect(() => {
    // Load user preferences from localStorage
    const savedPreferences = localStorage.getItem('investorPreferences');
    if (savedPreferences) {
      setUserPreferences(JSON.parse(savedPreferences));
    } else {
      // If no preferences found, redirect to setup page
      router.push('/dashboards/investor/setup');
    }
  }, [router]);

  const filteredCompanies = portfolioCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || company.sector.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const totalInvestment = portfolioCompanies.reduce((sum, company) => sum + company.investment, 0);
  const totalCurrentValue = portfolioCompanies.reduce((sum, company) => sum + company.currentValue, 0);
  const totalROI = ((totalCurrentValue - totalInvestment) / totalInvestment) * 100;
  const weightedReturn = portfolioCompanies.reduce(
    (sum, company) => sum + (company.annualReturn * company.currentValue), 
    0
  ) / totalCurrentValue;

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
    percentage: Math.round((amount / totalInvestment) * 100)
  }));

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
            <div className="text-2xl font-bold">${(totalCurrentValue / 1000000).toFixed(2)}M</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
              +${((totalCurrentValue - totalInvestment) / 1000000).toFixed(2)}M from initial investment
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
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="border-t hover:bg-muted/30">
                    <td className="py-3">{company.name}</td>
                    <td className="py-3">{company.sector}</td>
                    <td className="text-right py-3">${(company.investment / 1000000).toFixed(2)}M</td>
                    <td className="text-right py-3">${(company.currentValue / 1000000).toFixed(2)}M</td>
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