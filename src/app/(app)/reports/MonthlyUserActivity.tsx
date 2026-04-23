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

const data = [
  { month: "Jan", activeUsers: 900, newRegistrations: 200 },
  { month: "Feb", activeUsers: 950, newRegistrations: 180 },
  { month: "Mar", activeUsers: 880, newRegistrations: 220 },
  { month: "Apr", activeUsers: 920, newRegistrations: 240 },
  { month: "May", activeUsers: 980, newRegistrations: 260 },
  { month: "Jun", activeUsers: 1150, newRegistrations: 280 },
  { month: "Jul", activeUsers: 1000, newRegistrations: 250 },
];

const MonthlyUserActivity = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-semibold text-gray-900">Monthly User Activity</h3>
      <p className="text-xs text-gray-400 mb-2">Active users and registrations</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={40} />
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
    </div>
  );
};

export default MonthlyUserActivity;