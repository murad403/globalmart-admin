"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUserDetailsQuery } from "@/redux/features/user/user.api";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    ArrowLeft, 
    User as UserIcon, 
    Mail, 
    Phone, 
    CheckCircle2, 
    XCircle, 
    ShieldCheck, 
    ShieldAlert, 
    Briefcase, 
    Building2, 
    MapPin, 
    Calendar, 
    Clock, 
    AlertTriangle,
    Truck
} from "lucide-react";

const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200/80 shadow-2xs">
                <CheckCircle2 className="size-4 text-emerald-600" /> Active Account
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-800 border border-rose-200/80 shadow-2xs">
            <XCircle className="size-4 text-rose-600" /> Suspended Account
        </span>
    );
};

const getVerificationBadge = (isVerified: boolean, label: string) => {
    if (isVerified) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-900 border border-emerald-200/80">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" /> {label}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-200/80">
            <ShieldAlert className="size-4 text-slate-400 shrink-0" /> {label} (Pending)
        </span>
    );
};

export default function UserDetailsPage() {
    const params = useParams();
    const id = params?.id as string;

    const { data: response, isLoading, isError } = useUserDetailsQuery(id, {
        skip: !id,
    });

    const user = response?.data;

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <Skeleton className="h-9 w-32 rounded-xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
                <div className="grid gap-6 md:grid-cols-3">
                    <Skeleton className="h-80 w-full rounded-2xl" />
                    <Skeleton className="h-80 w-full rounded-2xl" />
                    <Skeleton className="h-80 w-full rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!user || isError) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center max-w-md mx-auto mt-12 shadow-xs">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-4">
                    <AlertTriangle className="size-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">User Not Found</h3>
                <p className="mt-1 text-sm text-slate-500 mb-6">
                    The requested user profile could not be retrieved or does not exist.
                </p>
                <Link
                    href="/users"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft className="size-4" /> Back to Users List
                </Link>
            </div>
        );
    }

    const createdDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "N/A";

    const updatedDate = user.updated_at
        ? new Date(user.updated_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "N/A";

    return (
        <div className="flex flex-col gap-6">
            {/* Top Navigation */}
            <div className="flex items-center justify-between gap-4">
                <Link
                    href="/users"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-2xs transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    <span>Back to Users</span>
                </Link>
            </div>

            {/* Premium Header Banner */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="border-b border-slate-100 bg-slate-900 p-6 text-white">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Avatar placeholder */}
                            <div className="grid size-16 place-items-center rounded-full bg-blue-600 text-white font-extrabold text-2xl border-2 border-white/20 shadow-inner shrink-0">
                                {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                            </div>

                            <div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                                        {user.full_name || "Unnamed User"}
                                    </h1>
                                    <span className="rounded-md bg-blue-500/20 px-2.5 py-1 text-xs font-extrabold text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                                        {user.user_type}
                                    </span>
                                    {user.is_ai_customer && (
                                        <span className="rounded bg-indigo-500/30 px-2.5 py-1 text-xs font-extrabold text-indigo-300 border border-indigo-400/30 tracking-wide">
                                            AI CUSTOMER
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-300 mt-1.5 flex items-center gap-3 font-medium">
                                    <span>User ID: #{user.id}</span>
                                    <span>•</span>
                                    <span>Email: {user.email}</span>
                                </p>
                            </div>
                        </div>

                        {/* Status Badges */}
                        <div className="bg-white p-2.5 rounded-xl shadow-xs border border-slate-100 flex items-center shrink-0">
                            {getStatusBadge(user.is_active)}
                        </div>
                    </div>
                </div>

                {/* Sub-banner Meta strip */}
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 p-4 bg-slate-50/80 border-t border-slate-100 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-slate-500" />
                        <span>Registered: <strong className="text-slate-950 font-bold">{createdDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="size-4 text-slate-500" />
                        <span>Last Profile Update: <strong className="text-slate-950 font-bold">{updatedDate}</strong></span>
                    </div>
                </div>
            </div>

            {/* Symmetrical 3-Column Profile Grid Layout */}
            <div className="grid gap-6 md:grid-cols-3 items-stretch">
                {/* COLUMN 1: Account & Verification Details */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                            <UserIcon className="size-5 text-blue-600" />
                            <span>Account Details</span>
                        </h3>

                        <div className="flex flex-col gap-4.5">
                            <div>
                                <span className="text-slate-500 block text-xs mb-1 uppercase font-bold tracking-wider">Full Name</span>
                                <p className="font-extrabold text-slate-950 text-base">{user.full_name || "N/A"}</p>
                            </div>

                            <div>
                                <span className="text-slate-500 block text-xs mb-1 uppercase font-bold tracking-wider">Email Address</span>
                                <div className="flex items-center gap-2 text-slate-950 font-bold text-sm">
                                    <Mail className="size-4 text-slate-500 shrink-0" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                            </div>

                            <div>
                                <span className="text-slate-500 block text-xs mb-1 uppercase font-bold tracking-wider">Phone Number</span>
                                <div className="flex items-center gap-2 text-slate-950 font-bold text-sm">
                                    <Phone className="size-4 text-slate-500 shrink-0" />
                                    <span>{user.phone || <span className="text-slate-400 italic font-normal">Not Provided</span>}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Verifications section */}
                    <div className="pt-5 mt-5 border-t border-slate-100">
                        <span className="text-slate-500 block text-xs mb-2.5 uppercase font-bold tracking-wider">Verification Status</span>
                        <div className="flex flex-col gap-2.5">
                            {getVerificationBadge(!!user.is_email_verified, "Email Verified")}
                            {getVerificationBadge(!!user.is_phone_verified, "Phone Verified")}
                            {getVerificationBadge(!!user.is_admin_verified, "Admin Verified")}
                        </div>
                    </div>
                </div>

                {/* COLUMN 2: Business Profile Information */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                            <Briefcase className="size-5 text-purple-600" />
                            <span>Business Profile</span>
                        </h3>

                        {user.profile ? (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <span className="text-slate-500 block text-xs mb-1 uppercase font-bold tracking-wider">Business Name</span>
                                    <p className="font-extrabold text-slate-950 text-base flex items-center gap-2">
                                        <Building2 className="size-4 text-purple-600 shrink-0" />
                                        <span>{user.profile.business_name || "N/A"}</span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-slate-500 block text-xs mb-1 uppercase font-bold tracking-wider">Business Type</span>
                                        <p className="font-bold text-slate-950 text-sm">{user.profile.business_type || "N/A"}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-xs mb-1 uppercase font-bold tracking-wider">Industry</span>
                                        <p className="font-bold text-slate-950 text-sm">{user.profile.industry_category || user.profile.industry || "N/A"}</p>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-slate-500 block text-xs mb-1 uppercase font-bold tracking-wider">Contact Person</span>
                                    <p className="font-bold text-slate-950 text-sm">
                                        {[user.profile.first_name, user.profile.last_name].filter(Boolean).join(" ") || "N/A"}
                                    </p>
                                </div>

                                {user.profile.phone_number && (
                                    <div>
                                        <span className="text-slate-500 block text-xs mb-1 uppercase font-bold tracking-wider">Business Phone</span>
                                        <p className="font-bold text-slate-950 text-sm">{user.profile.phone_number}</p>
                                    </div>
                                )}

                                <div>
                                    <span className="text-slate-500 block text-xs mb-1 uppercase font-bold tracking-wider">Location</span>
                                    <p className="font-bold text-slate-950 text-sm leading-relaxed flex items-start gap-1.5 mt-1">
                                        <MapPin className="size-4 text-slate-500 shrink-0 mt-0.5" />
                                        <span>
                                            {[
                                                user.profile.street_address,
                                                user.profile.city,
                                                user.profile.state_province,
                                                user.profile.postal_Code,
                                                user.profile.country
                                            ].filter(Boolean).join(", ") || "No address detailed"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="grid size-12 place-items-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 mb-3">
                                    <Briefcase className="size-5" />
                                </div>
                                <p className="text-sm font-bold text-slate-800">No Business Profile</p>
                                <p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                                    This participant has not configured a detailed commercial or reseller entity profile.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="pt-3 mt-4 border-t border-slate-50 text-xs font-semibold text-slate-400 text-right">
                        Profile ID: {user.profile?.id ? `#${user.profile.id}` : "N/A"}
                    </div>
                </div>

                {/* COLUMN 3: Shipping Address Information */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                            <Truck className="size-5 text-emerald-600" />
                            <span>Shipping Address</span>
                        </h3>

                        {user.shiping_address ? (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <span className="text-slate-500 block text-xs mb-1 uppercase font-bold tracking-wider">Recipient Name</span>
                                    <p className="font-extrabold text-slate-950 text-base">
                                        {[user.shiping_address.first_name, user.shiping_address.last_name].filter(Boolean).join(" ") || "N/A"}
                                    </p>
                                </div>

                                {user.shiping_address.email && (
                                    <div>
                                        <span className="text-slate-500 block text-xs mb-1 uppercase font-bold tracking-wider">Contact Email</span>
                                        <p className="font-bold text-slate-950 text-sm">{user.shiping_address.email}</p>
                                    </div>
                                )}

                                {user.shiping_address.phone && (
                                    <div>
                                        <span className="text-slate-500 block text-xs mb-1 uppercase font-bold tracking-wider">Contact Phone</span>
                                        <p className="font-bold text-slate-950 text-sm">{user.shiping_address.phone}</p>
                                    </div>
                                )}

                                <div>
                                    <span className="text-slate-500 block text-xs mb-1 uppercase font-bold tracking-wider">Delivery Address</span>
                                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/60 mt-1.5 shadow-2xs">
                                        <p className="text-slate-950 font-bold text-sm whitespace-pre-line leading-relaxed">
                                            {user.shiping_address.address || "N/A"}
                                        </p>
                                        <p className="text-slate-600 font-semibold text-xs mt-2 pt-2 border-t border-slate-200 flex items-center gap-2">
                                            <span>{user.shiping_address.state || "N/A"}</span>
                                            <span>•</span>
                                            <strong className="text-slate-950 font-bold">{user.shiping_address.country || "N/A"}</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="grid size-12 place-items-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 mb-3">
                                    <Truck className="size-5" />
                                </div>
                                <p className="text-sm font-bold text-slate-800">No Default Shipping</p>
                                <p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                                    No designated physical shipping address record found for this participant.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="pt-3 mt-4 border-t border-slate-50 text-xs font-semibold text-slate-400 text-right">
                        Address ID: {user.shiping_address?.id ? `#${user.shiping_address.id}` : "N/A"}
                    </div>
                </div>
            </div>
        </div>
    );
}