"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart, Leaf, TrendingUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="w-full py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white animate-gradient-x pb-2"
          >
            Simplifying Impact Measurement.<br className="hidden sm:block" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-6"
          >
            frontforumfocus helps investors and businesses measure how their daily activities create real world impact
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10"
          >
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push("/dashboards")}
            >
              Explore Dashboards
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-white dark:bg-gray-950">
        {/* For Businesses Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">For Businesses</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Track organization ESG metrics and sustainability goals in real-time
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg"
              >
                <Leaf className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Environmental Monitoring</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Track carbon emissions, renewable energy usage, and climate risk exposure
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg"
              >
                <Users className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Social Impact</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Measure diversity metrics, employee training, and community engagement
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg"
              >
                <BarChart className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Governance Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Report on board diversity, anti-corruption training, and data quality
                </p>
              </motion.div>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => router.push("/dashboard/business")} 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                ESG Dashboard
              </Button>
            </div>
          </div>
        </section>
        
        {/* For Investors Section */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">For Investors</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Monitor the financial and impact performance of your investment portfolio
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg"
              >
                <TrendingUp className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Portfolio Performance</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Track ROI, annual returns and financial metrics alongside impact data
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg"
              >
                <BarChart className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Impact Metrics</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Quantify environmental and social impact across your investments
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg"
              >
                <Leaf className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">SDG Alignment</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  See how your portfolio contributes to Sustainable Development Goals
                </p>
              </motion.div>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => router.push("/dashboards/investor")} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Investor Dashboard
              </Button>
            </div>
          </div>
        </section>

        {/* For Individuals Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">For Individuals</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Track your personal impact through volunteering, green payments, and advocacy
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg"
              >
                <Users className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Volunteer Hours</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Track and quantify your volunteer work and community service
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg"
              >
                <TrendingUp className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Green Payments</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Measure the impact of your sustainable purchasing decisions
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg"
              >
                <Leaf className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">SDG Mapping</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  See how your activities align with Sustainable Development Goals
                </p>
              </motion.div>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => window.open("https://greta-v1.vercel.app", "_blank")} 
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Personal Impact Tracker
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © 2023 frontforumfocus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 