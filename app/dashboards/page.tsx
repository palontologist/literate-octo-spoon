"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Leaf, TrendingUp, Users, Sun, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardSelection() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Dashboard Selection</h1>
          <Button 
            variant="outline" 
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Business ESG Dashboard */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-700 text-white">
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Business ESG Dashboard
              </CardTitle>
              <CardDescription className="text-white/80">
                Track sustainability metrics and ESG performance
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2">
                    <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Environment, Social & Governance</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Track emissions, diversity metrics, and governance data
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2">
                    <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">ISSB Standards Compliance</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Monitor your progress toward sustainability reporting standards
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-900 px-6 py-4">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => router.push("/dashboard/business")}
              >
                Access Business Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Investor Dashboard */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Investor Dashboard
              </CardTitle>
              <CardDescription className="text-white/80">
                Monitor portfolio performance and impact metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2">
                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Financial Performance</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Track ROI, returns, and value of impact investments
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2">
                    <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Impact Metrics</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Quantify the environmental and social impact of investments
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-900 px-6 py-4">
              <div className="w-full space-y-2">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push("/dashboards/investor")}
                >
                  Access Investor Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-center text-gray-500">
                  First time? <Button 
                    variant="link" 
                    className="p-0 h-auto text-xs"
                    onClick={() => router.push("/dashboards/investor/setup")}
                  >
                    Set up your impact preferences
                  </Button>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Sustainability Metrics Dashboard */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-700 text-white">
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Sustainability Metrics
              </CardTitle>
              <CardDescription className="text-white/80">
                Track metrics for solar energy and sustainable fashion
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-2">
                    <Sun className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Solar Energy Metrics</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Track production capacity, CO2 reduction, and resource efficiency
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-2">
                    <ShoppingBag className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Sustainable Fashion</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Monitor recycled materials usage, water savings, and ethical scores
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-900 px-6 py-4">
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700"
                onClick={() => router.push("/dashboards/impact/sustainability")}
              >
                Access Sustainability Metrics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Individual Dashboard Link */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-700 text-white">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Personal Impact Tracker
              </CardTitle>
              <CardDescription className="text-white/80">
                Track your individual sustainability impact
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Track Volunteering Hours</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Log and quantify your community service impact
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2">
                    <Leaf className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Sustainable Purchases</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Map your green payments to Sustainable Development Goals
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-900 px-6 py-4">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => window.open("https://greta-v1.vercel.app", "_blank")}
              >
                Access Personal Impact Tracker
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 