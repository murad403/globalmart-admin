"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, X, CheckCircle2, Clock, DollarSign, Receipt, Loader2, Check, Ban } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPaymentConfirmationQuery, usePaymentConfirmationMutation } from "@/redux/features/overview/overview.api";
import {
  PaymentConfirmationItem,
  PaymentConfirmationMutationResponse
} from "@/redux/features/overview/overview.type";

import PaymentRejectModal from "./PaymentRejectModal";
import PaymentAcceptModal from "./PaymentAcceptModal";

const orderStatusBadges: Record<string, string> = {
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  confirmed: "bg-blue-50 text-blue-700 border-blue-100",
  processing: "bg-purple-50 text-purple-700 border-purple-100",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
};

const paymentStatusBadges: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  confirmed: "bg-blue-100 text-blue-800",
  pending: "bg-amber-100 text-amber-800",
  failed: "bg-rose-100 text-rose-800",
};

export default function FinancePage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Local state for modals and processing action indicators
  const [rejectOrderId, setRejectOrderId] = useState<number | null>(null);
  const [acceptResultData, setAcceptResultData] = useState<PaymentConfirmationMutationResponse | null>(null);
  const [processingOrderId, setProcessingOrderId] = useState<number | null>(null);

  // Debounce search input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset page on query update
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // RTK Query Hooks
  const { data: response, isLoading, isFetching } = useGetPaymentConfirmationQuery({
    page,
    search: debouncedSearch,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const [paymentConfirmationMutation, { isLoading: isMutating }] = usePaymentConfirmationMutation();

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  // 1. Direct Accept Handler
  const handleAcceptDirect = async (orderId: number) => {
    setProcessingOrderId(orderId);
    try {
      const res = await paymentConfirmationMutation({
        order_id: orderId,
        action: "confirm",
        reason: "Payment verified successfully.",
      }).unwrap();

      toast.success(`Payment verified successfully for Order #${orderId}`);
      // Show success modal displaying detailed breakdown parameters
      setAcceptResultData(res);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to confirm payment verification.");
    } finally {
      setProcessingOrderId(null);
    }
  };

  // 2. Reject Form Submit Handler
  const handleRejectSubmit = async (reasonText: string) => {
    if (!rejectOrderId) return;
    setProcessingOrderId(rejectOrderId);
    try {
      await paymentConfirmationMutation({
        order_id: rejectOrderId,
        action: "cancel",
        reason: reasonText,
      }).unwrap();

      toast.success(`Payment rejected successfully for Order #${rejectOrderId}`);
      setRejectOrderId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to process payment rejection.");
      throw error;
    } finally {
      setProcessingOrderId(null);
    }
  };

  const records: PaymentConfirmationItem[] = response?.data || [];
  const meta = response?.meta;
  const stats = response?.stats;

  return (
    <main className="flex flex-col gap-6">
      {/* Top Main Heading */}
      <div className="flex items-center justify-between gap-4 mb-1">
        <PageHeader
          title="Payment Confirmations"
          description="Verify customer order transactions, synchronize seller settlements, and moderate escrows"
        />
      </div>

      {/* Top Metric Overview Summary Cards Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Orders Count */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Verification</span>
            <div className="grid size-8 place-items-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">
              {isLoading ? <Skeleton className="h-7 w-12" /> : stats?.pending_count ?? 0}
            </div>
            <span className="text-[11px] text-slate-400 font-medium block mt-0.5">Orders waiting verification</span>
          </div>
        </div>

        {/* Pending Settlement Volume */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unsettled Escrow</span>
            <div className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <DollarSign className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-blue-600">
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                `$${parseFloat(stats?.pending_amount?.toString() || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-medium block mt-0.5">Pending volume buffer</span>
          </div>
        </div>

        {/* Confirmed Settlements Count */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Settled Transactions</span>
            <div className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">
              {isLoading ? <Skeleton className="h-7 w-12" /> : stats?.confirmed_count ?? 0}
            </div>
            <span className="text-[11px] text-slate-400 font-medium block mt-0.5">Successfully confirmed orders</span>
          </div>
        </div>

        {/* Settled Value Volume */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Settled Volume</span>
            <div className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <Receipt className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-600">
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                `$${parseFloat(stats?.confirmed_amount?.toString() || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-medium block mt-0.5">Total cleared credits</span>
          </div>
        </div>
      </section>

      {/* Filter Bar Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID or Email or Name..."
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

          {/* Status Dropdown Selection */}
          <div className="sm:w-48 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 focus:border-slate-900 focus:outline-none transition-all cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Reset Filters trigger */}
          <button
            type="button"
            onClick={resetFilters}
            title="Reset Filters"
            className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 shrink-0 cursor-pointer self-end sm:self-auto"
          >
            <RotateCcw className="size-4.5" />
          </button>
        </div>
      </div>

      {/* Main Ledger Records Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-xs uppercase text-slate-500 tracking-wider">
                <th className="px-5 py-3.5 font-semibold">Order ID</th>
                <th className="px-5 py-3.5 font-semibold">Owner ID</th>
                <th className="px-5 py-3.5 font-semibold">Customer ID</th>
                <th className="px-5 py-3.5 font-semibold">Order Total</th>
                <th className="px-5 py-3.5 font-semibold">Order Status</th>
                <th className="px-5 py-3.5 font-semibold">Payment Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className={`divide-y divide-slate-100 ${isFetching ? "opacity-75 transition-opacity" : ""}`}>
              {isLoading ? (
                // Table Skeletons
                [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-5 w-16 rounded-md" /></td>
                    <td className="px-5 py-4 text-right"><Skeleton className="h-8 w-32 ml-auto" /></td>
                  </tr>
                ))
              ) : records.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="grid size-12 place-items-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 mb-2">
                        <Receipt className="size-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800">No payment records found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Adjust filter keywords or status views to find records</p>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((item) => {
                  const orderBadge = orderStatusBadges[item.status?.toLowerCase()] || "bg-slate-50 text-slate-700 border-slate-100";
                  const paymentBadge = paymentStatusBadges[item.payment_status?.toLowerCase()] || "bg-slate-100 text-slate-800";
                  const isCurrentRowProcessing = processingOrderId === item.id;
                  const isActionDisabled = isMutating || isCurrentRowProcessing || item.is_paid || item.status?.toLowerCase() !== "delivered";
                  const actionTitle = item.is_paid 
                    ? "Payment already confirmed as paid" 
                    : item.status?.toLowerCase() !== "delivered" 
                    ? "Order status must be delivered to verify payment" 
                    : "Execute action";

                  return (
                    <tr key={item.id} className="text-sm text-slate-700 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-extrabold text-slate-900 block">#{item.id}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[120px]">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-600">
                        {item.owner_id ? `Owner #${item.owner_id}` : "N/A"}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-600">
                        {item.customer_id ? `Customer #${item.customer_id}` : "N/A"}
                      </td>

                      <td className="px-5 py-4 font-extrabold text-slate-900">
                        ${parseFloat(item.order_total_price || "0").toFixed(2)}
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize tracking-wide border shadow-2xs ${orderBadge}`}>
                          {item.status || "pending"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${paymentBadge}`}>
                          {item.payment_status || "unpaid"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Direct Accept Verification Button */}
                          <button
                            type="button"
                            onClick={() => handleAcceptDirect(item.id)}
                            disabled={isActionDisabled}
                            className={`inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 px-3 py-1.5 text-xs font-bold transition-all border border-emerald-100 shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={actionTitle}
                          >
                            {isCurrentRowProcessing ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Check className="size-3.5 stroke-3" />
                            )}
                            <span>Accept</span>
                          </button>

                          {/* Reject Trigger Triggering Reason Input Modal */}
                          <button
                            type="button"
                            onClick={() => setRejectOrderId(item.id)}
                            disabled={isActionDisabled}
                            className={`inline-flex items-center gap-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 px-3 py-1.5 text-xs font-bold transition-all border border-rose-100 shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={actionTitle}
                          >
                            <Ban className="size-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination View Area */}
      {meta && meta.total_pages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.total_pages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Rejection Submission Layer */}
      <PaymentRejectModal
        open={!!rejectOrderId}
        orderId={rejectOrderId}
        isSubmitting={isMutating}
        onClose={() => setRejectOrderId(null)}
        onSubmit={handleRejectSubmit}
      />

      {/* Success Notification Breakdown View Layer */}
      <PaymentAcceptModal
        open={!!acceptResultData}
        result={acceptResultData}
        onClose={() => setAcceptResultData(null)}
      />
    </main>
  );
}