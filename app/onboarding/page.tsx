"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.push("/dashboards/impact/sustainability?tab=fashion");
  }, [router]);
  
  return (
    <div className="p-8">
      <h1 className="text-xl">Redirecting to onboarding...</h1>
    </div>
  );
} 