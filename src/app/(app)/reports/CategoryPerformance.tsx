"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Electronics: 38%", value: 38 },
  { name: "Clothing: 25%", value: 25 },
  { name: "Home & Living: 22%", value: 22 },
  { name: "Sports: 15%", value: 15 },
];

const COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#f87171"];

const CategoryPerformance = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-semibold text-gray-900">Category Performance</h3>
      <p className="text-xs text-gray-400 mb-2">Sales distribution by category</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="40%"
            cy="50%"
            outerRadius={85}
            dataKey="value"
            label={({ name, cx, cy, midAngle, outerRadius }) => {
              const RADIAN = Math.PI / 180;
              const r = outerRadius + 20;
              const x = cx + r * Math.cos(-midAngle * RADIAN);
              const y = cy + r * Math.sin(-midAngle * RADIAN);
              return (
                <text x={x} y={y} fill="#374151" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={11}>
                  {name}
                </text>
              );
            }}
            labelLine={true}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPerformance;