// src/components/layout/app-sidebar.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleUser,
  Brain,
  Search,
  Settings,
  HelpCircle,
  LogOut,
  Home,
  GraduationCap,
  Users,
  ClipboardCheck,
  LineChart,
  Ticket
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/firebase/AuthContext";
import ModeToggle from "@/components/mode-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  // { path: '/corsi', label: 'Corsi', icon: GraduationCap },
  // { path: '/studenti', label: 'Studenti', icon: Users },
  // { path: '/assessment', label: 'Assessment', icon: ClipboardCheck },
  // { path: '/analytics', label: 'Analytics', icon: LineChart },
  { path: '/demo', label: 'Demo', icon: Ticket}
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, currentUser } = useAuth();
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => pathname === path;

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-border p-4">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center"
                >
                  <Brain className="h-6 w-6" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                Kimpy Power Learning
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-bold"
            >
              <Brain className="h-6 w-6" />
              <span className="font-sans">Kimpy Power Learning</span>
            </Link>
          )}
        </SidebarHeader>

        <SidebarContent className={cn(
          isCollapsed ? "px-2 py-2" : "p-4",
          "flex flex-col items-center"
        )}>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.path)}
                      >
                        <Link href={item.path} className="flex items-center justify-center w-full">
                          <item.icon className="h-4 w-4" />
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                  >
                    <Link href={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span className="font-sans">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter
          className={cn(
            isCollapsed ? "p-1 my-4 pt-4" : "p-4",
            "border-t border-border"
          )}>
          {isCollapsed ? (
            <div className="flex flex-col space-y-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-center">
                    <ModeToggle />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Toggle theme
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full flex justify-center"
                  >
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Search
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-full flex justify-center"
                      >
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Open user menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {currentUser?.displayName || 'User'}
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="center" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer w-full">
                        <CircleUser className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/support" className="cursor-pointer w-full">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>Support</span>
                        <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-4">
                <ModeToggle />
                <form className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Search..."
                      className="w-full rounded-md border border-border bg-transparent py-2 pl-8 pr-4 text-sm font-sans"
                    />
                  </div>
                </form>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <CircleUser className="h-5 w-5" />
                    <span className="font-sans">
                      {currentUser?.displayName || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer w-full">
                        <CircleUser className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/support" className="cursor-pointer w-full">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>Support</span>
                        <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}