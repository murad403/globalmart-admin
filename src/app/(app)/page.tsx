"use client"

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
import UserDistribution from "./overview/UserDistribution"
import PageHeader from "@/components/shared/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { useGetOverviewQuery } from "@/redux/features/overview/overview.api"
import { Skeleton } from "@/components/ui/skeleton"

const getChangeInfo = (percentage: number | null) => {
  if (percentage === null) return { text: "Updated recently", color: "text-slate-400" }
  if (percentage > 0) return { text: `+${percentage}% from last month`, color: "text-emerald-600" }
  if (percentage < 0) return { text: `${percentage}% from last month`, color: "text-rose-500" }
  return { text: "0% from last month", color: "text-slate-500" }
}

const Page = () => {
  const { data: response, isLoading } = useGetOverviewQuery()
  const data = response?.data
  const cards = data?.cards
  const curr = "$"

  const stats = [
    {
      title: "Total Users",
      value: cards?.total_users?.value?.toLocaleString() ?? "0",
      changeInfo: getChangeInfo(cards?.total_users?.change_percentage ?? null),
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: cards?.total_orders?.value?.toLocaleString() ?? "0",
      changeInfo: getChangeInfo(cards?.total_orders?.change_percentage ?? null),
      icon: ShoppingCart,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Platform Revenue",
      value: cards?.platform_revenue?.value !== undefined 
        ? `${curr}${cards.platform_revenue.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        : `${curr}0.00`,
      changeInfo: getChangeInfo(cards?.platform_revenue?.change_percentage ?? null),
      icon: DollarSign,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      title: "Active Resellers",
      value: cards?.active_resellers?.value?.toLocaleString() ?? "0",
      changeInfo: getChangeInfo(cards?.active_resellers?.change_percentage ?? null),
      icon: UserRound,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Pending Approvals",
      value: cards?.pending_approvals?.value?.toLocaleString() ?? "0",
      changeInfo: getChangeInfo(cards?.pending_approvals?.change_percentage ?? null),
      icon: Bell,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      title: "Escrow Balance",
      value: cards?.escrow_balance?.value !== undefined 
        ? `${curr}${cards.escrow_balance.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        : `${curr}0.00`,
      changeInfo: getChangeInfo(cards?.escrow_balance?.change_percentage ?? null),
      icon: Shield,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ]

  return (
    <div>
      <main className="space-y-4 md:space-y-5">
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
                    {isLoading ? (
                      <div className="mt-1 space-y-2 py-0.5">
                        <Skeleton className="h-7 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    ) : (
                      <>
                        <p className="mt-1 text-[28px] leading-none font-semibold text-slate-900">
                          {stat.value}
                        </p>
                        <p className={`mt-2 text-xs ${stat.changeInfo.color}`}>
                          {stat.changeInfo.text}
                        </p>
                      </>
                    )}
                  </div>
                  <div
                    className={`grid size-8 place-items-center rounded-lg ${stat.iconBg} ${stat.iconColor} shrink-0`}
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
      </main>
    </div>
  )
}

export default Page
