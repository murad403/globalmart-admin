import React from "react";

const stats = [
  {
    label: "Total Revenue",
    value: "$788K",
    change: "+18.2% from last month",
    positive: true,
    icon: "$",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Net Profit",
    value: "$285K",
    change: "+24.5% from last month",
    positive: true,
    icon: "📈",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Total Expenses",
    value: "$503K",
    change: "+12.8% from last month",
    positive: false,
    icon: "📋",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    label: "Escrow Balance",
    value: "$340K",
    change: "+15.3% from last month",
    positive: true,
    icon: "💼",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    label: "Commission Earned",
    value: "$156K",
    change: "+21.7% from last month",
    positive: true,
    icon: "💳",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    label: "Savings",
    value: "$128K",
    change: "+9.4% from last month",
    positive: true,
    icon: "🐷",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
];

const FinanceStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between hover:shadow-sm transition-shadow"
        >
          <div>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className={`text-xs font-medium flex items-center gap-1 ${stat.positive ? "text-green-500" : "text-red-500"}`}>
              <span>{stat.positive ? "↗" : "↗"}</span>
              {stat.change}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
            <span className={`text-lg ${stat.iconColor}`}>{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinanceStats;