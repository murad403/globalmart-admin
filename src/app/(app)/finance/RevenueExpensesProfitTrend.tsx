"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 45000, expenses: 28000, profit: 12000 },
  { month: "Feb", revenue: 48000, expenses: 30000, profit: 14000 },
  { month: "Mar", revenue: 52000, expenses: 31000, profit: 16000 },
  { month: "Apr", revenue: 55000, expenses: 33000, profit: 17000 },
  { month: "May", revenue: 58000, expenses: 34000, profit: 18500 },
  { month: "Jun", revenue: 62000, expenses: 36000, profit: 20000 },
  { month: "Jul", revenue: 68000, expenses: 38000, profit: 22000 },
  { month: "Aug", revenue: 65000, expenses: 37000, profit: 21000 },
  { month: "Sep", revenue: 70000, expenses: 39000, profit: 23000 },
  { month: "Oct", revenue: 78000, expenses: 42000, profit: 26000 },
  { month: "Nov", revenue: 82000, expenses: 44000, profit: 28000 },
  { month: "Dec", revenue: 80000, expenses: 43000, profit: 27000 },
];

const RevenueExpensesProfitTrend = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-semibold text-gray-900">Revenue, Expenses & Profit Trend</h3>
      <p className="text-xs text-gray-400 mb-4">12-month financial overview</p>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f9a8d4" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f9a8d4" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6ee7b7" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={55} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
            formatter={(v: number) => `$${v.toLocaleString()}`}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            formatter={(value) => <span style={{ color: "#6b7280" }}>{value}</span>}
          />
          <Area type="monotone" dataKey="revenue" name="revenue" stroke="#60a5fa" strokeWidth={2} fill="url(#colorRevenue)" />
          <Area type="monotone" dataKey="expenses" name="expenses" stroke="#f472b6" strokeWidth={2} fill="url(#colorExpenses)" />
          <Area type="monotone" dataKey="profit" name="profit" stroke="#34d399" strokeWidth={2} fill="url(#colorProfit)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueExpensesProfitTrend;