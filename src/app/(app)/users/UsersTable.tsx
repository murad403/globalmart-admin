"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
    useGetAllUsersQuery, 
    useStatusToggleMutation 
} from "@/redux/features/user/user.api";
import Pagination from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Search, 
    RotateCcw, 
    X, 
    CheckCircle2, 
    XCircle, 
    Eye, 
    UserCheck, 
    UserX, 
    Loader2, 
    Calendar, 
    Briefcase,
    Users,
    Mail,
    Phone
} from "lucide-react";
import { toast } from "sonner";
import { User } from "@/redux/features/user/user.type";

const FILTER_USER_TYPE_OPTIONS = [
    { value: "all", label: "All User Types" },
    { value: "customer", label: "Customer" },
    { value: "reseller", label: "Reseller" },
    { value: "wholesaler", label: "Wholesaler" },
    { value: "admin", label: "Admin" },
];

const getUserTypeBadge = (type: string, isAi: boolean) => {
    const baseStyle = "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border";
    
    let typeBadge = null;
    switch (type?.toLowerCase()) {
        case "admin":
            typeBadge = <span className={`${baseStyle} bg-purple-50 text-purple-700 border-purple-200/80`}>Admin</span>;
            break;
        case "wholesaler":
            typeBadge = <span className={`${baseStyle} bg-blue-50 text-blue-700 border-blue-200/80`}>Wholesaler</span>;
            break;
        case "reseller":
            typeBadge = <span className={`${baseStyle} bg-amber-50 text-amber-700 border-amber-200/80`}>Reseller</span>;
            break;
        default:
            typeBadge = <span className={`${baseStyle} bg-emerald-50 text-emerald-700 border-emerald-200/80`}>Customer</span>;
            break;
    }

    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {typeBadge}
            {isAi && (
                <span className="inline-flex items-center rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 border border-indigo-200">
                    AI
                </span>
            )}
        </div>
    );
};

const getActiveBadge = (isActive: boolean) => {
    if (isActive) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/80 shadow-2xs">
                <CheckCircle2 className="size-3.5 text-emerald-600" /> Active
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200/80 shadow-2xs">
            <XCircle className="size-3.5 text-rose-600" /> Suspended
        </span>
    );
};

const UsersTable = () => {
    const [page, setPage] = useState(1);
    const [userType, setUserType] = useState("all");
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [loadingActionId, setLoadingActionId] = useState<number | null>(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // Reset page on new search
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const { data: response, isLoading, isFetching } = useGetAllUsersQuery({
        page,
        user_type: userType,
        search: debouncedSearch,
    });

    const [toggleStatus, { isLoading: isToggling }] = useStatusToggleMutation();

    const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUserType(e.target.value);
        setPage(1);
    };

    const resetFilters = () => {
        setSearchInput("");
        setDebouncedSearch("");
        setUserType("all");
        setPage(1);
    };

    const handleToggleStatus = async (user: User) => {
        setLoadingActionId(user.id);
        const targetStatus = !user.is_active;
        try {
            await toggleStatus({
                id: user.id,
                is_active: targetStatus
            }).unwrap();
            
            toast.success(
                `User "${user.full_name}" has been ${targetStatus ? 'activated' : 'suspended'} successfully.`
            );
        } catch (error: any) {
            toast.error(
                error?.data?.message || "Failed to update user status."
            );
        } finally {
            setLoadingActionId(null);
        }
    };

    const users: User[] = response?.data || [];
    const meta = response?.meta;

    return (
        <div className="flex flex-col gap-5">
            {/* Premium Filter Controls Bar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs overflow-x-auto">
                <div className="flex items-center gap-3 min-w-[600px]">
                    {/* Search input */}
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users by name, email, or phone..."
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

                    {/* User Type Filter Dropdown */}
                    <div className="w-48 shrink-0">
                        <select
                            value={userType}
                            onChange={handleUserTypeChange}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-800 focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer transition-all"
                        >
                            {FILTER_USER_TYPE_OPTIONS.map((opt) => (
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

            {/* Main Users Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm min-w-[900px]">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                                <th className="py-4 px-5 w-20">ID</th>
                                <th className="py-4 px-5">User</th>
                                <th className="py-4 px-5">Contact</th>
                                <th className="py-4 px-5">User Type</th>
                                <th className="py-4 px-5">Business Profile</th>
                                <th className="py-4 px-5">Joined Date</th>
                                <th className="py-4 px-5">Status</th>
                                <th className="py-4 px-5 text-right w-44">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                // Skeleton Loader Rows
                                [...Array(6)].map((_, index) => (
                                    <tr key={index} className="bg-white">
                                        <td className="p-5"><Skeleton className="h-5 w-10 rounded" /></td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1.5">
                                                <Skeleton className="h-4 w-32 rounded" />
                                                <Skeleton className="h-3 w-40 rounded" />
                                            </div>
                                        </td>
                                        <td className="p-5"><Skeleton className="h-4 w-28 rounded" /></td>
                                        <td className="p-5"><Skeleton className="h-5 w-20 rounded-full" /></td>
                                        <td className="p-5"><Skeleton className="h-4 w-24 rounded" /></td>
                                        <td className="p-5"><Skeleton className="h-4 w-20 rounded" /></td>
                                        <td className="p-5"><Skeleton className="h-6 w-20 rounded-full" /></td>
                                        <td className="p-5 text-right"><Skeleton className="ml-auto h-8 w-32 rounded-lg" /></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                // Empty State
                                <tr>
                                    <td colSpan={8} className="py-16 px-5 text-center">
                                        <div className="mx-auto max-w-sm flex flex-col items-center">
                                            <div className="grid size-14 place-items-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 mb-3 shadow-2xs">
                                                <Users className="size-6 text-slate-500" />
                                            </div>
                                            <p className="text-base font-bold text-slate-900">No users found</p>
                                            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                                                No users match your active search or filter criteria. Try adjusting your parameters.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                // Render Actual Users
                                users.map((user) => {
                                    const joinedDate = user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    }) : "N/A";

                                    // Safely access profile business name if available
                                    let businessName = "N/A";
                                    if (user.profile && 'business_name' in user.profile && user.profile.business_name) {
                                        businessName = user.profile.business_name;
                                    }

                                    const isCurrentToggling = isToggling && loadingActionId === user.id;

                                    return (
                                        <tr
                                            key={user.id}
                                            className={`transition-all hover:bg-slate-50/75 group ${isFetching || isCurrentToggling ? "opacity-60" : ""}`}
                                        >
                                            {/* ID */}
                                            <td className="py-4 px-5 font-bold text-slate-950">
                                                #{user.id}
                                            </td>

                                            {/* User Details */}
                                            <td className="py-4 px-5">
                                                <div className="min-w-0">
                                                    <p className="font-extrabold text-slate-950 text-sm truncate group-hover:text-blue-600 transition-colors">
                                                        {user.full_name || "Unnamed User"}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-700 mt-0.5 truncate font-medium">
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

                                            {/* User Type Badge */}
                                            <td className="py-4 px-5">
                                                {getUserTypeBadge(user.user_type, user.is_ai_customer)}
                                            </td>

                                            {/* Business Profile */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-950 font-bold">
                                                    <Briefcase className="size-3.5 text-slate-500 shrink-0" />
                                                    <span className="truncate max-w-[150px]" title={businessName}>
                                                        {businessName}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Joined Date */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
                                                    <Calendar className="size-3.5 text-slate-500 shrink-0" />
                                                    <span>{joinedDate}</span>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-5">
                                                {getActiveBadge(user.is_active)}
                                            </td>

                                            {/* Actions Column */}
                                            <td className="py-4 px-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* View Details Link */}
                                                    <Link
                                                        href={`/users/${user.id}`}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 border border-slate-200/80 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-2xs"
                                                        title="View User Details"
                                                    >
                                                        <Eye className="size-3.5" />
                                                        <span>View</span>
                                                    </Link>

                                                    {/* Suspend / Active Toggle Button */}
                                                    <button
                                                        type="button"
                                                        disabled={isToggling}
                                                        onClick={() => handleToggleStatus(user)}
                                                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold border transition-all shadow-2xs disabled:opacity-50 cursor-pointer w-24 justify-center ${
                                                            user.is_active
                                                                ? "bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-600 hover:text-white hover:border-rose-600"
                                                                : "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                                                        }`}
                                                        title={user.is_active ? "Suspend User" : "Activate User"}
                                                    >
                                                        {isCurrentToggling ? (
                                                            <Loader2 className="size-3.5 animate-spin shrink-0" />
                                                        ) : user.is_active ? (
                                                            <UserX className="size-3.5 shrink-0" />
                                                        ) : (
                                                            <UserCheck className="size-3.5 shrink-0" />
                                                        )}
                                                        <span>{user.is_active ? "Suspend" : "Activate"}</span>
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
};

export default UsersTable;
