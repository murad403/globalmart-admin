"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useGetReportsQuery } from "@/redux/features/overview/overview.api";
import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_HEIGHTS = [30, 45, 25, 60, 50, 75];

const SalesPerformanceTrend = () => {
  const { data: response, isLoading } = useGetReportsQuery();
  const data = response?.data?.sales_performance_trend || [];
  const currSymbol = "$";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-semibold text-gray-900">Sales Performance Trend</h3>
      <p className="text-xs text-gray-400 mb-4">6-month sales, orders, and customer data</p>
      <div className="h-[240px] w-full">
        {isLoading ? (
          <div className="flex h-full w-full items-end justify-between gap-4 pt-6 pb-2 px-2">
            {SKELETON_HEIGHTS.map((h, i) => (
              <Skeleton 
                key={i} 
                className="w-full rounded-t-md" 
                style={{ height: `${h}%` }} 
              />
            ))}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis 
                tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
                tick={{ fontSize: 11, fill: "#9ca3af" }} 
                axisLine={false} 
                tickLine={false} 
                width={45} 
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(value) => <span style={{ color: "#6b7280" }}>{value}</span>}
              />
              <Line type="monotone" dataKey="sales" name={`Sales (${currSymbol})`} stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="orders" name="Orders" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="customers" name="Customers" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesPerformanceTrend;