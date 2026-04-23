import React from "react"
import { Activity, Database, Zap } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const healthData = [
  { label: "Server Load", value: "Current: 23%", icon: Activity },
  { label: "Database Latency", value: "Current: 45ms", icon: Database },
  { label: "API Success Rate", value: "Current: 99.9%", icon: Zap },
]

const SystemHealth = () => {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-900">
          System Health
        </CardTitle>
        <p className="text-xs text-slate-500">Real-time platform status</p>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {healthData.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-6 place-items-center rounded-md bg-slate-100 text-slate-500">
                  <Icon className="size-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.value}</p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Healthy
              </Badge>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default SystemHealth
