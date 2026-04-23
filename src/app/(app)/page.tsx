import React from "react"
import {
  Bell,
  DollarSign,
  Shield,
  ShoppingCart,
  UserRound,
  Users,
} from "lucide-react"

import MonthlyRevenue from "./overview/MonthlyRevenue"
import SystemHealth from "./overview/SystemHealth"
import UserDistribution from "./overview/UserDistribution"
import PageHeader from "@/components/shared/PageHeader"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Total Users",
    value: "12,450",
    change: "+12% from last month",
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    changeColor: "text-emerald-600",
  },
  {
    title: "Total Orders",
    value: "45,230",
    change: "+8% from last month",
    icon: ShoppingCart,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    changeColor: "text-emerald-600",
  },
  {
    title: "Platform Revenue",
    value: "$1.2M",
    change: "+24% from last month",
    icon: DollarSign,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    changeColor: "text-emerald-600",
  },
  {
    title: "Active Resellers",
    value: "640",
    change: "+5% from last month",
    icon: UserRound,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    changeColor: "text-emerald-600",
  },
  {
    title: "Pending Approvals",
    value: "12",
    change: "-2 from last month",
    icon: Bell,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    changeColor: "text-rose-500",
  },
  {
    title: "Escrow Balance",
    value: "$340K",
    change: "+15% from last month",
    icon: Shield,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    changeColor: "text-emerald-600",
  },
]

const Page = () => {
  return (
    <div>
      

      <main className="space-y-4  md:space-y-5 ">
        <PageHeader
          title="Overview"
          description="Platform performance and key metrics at a glance"
        />

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <Card key={stat.title} className="bg-white">
                <CardContent className="flex items-start justify-between pt-4">
                  <div>
                    <p className="text-xs text-slate-500">{stat.title}</p>
                    <p className="mt-1 text-[28px] leading-none font-semibold text-slate-900">
                      {stat.value}
                    </p>
                    <p className={`mt-2 text-xs ${stat.changeColor}`}>{stat.change}</p>
                  </div>
                  <div
                    className={`grid size-8 place-items-center rounded-lg ${stat.iconBg} ${stat.iconColor}`}
                  >
                    <Icon className="size-4" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <MonthlyRevenue />
          <UserDistribution />
        </section>

        <section>
          <SystemHealth />
        </section>
      </main>
    </div>
  )
}

export default Page
