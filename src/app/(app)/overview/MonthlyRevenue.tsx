"use client"

import React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetOverviewQuery } from "@/redux/features/overview/overview.api"
import { Skeleton } from "@/components/ui/skeleton"

const SKELETON_HEIGHTS = [35, 45, 25, 60, 50, 75, 40, 55, 70, 30, 65, 80]

const MonthlyRevenue = () => {
  const { data: response, isLoading } = useGetOverviewQuery()
  const monthlyRevenue = response?.data?.monthly_revenue || []
  
  const chartData = monthlyRevenue.map((item) => ({
    month: item.month,
    value: item.amount,
  }))

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-900">
          Monthly Revenue
        </CardTitle>
        <p className="text-xs text-slate-500">Overview of platform earnings</p>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-2 md:p-3 [&_svg]:outline-none [&_*:focus-visible]:outline-none">
          <div className="h-60 w-full md:h-64">
            {isLoading ? (
              <div className="flex h-full w-full items-end justify-between gap-2 pt-6 pb-2 px-2">
                {SKELETON_HEIGHTS.map((h, i) => (
                  <Skeleton 
                    key={i} 
                    className="w-full rounded-none" 
                    style={{ height: `${h}%` }} 
                  />
                ))}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 6, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d9dce4" vertical={true} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={{ stroke: "#a3aab8" }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={{ stroke: "#a3aab8" }}
                    tickLine={false}
                    width={45}
                  />
                  <Bar dataKey="value" fill="#18b981" barSize={22} radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MonthlyRevenue