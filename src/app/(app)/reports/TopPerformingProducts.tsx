import React from "react";

const products = [
  { name: "Wireless Headphones XT", sales: 1245, revenue: "$62,250", growth: "+18%", positive: true },
  { name: "Smart Watch Pro", sales: 987, revenue: "$49,350", growth: "+24%", positive: true },
  { name: "Coffee Maker 2000", sales: 876, revenue: "$43,800", growth: "+12%", positive: true },
  { name: "Yoga Mat Premium", sales: 765, revenue: "$38,250", growth: "+8%", positive: true },
  { name: "Summer Cotton Dress", sales: 654, revenue: "$32,700", growth: "+15%", positive: true },
];

const TopPerformingProducts = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-semibold text-gray-900">Top Performing Products</h3>
      <p className="text-xs text-gray-400 mb-4">Best sellers by revenue</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2 text-xs font-semibold text-gray-500">Product Name</th>
            <th className="text-left py-2 text-xs font-semibold text-gray-500">Sales</th>
            <th className="text-left py-2 text-xs font-semibold text-gray-500">Revenue</th>
            <th className="text-right py-2 text-xs font-semibold text-gray-500">Growth</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className="py-3 text-gray-800 font-medium">{p.name}</td>
              <td className="py-3 text-gray-600">{p.sales.toLocaleString()}</td>
              <td className="py-3 text-gray-600">{p.revenue}</td>
              <td className={`py-3 text-right font-semibold ${p.positive ? "text-green-500" : "text-red-500"}`}>
                {p.growth}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopPerformingProducts;