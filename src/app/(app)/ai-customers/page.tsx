"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGetAllAiUsersQuery } from "@/redux/features/user/user.api";
import PageHeader from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Search, 
    RotateCcw, 
    X, 
    CheckCircle2, 
    XCircle, 
    Eye, 
    Bot, 
    Plus, 
    Calendar, 
    Briefcase,
    Mail,
    Phone
} from "lucide-react";
import { User } from "@/redux/features/user/user.type";

const getActiveBadge = (isActive: boolean) => {
    if (isActive) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200/80 shadow-2xs">
                <CheckCircle2 className="size-3.5 text-emerald-600" /> Active
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-800 border border-rose-200/80 shadow-2xs">
            <XCircle className="size-3.5 text-rose-600" /> Suspended
        </span>
    );
};

export default function AiCustomersPage() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const { data: response, isLoading, isFetching } = useGetAllAiUsersQuery({
        page,
        search: debouncedSearch,
    });

    const resetFilters = () => {
        setSearchInput("");
        setDebouncedSearch("");
        setPage(1);
    };

    const customers: User[] = response?.data || [];
    const meta = response?.meta;

    return (
        <div className="flex flex-col gap-6">
            {/* Header section with Create Button placed on top right side */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <PageHeader 
                    title="AI Customers" 
                    description="Manage, monitor, and provision AI-driven virtual trading accounts" 
                />

                <Link
                    href="/ai-customers/create-ai-customer"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-xs transition-all hover:bg-blue-700 hover:shadow-md shrink-0"
                >
                    <Plus className="size-4.5 stroke-[3]" />
                    <span>Create AI Customer</span>
                </Link>
            </div>

            {/* Premium Filter Controls Bar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs overflow-x-auto">
                <div className="flex items-center gap-3 min-w-[400px]">
                    {/* Search input */}
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search AI customers by name, email, or phone..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm font-medium text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:bg-white focus:outline-none transition-all"
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

                    {/* Reset button */}
                    <button
                        type="button"
                        onClick={resetFilters}
                        title="Reset Filters"
                        className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-950 hover:text-white hover:border-slate-950 shrink-0 cursor-pointer"
                    >
                        <RotateCcw className="size-4.5" />
                    </button>
                </div>
            </div>

            {/* Main AI Customers Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm min-w-[850px]">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                                <th className="py-4 px-5 w-20">ID</th>
                                <th className="py-4 px-5">AI Profile</th>
                                <th className="py-4 px-5">Contact Phone</th>
                                <th className="py-4 px-5">Business Name</th>
                                <th className="py-4 px-5">Created Date</th>
                                <th className="py-4 px-5">Status</th>
                                <th className="py-4 px-5 text-right w-28">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                // Skeleton Loader Rows
                                [...Array(5)].map((_, index) => (
                                    <tr key={index} className="bg-white">
                                        <td className="p-5"><Skeleton className="h-5 w-10 rounded" /></td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1.5">
                                                <Skeleton className="h-4 w-32 rounded" />
                                                <Skeleton className="h-3 w-40 rounded" />
                                            </div>
                                        </td>
                                        <td className="p-5"><Skeleton className="h-4 w-28 rounded" /></td>
                                        <td className="p-5"><Skeleton className="h-4 w-32 rounded" /></td>
                                        <td className="p-5"><Skeleton className="h-4 w-24 rounded" /></td>
                                        <td className="p-5"><Skeleton className="h-6 w-20 rounded-full" /></td>
                                        <td className="p-5 text-right"><Skeleton className="ml-auto h-8 w-20 rounded-lg" /></td>
                                    </tr>
                                ))
                            ) : customers.length === 0 ? (
                                // Empty State
                                <tr>
                                    <td colSpan={7} className="py-16 px-5 text-center">
                                        <div className="mx-auto max-w-sm flex flex-col items-center">
                                            <div className="grid size-14 place-items-center rounded-full bg-indigo-50 text-indigo-500 border border-indigo-100 mb-3 shadow-2xs">
                                                <Bot className="size-6" />
                                            </div>
                                            <p className="text-base font-extrabold text-slate-950">No AI Customers Found</p>
                                            <p className="mt-1 text-xs text-slate-500 leading-relaxed font-medium">
                                                No simulated AI users currently match your search criteria. Click &quot;Create AI Customer&quot; above to setup a new virtual account.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                // Render Actual Customers
                                customers.map((user) => {
                                    const createdDate = user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    }) : "N/A";

                                    let businessName = "N/A";
                                    if (user.profile && 'business_name' in user.profile && user.profile.business_name) {
                                        businessName = user.profile.business_name;
                                    }

                                    return (
                                        <tr
                                            key={user.id}
                                            className={`transition-all hover:bg-slate-50/75 group ${isFetching ? "opacity-60" : ""}`}
                                        >
                                            {/* ID */}
                                            <td className="py-4 px-5 font-bold text-slate-950">
                                                #{user.id}
                                            </td>

                                            {/* AI Profile */}
                                            <td className="py-4 px-5">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="font-extrabold text-slate-950 text-sm truncate group-hover:text-blue-600 transition-colors">
                                                            {user.full_name || "Unnamed AI"}
                                                        </p>
                                                        <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-extrabold text-indigo-700 border border-indigo-200">
                                                            AI
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-700 mt-1 truncate font-medium">
                                                        <Mail className="size-3.5 shrink-0 text-slate-500" />
                                                        <span className="truncate">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact Phone */}
                                            <td className="py-4 px-5">
                                                {user.phone ? (
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-950 font-bold">
                                                        <Phone className="size-3.5 text-slate-500 shrink-0" />
                                                        <span>{user.phone}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">No Phone</span>
                                                )}
                                            </td>

                                            {/* Business Name */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-950 font-bold">
                                                    <Briefcase className="size-3.5 text-slate-500 shrink-0" />
                                                    <span className="truncate max-w-[150px]" title={businessName}>
                                                        {businessName}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Created Date */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
                                                    <Calendar className="size-3.5 text-slate-500 shrink-0" />
                                                    <span>{createdDate}</span>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-5">
                                                {getActiveBadge(user.is_active)}
                                            </td>

                                            {/* Actions Column */}
                                            <td className="py-4 px-5 text-right">
                                                <Link
                                                    href={`/ai-customers/${user.id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 border border-slate-200/80 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all shadow-2xs"
                                                    title="View AI Details"
                                                >
                                                    <Eye className="size-3.5" />
                                                    <span>View</span>
                                                </Link>
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
        </div>
    );
}