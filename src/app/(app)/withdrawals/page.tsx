"use client";

import React, { useState, useEffect } from "react";
import {
    useGetOrderWithdrawalsRequestQuery,
    useUpdateWithdrawalStatusMutation
} from "@/redux/features/order/order.api";
import Pagination from "@/components/shared/Pagination";
import PageHeader from "@/components/shared/PageHeader";
import AppModal from "@/components/shared/AppModal";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Search, 
    RotateCcw, 
    X, 
    CheckCircle2, 
    Clock, 
    XCircle, 
    CreditCard, 
    Calendar, 
    DollarSign,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { WithdrawalRequest } from "@/redux/features/order/order.type";

const FILTER_STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
];

const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
        case "approved":
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/80 shadow-2xs">
                    <CheckCircle2 className="size-3.5 text-emerald-600" /> Approved
                </span>
            );
        case "rejected":
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200/80 shadow-2xs">
                    <XCircle className="size-3.5 text-rose-600" /> Rejected
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200/80 shadow-2xs">
                    <Clock className="size-3.5 text-amber-600" /> Pending
                </span>
            );
    }
};

const getPaidBadge = (isPaid: boolean) => {
    if (isPaid) {
        return (
            <span className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Paid
            </span>
        );
    }
    return (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Unpaid
        </span>
    );
};

export default function WithdrawalsPage() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("all");
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Modal state for Rejections
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    // Tracking loading operations per request item
    const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // Reset page on new search
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const { data: response, isLoading, isFetching } = useGetOrderWithdrawalsRequestQuery({
        page,
        status,
        search: debouncedSearch,
    });

    const [updateStatus, { isLoading: isUpdating }] = useUpdateWithdrawalStatusMutation();

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
        setPage(1);
    };

    const resetFilters = () => {
        setSearchInput("");
        setDebouncedSearch("");
        setStatus("all");
        setPage(1);
    };

    // Action 1: Handle Approval Auto-Send
    const handleApprove = async (id: number) => {
        const actionKey = `${id}-approved`;
        setLoadingActionId(actionKey);
        try {
            await updateStatus({
                withdrawal_request_ids: [id],
                action: "approved",
                reason: "Withdraw request approved successfully."
            }).unwrap();
            toast.success(`Withdrawal request #${id} has been approved successfully!`);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to approve withdrawal request");
        } finally {
            setLoadingActionId(null);
        }
    };

    // Action 2: Trigger Reject Reason Modal
    const handleOpenRejectModal = (id: number) => {
        setSelectedWithdrawalId(id);
        setRejectReason("");
        setRejectModalOpen(true);
    };

    // Action 2.1: Confirm Rejection with Reason
    const handleConfirmReject = async () => {
        if (!selectedWithdrawalId) return;
        const actionKey = `${selectedWithdrawalId}-rejected`;
        setLoadingActionId(actionKey);
        try {
            await updateStatus({
                withdrawal_request_ids: [selectedWithdrawalId],
                action: "rejected",
                reason: rejectReason.trim() || "Invalid bank account information."
            }).unwrap();
            toast.success(`Withdrawal request #${selectedWithdrawalId} rejected successfully.`);
            setRejectModalOpen(false);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to reject withdrawal request");
        } finally {
            setLoadingActionId(null);
        }
    };

    // Action 3: Handle Mark as Paid
    const handleMarkPaid = async (id: number) => {
        const actionKey = `${id}-paid`;
        setLoadingActionId(actionKey);
        try {
            await updateStatus({
                withdrawal_request_ids: [id],
                action: "paid",
                reason: "Payment successfully."
            }).unwrap();
            toast.success(`Withdrawal request #${id} marked as Paid!`);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to mark withdrawal request as paid");
        } finally {
            setLoadingActionId(null);
        }
    };

    const withdrawals: WithdrawalRequest[] = response?.data || [];
    const meta = response?.meta;

    return (
        <div className="flex flex-col gap-6">
            {/* Page Header */}
            <PageHeader
                title="Withdrawal Requests"
                description="Manage, search, and verify financial payout requests from users"
            />

            {/* Premium Filter Controls Bar - Pure Horizontal Row Always */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs overflow-x-auto">
                <div className="flex items-center gap-3 min-w-[600px]">
                    {/* Search input */}
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by user email, notes, or payment details..."
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

                    {/* Status Filter Dropdown */}
                    <div className="w-44 shrink-0">
                        <select
                            value={status}
                            onChange={handleStatusChange}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-800 focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer transition-all"
                        >
                            {FILTER_STATUS_OPTIONS.map((opt) => (
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

            {/* Main Data Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                                <th className="py-4 px-5">Request ID</th>
                                <th className="py-4 px-5">User Details</th>
                                <th className="py-4 px-5">Payment Info</th>
                                <th className="py-4 px-5">Amount</th>
                                <th className="py-4 px-5">Payout Status</th>
                                <th className="py-4 px-5">Approval</th>
                                <th className="py-4 px-5">Admin Notes</th>
                                <th className="py-4 px-5 text-right min-w-[180px]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                // Skeleton Loader Rows
                                [...Array(5)].map((_, index) => (
                                    <tr key={index} className="bg-white">
                                        <td className="p-5"><Skeleton className="h-5 w-16 rounded-md mb-1.5" /><Skeleton className="h-3 w-20 rounded" /></td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1.5">
                                                <Skeleton className="h-4 w-36 rounded" />
                                                <Skeleton className="h-3 w-16 rounded" />
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1.5">
                                                <Skeleton className="h-4 w-28 rounded" />
                                                <Skeleton className="h-3 w-24 rounded" />
                                            </div>
                                        </td>
                                        <td className="p-5"><Skeleton className="h-5 w-16 rounded" /></td>
                                        <td className="p-5"><Skeleton className="h-5 w-14 rounded-md" /></td>
                                        <td className="p-5"><Skeleton className="h-6 w-20 rounded-full" /></td>
                                        <td className="p-5"><Skeleton className="h-4 w-44 rounded" /></td>
                                        <td className="p-5 text-right"><Skeleton className="ml-auto h-9 w-28 rounded-xl" /></td>
                                    </tr>
                                ))
                            ) : withdrawals.length === 0 ? (
                                // Empty State
                                <tr>
                                    <td colSpan={8} className="py-16 px-5 text-center">
                                        <div className="mx-auto max-w-sm flex flex-col items-center">
                                            <div className="grid size-14 place-items-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 mb-3 shadow-2xs">
                                                <DollarSign className="size-6 text-slate-500" />
                                            </div>
                                            <p className="text-base font-bold text-slate-900">No withdrawal requests found</p>
                                            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                                                Try modifying your active search parameters or toggle the status filters to view records.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                // Render Actual Withdrawal Requests
                                withdrawals.map((item) => {
                                    const requestDate = item.requested_at ? new Date(item.requested_at).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    }) : "N/A";

                                    const holderName = item.payment_details?.card_holder_name || "N/A";
                                    const cardNumber = item.payment_details?.card_number ? `•••• ${item.payment_details.card_number.slice(-4)}` : "N/A";
                                    const paymentMethod = item.payment_method ? item.payment_method.toUpperCase() : "CARD";

                                    const isItemUpdating = isUpdating && loadingActionId?.startsWith(`${item.id}-`);

                                    return (
                                        <tr
                                            key={item.id}
                                            className={`transition-all hover:bg-slate-50/75 group ${isFetching || isItemUpdating ? "opacity-60" : ""}`}
                                        >
                                            {/* Request ID & Date */}
                                            <td className="py-4 px-5 font-medium">
                                                <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 font-extrabold text-slate-900 text-xs border border-slate-200/60 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors">
                                                    #{item.id}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5 font-medium">
                                                    <Calendar className="size-3 text-slate-400" />
                                                    <span>{requestDate}</span>
                                                </div>
                                            </td>

                                            {/* User Details */}
                                            <td className="py-4 px-5">
                                                <div className="min-w-0">
                                                    <p className="truncate font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                                                        {item.user_email}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        User ID: <span className="font-semibold text-slate-700">{item.user_id}</span>
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Payment Info */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-start gap-2.5">
                                                    <div className="mt-0.5 rounded bg-slate-100 p-1 text-slate-600 shrink-0 border border-slate-200/60">
                                                        <CreditCard className="size-3.5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-slate-800 text-xs leading-tight">
                                                            {holderName}
                                                        </p>
                                                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                                            <span className="font-bold text-slate-700">{paymentMethod}</span> ({cardNumber})
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Amount */}
                                            <td className="py-4 px-5">
                                                <p className="font-extrabold text-slate-900 text-sm">
                                                    ${parseFloat(item.amount || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </p>
                                            </td>

                                            {/* Payout Status (is_paid) */}
                                            <td className="py-4 px-5">
                                                {getPaidBadge(item.is_paid)}
                                            </td>

                                            {/* Approval Status */}
                                            <td className="py-4 px-5">
                                                {getStatusBadge(item.status)}
                                            </td>

                                            {/* Admin Notes */}
                                            <td className="py-4 px-5 max-w-xs">
                                                <p className="text-xs text-slate-600 line-clamp-2 whitespace-pre-line leading-relaxed" title={item.note || ""}>
                                                    {item.note || <span className="text-slate-400 italic">No notes attached</span>}
                                                </p>
                                            </td>

                                            {/* Multi-Action Dynamic Controls Column */}
                                            <td className="py-4 px-5 text-right">
                                                {item.status === "pending" && (
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            title="Approve Request"
                                                            disabled={isUpdating}
                                                            onClick={() => handleApprove(item.id)}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 px-2.5 py-1.5 text-xs font-bold border border-emerald-200/80 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                                                        >
                                                            {loadingActionId === `${item.id}-approved` ? (
                                                                <Loader2 className="size-3.5 animate-spin shrink-0" />
                                                            ) : (
                                                                <CheckCircle2 className="size-3.5 shrink-0" />
                                                            )}
                                                            <span>Approve</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            title="Reject Request"
                                                            disabled={isUpdating}
                                                            onClick={() => handleOpenRejectModal(item.id)}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-rose-50 text-rose-700 px-2.5 py-1.5 text-xs font-bold border border-rose-200/80 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                                                        >
                                                            <XCircle className="size-3.5 shrink-0" />
                                                            <span>Reject</span>
                                                        </button>
                                                    </div>
                                                )}

                                                {item.status === "approved" && !item.is_paid && (
                                                    <button
                                                        type="button"
                                                        title="Mark as Paid"
                                                        disabled={isUpdating}
                                                        onClick={() => handleMarkPaid(item.id)}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-blue-700 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                                                    >
                                                        {loadingActionId === `${item.id}-paid` ? (
                                                            <Loader2 className="size-3.5 animate-spin shrink-0" />
                                                        ) : (
                                                            <DollarSign className="size-3.5 shrink-0" />
                                                        )}
                                                        <span>Mark as Paid</span>
                                                    </button>
                                                )}

                                                {item.status === "approved" && item.is_paid && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                                                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                                        <span>Completed</span>
                                                    </span>
                                                )}

                                                {item.status === "rejected" && (
                                                    <span className="text-xs font-semibold text-slate-400 italic">
                                                        Rejected
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Section */}
                {meta && meta.total_pages > 1 && (
                  <div className="border-t border-slate-100 p-4 flex justify-center bg-slate-50/50">
                      <Pagination
                          currentPage={meta.current_page}
                          totalPages={meta.total_pages}
                          onPageChange={(p) => setPage(p)}
                      />
                  </div>
                )}
            </div>

            {/* Reject Reason Modal Overlay */}
            <AppModal
                open={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                title="Reject Withdrawal Request"
                subtitle={`Provide a clear explanation for rejecting request #${selectedWithdrawalId}`}
                footer={
                    <div className="flex items-center justify-end gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => setRejectModalOpen(false)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={isUpdating || !rejectReason.trim()}
                            onClick={handleConfirmReject}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            {isUpdating && loadingActionId === `${selectedWithdrawalId}-rejected` ? (
                                <Loader2 className="size-3.5 animate-spin" />
                            ) : null}
                            <span>Confirm Rejection</span>
                        </button>
                    </div>
                }
            >
                <div className="flex flex-col gap-2 pt-1">
                    <label htmlFor="reject-reason" className="text-xs font-bold text-slate-700">
                        Rejection Reason <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                        id="reject-reason"
                        rows={3}
                        placeholder="e.g. Invalid bank account information or duplicate payout requested."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none transition-all resize-none"
                    />
                </div>
            </AppModal>
        </div>
    );
}