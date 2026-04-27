"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/shared/SplashScreen";
import { getSession } from "@/lib/storage";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Show splash for a deterministic window (800–2000ms)
    const delay = 1200;
    const timer = setTimeout(() => {
      const session = getSession();
      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}