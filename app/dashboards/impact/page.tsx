"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown, Filter, Download, Leaf, Users, Scale } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis, Tooltip } from "recharts";

// Mock portfolio data
const portfolioCompanies = [
  { 
    id: 1, 
    name: "EcoTech Solutions",
    sector: "Clean Energy",
    investment: 2500000,
    carbonReduction: 1250,
    renewableEnergyUsage: 78,
    diversityScore: 72,
    governanceScore: 85,
    overallScore: 79,
    trend: 5.2
  },
  { 
    id: 2, 
    name: "AquaPure Systems",
    sector: "Water Management",
    investment: 1800000,
    carbonReduction: 850,
    renewableEnergyUsage: 62,
    diversityScore: 68,
    governanceScore: 77,
    overallScore: 69,
    trend: 3.1
  },
  { 
    id: 3, 
    name: "GreenBuild Inc.",
    sector: "Sustainable Construction",
    investment: 3200000,
    carbonReduction: 2100,
    renewableEnergyUsage: 45,
    diversityScore: 81,
    governanceScore: 73,
    overallScore: 65,
    trend: -2.3
  },
  { 
    id: 4, 
    name: "SolarTech Industries",
    sector: "Clean Energy",
    investment: 4100000,
    carbonReduction: 3250,
    renewableEnergyUsage: 91,
    diversityScore: 65,
    governanceScore: 79,
    overallScore: 82,
    trend: 7.8
  },
  { 
    id: 5, 
    name: "EcoHarvest Agriculture",
    sector: "Sustainable Agriculture",
    investment: 1950000,
    carbonReduction: 1050,
    renewableEnergyUsage: 58,
    diversityScore: 75,
    governanceScore: 68,
    overallScore: 67,
    trend: 1.4
  }
];

// Historical impact data for charts
const impactTrendData = [
  { month: 'Jan', emissions: 4850, social: 68, governance: 71 },
  { month: 'Feb', emissions: 4600, social: 70, governance: 72 },
  { month: 'Mar', emissions: 4400, social: 71, governance: 73 },
  { month: 'Apr', emissions: 4100, social: 72, governance: 75 },
  { month: 'May', emissions: 3850, social: 74, governance: 77 },
  { month: 'Jun', emissions: 3500, social: 75, governance: 78 },
];

const chartConfig = {
  emissions: {
    label: 'Carbon Emissions (tons)',
    color: 'hsl(var(--chart-1))',
  },
  social: {
    label: 'Social Score',
    color: 'hsl(var(--chart-2))',
  },
  governance: {
    label: 'Governance Score',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export default function ImpactDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCompanies = portfolioCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || company.sector.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const totalInvestment = portfolioCompanies.reduce((sum, company) => sum + company.investment, 0);
  const totalCarbonReduction = portfolioCompanies.reduce((sum, company) => sum + company.carbonReduction, 0);
  const averageESGScore = Math.round(portfolioCompanies.reduce((sum, company) => sum + company.overallScore, 0) / portfolioCompanies.length);
  
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
          <h1 className="text-3xl font-bold">Impact Investment Portfolio</h1>
          <p className="text-muted-foreground">Track ESG impact across your investments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboards")}>
            Dashboard Selection
          </Button>
          <Button variant="outline" onClick={() => router.push("/report")}>
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalInvestment / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">Across {portfolioCompanies.length} companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Carbon Reduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {totalCarbonReduction.toLocaleString()} tons
              <ArrowDown className="h-4 w-4 ml-2 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">Annual CO2 reduction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average ESG Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {averageESGScore}/100
              <ArrowUp className="h-4 w-4 ml-2 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">Portfolio-wide ESG performance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Impact Trends</CardTitle>
            <CardDescription>6-month trend of key ESG metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig}>
                <AreaChart data={impactTrendData}>
                  <defs>
                    <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartConfig.emissions.color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={chartConfig.emissions.color} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartConfig.social.color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={chartConfig.social.color} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGovernance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartConfig.governance.color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={chartConfig.governance.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-md shadow-md p-2">
                            <p className="font-medium">{payload[0].payload.month}</p>
                            {payload.map((entry, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartConfig[entry.dataKey as keyof typeof chartConfig].color }}></div>
                                <span>{chartConfig[entry.dataKey as keyof typeof chartConfig].label}:</span>
                                <span className="font-medium">{entry.value}</span>
                              </div>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="emissions"
                    stroke={chartConfig.emissions.color}
                    fillOpacity={1}
                    fill="url(#colorEmissions)"
                  />
                  <Area
                    type="monotone"
                    dataKey="social"
                    stroke={chartConfig.social.color}
                    fillOpacity={1}
                    fill="url(#colorSocial)"
                  />
                  <Area
                    type="monotone"
                    dataKey="governance"
                    stroke={chartConfig.governance.color}
                    fillOpacity={1}
                    fill="url(#colorGovernance)"
                  />
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
            <CardTitle>Portfolio Companies</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Search companies..."
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
                  <th className="text-right py-2">
                    <div className="flex items-center justify-end gap-1">
                      <Leaf className="h-4 w-4" />
                      <span>Environmental</span>
                    </div>
                  </th>
                  <th className="text-right py-2">
                    <div className="flex items-center justify-end gap-1">
                      <Users className="h-4 w-4" />
                      <span>Social</span>
                    </div>
                  </th>
                  <th className="text-right py-2">
                    <div className="flex items-center justify-end gap-1">
                      <Scale className="h-4 w-4" />
                      <span>Governance</span>
                    </div>
                  </th>
                  <th className="text-right py-2">Overall Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="border-t hover:bg-muted/30">
                    <td className="py-3">{company.name}</td>
                    <td className="py-3">{company.sector}</td>
                    <td className="text-right py-3">${(company.investment / 1000000).toFixed(2)}M</td>
                    <td className="text-right py-3">{company.renewableEnergyUsage}%</td>
                    <td className="text-right py-3">{company.diversityScore}/100</td>
                    <td className="text-right py-3">{company.governanceScore}/100</td>
                    <td className="text-right py-3">
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-medium">{company.overallScore}</span>
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

      <div className="flex justify-between">
        <Button variant="outline" className="flex gap-2 items-center">
          <Filter className="h-4 w-4" />
          Advanced Filters
        </Button>
        <Button variant="outline" className="flex gap-2 items-center">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>
    </div>
  );
} 