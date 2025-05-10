"use client";

import { Aperture } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export default function AppLogo() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="flex items-center gap-2 p-2">
      <Aperture className="h-8 w-8 text-sidebar-primary" />
      <h1
        className={`text-xl font-semibold text-sidebar-foreground transition-opacity duration-300 ${
          isCollapsed ? "opacity-0 w-0 md:group-data-[collapsible=icon]:opacity-0 md:group-data-[collapsible=icon]:w-0" : "opacity-100 w-auto"
        }`}
      >
        VisionCraft AI
      </h1>
    </div>
  );
}
