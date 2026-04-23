"use client";

import PageHeader from "@/components/shared/PageHeader";
import { Trash } from "lucide-react";
import React, { useState } from "react";

interface Customer {
  id: string;
  name: string;
  location: string;
  label: string;
}

const sampleCustomers: Customer[] = [
  { id: "1", name: "Sarah Johnson", location: "Los Angeles, CA", label: "AI Customer" },
  { id: "2", name: "David Kim", location: "Seattle, WA", label: "AI Customer" },
];

const AvatarIcon = ({ name }: { name: string }) => {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
      {initials}
    </div>
  );
};

interface Props {
  customers?: Customer[];
  onEdit?: (customer: Customer) => void;
  onDelete?: (id: string) => void;
}

const AiCustomers = ({ customers = sampleCustomers, onEdit, onDelete }: Props) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div>
      <PageHeader title="AI Customers" description="Curator and monitor AI shopping agents" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <AvatarIcon name={customer.name} />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{customer.name}</p>
                  <p className="text-xs text-gray-500">{customer.location}</p>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === customer.id ? null : customer.id)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                >
                  ⋯
                </button>
                {openMenuId === customer.id && (
                  <div className="absolute right-0 top-7 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-30">
                    <button
                      onClick={() => { onEdit?.(customer); setOpenMenuId(null); }}
                      className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => { onDelete?.(customer.id); setOpenMenuId(null); }}
                      className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {customer.label}
              </span>
              <button
                onClick={() => onDelete?.(customer.id)}
                className="text-red-400 hover:text-red-600 transition-colors text-base cursor-pointer"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiCustomers;