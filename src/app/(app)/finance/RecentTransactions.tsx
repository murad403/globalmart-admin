import React from "react";

const transactions = [
  { amount: "$12,500", type: "Commission", date: "2024-03-01", status: "Completed" },
  { amount: "$8,700", type: "Subscription", date: "2024-03-02", status: "Completed" },
  { amount: "$15,200", type: "Commission", date: "2024-03-03", status: "Completed" },
];

const RecentTransactions = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-base font-semibold text-gray-900">Recent Transactions</h3>
      <p className="text-xs text-gray-400 mb-4">Latest financial activities</p>
      <div className="space-y-4">
        {transactions.map((tx, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div>
              <p className="text-sm font-semibold text-gray-900">{tx.amount}</p>
              <p className="text-xs text-gray-500">{tx.type}</p>
              <p className="text-xs text-gray-400">{tx.date}</p>
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-md">
              {tx.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;