"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function InvestorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedSetup = localStorage.getItem('investorPreferences');
    
    // If on the setup page, don't redirect
    if (pathname === '/dashboards/investor/setup') {
      setLoading(false);
      return;
    }
    
    // If not on setup page and no preferences, redirect to setup
    if (!hasCompletedSetup) {
      router.push('/dashboards/investor/setup');
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  if (loading && pathname !== '/dashboards/investor/setup') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 