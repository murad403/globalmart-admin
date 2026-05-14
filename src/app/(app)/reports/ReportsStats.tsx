"use client"
import {
  Bell,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { useGetReportsQuery } from "@/redux/features/overview/overview.api"
import { Skeleton } from "@/components/ui/skeleton"

const getChangeInfo = (percentage: number | null) => {
  if (percentage === null) return { text: "Updated recently", color: "text-slate-400" }
  if (percentage > 0) return { text: `+${percentage}% from last month`, color: "text-emerald-600" }
  if (percentage < 0) return { text: `${percentage}% from last month`, color: "text-rose-500" }
  return { text: "0% from last month", color: "text-slate-500" }
}

const ReportsStats = () => {
  const { data: response, isLoading } = useGetReportsQuery()
  const data = response?.data
  const cards = data?.cards
  const curr = "$"

  const stats = [
    {
      title: "Total Sales",
      value: cards?.total_sales?.value !== undefined && cards?.total_sales?.value !== null
        ? `${curr}${cards.total_sales.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
        : `${curr}0.00`,
      changeInfo: getChangeInfo(cards?.total_sales?.change_percentage ?? null),
      icon: DollarSign,
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
      title: "New Customers",
      value: cards?.new_customers?.value?.toLocaleString() ?? "0",
      changeInfo: getChangeInfo(cards?.new_customers?.change_percentage ?? null),
      icon: Users,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      title: "Growth Rate",
      value: cards?.growth_rate?.value !== undefined && cards?.growth_rate?.value !== null
        ? `${cards.growth_rate.value}%`
        : "N/A",
      changeInfo: getChangeInfo(cards?.growth_rate?.change_percentage ?? null),
      icon: TrendingUp,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Pending Approvals",
      value: cards?.pending_approvals?.value?.toLocaleString() ?? "0",
      changeInfo: { text: "Requires verification", color: "text-slate-400" },
      icon: Bell,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
  ]

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card key={stat.title} className="bg-white">
            <CardContent className="flex items-start justify-between pt-4">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-xs text-slate-500 truncate">{stat.title}</p>
                {isLoading ? (
                  <div className="mt-1 space-y-2 py-0.5">
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ) : (
                  <>
                    <p className="mt-1 text-[24px] xl:text-[22px] 2xl:text-[26px] leading-none font-semibold text-slate-900 truncate" title={stat.value}>
                      {stat.value}
                    </p>
                    <p className={`mt-2 text-xs ${stat.changeInfo.color} truncate`}>
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
  )
}

export default ReportsStats
