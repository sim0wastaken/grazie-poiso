// src/components/authentication/auth-login.tsx
'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Firebase authentication instance
  const auth = getAuth();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Get the ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Store the token in a cookie
      document.cookie = `auth-token=${idToken}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`;
      
      router.push("/dashboard"); // Redirect to the dashboard on success
      router.refresh(); // Refresh the page to update the auth state
    } catch (err) {
      setError("Failed to log in. Please check your credentials and try again.");
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const firestore = getFirestore();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Get the ID token
      const idToken = await user.getIdToken();
      
      // Store the token in a cookie
      document.cookie = `auth-token=${idToken}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`;

      // Check if user already exists in Firestore
      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // If the user doesn't exist, create a new user document
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          createdAt: new Date(),
          provider: "google"
        });
      }

      router.push("/dashboard"); // Redirect to the dashboard on success
      router.refresh(); // Refresh the page to update the auth state
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(); // Call login on form submit
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Login form */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Email input */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password input */}
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error message */}
          {error && <div className="text-red-500">{error}</div>}

          {/* Login button */}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        {/* Google Login button outside the form */}
        <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin}>
          Login with Google
        </Button>

        {/* Sign-up link */}
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}