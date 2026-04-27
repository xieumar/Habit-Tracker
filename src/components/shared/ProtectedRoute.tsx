"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/storage";
import type { Session } from "@/types/auth";

interface ProtectedRouteProps {
  children: (session: Session) => React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    setSession(s);
    setLoading(false);
  }, [router]);

  if (loading || !session) {
    return null; 
  }

  return <>{children(session)}</>;
}
