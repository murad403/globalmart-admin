import React from "react"
import { Bell, Search } from "lucide-react"

import AdminSidebar from "../shared/AdminSidebar"
import { Input } from "../ui/input"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "../ui/tooltip"
import { SidebarTrigger } from "../ui/sidebar"

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <TooltipProvider>
            <SidebarProvider
                defaultOpen
                style={
                    {
                        "--sidebar-width": "16rem",
                        "--sidebar-width-icon": "2.65rem",
                    } as React.CSSProperties
                }
            >
                <AdminSidebar />
                <SidebarInset className="min-h-svh bg-[#f4f6fb]">
                    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-[#f4f6fb]/95 px-4 backdrop-blur md:px-6">
                        <div className="flex items-center gap-3">
                            <SidebarTrigger className="text-slate-600 hover:text-slate-900" />
                            <div className="relative hidden w-70 sm:block">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Search anything..."
                                    className="h-9 border-slate-200 bg-white pl-9"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                className="grid size-8 place-items-center rounded-full text-slate-600 hover:bg-white"
                                aria-label="Notifications"
                            >
                                <Bell className="size-4" />
                            </button>
                            <div className="hidden text-right sm:block">
                                <p className="text-xs font-semibold text-slate-800">Admin User</p>
                                <p className="text-[11px] text-slate-500">admin</p>
                            </div>
                            <div className="grid size-8 place-items-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                                A
                            </div>
                        </div>
                    </header>

                    <div className="p-4 md:p-6">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}

export default MainWrapper
