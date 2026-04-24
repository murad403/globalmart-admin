"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, CircleHelp, DollarSign, FileBarChart, FilePenLine, LayoutGrid, ListTree, LogOut, MessageSquare, Package, Settings, Users } from "lucide-react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar"

const NAV_ITEMS = [
  { title: "Overview", href: "/", icon: LayoutGrid },
  { title: "Users", href: "/users", icon: Users },
  { title: "Products", href: "/products", icon: Package },
  { title: "Message", href: "/messages", icon: MessageSquare },
  { title: "Categories", href: "/categories", icon: ListTree },
  { title: "AI Customers", href: "/ai-customers", icon: Bot },
  { title: "Finance", href: "/finance", icon: DollarSign },
  { title: "Reports", href: "/reports", icon: FileBarChart },
  { title: "Contents", href: "/contents", icon: FilePenLine },
  { title: "FAQ", href: "/faq", icon: CircleHelp },
  { title: "Settings", href: "/settings", icon: Settings },
]

const AdminSidebar = () => {
  const pathname = usePathname()

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 [--sidebar:#08152f] [--sidebar-foreground:#d5e0ff] [--sidebar-accent:#1f4fff] [--sidebar-accent-foreground:#ffffff] [--sidebar-border:rgba(255,255,255,0.12)]"
    >
      <SidebarHeader className="border-b border-white/10 px-3 py-5">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="grid size-6 shrink-0 place-items-center rounded-full bg-linear-to-br from-fuchsia-500 to-indigo-500 text-[10px] font-bold text-white">
            GM
          </div>
          <p className="truncate text-sm font-semibold text-white group-data-[collapsible=icon]:hidden">
            GlobalMart
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = item.href === pathname

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="h-9 text-slate-200 data-[active=true]:bg-[#1f4fff] data-[active=true]:text-white hover:bg-white/10 hover:text-white"
                    >
                      <Link href={item.href}>
                        <Icon className="size-5 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-3 text-xs text-slate-300">
        <div className="group-data-[collapsible=icon]:hidden">
          <p className="uppercase tracking-wide text-slate-400">Logged in as</p>
          <p className="mt-1 font-medium text-slate-100">Admin</p>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Logout"
              className="h-8 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
            >
              <Link href="/auth/sign-in">
                <LogOut className="size-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AdminSidebar
