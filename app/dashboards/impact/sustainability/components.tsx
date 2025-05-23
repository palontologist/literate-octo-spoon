"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Target, Globe } from "lucide-react";

// SDG metrics data
const SDG_DATA = [
  {
    id: "sdg12",
    name: "SDG 12: Responsible Consumption and Production",
    description: "Ensure sustainable consumption and production patterns",
    progress: 38,
    metrics: [
      { name: "Waste Reduction", value: 42, unit: "%", trend: "up" },
      { name: "Resource Efficiency", value: 35, unit: "%", trend: "up" },
      { name: "Sustainable Practices", value: 28, unit: "%", trend: "up" }
    ],
    color: "green"
  },
  {
    id: "sdg13",
    name: "SDG 13: Climate Action",
    description: "Take urgent action to combat climate change and its impacts",
    progress: 31,
    metrics: [
      { name: "Carbon Reduction", value: 27, unit: "%", trend: "up" },
      { name: "Climate Resilience", value: 18, unit: "%", trend: "up" },
      { name: "Green Energy Usage", value: 45, unit: "%", trend: "up" }
    ],
    color: "blue"
  },
  {
    id: "sdg6",
    name: "SDG 6: Clean Water and Sanitation",
    description: "Ensure availability and sustainable management of water and sanitation for all",
    progress: 42,
    metrics: [
      { name: "Water Usage Reduction", value: 52, unit: "%", trend: "up" },
      { name: "Water Recycling", value: 38, unit: "%", trend: "up" },
      { name: "Clean Water Practices", value: 41, unit: "%", trend: "up" }
    ],
    color: "cyan"
  },
  {
    id: "sdg8",
    name: "SDG 8: Decent Work and Economic Growth",
    description: "Promote sustainable economic growth and decent work for all",
    progress: 45,
    metrics: [
      { name: "Fair Wages", value: 56, unit: "%", trend: "up" },
      { name: "Safe Working Conditions", value: 62, unit: "%", trend: "up" },
      { name: "Employment Growth", value: 24, unit: "%", trend: "up" }
    ],
    color: "amber"
  },
  {
    id: "sdg15",
    name: "SDG 15: Life on Land",
    description: "Protect, restore and promote sustainable use of terrestrial ecosystems",
    progress: 29,
    metrics: [
      { name: "Land Conservation", value: 31, unit: "%", trend: "up" },
      { name: "Biodiversity Protection", value: 22, unit: "%", trend: "up" },
      { name: "Deforestation Prevention", value: 35, unit: "%", trend: "up" }
    ],
    color: "emerald"
  }
];

/**
 * SDGMetrics component displays progress towards Sustainable Development Goals
 */
export function SDGMetrics() {
  const [activeTab, setActiveTab] = useState(SDG_DATA[0].id);
  
  // Color mapping
  const colorMap: Record<string, string> = {
    green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
  };
  
  const progressColors: Record<string, string> = {
    green: "bg-green-600",
    blue: "bg-blue-600",
    cyan: "bg-cyan-600",
    amber: "bg-amber-600",
    emerald: "bg-emerald-600"
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-500" />
          SDG Contribution
        </CardTitle>
        <CardDescription>Track progress towards Sustainable Development Goals</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 h-auto p-1">
            {SDG_DATA.map(sdg => (
              <TabsTrigger 
                key={sdg.id} 
                value={sdg.id}
                className="text-xs py-1 px-2 h-auto"
              >
                {sdg.id.toUpperCase().replace("SDG", "")}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {SDG_DATA.map(sdg => (
            <TabsContent key={sdg.id} value={sdg.id} className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{sdg.name}</h3>
                <p className="text-sm text-muted-foreground">{sdg.description}</p>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{sdg.progress}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${progressColors[sdg.color]}`} 
                    style={{ width: `${sdg.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-3">Key Metrics</h4>
                <div className="space-y-3">
                  {sdg.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={colorMap[sdg.color]}>
                          {metric.name}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{metric.value}{metric.unit}</span>
                        {metric.trend === "up" && <ArrowUp className="h-3 w-3 text-green-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-3 flex items-start gap-2 text-sm">
                <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <span className="font-medium">2030 Target:</span> {sdg.progress * 2}% overall contribution to {sdg.name.split(":")[1].trim()}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
} 