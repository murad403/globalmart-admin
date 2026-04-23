"use client"

import React from "react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const legend = [
  { label: "Wholesalers", dotClass: "bg-blue-500", textClass: "text-blue-500" },
  { label: "Retailers", dotClass: "bg-emerald-500", textClass: "text-emerald-500" },
  { label: "Customers", dotClass: "bg-amber-500", textClass: "text-amber-500" },
]

const distributionData = [
  { name: "Wholesalers", value: 40, color: "#3b82f6" },
  { name: "Retailers", value: 25, color: "#10b981" },
  { name: "Customers", value: 35, color: "#f59e0b" },
]

const UserDistribution = () => {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-900">
          User Distribution
        </CardTitle>
        <p className="text-xs text-slate-500">By account type</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 pt-2">
        <div className="h-38 w-full max-w-55">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                startAngle={0}
                endAngle={360}
                paddingAngle={1}
              >
                {distributionData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="#ffffff" strokeWidth={1} style={{outline: "none "}} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
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
