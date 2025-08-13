"use client";
import * as React from "react";
import { LayoutDashboard, Minus, Plus } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LogoutButton } from "./logout-button";
import { fetchJSONAPI } from "@/lib/lib";
import { supabase } from "@/app/api/supabase.config";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const adminSidebarData = {
  navMain: [
    {
      title: "Reimbursements",
      url: "#",
      items: [
        {
          title: "Manage Reimbursements",
          url: "/dashboard/reimbursements",
        },
        {
          title: "Add Reimbursements",
          url: "/dashboard/reimbursements/add",
        },
      ],
    },
    {
      title: "Categories",
      url: "#",
      items: [
        {
          title: "Manage Categories",
          url: "/dashboard/categories",
        },
        {
          title: "Add Categories",
          url: "/dashboard/categories/add",
        },
      ],
    },
    {
      title: "Employees",
      url: "#",
      items: [
        {
          title: "Manage Employees",
          url: "/dashboard/employees",
        },
      ],
    },
  ],
};

const userSidebarData = {
  navMain: [
    {
      title: "Reimbursements",
      url: "#",
      items: [
        {
          title: "Manage Reimbursements",
          url: "/dashboard/reimbursements",
        },
        {
          title: "Add Reimbursements",
          url: "/dashboard/reimbursements/add",
        },
      ],
    },
    {
      title: "Categories",
      url: "#",
      items: [
        {
          title: "Manage Categories",
          url: "/dashboard/categories",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  async function getEmpID() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }
    if (data.user === null) {
      throw new Error("Unauthorized User");
    }

    const empRes = await fetchJSONAPI(
      "GET",
      `/api/v1/employees/${data.user.id}`
    );
    const json = await empRes.json();
    if (json.data.length === 0) {
      throw new Error("Unauthorized User");
    }
    return json.data[0].txEmployeeCode;
  }

  const checkAdminQuery = useQuery({
    queryKey: ["check-admin"],
    queryFn: getEmpID,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const isAdmin: boolean = checkAdminQuery.isSuccess && checkAdminQuery.data;
  let sidebarData = userSidebarData;
  if (isAdmin) {
    sidebarData = adminSidebarData;
  }
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Izifinance</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarData.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={item.url}>{item.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
