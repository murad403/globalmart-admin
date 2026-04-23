"use client";
import React, { useState } from "react";
import RecentOrders from "./RecentOrders";
import AiCustomers from "./AiCustomers";
import CreateAiCustomerModal from "./CreateAiCustomerModal";
import EditAiCustomerModal from "./EditAiCustomerModal";
import TriggerOrderModal from "./TriggerOrderModal";

interface Customer {
  id: string;
  name: string;
  location: string;
  label: string;
}

const initialCustomers: Customer[] = [
  { id: "1", name: "Sarah Johnson", location: "Los Angeles, CA", label: "AI Customer" },
  { id: "2", name: "David Kim", location: "Seattle, WA", label: "AI Customer" },
];

const Page = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [showCreate, setShowCreate] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const handleCreate = (data: { name: string; email: string; location: string }) => {
    const newCustomer: Customer = {
      id: String(Date.now()),
      name: data.name,
      location: data.location,
      label: "AI Customer",
    };
    setCustomers((prev) => [...prev, newCustomer]);
  };

  const handleSaveEdit = (data: { aiName: string; assignedReseller: string; status: string }) => {
    if (!editCustomer) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === editCustomer.id ? { ...c, name: data.aiName } : c
      )
    );
    setEditCustomer(null);
  };

  const handleDelete = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div >
        {/* Header Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setShowCreate(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm cursor-pointer"
          >
            <span className="text-lg leading-none">+</span>
            Create AI Customer
          </button>
          <button
            onClick={() => setShowTrigger(true)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm cursor-pointer"
          >
            <span>⚡</span>
            Trigger Order
          </button>
        </div>

        {/* AI Customers Section */}
        <AiCustomers
          customers={customers}
          onEdit={(customer) => setEditCustomer(customer)}
          onDelete={handleDelete}
        />

        {/* Recent Orders Section */}
        <RecentOrders />
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateAiCustomerModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}

      {editCustomer && (
        <EditAiCustomerModal
          onClose={() => setEditCustomer(null)}
          defaultValues={{ aiName: editCustomer.name, assignedReseller: "", status: "" }}
          onSave={handleSaveEdit}
        />
      )}

      {showTrigger && (
        <TriggerOrderModal onClose={() => setShowTrigger(false)} />
      )}
    </div>
  );
};

export default Page;