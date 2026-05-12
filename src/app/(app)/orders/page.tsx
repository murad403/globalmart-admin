"use client";
import React, { useState, useEffect } from "react";
import { useGetOrdersQuery } from "@/redux/features/order/order.api";
import { Order } from "@/redux/features/order/order.type";
import Pagination from "@/components/shared/Pagination";
import {
  Search,
  Eye,
  Calendar,
  RotateCcw,
  Package,
  X,
  User,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import Image from "next/image";

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
      return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200"><CheckCircle2 className="size-3" /> Delivered</span>;
    case "confirmed":
      return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 border border-blue-200"><CheckCircle2 className="size-3" /> Confirmed</span>;
    case "processing":
      return <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-medium text-purple-700 border border-purple-200"><Clock className="size-3" /> Processing</span>;
    case "shipped":
      return <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700 border border-indigo-200"><Truck className="size-3" /> Shipped</span>;
    case "cancelled":
      return <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-medium text-rose-700 border border-rose-200"><XCircle className="size-3" /> Cancelled</span>;
    default:
      return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 border border-amber-200"><Clock className="size-3" /> Pending</span>;
  }
};

const getPaymentBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
      return <span className="rounded bg-emerald-100 px-2 py:0.5 text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">Success</span>;
    case "refunded":
      return <span className="rounded bg-slate-100 px-2 py:0.5 text-[10px] font-semibold text-slate-700 uppercase tracking-wider">Refunded</span>;
    default:
      return <span className="rounded bg-amber-100 px-2 py:0.5 text-[10px] font-semibold text-amber-800 uppercase tracking-wider">Pending</span>;
  }
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
    <div className="space-y-4 md:space-y-5">
      {/* Title & Stats header */}
      <PageHeader title="Order Management" description="Monitor and filter unified wholesale and reseller order operations" />

      {/* Premium Filter Controls Bar - Pure Horizontal Row Always */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-2.5 min-w-[700px]">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name, brand, seller..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pr-4 pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="w-40 shrink-0">
            <select
              value={status}
              onChange={handleStatusChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 px-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date range filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <input
              type="date"
              value={dateFrom}
              onChange={handleDateFromChange}
              aria-label="Start Date"
              className="w-32 rounded-lg border border-slate-200 bg-slate-50/50 py-2 px-1 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            />
            <span className="text-xs font-medium text-slate-400">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={handleDateToChange}
              aria-label="End Date"
              className="w-32 rounded-lg border border-slate-200 bg-slate-50/50 py-2 px-1 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            />
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={resetFilters}
            title="Reset Filters"
            className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 shrink-0 cursor-pointer"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Order Info</th>
                <th className="py-3.5 px-4">Buyer Details</th>
                <th className="py-3.5 px-4">Primary Product</th>
                <th className="py-3.5 px-4 text-center">Qty</th>
                <th className="py-3.5 px-4">Total Price</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                // Loading Skeleton Rows
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse bg-white">
                    <td className="p-4"><div className="h-4 w-20 bg-slate-200 rounded mb-1"></div><div className="h-3 w-24 bg-slate-100 rounded"></div></td>
                    <td className="p-4"><div className="flex items-center gap-3"><div className="size-9 rounded-full bg-slate-200 shrink-0"></div><div><div className="h-4 w-28 bg-slate-200 rounded mb-1"></div><div className="h-3 w-32 bg-slate-100 rounded"></div></div></div></td>
                    <td className="p-4"><div className="flex items-center gap-3"><div className="size-10 rounded-lg bg-slate-200 shrink-0"></div><div><div className="h-4 w-36 bg-slate-200 rounded mb-1"></div><div className="h-3 w-16 bg-slate-100 rounded"></div></div></div></td>
                    <td className="p-4 text-center"><div className="mx-auto h-4 w-6 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-12 bg-slate-200 rounded"></div></td>
                    <td className="p-4"><div className="h-5 w-20 bg-slate-200 rounded-full"></div></td>
                    <td className="p-4 text-right"><div className="ml-auto h-8 w-24 bg-slate-200 rounded-lg"></div></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={8} className="py-12 px-4 text-center">
                    <div className="mx-auto max-w-sm">
                      <div className="mx-auto grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400 mb-3">
                        <Package className="size-6" />
                      </div>
                      <p className="text-base font-semibold text-slate-800">No orders found</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try modifying your active filters, custom date periods, or clear existing terms.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Render Actual Orders
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
                    <tr key={order.id} className={`transition-colors hover:bg-slate-50/50 ${isFetching ? "opacity-60" : ""}`}>
                      {/* Order ID & Date */}
                      <td className="py-4 px-4 font-medium">
                        <span className="text-slate-900 font-bold text-sm">#{order.id}</span>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <Calendar className="size-3 shrink-0" />
                          <span>{orderDate}</span>
                        </div>
                      </td>

                      {/* Buyer Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                            {buyerImage ? (
                              <Image src={buyerImage} alt={order.buyer?.full_name || "Buyer"} className="rounded-full h-10 w-10 object-cover" width={500} height={500} unoptimized />
                            ) : (
                              buyerInitials
                            )}
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800 text-sm">
                              {order.buyer?.full_name || "Unknown Buyer"}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {order.buyer?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Primary Product Info */}
                      <td className="py-4 px-4 max-w-xs">
                        {primaryProduct ? (
                          <div className="flex items-center gap-3">
                            <div className="grid size-11 place-items-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50 shrink-0 text-slate-400">
                              {productImage ? (
                                <Image src={productImage} alt={primaryProduct.name} className="w-full h-full object-cover" width={500} height={500} unoptimized />
                              ) : (
                                <Package className="size-5" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-800 text-sm" title={primaryProduct.name}>
                                {primaryProduct.name}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                                  {primaryProduct.brand || "Brand"}
                                </span>
                                {extraCount > 0 && (
                                  <span className="text-[11px] font-semibold text-blue-600">
                                    +{extraCount} item{extraCount > 1 ? "s" : ""}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Product unavailable</span>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="py-4 px-4 text-center font-bold text-slate-800 text-sm">
                        {totalQty}
                      </td>

                      {/* Total Price */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-900 text-sm">
                          ${parseFloat(order.order_total_price || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-4">
                        {getPaymentBadge(order.payment_status || "pending")}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        {getStatusBadge(order.status || "pending")}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-blue-600 cursor-pointer"
                        >
                          <Eye className="size-3.5" />
                          <span>View Details</span>
                        </button>
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
          <div className="border-t border-slate-100 p-4 flex justify-center">
            <Pagination
              currentPage={meta.current_page}
              totalPages={meta.total_pages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Premium Deep Order Details Dialog/Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/75 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Order Details <span className="text-blue-600">#{selectedOrder.id}</span>
                  </h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Created on{" "}
                  {selectedOrder.created_at
                    ? new Date(selectedOrder.created_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="grid size-8 place-items-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body Container with Scroll */}
            <div className="overflow-y-auto p-5 space-y-5">
              {/* Twin User Breakdown Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Seller Card */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="size-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Seller Identity</span>
                    <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 capitalize">
                      {selectedOrder.seller?.user_type || "Seller"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative grid size-12 place-items-center overflow-hidden rounded-full bg-slate-200 font-bold text-slate-600 text-sm shrink-0">
                      {selectedOrder.seller?.image ? (
                        <Image src={getFullImageUrl(selectedOrder.seller.image) || ""} alt="Seller" className="w-full h-full object-cover" width={500} height={500} unoptimized />
                      ) : (
                        selectedOrder.seller?.full_name ? selectedOrder.seller.full_name.charAt(0).toUpperCase() : "S"
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800 text-sm">
                        {selectedOrder.seller?.full_name || "N/A"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {selectedOrder.seller?.email || "No Email"}
                      </p>
                      {selectedOrder.seller?.phone && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {selectedOrder.seller.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buyer Card */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="size-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Buyer Identity</span>
                    <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 capitalize">
                      {selectedOrder.buyer?.user_type || "Customer"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative grid size-12 place-items-center overflow-hidden rounded-full bg-slate-200 font-bold text-slate-600 text-sm shrink-0">
                      {selectedOrder.buyer?.image ? (
                        <Image src={getFullImageUrl(selectedOrder.buyer.image) || ""} alt="Buyer" className="w-full h-full object-cover" width={500} height={500} unoptimized />
                      ) : (
                        selectedOrder.buyer?.full_name ? selectedOrder.buyer.full_name.charAt(0).toUpperCase() : "B"
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800 text-sm">
                        {selectedOrder.buyer?.full_name || "N/A"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {selectedOrder.buyer?.email || "No Email"}
                      </p>
                      {selectedOrder.buyer?.phone && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {selectedOrder.buyer.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Notes Alerts (if present) */}
              {(selectedOrder.order_cancel_note_buyer || selectedOrder.order_cancel_note_seller) && (
                <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>Cancellation & Order Logs</span>
                  </div>
                  {selectedOrder.order_cancel_note_buyer && (
                    <p className="text-xs text-rose-700 bg-white/80 p-2 rounded border border-rose-100">
                      <strong className="font-semibold text-rose-900">Buyer Note:</strong> {selectedOrder.order_cancel_note_buyer}
                    </p>
                  )}
                  {selectedOrder.order_cancel_note_seller && (
                    <p className="text-xs text-rose-700 bg-white/80 p-2 rounded border border-rose-100">
                      <strong className="font-semibold text-rose-900">Seller Note:</strong> {selectedOrder.order_cancel_note_seller}
                    </p>
                  )}
                </div>
              )}

              {/* Product Manifest */}
              <div>
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                  Ordered Items Breakdown ({selectedOrder.products?.length || 0})
                </h4>
                <div className="rounded-xl border border-slate-200/60 divide-y divide-slate-100 bg-white">
                  {selectedOrder.products?.map((item) => {
                    const pItem = item.product;
                    const pImg = pItem?.images?.[0] ? getFullImageUrl(pItem.images[0]) : null;

                    return (
                      <div key={item.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="grid size-12 place-items-center rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0 text-slate-400">
                            {pImg ? (
                              <Image src={pImg} alt={pItem?.name || "Product"} className="w-full h-full object-cover" width={500} height={500} unoptimized />
                            ) : (
                              <Package className="size-6" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-xs max-w-sm leading-tight">
                              {pItem?.name || "Product Name Unavailable"}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              {pItem?.brand && (
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                                  {pItem.brand}
                                </span>
                              )}
                              {pItem?.category && (
                                <span className="text-[10px] text-slate-500">
                                  {pItem.category}
                                </span>
                              )}
                              <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[9px] font-bold text-purple-700 uppercase tracking-wider border border-purple-100">
                                {item.listing_type || "Standard"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Calculations */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-0 pt-2 sm:pt-0">
                          <div className="text-right">
                            <p className="text-[10px] text-slate-400">Unit Price</p>
                            <p className="text-xs font-semibold text-slate-700">
                              ${parseFloat(item.unit_price || "0").toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-slate-400">Qty</p>
                            <p className="text-xs font-bold text-slate-900">
                              x{item.qty || 0}
                            </p>
                          </div>
                          <div className="text-right min-w-[70px]">
                            <p className="text-[10px] text-slate-400">Subtotal</p>
                            <p className="text-xs font-bold text-blue-600">
                              ${parseFloat(item.line_total || "0").toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Transaction Flags & Summary */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-slate-200/60 shadow-2xs text-xs">
                    <span className="text-slate-400 font-medium">Payment:</span>
                    {getPaymentBadge(selectedOrder.payment_status || "pending")}
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-slate-200/60 shadow-2xs text-xs">
                    <span className="text-slate-400 font-medium">Paid Status:</span>
                    <span className={`font-bold ${selectedOrder.is_paid ? "text-emerald-600" : "text-amber-600"}`}>
                      {selectedOrder.is_paid ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-slate-200/60 shadow-2xs text-xs">
                    <span className="text-slate-400 font-medium">Fulfillment:</span>
                    <span className="font-semibold text-slate-700">
                      {selectedOrder.is_cash_on_delivery ? "Cash on Delivery" : "Prepaid Gateway"}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 border-t sm:border-0 pt-3 sm:pt-0">
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Value</p>
                  <p className="text-xl font-black text-slate-900">
                    ${parseFloat(selectedOrder.order_total_price || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 bg-slate-50/50 p-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg bg-slate-800 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-900 transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}