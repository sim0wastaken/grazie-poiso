// src/components/authentication/auth-signup.tsx
'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
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

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const auth = getAuth();

  // Handle email/password signup
  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get the ID token
      const idToken = await user.getIdToken();
      
      // Store the token in a cookie
      document.cookie = `auth-token=${idToken}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
        provider: "email"
      });

      router.push("/dashboard");
      router.refresh(); // Refresh to update auth state
    } catch (err) {
      setError("Failed to sign up. Please try again.");
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      if (user) {
        // Get the ID token
        const idToken = await user.getIdToken();
        
        // Store the token in a cookie
        document.cookie = `auth-token=${idToken}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`;

        // Check if user exists in Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);
  
        const displayName = user.displayName || "Google User";
        const [firstName = "Google", lastName = "User"] = displayName.split(" ");
  
        if (!userSnapshot.exists()) {
          // If user doesn't exist, add to Firestore
          await setDoc(userRef, {
            firstName,
            lastName,
            email: user.email,
            uid: user.uid,
            createdAt: new Date(),
            provider: "google"
          });
        }
  
        router.push("/dashboard");
        router.refresh(); // Refresh to update auth state
      }
    } catch (error) {
      console.error("Error signing up with Google: ", error);
      setError("Failed to sign up with Google. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignup();
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Form for email/password signup */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* First Name */}
          <div className="grid gap-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          {/* Last Name */}
          <div className="grid gap-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error message */}
          {error && <div className="text-red-500">{error}</div>}

          {/* Signup button */}
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>

        {/* Google Signup button */}
        <Button variant="outline" onClick={handleGoogleSignup} className="w-full mt-4">
          Sign Up with Google
        </Button>

        {/* Login link */}
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">Login</Link>
        </div>
      </CardContent>
    </Card>
  );
}