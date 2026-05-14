"use client";

import React, { useState, useEffect } from "react";
import { 
    Pencil, 
    Trash2, 
    Plus, 
    Search, 
    RotateCcw, 
    X, 
    HelpCircle, 
    Loader2, 
    ChevronDown 
} from "lucide-react";
import { toast } from "sonner";
import { 
    useGetFaqsQuery, 
    useAddFaqMutation, 
    useUpdateFaqMutation, 
    useDeleteFaqMutation 
} from "@/redux/features/faq/faq.api";
import { Faq } from "@/redux/features/faq/faq.type";
import AddFaqModal from "./AddFaqModal";
import EditFaqModal from "./EditFaqModal";
import Pagination from "@/components/shared/Pagination";
import PageHeader from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_COLORS: Record<string, string> = {
  General: "bg-teal-50 text-teal-700 border-teal-200/80",
  "Getting Started": "bg-blue-50 text-blue-700 border-blue-200/80",
  Payments: "bg-purple-50 text-purple-700 border-purple-200/80",
  Integration: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  Shipping: "bg-orange-50 text-orange-700 border-orange-200/80",
  Returns: "bg-rose-50 text-rose-700 border-rose-200/80",
};

const FILTER_CATEGORY_OPTIONS = [
    { value: "all", label: "All Categories" },
    { value: "General", label: "General" },
    { value: "Getting Started", label: "Getting Started" },
    { value: "Payments", label: "Payments" },
    { value: "Integration", label: "Integration" },
    { value: "Shipping", label: "Shipping" },
    { value: "Returns", label: "Returns" },
];

export default function FaqPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [editFaq, setEditFaq] = useState<Faq | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Debounce search input
  useEffect(() => {
      const timer = setTimeout(() => {
          setDebouncedSearch(searchInput);
          setPage(1); // Reset page on new search
      }, 400);
      return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch FAQ query
  const { data: response, isLoading, isFetching } = useGetFaqsQuery({
      page,
      category,
      search: debouncedSearch,
  });

  // RTK Query Mutations
  const [addFaqMutation] = useAddFaqMutation();
  const [updateFaqMutation] = useUpdateFaqMutation();
  const [deleteFaqMutation] = useDeleteFaqMutation();

  const resetFilters = () => {
      setSearchInput("");
      setDebouncedSearch("");
      setCategory("all");
      setPage(1);
  };

  const handleAdd = async (data: { category: string; question: string; answer: string }) => {
      try {
          await addFaqMutation(data).unwrap();
          toast.success("FAQ created successfully");
          setShowAdd(false);
      } catch (error: any) {
          toast.error(error?.data?.message || "Failed to create FAQ");
      }
  };

  const handleEdit = async (id: number, data: { category: string; question: string; answer: string }) => {
      try {
          await updateFaqMutation({ id, data }).unwrap();
          toast.success("FAQ updated successfully");
          setEditFaq(null);
      } catch (error: any) {
          toast.error(error?.data?.message || "Failed to update FAQ");
      }
  };

  const handleDelete = async (id: number) => {
      setDeletingId(id);
      try {
          await deleteFaqMutation({ id }).unwrap();
          toast.success("FAQ deleted successfully");
      } catch (error: any) {
          toast.error(error?.data?.message || "Failed to delete FAQ");
      } finally {
          setDeletingId(null);
      }
  };

  const faqs: Faq[] = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
        <PageHeader
            title="Frequently Asked Questions"
            description="Manage, search, and organize frequently asked questions and answers"
        />
        <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all hover:shadow-md shrink-0 cursor-pointer"
        >
            <Plus className="size-4.5" />
            Add FAQ
        </button>
      </div>

      {/* Premium Filter Controls Bar - Pure Horizontal Row Always */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs overflow-x-auto">
          <div className="flex items-center gap-3 min-w-[600px]">
              {/* Search input */}
              <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                      type="text"
                      placeholder="Search questions or answers..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none transition-all"
                  />
                  {searchInput && (
                      <button
                          type="button"
                          onClick={() => setSearchInput("")}
                          className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                          <X className="size-4" />
                      </button>
                  )}
              </div>

              {/* Category Filter Dropdown */}
              <div className="w-48 shrink-0">
                  <select
                      value={category}
                      onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-800 focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer transition-all"
                  >
                      {FILTER_CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                              {opt.label}
                          </option>
                      ))}
                  </select>
              </div>

              {/* Reset button */}
              <button
                  type="button"
                  onClick={resetFilters}
                  title="Reset Filters"
                  className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 shrink-0 cursor-pointer"
              >
                  <RotateCcw className="size-4.5" />
              </button>
          </div>
      </div>

      {/* FAQ List / Contents */}
      <div className="space-y-3">
          {isLoading ? (
              // Skeleton Loaders
              [...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs">
                      <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2.5 flex-1">
                              <Skeleton className="h-5 w-24 rounded-full" />
                              <Skeleton className="h-4 w-3/4 rounded" />
                          </div>
                          <Skeleton className="h-8 w-16 rounded-lg shrink-0" />
                      </div>
                  </div>
              ))
          ) : faqs.length === 0 ? (
              // Empty State
              <div className="rounded-2xl border border-slate-200 bg-white py-16 px-5 text-center shadow-xs">
                  <div className="mx-auto max-w-sm flex flex-col items-center">
                      <div className="grid size-14 place-items-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 mb-3 shadow-2xs">
                          <HelpCircle className="size-6 text-slate-500" />
                      </div>
                      <p className="text-base font-bold text-slate-900">No FAQs found</p>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                          Try modifying your search parameters or toggle the active category filters to view records.
                      </p>
                  </div>
              </div>
          ) : (
              // Render Actual FAQs
              faqs.map((faq) => {
                  const isExpanded = expandedId === faq.id;
                  const isDeletingThis = deletingId === faq.id;

                  return (
                      <div 
                          key={faq.id} 
                          className={`bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs transition-all hover:border-slate-300 ${isFetching ? "opacity-70" : ""}`}
                      >
                          <div
                              className="flex items-start justify-between px-5 py-4 cursor-pointer select-none group"
                              onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                          >
                              <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                                  <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-2">
                                          <span
                                              className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-md border tracking-wide uppercase ${
                                                  CATEGORY_COLORS[faq.category] || "bg-slate-50 text-slate-600 border-slate-200"
                                              }`}
                                          >
                                              {faq.category}
                                          </span>
                                      </div>
                                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                          <span>{faq.question}</span>
                                          <ChevronDown className={`size-4 text-slate-400 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180 text-blue-600" : ""}`} />
                                      </h3>
                                      
                                      {isExpanded && (
                                          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed pr-2 animate-in fade-in-50 duration-200">
                                              {faq.answer}
                                          </div>
                                      )}
                                  </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                                  <button
                                      type="button"
                                      title="Edit FAQ"
                                      onClick={(e) => { 
                                          e.stopPropagation(); 
                                          setEditFaq(faq); 
                                      }}
                                      className="grid size-8 place-items-center text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  >
                                      <Pencil className="size-4" />
                                  </button>
                                  <button
                                      type="button"
                                      title="Delete FAQ"
                                      disabled={isDeletingThis}
                                      onClick={(e) => { 
                                          e.stopPropagation(); 
                                          handleDelete(faq.id); 
                                      }}
                                      className="grid size-8 place-items-center text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                  >
                                      {isDeletingThis ? (
                                          <Loader2 className="size-4 animate-spin text-rose-600" />
                                      ) : (
                                          <Trash2 className="size-4" />
                                      )}
                                  </button>
                              </div>
                          </div>
                      </div>
                  );
              })
          )}
      </div>

      {/* Pagination Section */}
      {meta && meta.total_pages > 1 && (
          <div className="flex justify-center pt-2">
              <Pagination
                  currentPage={meta.current_page}
                  totalPages={meta.total_pages}
                  onPageChange={(p) => setPage(p)}
              />
          </div>
      )}

      {/* Modals */}
      {showAdd && (
          <AddFaqModal 
              onClose={() => setShowAdd(false)} 
              onSave={handleAdd} 
          />
      )}
      {editFaq && (
          <EditFaqModal 
              faq={editFaq} 
              onClose={() => setEditFaq(null)} 
              onSave={handleEdit} 
          />
      )}
    </div>
  );
}