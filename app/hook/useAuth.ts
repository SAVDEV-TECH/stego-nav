// hooks/useAuth.ts
"use client";

import { useState, useEffect } from "react";

export default function useAuth() {
  const [user, setUser] = useState<{ name: string; accountNo: string; balance: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/authss/me");  
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return { user, setUser, loading };
}
