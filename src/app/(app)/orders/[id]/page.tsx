"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetOrderDetailsQuery } from "@/redux/features/order/order.api";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Package, 
  Phone, 
  Mail, 
  User, 
  Store, 
  Truck, 
  XCircle, 
  AlertTriangle,
  Receipt
} from "lucide-react";

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
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 shadow-2xs">
          <CheckCircle2 className="size-3.5" /> Delivered
        </span>
      );
    case "confirmed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200 shadow-2xs">
          <CheckCircle2 className="size-3.5" /> Confirmed
        </span>
      );
    case "processing":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-200 shadow-2xs">
          <Clock className="size-3.5" /> Processing
        </span>
      );
    case "shipped":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200 shadow-2xs">
          <Truck className="size-3.5" /> Shipped
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200 shadow-2xs">
          <XCircle className="size-3.5" /> Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200 shadow-2xs">
          <Clock className="size-3.5" /> Pending
        </span>
      );
  }
};

const getPaymentBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
      return (
        <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
          Success
        </span>
      );
    case "refunded":
      return (
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          Refunded
        </span>
      );
    default:
      return (
        <span className="rounded-md bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
          Pending
        </span>
      );
  }
};

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: response, isLoading, isError } = useGetOrderDetailsQuery(id, {
    skip: !id,
  });

  const order = response?.data || response;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {/* Back navigation skeleton */}
        <Skeleton className="h-9 w-32 rounded-xl" />
        {/* Banner skeleton */}
        <Skeleton className="h-36 w-full rounded-2xl" />
        {/* 2x2 Grid skeleton for the 4 cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if ((!order && !isLoading) || isError) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center max-w-md mx-auto mt-12 shadow-xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-4">
          <AlertTriangle className="size-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Order Not Found</h3>
        <p className="mt-1 text-sm text-slate-500 mb-6">
          The requested order details could not be found or may have been deleted.
        </p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Orders List
        </Link>
      </div>
    );
  }

  const createdDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const updatedDate = order?.updated_at
    ? new Date(order.updated_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <div className="flex flex-col gap-6">
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-blue-600"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Orders</span>
        </Link>
      </div>

      {/* Main Order Title Banner */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {/* Solid dark header block to guarantee visibility of white text */}
        <div className="border-b border-slate-100 bg-slate-900 p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                  Order ID
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  #{order?.id}
                </h1>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-slate-400" />
                  <span>Placed: {createdDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-slate-400" />
                  <span>Last updated: {updatedDate}</span>
                </div>
              </div>
            </div>

            {/* Badges strip placed in a white container for outstanding contrast */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl shadow-xs border border-slate-100">
              {getStatusBadge(order?.status || "pending")}
              {getPaymentBadge(order?.payment_status || "pending")}
            </div>
          </div>
        </div>

        {/* Order Meta Quick Overview Banner */}
        <div className="grid grid-cols-2 gap-4 p-4 text-center sm:grid-cols-4 divide-x divide-slate-100 bg-slate-50/80">
          <div className="px-2">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Payment Method
            </span>
            <span className="mt-1 block text-sm font-bold text-slate-900">
              {order?.is_cash_on_delivery ? "Cash on Delivery" : "Online Secure"}
            </span>
          </div>
          <div className="px-2">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Payment State
            </span>
            <span className="mt-1 block text-sm font-bold text-slate-900">
              {order?.is_paid ? (
                <span className="text-emerald-600 flex items-center justify-center gap-1 font-semibold">
                  <CheckCircle2 className="size-3.5" /> Fully Paid
                </span>
              ) : (
                <span className="text-amber-600 flex items-center justify-center gap-1 font-semibold">
                  <Clock className="size-3.5" /> Unpaid
                </span>
              )}
            </span>
          </div>
          <div className="px-2">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Items
            </span>
            <span className="mt-1 block text-sm font-bold text-slate-900">
              {order?.products?.reduce((acc: number, curr: any) => acc + (curr.qty || 0), 0) || 0} Unit(s)
            </span>
          </div>
          <div className="px-2">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Order Total
            </span>
            <span className="mt-1 block text-sm font-bold text-blue-600">
              ${parseFloat(order?.order_total_price || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Cancellation Notes Alerts if present */}
      {(order?.order_cancel_note_seller || order?.order_cancel_note_buyer) && (
        <div className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
          <h3 className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-3">
            <AlertTriangle className="size-4.5 text-amber-600" />
            <span>Cancellation / Modification Notes</span>
          </h3>

          <div className="flex flex-col gap-3 text-xs leading-relaxed">
            {order?.order_cancel_note_seller && (
              <div className="rounded-xl bg-white p-3 border border-amber-100 shadow-2xs">
                <span className="font-semibold text-amber-800 block mb-1">Seller Note:</span>
                <p className="text-slate-700 italic">{order.order_cancel_note_seller}</p>
              </div>
            )}
            {order?.order_cancel_note_buyer && (
              <div className="rounded-xl bg-white p-3 border border-amber-100 shadow-2xs">
                <span className="font-semibold text-amber-800 block mb-1">Buyer Note:</span>
                <p className="text-slate-700 italic">{order.order_cancel_note_buyer}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Layout - Symmetrical 2x2 Grid for the 4 cards displayed in exactly two rows */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* ROW 1, CARD 1: Buyer Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <User className="size-4.5 text-blue-600" />
              <span>Buyer Details</span>
            </h3>

            {order?.buyer ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {order.buyer.image ? (
                    <Image 
                      src={getFullImageUrl(order.buyer.image)!} 
                      alt={order.buyer.full_name || "Buyer"} 
                      width={50} 
                      height={50} 
                      className="size-12 rounded-full object-cover border border-slate-200"
                      unoptimized
                    />
                  ) : (
                    <div className="grid size-12 place-items-center rounded-full bg-blue-100 text-blue-700 font-bold text-base border border-blue-200">
                      {order.buyer.full_name ? order.buyer.full_name.charAt(0).toUpperCase() : "B"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 text-base truncate">
                      {order.buyer.full_name || "Unknown Buyer"}
                    </p>
                    <span className="inline-block mt-0.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                      {order.buyer.user_type || "customer"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No buyer information available.</p>
            )}
          </div>

          {order?.buyer && (
            <div className="flex flex-col gap-2 text-xs pt-4 mt-4 border-t border-slate-50">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="size-4 text-slate-400 shrink-0" />
                <span className="truncate">{order.buyer.email || "No email provided"}</span>
              </div>
              {order.buyer.phone && (
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Phone className="size-4 text-slate-400 shrink-0" />
                  <span>{order.buyer.phone}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ROW 1, CARD 2: Seller Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Store className="size-4.5 text-purple-600" />
              <span>Seller Details</span>
            </h3>

            {order?.seller ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {order.seller.image ? (
                    <Image 
                      src={getFullImageUrl(order.seller.image)!} 
                      alt={order.seller.full_name || "Seller"} 
                      width={50} 
                      height={50} 
                      className="size-12 rounded-full object-cover border border-slate-200"
                      unoptimized
                    />
                  ) : (
                    <div className="grid size-12 place-items-center rounded-full bg-purple-100 text-purple-700 font-bold text-base border border-purple-200">
                      {order.seller.full_name ? order.seller.full_name.charAt(0).toUpperCase() : "S"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 text-base truncate">
                      {order.seller.full_name || "Unknown Seller"}
                    </p>
                    <span className="inline-block mt-0.5 rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-semibold text-purple-700 border border-purple-100 uppercase tracking-wider">
                      {order.seller.user_type || "reseller"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No seller information available.</p>
            )}
          </div>

          {order?.seller && (
            <div className="flex flex-col gap-2 text-xs pt-4 mt-4 border-t border-slate-50">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="size-4 text-slate-400 shrink-0" />
                <span className="truncate">{order.seller.email || "No email provided"}</span>
              </div>
              {order.seller.phone && (
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Phone className="size-4 text-slate-400 shrink-0" />
                  <span>{order.seller.phone}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ROW 2, CARD 3: Line Items Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Package className="size-4.5 text-blue-600" />
                <span>Line Items ({order?.products?.length || 0})</span>
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Product Detail</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order?.products?.map((item: any) => {
                    const product = item.product;
                    const productImage = product?.images?.[0] ? getFullImageUrl(product.images[0]) : null;

                    return (
                      <tr key={item.id} className="transition-colors hover:bg-slate-50/40">
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-start gap-2.5">
                            <div className="grid size-10 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shrink-0 text-slate-400">
                              {productImage ? (
                                <Image 
                                  src={productImage} 
                                  alt={product?.name || "Product"} 
                                  width={80} 
                                  height={80} 
                                  className="w-full h-full object-cover"
                                  unoptimized
                                />
                              ) : (
                                <Package className="size-4" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-800 text-xs leading-tight line-clamp-2">
                                {product?.name || "Unknown Product"}
                              </p>
                              <div className="flex flex-wrap items-center gap-1 mt-1">
                                {product?.brand && (
                                  <span className="rounded bg-slate-100 px-1 py-0.5 text-[9px] font-medium text-slate-600">
                                    {product.brand}
                                  </span>
                                )}
                                <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-medium text-blue-700 capitalize">
                                  {item.listing_type || "reseller"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold text-slate-800 text-xs">
                          {item.qty || 1}
                        </td>

                        <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-xs">
                          ${parseFloat(item.line_total || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ROW 2, CARD 4: Financial Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Receipt className="size-4.5 text-emerald-600" />
              <span>Financial Overview</span>
            </h3>

            <div className="flex flex-col gap-3 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">
                  ${parseFloat(order?.order_total_price || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Shipping Fee</span>
                <span className="font-medium text-slate-900">$0.00</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 mt-4 border-t border-dashed border-slate-200">
            <span className="font-bold text-slate-900 text-sm">Total Amount</span>
            <span className="font-bold text-blue-600 text-base">
              ${parseFloat(order?.order_total_price || "0").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}