"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

const data = [
  { week: "Week 1", inflow: 135000, outflow: 0 },
  { week: "Week 2", inflow: 155000, outflow: 0 },
  { week: "Week 3", inflow: 148000, outflow: 0 },
  { week: "Week 4", inflow: 175000, outflow: 0 },
];

const CashFlowAnalysis = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-semibold text-gray-900">Cash Flow Analysis</h3>
      <p className="text-xs text-gray-400 mb-4">Weekly inflow vs outflow</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={55} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
            formatter={(v: number) => `$${v.toLocaleString()}`}
          />
          <Legend
            iconType="square"
            iconSize={10}
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            formatter={(value) => <span style={{ color: "#6b7280" }}>{value}</span>}
          />
          <Bar dataKey="inflow" name="Inflow" fill="#10B981" radius={[4, 4, 0, 0]} barSize={50}/>
          <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={50}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashFlowAnalysis;