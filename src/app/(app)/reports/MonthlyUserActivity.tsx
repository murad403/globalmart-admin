"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useGetReportsQuery } from "@/redux/features/overview/overview.api";
import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_HEIGHTS = [20, 35, 15, 45, 30, 55, 40, 60, 25, 50, 70, 85];

const MonthlyUserActivity = () => {
  const { data: response, isLoading } = useGetReportsQuery();
  const monthlyUserActivity = response?.data?.monthly_user_activity || [];

  const data = monthlyUserActivity.map((item) => ({
    month: item.month,
    activeUsers: item.active_users,
    newRegistrations: item.new_registrations,
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-semibold text-gray-900">Monthly User Activity</h3>
      <p className="text-xs text-gray-400 mb-2">Active users and registrations</p>
      <div className="h-[220px] w-full">
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
            <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis 
                tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
                tick={{ fontSize: 11, fill: "#9ca3af" }} 
                axisLine={false} 
                tickLine={false} 
                width={40} 
              />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Legend
                iconType="square"
                iconSize={10}
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(value) => <span style={{ color: "#6b7280" }}>{value}</span>}
              />
              <Bar dataKey="activeUsers" name="Active Users" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="newRegistrations" name="New Registrations" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MonthlyUserActivity;