"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, BrainCog, Target, Database, Camera, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/backbone-advisor", label: "Backbone Advisor", icon: BrainCog },
  {
    href: "/detection-head-advisor",
    label: "Detection Head Advisor",
    icon: Target,
  },
  { href: "/dataset-loader", label: "Dataset Loader", icon: Database },
  { href: "/interactive-demo", label: "Interactive Demo", icon: Camera },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={{children: item.label, className: "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border"}}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
