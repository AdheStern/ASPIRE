"use client";

import {
  BookOpen,
  HardDrive,
  LifeBuoy,
  Package,
  Send,
  Settings2,
} from "lucide-react";
import type * as React from "react";

import { NavMain } from "@/components/shared/sidebar/nav-main";
import { NavProjects } from "@/components/shared/sidebar/nav-projects";
import { NavSecondary } from "@/components/shared/sidebar/nav-secondary";
import { NavUser } from "@/components/shared/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Proyectos",
      url: "/aspire",
      icon: Package,
      isActive: true,
    },
    {
      title: "Almacenamiento",
      url: "/aspire/mcp",
      icon: HardDrive,
    },
    {
      title: "Documentación",
      url: "#",
      icon: BookOpen,
    },
    {
      title: "Configuraciones",
      url: "#",
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: "Soporte",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
