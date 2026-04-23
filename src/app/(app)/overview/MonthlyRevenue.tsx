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

const chartData = [
  { month: "Jan", value: 4600 },
  { month: "Feb", value: 5300 },
  { month: "Mar", value: 4900 },
  { month: "Apr", value: 7500 },
  { month: "May", value: 6200 },
  { month: "Jun", value: 7000 },
  { month: "Jul", value: 6000 },
  { month: "Aug", value: 6600 },
]

const MonthlyRevenue = () => {
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
                  domain={[0, 8000]}
                  ticks={[0, 2000, 4000, 6000, 8000]}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={{ stroke: "#a3aab8" }}
                  tickLine={false}
                  width={42}
                />
                <Bar dataKey="value" fill="#18b981" barSize={22} radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MonthlyRevenue