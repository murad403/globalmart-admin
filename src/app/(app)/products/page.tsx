"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Search, RotateCcw, X, Trash2, Package } from "lucide-react";
import { toast } from "sonner";

import PageHeader from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetProductsQuery, useDeleteProductMutation } from "@/redux/features/product/product.api";
import { ProductItem } from "@/redux/features/product/product.type";
import DeleteProductModal from "./DeleteProductModal";

const statusClasses: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-amber-100 text-amber-700",
  draft: "bg-slate-100 text-slate-700",
};

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset page on search change
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // RTK Query hooks
  const { data: response, isLoading, isFetching } = useGetProductsQuery({
    page,
    search: debouncedSearch,
  });

  const [deleteProductMutation, { isLoading: isDeleting }] = useDeleteProductMutation();

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProductMutation(deletingProduct.id.toString()).unwrap();
      toast.success("Product deleted successfully!");
      setDeletingProduct(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  const products: ProductItem[] = response?.data || [];
  const meta = response?.meta;

  return (
    <main className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 mb-1">
        <PageHeader 
          title="Products" 
          description="Review, moderate, and manage complete product inventory records" 
        />
      </div>

      {/* Filter Controls Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name or brand..."
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

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-xs uppercase text-slate-500 tracking-wider">
                <th className="px-5 py-3.5 font-semibold">Product Name</th>
                <th className="px-5 py-3.5 font-semibold">Seller</th>
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-5 py-3.5 font-semibold">Price</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className={`divide-y divide-slate-100 ${isFetching ? "opacity-75 transition-opacity" : ""}`}>
              {isLoading ? (
                // Table Skeletons
                [...Array(6)].map((_, index) => (
                  <tr key={index}>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-60" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                    <td className="px-5 py-4 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="grid size-12 place-items-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 mb-2">
                        <Package className="size-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800">No products found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Try refining your search input to locate items</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const statusBadgeClass = statusClasses[product.status?.toLowerCase()] || "bg-slate-100 text-slate-700";

                  return (
                    <tr key={product.id} className="text-sm text-slate-700 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <Link
                            href={`/products/${product.id}`}
                            className="font-semibold text-slate-900 transition-colors hover:text-blue-600 line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          {product.brand && (
                            <span className="text-xs text-slate-400 font-medium mt-0.5">Brand: {product.brand}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">
                        {product.wholesaler?.full_name || "N/A"}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {product.category?.title || "Uncategorized"}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        ${product.wholesale_price}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize tracking-wide ${statusBadgeClass}`}>
                          {product.status || "draft"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${product.id}`}
                            className="grid size-8 place-items-center rounded-lg text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                            aria-label={`View ${product.name}`}
                          >
                            <Eye className="size-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeletingProduct(product)}
                            className="grid size-8 place-items-center rounded-lg text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="size-4" />
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

      {/* Pagination Controls */}
      {meta && meta.total_pages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.total_pages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Confirmation Modal */}
      <DeleteProductModal
        open={!!deletingProduct}
        productName={deletingProduct?.name || "this product"}
        isDeleting={isDeleting}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
      />
    </main>
  );
}