"use client";
import { ArrowUp, ArrowDown, Leaf, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, PieChart,  CartesianGrid, XAxis, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data - replace with API calls
const chartData = [
  { month: 'Jan', production: 12000, emissions: 10500 },
  { month: 'Feb', production: 11500, emissions: 9800 },
  { month: 'Mar', production: 13000, emissions: 9200 },
  { month: 'Apr', production: 12500, emissions: 8900 },
  { month: 'May', production: 14000, emissions: 8500 },
  { month: 'Jun', production: 13500, emissions: 8100 },
];

const socialData = {
  diversity: {
    gender: 42, // % women
    ethnicity: 28, // % underrepresented
  },
  training: {
    antiCorruption: 72, // %
    ethics: 85,
  },
};

const metricCategories = {
  overview: [
    'Carbon Intensity', 
    'Renewable Energy',
    'Board Diversity',
    'Anti-Corruption Training',
    'ISSB Compliance Score'
  ],
  environmental: [
    'Financed Emissions',
    'Green Financing Ratio',
    'Climate Risk Exposure',
    'Renewable Energy Usage'
  ],
  social: [
    'Financial Inclusion',
    'Gender Pay Gap', 
    'Employee Training Hours',
    'Community Investment',
    'Stakeholder Engagement'
  ],
  governance: [
    'Board Diversity',
    'Anti-Corruption Training',
    'Whistleblower Cases',
    'Executive Pay Ratio',
    'Data Quality Score',
    'Tax Transparency',
    'Human Rights Due Diligence'
  ],
  issb: [
    'Scenario Analysis Compliance',
    'Climate Vulnerability',
    'Transition Plan Progress',
    'ISSB Compliance Score'
  ]
};

const metricDetails = {
  // Add overview metrics
  'Carbon Intensity': {
    standard: 'ISSB',
    source: 'Energy Reports',
    description: 'CO2 emissions per revenue dollar',
    currentValue: '0.45 tCO2e/$',
    target: '0.35 tCO2e/$ by 2025'
  },
  'Renewable Energy': {
    standard: 'GRI 302',
    source: 'Utility Bills',
    description: 'Percentage of renewable energy usage',
    currentValue: '42%',
    target: '60% by 2025'
  },
  'Board Diversity': {
    standard: 'SASB',
    source: 'HR Records',
    description: 'Percentage of diverse board members',
    currentValue: '35%',
    target: '40% by 2024'
  },
  'Anti-Corruption Training': {
    standard: 'ISO 37001',
    source: 'Training Records',
    description: 'Employees trained in anti-corruption',
    currentValue: '72%',
    target: '100% by 2025'
  },
  'ISSB Compliance Score': {
    standard: 'ISSB',
    source: 'Audit Reports',
    description: 'Compliance with disclosure requirements',
    currentValue: '85%',
    target: '100% by 2024'
  },
  // Environmental
  'Financed Emissions': {
    standard: 'ISSB',
    source: 'Loan Portfolios',
    description: 'CO2 equivalent emissions per $M investment',
    currentValue: '2.1 tCO2e/$M',
    target: '1.8 tCO2e/$M by 2025'
  },
  'Green Financing Ratio': {
    standard: 'SASB',
    source: 'Product Mix',
    description: 'Percentage of sustainable loans in portfolio',
    currentValue: '28%',
    target: '35% by 2026'
  },
  'Climate Risk Exposure': {
    standard: 'ISSB',
    source: 'Risk Assessment',
    description: 'Assets in high-risk climate zones',
    currentValue: '18%',
    target: '10% by 2030'
  },
  'Renewable Energy Usage': {
    standard: 'GRI 302',
    source: 'Energy Reports',
    description: 'Percentage of renewable energy consumption',
    currentValue: '42%',
    target: '60% by 2025'
  },

  // Social
  'Financial Inclusion': {
    standard: 'GRI 203',
    source: 'Customer Data',
    description: 'Loans to underserved communities',
    currentValue: '18%',
    target: '25% by 2025'
  },
  'Gender Pay Gap': {
    standard: 'GRI 405',
    source: 'HR Records',
    description: 'Female to male compensation ratio',
    currentValue: '0.87',
    target: '0.95 by 2026'
  },
  'Employee Training Hours': {
    standard: 'SASB',
    source: 'HR Systems',
    description: 'Annual training hours per employee',
    currentValue: '32',
    target: '40 by 2024'
  },

  // Governance
  'Data Quality Score': {
    standard: 'GRI 101',
    source: 'System Logs',
    description: 'Automated data collection accuracy',
    currentValue: '92%',
    target: '95% by Q4'
  },
  'Tax Transparency': {
    standard: 'GRI 207',
    source: 'Financial Systems',
    description: 'Country-by-country reporting compliance',
    currentValue: '78%',
    target: '100% by 2025'
  },
  'Climate Vulnerability': {
    standard: 'ISSB',
    source: 'Geospatial Data',
    description: 'Assets exposed to climate risks',
    currentValue: '22%',
    target: '<15% by 2030'
  }
};

const chartConfig = {
  production: {
    label: 'Production',
    color: 'hsl(var(--chart-1))',
  },
  emissions: {
    label: 'Emissions',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [initialData, setInitialData] = useState<{
    environmental: {
      financedEmissions: number;
      greenFinancingRatio: number;
      climateRisk: number;
      renewableEnergy: number;
    };
    social: {
      financialInclusion: number;
      genderPayGap: number;
      trainingHours: number;
    };
    governance: {
      boardDiversity: number;
      antiCorruption: number;
      dataQuality: number;
      taxTransparency: number;
    };
    issb: {
      climateVulnerability: number;
      complianceScore: number;
    };
  } | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<keyof typeof metricCategories>('overview');

  // AI Recommendations
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');

  const [chartData, setChartData] = useState([
    { 
      month: 'Jan', 
      production: initialData?.environmental.production || 12000,
      emissions: initialData?.environmental.emissions || 10500
    },
    { month: 'Feb', production: 11500, emissions: 9800 },
    { month: 'Mar', production: 13000, emissions: 9200 },
    { month: 'Apr', production: 12500, emissions: 8900 },
    { month: 'May', production: 14000, emissions: 8500 },
    { month: 'Jun', production: 13500, emissions: 8100 },
  ]);

  const [socialData, setSocialData] = useState({
    diversity: { 
      gender: initialData?.social.gender || 42,
      ethnicity: initialData?.social.ethnicity || 28 
    },
    training: { antiCorruption: 72, ethics: 85 },
  });

  // Add input visibility state
  const [activeFormCategory, setActiveFormCategory] = useState<null | keyof typeof metricCategories>(null);

  // Load initial data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('dashboardData');
    if (savedData) {
      setInitialData(JSON.parse(savedData));
      setOnboardingComplete(true);
    }
  }, []);

  useEffect(() => {
    // Generate AI recommendations based on data
    const generateRecommendations = () => {
        const recs = [];
      if (chartData[0].emissions < 10000) {
        recs.push("Increase renewable energy investment to meet 40% target");
      }
      if (socialData.training.antiCorruption < 80) {
        recs.push("Implement mandatory anti-corruption training for all employees");
      }
      setRecommendations(recs);
    };
    
    generateRecommendations();
  }, []);

  const filteredMetrics = metricCategories[selectedCategory as keyof typeof metricCategories]
    .filter(metric => metric.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleTabChange = (value: string) => {
    if (value in metricCategories) {
      setSelectedCategory(value as keyof typeof metricCategories);
    }
  };

  // Add onboarding form component before main return
  if (!onboardingComplete) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Initial Setup</CardTitle>
            <p className="text-muted-foreground">Provide initial metrics data</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newData = {
                environmental: {
                  production: Number(formData.get('production')),
                  emissions: Number(formData.get('emissions'))
                },
                social: {
                  gender: Number(formData.get('gender')),
                  ethnicity: Number(formData.get('ethnicity'))
                },
                governance: {
                  dataQuality: Number(formData.get('dataQuality')),
                  taxTransparency: Number(formData.get('taxTransparency'))
                },
                issb: {
                  climateVulnerability: Number(formData.get('climateVulnerability'))
                }
              };
              
              localStorage.setItem('dashboardData', JSON.stringify(newData));
              setInitialData(newData);
              setOnboardingComplete(true);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Initial Production (tons)</label>
                  <Input name="production" type="number" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Initial Emissions (CO2e)</label>
                  <Input name="emissions" type="number" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">% Women in Workforce</label>
                  <Input name="gender" type="number" min="0" max="100" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">% Underrepresented Groups</label>
                  <Input name="ethnicity" type="number" min="0" max="100" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data Quality Score</label>
                  <Input name="dataQuality" type="number" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tax Transparency</label>
                  <Input name="taxTransparency" type="number" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Climate Vulnerability</label>
                  <Input name="climateVulnerability" type="number" required />
                </div>
                <Button type="submit" className="w-full">Initialize Dashboard</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      <Tabs value={selectedCategory} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-5 w-full relative">
          {Object.keys(metricCategories).map((category) => (
            <div key={category} className="relative">
              <TabsTrigger value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
                <div className="ml-2 w-2 h-2 rounded-full" 
                     style={{ backgroundColor: `var(--${category}-color)` }} />
              </TabsTrigger>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute -top-3 -right-3 p-1 h-6 w-6" 
                onClick={() => setActiveFormCategory(category as keyof typeof metricCategories)}
              >
                +
              </Button>
            </div>
          ))}
        </TabsList>

        <div className="pt-6">
          <TabsContent value={selectedCategory}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMetrics.map((metric) => {
                const details = metricDetails[metric as keyof typeof metricDetails];
                return details ? (
                  <MetricDetailCard
                    key={metric}
                    title={metric}
                    {...details}
                  />
                ) : (
                  <MetricCard
                    key={metric}
                    title={metric}
                    value="N/A"
                    trend={0}
                    icon={<Leaf className="h-6 w-6" />}
                  />
                );
              })}
              <MetricCard
                title="Sample Metric"
                value="85%"
                trend={5}
                icon={<Leaf className="h-6 w-6" />}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Environmental Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Social & Governance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Diversity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <PieChart
                width={300}
                height={300}
                data={[
                  { name: 'Women', value: socialData.diversity.gender },
                  { name: 'Men', value: 100 - socialData.diversity.gender },
                ]}
              >
                <Legend layout="horizontal" verticalAlign="bottom" />
              </PieChart>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProgressBar 
                label="ISSB Requirements Met" 
                value={85} 
                target={100}
              />
              <ProgressBar
                label="Anti-Corruption Training"
                value={socialData.training.antiCorruption}
                target={100}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle>AI-Powered Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {activeFormCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Input {activeFormCategory} Data</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              // Update corresponding state based on category
              if (activeFormCategory === 'environmental') {
                setChartData([...chartData, {
                  month: formData.get('month') as string,
                  production: Number(formData.get('production')),
                  emissions: Number(formData.get('emissions'))
                }]);
                // Update environmental metrics
                setInitialData(prev => ({
                  ...prev!,
                  environmental: {
                    ...prev!.environmental,
                    financedEmissions: Number(formData.get('financedEmissions')),
                    greenFinancingRatio: Number(formData.get('greenFinancingRatio'))
                  }
                }));
              } else if (activeFormCategory === 'social') {
                setSocialData({
                  ...socialData,
                  diversity: {
                    gender: Number(formData.get('gender')),
                    ethnicity: Number(formData.get('ethnicity'))
                  }
                });
              } else if (activeFormCategory === 'governance') {
                setInitialData(prev => ({
                  ...prev!,
                  governance: {
                    ...prev!.governance,
                    dataQuality: Number(formData.get('dataQuality')),
                    taxTransparency: Number(formData.get('taxTransparency'))
                  }
                }));
              } else if (activeFormCategory === 'issb') {
                setInitialData(prev => ({
                  ...prev!,
                  issb: {
                    ...prev!.issb,
                    climateVulnerability: Number(formData.get('climateVulnerability'))
                  }
                }));
              }
              setActiveFormCategory(null);
            }}>
              {activeFormCategory === 'environmental' && (
                <>
                  <Input name="financedEmissions" type="number" placeholder="Financed Emissions (tCO2e/$M)" />
                  <Input name="greenFinancingRatio" type="number" placeholder="Green Financing Ratio (%)" />
                  <Input name="climateRisk" type="number" placeholder="Climate Risk Exposure (%)" />
                  <Input name="renewableEnergy" type="number" placeholder="Renewable Energy Usage (%)" />
                </>
              )}
              {activeFormCategory === 'social' && (
                <>
                  <Input name="gender" type="number" placeholder="% Women" required />
                  <Input name="ethnicity" type="number" placeholder="% Underrepresented" required />
                </>
              )}
              {activeFormCategory === 'governance' && (
                <>
                  <Input name="dataQuality" type="number" placeholder="Data Quality Score" required />
                  <Input name="taxTransparency" type="number" placeholder="Tax Transparency %" required />
                </>
              )}
              {activeFormCategory === 'issb' && (
                <Input name="climateVulnerability" type="number" placeholder="Climate Vulnerability %" required />
              )}
              <div className="mt-4 flex gap-2">
                <Button type="submit">Save</Button>
                <Button variant="outline" onClick={() => setActiveFormCategory(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable components
function MetricCard({ title, value, trend, icon }: { 
  title: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
}) {
  const isPositive = trend >= 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          {Math.abs(trend)}% {isPositive ? 'increase' : 'decrease'}
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ label, value, target }: {
  label: string;
  value: number;
  target: number;
}) {
  const percentage = (value / target) * 100;
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm">{value}/{target}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full">
        <div 
          className="h-2 bg-blue-500 rounded-full transition-all" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function MetricDetailCard({ 
  title, 
  standard, 
  source, 
  description, 
  currentValue, 
  target 
}: {
  title: string;
  standard: string;
  source: string;
  description: string;
  currentValue: string;
  target: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span>{standard}</span>
          <span>•</span>
          <span>{source}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold">{currentValue}</p>
            <p className="text-sm text-muted-foreground">Current Value</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium">{target}</p>
            <p className="text-sm text-muted-foreground">Target</p>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
