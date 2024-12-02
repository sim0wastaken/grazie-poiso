// src/app/signup/page.tsx
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignupForm from "@/app/(auth)/signup/auth-signup";
import { useAuth } from "@/firebase/AuthContext";

export default function Signup() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/"); // Redirect to the home page if logged in
    }
  }, [currentUser, router]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Signup</h1>
        <SignupForm />
      </div>
    </div>
  );
}
