// src/components/layout/navigation-bar.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleUser,
  Menu,
  Package2,
  Search,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";
import ModeToggle from "@/components/mode-toggle";
import { useAuth } from "@/firebase/AuthContext";
import { cn } from "@/lib/utils";

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/corsi', label: 'Corsi' },
  { path: '/studenti', label: 'Studenti' },
  { path: '/assessment', label: 'Assessment' },
  { path: '/analytics', label: 'Analytics' },
] as const;

export function NavigationBar() {
  const pathname = usePathname();
  const { logout, currentUser } = useAuth();
  
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 container">
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 mr-6"
          >
            <Package2 className="h-6 w-6" />
            <span className="font-bold font-sans">Kimpy Power Learning</span>
          </Link>
          
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary font-sans",
                isActive(item.path) 
                  ? "text-foreground" 
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center space-x-2">
                  <Package2 className="h-6 w-6" />
                  <span className="font-sans">Kimpy Power Learning</span>
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary font-sans",
                    isActive(item.path) 
                      ? "text-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Right Section */}
        <div className="ml-auto flex items-center space-x-4">
          <form className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 md:w-[200px] lg:w-[300px] font-sans"
              />
            </div>
          </form>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none font-sans">
                    {currentUser?.displayName || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground font-mono">
                    {currentUser?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer flex w-full items-center font-sans">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/support" className="cursor-pointer flex w-full items-center font-sans">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout}
                className="cursor-pointer text-red-600 focus:text-red-600 font-sans"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}