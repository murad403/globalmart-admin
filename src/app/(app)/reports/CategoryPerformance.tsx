"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useGetReportsQuery } from "@/redux/features/overview/overview.api";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#f87171", "#8b5cf6", "#ec4899"];

const CategoryPerformance = () => {
  const { data: response, isLoading } = useGetReportsQuery();
  const categoryPerformance = response?.data?.category_performance || [];

  const data = categoryPerformance.map((item) => ({
    name: `${item.category}: ${Math.round(item.percentage)}%`,
    value: item.percentage,
    qty: item.qty,
  }));

  const hasData = data.length > 0 && data.some((d) => d.value > 0);
  const displayData = hasData 
    ? data 
    : [{ name: "No Data: 0%", value: 1 }];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-semibold text-gray-900">Category Performance</h3>
      <p className="text-xs text-gray-400 mb-2">Sales distribution by category</p>
      <div className="h-[220px] w-full flex items-center justify-center">
        {isLoading ? (
          <Skeleton className="size-32 rounded-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="40%"
                cy="50%"
                outerRadius={85}
                dataKey="value"
                label={({ name, cx, cy, midAngle, outerRadius }) => {
                  const RADIAN = Math.PI / 180;
                  const safeCx = cx ?? 0;
                  const safeCy = cy ?? 0;
                  const safeMidAngle = midAngle ?? 0;
                  const safeOuterRadius = outerRadius ?? 0;
                  const r = safeOuterRadius + 20;
                  const x = safeCx + r * Math.cos(-safeMidAngle * RADIAN);
                  const y = safeCy + r * Math.sin(-safeMidAngle * RADIAN);
                  return (
                    <text x={x} y={y} fill="#374151" textAnchor={x > safeCx ? "start" : "end"} dominantBaseline="central" fontSize={11}>
                      {name}
                    </text>
                  );
                }}
                labelLine={true}
              >
                {displayData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={hasData ? COLORS[index % COLORS.length] : "#e2e8f0"} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, item) => {
                  const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
                  const qty = item?.payload?.qty;
                  return qty !== undefined ? [`${numericValue.toFixed(2)}% (Qty: ${qty})`, "Share"] : [`${numericValue.toFixed(2)}%`, "Share"];
                }}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CategoryPerformance;