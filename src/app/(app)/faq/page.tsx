"use client";
import React, { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import AddFaqModal from "./AddFaqModal";
import EditFaqModal from "./EditFaqModal";

export type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

const INITIAL_FAQS: Faq[] = [
  {
    id: "1",
    category: "Getting Started",
    question: "How do I become a wholesaler on GlobalMart?",
    answer: "To become a wholesaler, register for a business account, complete verification, and submit your product catalog for approval.",
  },
  {
    id: "2",
    category: "Payments",
    question: "What payment methods are supported?",
    answer: "We support bank transfers, credit/debit cards, and digital wallets.",
  },
  {
    id: "3",
    category: "Payments",
    question: "How does the escrow system work?",
    answer: "Payments are held in escrow until the buyer confirms receipt and satisfaction.",
  },
  {
    id: "4",
    category: "Integration",
    question: "Can I integrate with my own store?",
    answer: "Yes, we provide a full REST API and webhook support for store integration.",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Getting Started": "bg-blue-50 text-blue-600",
  Payments: "bg-purple-50 text-purple-600",
  Integration: "bg-green-50 text-green-600",
  Shipping: "bg-orange-50 text-orange-600",
  Returns: "bg-red-50 text-red-600",
};

export default function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>(INITIAL_FAQS);
  const [showAdd, setShowAdd] = useState(false);
  const [editFaq, setEditFaq] = useState<Faq | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>("1");

  const handleAdd = (faq: Omit<Faq, "id">) => {
    setFaqs((prev) => [...prev, { ...faq, id: Date.now().toString() }]);
    setShowAdd(false);
  };

  const handleEdit = (updated: Faq) => {
    setFaqs((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    setEditFaq(null);
  };

  const handleDelete = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id))
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage frequently asked questions</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add FAQ
        </button>
      </div>

      <div className="space-y-2">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1.5 ${
                      CATEGORY_COLORS[faq.category] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {faq.category}
                    <svg className={`w-3 h-3 transition-transform ${expandedId === faq.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                  <p className="text-sm font-semibold text-gray-900">{faq.question}</p>
                  {expandedId === faq.id && (
                    <p className="text-sm text-gray-500 mt-1.5">{faq.answer}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditFaq(faq); }}
                  className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>handleDelete(faq.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && <AddFaqModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
      {editFaq && <EditFaqModal faq={editFaq} onClose={() => setEditFaq(null)} onSave={handleEdit} />}
    </div>
  );
}