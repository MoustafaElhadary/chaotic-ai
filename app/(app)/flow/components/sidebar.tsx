import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  BarChart,
  File,
  Inbox,
  LayoutDashboard,
  List,
  MessagesSquare,
  Send,
  Settings,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";
import { Nav } from "./nav";

interface SidebarProps {
  isCollapsed: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          "flex h-[52px] items-center justify-center",
          isCollapsed ? "h-[52px]" : "px-2"
        )}
      >
        <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Vercel</title>
            <path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor" />
          </svg>
          {!isCollapsed && <span>Chaotic</span>}
        </div>
      </div>
      <Separator />
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Dashboard",
            label: "",
            icon: LayoutDashboard,
            variant: "default",
            url: "/",
          },
          {
            title: "Flows",
            label: "",
            icon: List,
            variant: "ghost",
            url: "/testing",
          },
        ]}
      />
      <div className="flex-1 overflow-auto">
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Updates",
              label: "342",
              icon: AlertCircle,
              variant: "ghost",
              url: "/flow",
            },
            {
              title: "Analytics",
              label: "",
              icon: BarChart,
              variant: "ghost",
              url: "/",
            },
            {
              title: "Settings",
              label: "",
              icon: Settings,
              variant: "ghost",
              url: "/settings",
            },
          ]}
        />
      </div>
      <div className={cn("mt-auto p-4", isCollapsed && "flex justify-center")}>
        <UserButton />
      </div>
    </>
  );
}
