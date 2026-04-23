import React from "react";
import Image from "next/image";

interface Order {
  id: string;
  product: string;
  customer: string;
  customerAvatar?: string;
  isAI?: boolean;
  reseller: string;
  amount: string;
  status: "pending" | "accepted" | "completed" | "shipped";
}

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
};

const sampleOrders: Order[] = [
  { id: "order-6", product: "Smart Watch Pro", customer: "David Kim", isAI: true, reseller: "Electronics Hub", amount: "$151.30", status: "pending" },
  { id: "order-1", product: "Wireless Bluetooth Headphones", customer: "Sarah Johnson", isAI: true, reseller: "Tech Reseller Store", amount: "$159.98", status: "pending" },
  { id: "order-2", product: "Smart Watch Pro", customer: "Michael Chen", isAI: true, reseller: "Tech Reseller Store", amount: "$149.99", status: "accepted" },
  { id: "order-3", product: "USB-C Fast Charging Cable", customer: "Emily Rodriguez", isAI: true, reseller: "Electronics Hub", amount: "$79.95", status: "completed" },
  { id: "order-4", product: "Portable Power Bank 20000mAh", customer: "David Kim", isAI: true, reseller: "Smart Gadgets Pro", amount: "$119.97", status: "shipped" },
];

interface Props {
  orders?: Order[];
}

const AvatarPlaceholder = ({ name }: { name: string }) => {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["bg-orange-400", "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-pink-400"];
  const colorIndex = name.charCodeAt(0) % colors.length;
  return (
    <div className={`w-7 h-7 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
      {initials}
    </div>
  );
};

const RecentOrders = ({ orders = sampleOrders }: Props) => {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reseller</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === orders.length - 1 ? "border-b-0" : ""}`}>
                <td className="px-5 py-3.5 text-gray-700 font-medium">{order.id}</td>
                <td className="px-5 py-3.5 text-gray-700">{order.product}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <AvatarPlaceholder name={order.customer} />
                    <span className="text-gray-700">{order.customer}</span>
                    {order.isAI && (
                      <span className="bg-blue-100 text-blue-600 text-[10px] font-semibold px-1.5 py-0.5 rounded">AI</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-600">{order.reseller}</td>
                <td className="px-5 py-3.5 text-gray-800 font-medium">{order.amount}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;