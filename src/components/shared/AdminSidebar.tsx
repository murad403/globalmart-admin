"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BanknoteArrowDown, Bot, CircleHelp, DollarSign, FileBarChart, FilePenLine, LayoutGrid, ListTree, LogOut, MessageSquare, Package, Settings, ShoppingCart, Users } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar"
import { removeToken } from "@/utils/auth"

const NAV_ITEMS = [
  { title: "Overview", href: "/", icon: LayoutGrid },
  { title: "Users", href: "/users", icon: Users },
  { title: "Products", href: "/products", icon: Package },
  { title: "Orders", href: "/orders", icon: ShoppingCart },
  { title: "Withdrawals", href: "/withdrawals", icon: BanknoteArrowDown },
  { title: "Categories", href: "/categories", icon: ListTree },
  { title: "AI Customers", href: "/ai-customers", icon: Bot },
  { title: "Message", href: "/messages", icon: MessageSquare },
  { title: "Finance", href: "/finance", icon: DollarSign },
  { title: "Reports", href: "/reports", icon: FileBarChart },
  { title: "Contents", href: "/contents", icon: FilePenLine },
  { title: "FAQ", href: "/faq", icon: CircleHelp },
  { title: "Settings", href: "/settings", icon: Settings },
]

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = () => {
    removeToken();
    router.push("/auth/sign-in");
  };
  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 [--sidebar:#08152f] [--sidebar-foreground:#d5e0ff] [--sidebar-accent:#1f4fff] [--sidebar-accent-foreground:#ffffff] [--sidebar-border:rgba(255,255,255,0.12)]"
    >
      <SidebarHeader className="border-b border-white/10 px-3 py-5 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:h-16 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center gap-2 overflow-hidden group-data-[collapsible=icon]:justify-center">
          <div className="grid size-6 shrink-0 place-items-center rounded-full bg-linear-to-br from-fuchsia-500 to-indigo-500 text-[10px] font-bold text-white group-data-[collapsible=icon]:size-7 group-data-[collapsible=icon]:text-xs">
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
            <SidebarMenu className="group-data-[collapsible=icon]:items-center">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = item.href === pathname

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="h-9 text-slate-200 data-[active=true]:bg-[#1f4fff] data-[active=true]:text-white hover:bg-white/10 hover:text-white group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
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

      <SidebarFooter className="border-t border-white/10 p-3 text-xs text-slate-300 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
        <div className="group-data-[collapsible=icon]:hidden">
          <p className="uppercase tracking-wide text-slate-400">Logged in as</p>
          <p className="mt-1 font-medium text-slate-100">Admin</p>
        </div>
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Logout"
              className="h-8 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 cursor-pointer group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
            >
              <button onClick={handleLogout}>
                <LogOut className="size-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AdminSidebar
