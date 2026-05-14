"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Check, 
  Star, 
  Package, 
  Store, 
  Tag, 
  Truck, 
  AlertTriangle, 
  Calendar, 
  ShieldCheck, 
  Layers, 
  Layers2,
  DollarSign,
  Scale,
  Clock
} from "lucide-react";

import { useGetProductDetailsQuery } from "@/redux/features/product/product.api";
import { Skeleton } from "@/components/ui/skeleton";
import getFullImageUrl from "@/utils/getFullImageUrl";

const statusClasses: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
  inactive: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  draft: { bg: "bg-slate-50 border-slate-200", text: "text-slate-700" },
};

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params?.productId as string;

  const { data: response, isLoading, isError } = useGetProductDetailsQuery(productId, {
    skip: !productId,
  });

  const product = response?.data;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <main className="flex flex-col gap-6">
        <Skeleton className="h-9 w-32 rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            <Skeleton className="h-[340px] md:h-[450px] w-full rounded-2xl" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-18 w-full rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (!product || isError) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center max-w-md mx-auto mt-12 shadow-xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-4">
          <AlertTriangle className="size-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Product Not Found</h3>
        <p className="mt-1 text-sm text-slate-500 mb-6">
          The requested product catalog details could not be loaded or may have been removed.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Products List
        </Link>
      </div>
    );
  }

  // Calculate pricing metrics safely
  const wholesalePrice = parseFloat(product.wholesale_price || "0");
  const mrpPrice = parseFloat(product.mrp || "0");
  const hasDiscount = mrpPrice > wholesalePrice && mrpPrice > 0;
  const discountPercent = hasDiscount 
    ? Math.round(((mrpPrice - wholesalePrice) / mrpPrice) * 100) 
    : 0;

  // Resolve Images List safely
  const imagesList = product.images && product.images.length > 0 
    ? product.images.map((img) => getFullImageUrl(img.image)).filter(Boolean) as string[]
    : [];

  const mainDisplayImage = imagesList[selectedImageIndex] || null;
  const statusToken = statusClasses[product.status?.toLowerCase()] || statusClasses.draft;

  const createdDate = product.created_at 
    ? new Date(product.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <main className="flex flex-col gap-6">
      {/* Top Header Link */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-blue-600"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Main Grid View Showcase */}
      <div className="grid gap-8 lg:grid-cols-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        {/* Gallery Panel */}
        <section className="flex flex-col gap-3">
          <div className="relative flex items-center justify-center h-[340px] md:h-[450px] w-full rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden group">
            {mainDisplayImage ? (
              <Image
                src={mainDisplayImage}
                alt={product.name || "Product image"}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
                <Package className="size-16 stroke-1" />
                <span className="text-xs text-slate-400 font-medium">No Image Uploaded</span>
              </div>
            )}

            {/* Absolute badge overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold capitalize border ${statusToken.bg} ${statusToken.text} shadow-2xs`}>
                {product.status || "draft"}
              </span>
            </div>
          </div>

          {/* Thumbnail list */}
          {imagesList.length > 1 && (
            <div className="grid grid-cols-4 gap-2.5">
              {imagesList.map((url, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-20 w-full rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx 
                      ? "border-blue-600 shadow-xs" 
                      : "border-slate-100 opacity-70 hover:opacity-100 hover:border-slate-300"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Product Meta & Description Panel */}
        <section className="flex flex-col">
          {/* Category & Brand Metadata Row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {product.category?.title && (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                <Tag className="size-3" />
                {product.category.title}
              </span>
            )}
            {product.brand && (
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                Brand: {product.brand}
              </span>
            )}
            {product.product_type && (
              <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                Type: {product.product_type}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
            {product.name}
          </h1>

          {/* Rating Summary Strip */}
          <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`size-4 ${i < Math.round(parseFloat(product.product_rating || "0")) ? "fill-current" : ""}`} 
                />
              ))}
            </div>
            <span className="font-bold text-slate-800">
              {parseFloat(product.product_rating || "0").toFixed(1)} Rating
            </span>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 my-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Wholesale Price</span>
              <span className="text-3xl font-extrabold text-blue-600">
                ${wholesalePrice.toFixed(2)}
              </span>
            </div>

            {hasDiscount && (
              <>
                <div className="flex flex-col ml-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">MRP</span>
                  <span className="text-lg text-slate-400 line-through font-bold">
                    ${mrpPrice.toFixed(2)}
                  </span>
                </div>
                <span className="self-center ml-auto inline-flex items-center rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-extrabold text-rose-600 border border-rose-200 uppercase tracking-wide">
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Description Block */}
          <div className="flex flex-col gap-1.5 mb-6">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Product Description</span>
            <p className="text-sm leading-relaxed text-slate-600 border-b border-slate-100 pb-5">
              {product.description || "No specific detailed description provided for this inventory listing item."}
            </p>
          </div>

          {/* Specifications & Variants List */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm mb-6 flex-1">
            {product.color && (
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Color Identifier</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span 
                    className="size-3 rounded-full border border-slate-300 inline-block" 
                    style={{ backgroundColor: product.color.toLowerCase() }} 
                  />
                  {product.color}
                </span>
              </div>
            )}

            {product.size && (
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Size Base</span>
                <span className="font-semibold text-slate-800 uppercase bg-slate-100 px-2 py-0.5 rounded w-max">
                  {product.size}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Minimum Order Qty</span>
              <span className="font-semibold text-slate-800">
                {product.minimum_order_qty} Units
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Cash on Delivery</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                {product.allow_cash_on_delivary ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">Yes (Allowed)</span>
                ) : (
                  <span className="text-slate-400">Not Supported</span>
                )}
              </span>
            </div>
          </div>

          {/* Admin / Resell Flags Badges Container */}
          <div className="flex flex-wrap items-center gap-2 pt-4 mt-auto border-t border-slate-100 text-xs">
            {product.is_admin_approved && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 font-semibold px-2 py-1 border border-emerald-100">
                <ShieldCheck className="size-3.5 text-emerald-600" /> Admin Approved
              </span>
            )}
            {product.allow_resell && (
              <span className="inline-flex items-center gap-1 rounded bg-purple-50 text-purple-700 font-semibold px-2 py-1 border border-purple-100">
                <Layers2 className="size-3.5 text-purple-600" /> Reselling Enabled
              </span>
            )}
            {product.reseller_price_control && (
              <span className="inline-flex items-center rounded bg-slate-100 text-slate-600 font-medium px-2 py-1">
                Price Control: <strong className="ml-1 text-slate-800">{product.reseller_price_control}</strong>
              </span>
            )}
          </div>
        </section>
      </div>

      {/* Logistics & Seller Section - Placed in beautiful bottom cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Inventory & Shipping Meta Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Truck className="size-4.5 text-blue-600" />
              <span>Inventory & Shipping Settings</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">Stock Status</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-base font-extrabold text-slate-900">{product.stock}</span>
                  <span className="text-xs text-slate-500 font-medium">Units</span>
                  {product.stock <= product.low_stock_alert_threshold && (
                    <span className="ml-1 rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 uppercase">
                      Low Alert
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">Shipping Type</span>
                <span className="text-sm font-semibold text-slate-800 mt-1 block">
                  {product.shipping_type || "Standard"}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">Processing Time</span>
                <span className="text-sm font-semibold text-slate-800 mt-1 block flex items-center gap-1">
                  <Clock className="size-3 text-slate-400" />
                  {product.processing_time || "1-3 Days"}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">Dimensions / Weight</span>
                <span className="text-xs font-semibold text-slate-700 mt-1 block">
                  {product.weight ? `${product.weight} kg` : "N/A weight"} 
                  {product.length && product.height ? ` (${product.length}x${product.height} cm)` : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
            <span>Alert Threshold: {product.low_stock_alert_threshold} units</span>
            <span>Date Added: {createdDate}</span>
          </div>
        </div>

        {/* Wholesaler / Seller Identity Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Store className="size-4.5 text-purple-600" />
              <span>Wholesaler / Provider Info</span>
            </h3>

            {product.wholesaler ? (
              <div className="flex items-center gap-3">
                {product.wholesaler.image ? (
                  <Image
                    src={getFullImageUrl(product.wholesaler.image)!}
                    alt={product.wholesaler.full_name || "Seller"}
                    width={56}
                    height={56}
                    className="size-14 rounded-full object-cover border border-slate-200"
                    unoptimized
                  />
                ) : (
                  <div className="grid size-14 place-items-center rounded-full bg-purple-100 text-purple-700 font-bold text-xl border border-purple-200">
                    {product.wholesaler.full_name ? product.wholesaler.full_name.charAt(0).toUpperCase() : "W"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 text-base truncate">
                    {product.wholesaler.full_name || "Anonymous Provider"}
                  </p>
                  <span className="inline-block mt-0.5 rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-semibold text-purple-700 border border-purple-100 uppercase tracking-wider">
                    {product.wholesaler.user_type || "wholesaler"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No specific assigned wholesaler record found.</p>
            )}
          </div>

          {product.wholesaler && (
            <div className="flex flex-col gap-2 text-xs pt-4 mt-4 border-t border-slate-50 text-slate-600">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Contact Email:</span>
                <span className="font-medium text-slate-800 truncate max-w-[200px]">{product.wholesaler.email}</span>
              </div>
              {product.wholesaler.phone && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Direct Phone:</span>
                  <span className="font-medium text-slate-800">{product.wholesaler.phone}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}