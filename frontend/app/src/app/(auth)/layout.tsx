// src/app/(auth)/layout.tsx
export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="p-4 w-full max-w-[400px]">
          {children}
        </div>
      </div>
    );
  }