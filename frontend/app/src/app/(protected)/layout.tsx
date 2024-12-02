// src/app/(protected)/layout.tsx
'use client';

import { useAuth } from '@/firebase/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/icons/loading-spinner';
import { AppSidebar } from '@/components/layouts/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !currentUser) {
      // Store the attempted URL to redirect back after login
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [currentUser, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return currentUser ? (
    <>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <main>
          <div className='p-2'>
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </>
  ) : null;
}
