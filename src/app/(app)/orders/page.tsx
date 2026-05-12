"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetOrdersQuery } from "@/redux/features/order/order.api";
import Pagination from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Eye, 
  Calendar, 
  RotateCcw, 
  Package, 
  X, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle,
  ShoppingBag
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const getFullImageUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) {
    return path;
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://10.10.12.15:8001/api/v1";
  const origin = baseUrl.replace(/\/api\/v1\/?$/, "");
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/80 shadow-2xs">
          <CheckCircle2 className="size-3.5 text-emerald-600" /> Delivered
        </span>
      );
    case "confirmed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200/80 shadow-2xs">
          <CheckCircle2 className="size-3.5 text-blue-600" /> Confirmed
        </span>
      );
    case "processing":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-200/80 shadow-2xs">
          <Clock className="size-3.5 text-purple-600" /> Processing
        </span>
      );
    case "shipped":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200/80 shadow-2xs">
          <Truck className="size-3.5 text-indigo-600" /> Shipped
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200/80 shadow-2xs">
          <XCircle className="size-3.5 text-rose-600" /> Cancelled
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

const getPaymentBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
      return (
        <span className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
          Success
        </span>
      );
    case "refunded":
      return (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          Refunded
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-md bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
          Pending
        </span>
      );
  }
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset page on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFrom(e.target.value);
    setPage(1);
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTo(e.target.value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const { data: response, isLoading, isFetching } = useGetOrdersQuery({
    page,
    status,
    search: debouncedSearch,
    date_from: dateFrom,
    date_to: dateTo,
  });

  const orders = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Stats header */}
      <PageHeader 
        title="Order Management" 
        description="Monitor and filter unified wholesale and reseller order operations" 
      />

      {/* Premium Filter Controls Bar - Pure Horizontal Row Always */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-3 min-w-[750px]">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders by product name, brand, buyer email..."
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

          {/* Status Dropdown */}
          <div className="w-44 shrink-0">
            <select
              value={status}
              onChange={handleStatusChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-800 focus:border-slate-900 focus:bg-white focus:outline-none cursor-pointer transition-all"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date range filter */}
          <div className="flex items-center gap-2 shrink-0 bg-slate-50 p-1 rounded-xl border border-slate-100">
            <input
              type="date"
              value={dateFrom}
              onChange={handleDateFromChange}
              aria-label="Start Date"
              className="w-32 rounded-lg bg-transparent py-1.5 px-2 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-400">&rarr;</span>
            <input
              type="date"
              value={dateTo}
              onChange={handleDateToChange}
              aria-label="End Date"
              className="w-32 rounded-lg bg-transparent py-1.5 px-2 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            />
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

      {/* Main Table Container - Re-designed Premium View */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-5">Order ID</th>
                <th className="py-4 px-5">Buyer Details</th>
                <th className="py-4 px-5">Primary Listing</th>
                <th className="py-4 px-5 text-center">Qty</th>
                <th className="py-4 px-5">Total Amount</th>
                <th className="py-4 px-5">Payment</th>
                <th className="py-4 px-5">State</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                // High-fidelity Shadcn Skeleton Rows
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="bg-white">
                    <td className="p-5"><Skeleton className="h-5 w-16 rounded-md mb-1.5" /><Skeleton className="h-3 w-20 rounded" /></td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-11 rounded-full shrink-0" />
                        <div className="flex flex-col gap-1.5">
                          <Skeleton className="h-4 w-28 rounded" />
                          <Skeleton className="h-3 w-36 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-12 rounded-xl shrink-0" />
                        <div className="flex flex-col gap-1.5">
                          <Skeleton className="h-4 w-36 rounded" />
                          <Skeleton className="h-3 w-20 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-center"><Skeleton className="mx-auto h-4 w-6 rounded" /></td>
                    <td className="p-5"><Skeleton className="h-4 w-16 rounded" /></td>
                    <td className="p-5"><Skeleton className="h-5 w-14 rounded-md" /></td>
                    <td className="p-5"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="p-5 text-right"><Skeleton className="ml-auto h-9 w-28 rounded-xl" /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                // Elegant Empty State
                <tr>
                  <td colSpan={8} className="py-16 px-5 text-center">
                    <div className="mx-auto max-w-sm flex flex-col items-center">
                      <div className="grid size-14 place-items-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 mb-3 shadow-2xs">
                        <ShoppingBag className="size-6 text-slate-500" />
                      </div>
                      <p className="text-base font-bold text-slate-900">No matching orders found</p>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        Try modifying your active search keyword, toggling operational statuses, or extending the date parameter periods.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Render High-fidelity Actual Orders
                orders.map((order) => {
                  const buyerImage = getFullImageUrl(order.buyer?.image);
                  const buyerInitials = order.buyer?.full_name ? order.buyer.full_name.charAt(0).toUpperCase() : "B";

                  // Extract primary product detail
                  const primaryItem = order.products?.[0];
                  const primaryProduct = primaryItem?.product;
                  const productImage = primaryProduct?.images?.[0] ? getFullImageUrl(primaryProduct.images[0]) : null;

                  // Total items quantity count
                  const totalQty = order.products?.reduce((acc, curr) => acc + (curr.qty || 0), 0) || 0;
                  const extraCount = (order.products?.length || 1) - 1;

                  const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }) : "N/A";

                  return (
                    <tr 
                      key={order.id} 
                      className={`transition-all hover:bg-slate-50/75 group ${isFetching ? "opacity-60" : ""}`}
                    >
                      {/* Order ID & Date */}
                      <td className="py-4 px-5 font-medium">
                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 font-extrabold text-slate-900 text-xs border border-slate-200/60 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors">
                          #{order.id}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5 font-medium">
                          <Calendar className="size-3 text-slate-400" />
                          <span>{orderDate}</span>
                        </div>
                      </td>

                      {/* Buyer Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="size-11 shrink-0">
                            {buyerImage ? (
                              <Image 
                                src={buyerImage} 
                                alt={order.buyer?.full_name || "Buyer"} 
                                className="rounded-full size-full object-cover border border-slate-200 shadow-2xs" 
                                width={100} 
                                height={100} 
                                unoptimized 
                              />
                            ) : (
                              <div className="rounded-full bg-slate-900 size-full flex justify-center items-center text-white font-bold text-sm shadow-2xs">
                                {buyerInitials}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                              {order.buyer?.full_name || "Unknown Buyer"}
                            </p>
                            <p className="truncate text-xs text-slate-500 mt-0.5">
                              {order.buyer?.email || "No email provided"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Primary Product Info */}
                      <td className="py-4 px-5 max-w-xs">
                        {primaryProduct ? (
                          <div className="flex items-center gap-3">
                            <div className="grid size-12 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shrink-0 text-slate-400 shadow-2xs group-hover:border-blue-200 transition-colors">
                              {productImage ? (
                                <Image 
                                  src={productImage} 
                                  alt={primaryProduct.name} 
                                  className="w-full h-full object-cover" 
                                  width={100} 
                                  height={100} 
                                  unoptimized 
                                />
                              ) : (
                                <Package className="size-5" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-800 text-xs leading-tight" title={primaryProduct.name}>
                                {primaryProduct.name}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                                  {primaryProduct.brand || "General"}
                                </span >
                                {extraCount > 0 && (
                                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100">
                                    +{extraCount} item{extraCount > 1 ? "s" : ""}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Listing detail unavailable</span>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="py-4 px-5 text-center font-extrabold text-slate-800 text-sm">
                        {totalQty}
                      </td>

                      {/* Total Price */}
                      <td className="py-4 px-5">
                        <p className="font-extrabold text-slate-900 text-sm">
                          ${parseFloat(order.order_total_price || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-5">
                        {getPaymentBadge(order.payment_status || "pending")}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-5">
                        {getStatusBadge(order.status || "pending")}
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-5 text-right">
                        <Link
                          href={`/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-600 hover:shadow-sm cursor-pointer"
                        >
                          <Eye className="size-3.5" />
                          <span>View Order</span>
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