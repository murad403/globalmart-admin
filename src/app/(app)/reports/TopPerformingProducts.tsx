"use client";
import React from "react";
import { useGetReportsQuery } from "@/redux/features/overview/overview.api";
import { Skeleton } from "@/components/ui/skeleton";

const TopPerformingProducts = () => {
  const { data: response, isLoading } = useGetReportsQuery();
  const products = response?.data?.top_performing_products || [];
  const curr = "$";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-semibold text-gray-900">Top Performing Products</h3>
      <p className="text-xs text-gray-400 mb-4">Best sellers by revenue</p>
      <div className="overflow-x-auto">
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
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-3"><Skeleton className="h-4 w-48" /></td>
                  <td className="py-3"><Skeleton className="h-4 w-12" /></td>
                  <td className="py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-3 text-right"><Skeleton className="h-4 w-12 ml-auto" /></td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-xs text-gray-400">
                  No top performing products found
                </td>
              </tr>
            ) : (
              products.map((p, i) => {
                const growthStr = p.growth ?? "N/A";
                const isPositive = !growthStr.startsWith("-");
                const formattedRev = `${curr}${p.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

                return (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 text-gray-800 font-medium">{p.product_name}</td>
                    <td className="py-3 text-gray-600">{p.sales.toLocaleString()}</td>
                    <td className="py-3 text-gray-600">{formattedRev}</td>
                    <td className={`py-3 text-right font-semibold ${growthStr === "N/A" ? "text-gray-400" : isPositive ? "text-green-500" : "text-red-500"}`}>
                      {growthStr}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopPerformingProducts;