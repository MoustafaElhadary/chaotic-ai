"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { List, LucideIcon, Menu, Package2, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BarChart, LayoutDashboard } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/" },
  { title: "Flows", icon: List, href: "/testing" },
  { title: "Analytics", icon: BarChart, href: "/" },
  { title: "Settings", icon: Settings, href: "/settings" },
];

export default function AppHeader() {
  return (
    <aside className="sticky top-0 flex h-screen flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className={cn("transition-opacity opacity-0")}>Acme Inc</span>
        </Link>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <NavItems />
        </nav>
      </div>
      <div className="mt-auto p-4">
        <UserButton />
      </div>
    </aside>
  );
}

const NavItems = () => {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => (
        <NavItem key={item.title} item={item} active={pathname === item.href} />
      ))}
    </>
  );
};

const NavItem = ({ item, active }: { item: NavItem; active: boolean }) => {
  return (
    <TooltipProvider>
      <Tooltip key={item.title} delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              buttonVariants({
                variant: active ? "default" : "ghost",
                size: "sm",
              }),
              "justify-start w-9 px-0"
            )}
          >
            <item.icon className={cn("h-4 w-4")} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
