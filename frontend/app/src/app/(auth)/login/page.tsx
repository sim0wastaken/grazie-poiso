// src/app/login/page.tsx
'use client';

import { useEffect } from "react";
import { useRouter, useSearchParams  } from "next/navigation";
import LoginForm from "@/app/(auth)/login/auth-login";
import { useAuth } from "@/firebase/AuthContext";

export default function Login() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';

  useEffect(() => {
    if (currentUser) {
      router.push(from);
    }
  }, [currentUser, router, from]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
