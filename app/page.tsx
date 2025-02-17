"use client";
import { ArrowUp, ArrowDown, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart,  DonutChart } from "@carbon/charts-react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data - replace with API calls
const environmentalData = {
  energyConsumption: [4000, 3200, 2800, 2500], // kWh
  emissions: {
    scope1: 15000, // tCO2e
    scope2: 8000,
    scope3: 45000,
  },
  renewableEnergy: 35, // %
};

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

  // ISSB
  'Climate Vulnerability': {
    standard: 'ISSB',
    source: 'Geospatial Data',
    description: 'Assets exposed to climate risks',
    currentValue: '22%',
    target: '<15% by 2030'
  }
  // Add remaining metrics following same pattern
};

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof metricCategories>('overview');

  // AI Recommendations
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Generate AI recommendations based on data
    const generateRecommendations = () => {
        const recs = [];
      if (environmentalData.renewableEnergy < 40) {
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
          <TabsTrigger value="overview">
            Overview <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full" />
          </TabsTrigger>
          <TabsTrigger value="environmental">
            Environmental <div className="ml-2 w-2 h-2 bg-green-500 rounded-full" />
          </TabsTrigger>
          <TabsTrigger value="social">
            Social <div className="ml-2 w-2 h-2 bg-purple-500 rounded-full" />
          </TabsTrigger>
          <TabsTrigger value="governance">
            Governance <div className="ml-2 w-2 h-2 bg-orange-500 rounded-full" />
          </TabsTrigger>
          <TabsTrigger value="issb">
            ISSB <div className="ml-2 w-2 h-2 bg-red-500 rounded-full" />
          </TabsTrigger>
        </TabsList>

        <div className="pt-6">
          <TabsContent value={selectedCategory}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMetrics.map((metric) => (
                <MetricDetailCard
                  key={metric}
                  title={metric}
                  {...metricDetails[metric as keyof typeof metricDetails]}
                />
              ))}
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
            <LineChart
              data={[
                { month: 'Jan', emissions: 12000 },
                { month: 'Feb', emissions: 10500 },
                // ... more data
              ]}
              options={{
                axes: {
                  bottom: { title: 'Month', mapsTo: 'month' },
                  left: { title: 'CO2 Emissions (t)', mapsTo: 'emissions' }
                },
                height: '100%'
              }}
            />
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
              <DonutChart
                data={[
                  { group: 'Women', value: socialData.diversity.gender },
                  { group: 'Men', value: 100 - socialData.diversity.gender },
                ]}
                options={{
                  height: '100%',
                  legend: { position: 'bottom' }
                }}
              />
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
