"use client"

import React from "react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetOverviewQuery } from "@/redux/features/overview/overview.api"
import { Skeleton } from "@/components/ui/skeleton"

const legend = [
  { label: "Wholesalers", dotClass: "bg-blue-500", textClass: "text-blue-500" },
  { label: "Retailers", dotClass: "bg-emerald-500", textClass: "text-emerald-500" },
  { label: "Customers", dotClass: "bg-amber-500", textClass: "text-amber-500" },
]

const COLOR_MAP: Record<string, string> = {
  wholesalers: "#3b82f6",
  retailers: "#10b981",
  customers: "#f59e0b",
}

const UserDistribution = () => {
  const { data: response, isLoading } = useGetOverviewQuery()
  const userDistribution = response?.data?.user_distribution || []

  const distributionData = userDistribution.map((item) => ({
    name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
    value: item.count,
    color: COLOR_MAP[item.type.toLowerCase()] || "#64748b",
  }))

  // Ensure PieChart renders properly even if all values are 0 by checking total
  const hasData = distributionData.some((d) => d.value > 0)
  const displayData = hasData 
    ? distributionData 
    : distributionData.map((d) => ({ ...d, value: 1 })) // Equal share placeholder if all counts are 0

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-900">
          User Distribution
        </CardTitle>
        <p className="text-xs text-slate-500">By account type</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 pt-2">
        <div className="h-38 w-full max-w-55 flex items-center justify-center">
          {isLoading ? (
            <Skeleton className="size-30 rounded-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  startAngle={0}
                  endAngle={360}
                  paddingAngle={1}
                >
                  {displayData.map((entry) => (
                    <Cell 
                      key={entry.name} 
                      fill={hasData ? entry.color : "#e2e8f0"} 
                      stroke="#ffffff" 
                      strokeWidth={1} 
                      style={{ outline: "none " }} 
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-xs ${item.dotClass}`} />
              <span className={item.textClass}>{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default UserDistribution
