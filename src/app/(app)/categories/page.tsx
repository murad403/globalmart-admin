"use client";
import React, { useState, useEffect } from "react";
import { Plus, Search, RotateCcw, X, Pencil, Trash2, Calendar, Layers } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategoriesQuery, useAddCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from "@/redux/features/category/category.api";
import { Category } from "@/redux/features/category/category.type";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import getFullImageUrl from "@/utils/getFullImageUrl";


export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Modal controls state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset page on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Query Hook
  const { data: response, isLoading, isFetching } = useGetCategoriesQuery({
    page,
    search: debouncedSearch,
  });

  // Mutation Hooks
  const [addCategoryMutation] = useAddCategoryMutation();
  const [updateCategoryMutation] = useUpdateCategoryMutation();
  const [deleteCategoryMutation, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setPage(1);
  };

  const handleAddSubmit = async (formData: FormData) => {
    try {
      await addCategoryMutation(formData).unwrap();
      toast.success("Category created successfully!");
      setIsAddOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create category");
      throw error;
    }
  };

  const handleEditSubmit = async (id: number, formData: FormData) => {
    try {
      await updateCategoryMutation({ id, data: formData }).unwrap();
      toast.success("Category updated successfully!");
      setEditingCategory(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update category");
      throw error;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategoryMutation({ id: deletingCategory.id }).unwrap();
      toast.success("Category deleted successfully!");
      setDeletingCategory(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete category");
    }
  };

  const categories: Category[] = response?.data || [];
  const meta = response?.meta;

  return (
    <main className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
        <PageHeader
          title="Categories"
          description="Organize the primary catalog hierarchy with title identifiers and descriptive visual banner representations"
        />
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-all hover:shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="size-4.5" />
          Add Category
        </button>
      </div>

      {/* Premium Filter Controls Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search category titles..."
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

      {/* Grid Content Showcase Section */}
      <section>
        {isLoading ? (
          // Stunning Grid Skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-2xs flex flex-col">
                <Skeleton className="h-44 w-full rounded-none" />
                <div className="p-4.5 space-y-2.5 flex-1">
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
                <div className="p-3 border-t border-slate-50 flex items-center justify-end gap-2">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          // Premium Empty State
          <div className="rounded-2xl border border-slate-200 bg-white py-16 px-5 text-center shadow-xs">
            <div className="mx-auto max-w-sm flex flex-col items-center">
              <div className="grid size-14 place-items-center rounded-full bg-slate-50 text-slate-400 border border-slate-100 mb-3 shadow-2xs">
                <Layers className="size-6 text-slate-500" />
              </div>
              <p className="text-base font-bold text-slate-900">No categories found</p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Try adjusting your live search keywords or click "Add Category" to provision new records.
              </p>
            </div>
          </div>
        ) : (
          // Rich Visual Cards Grid Layout
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const createdDate = category.created_at ? new Date(category.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              }) : "N/A";

              const bannerUrl = getFullImageUrl(category.image);

              return (
                <div
                  key={category.id}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs transition-all hover:shadow-md hover:border-slate-300 ${isFetching ? "opacity-75" : ""}`}
                >
                  {/* Visual Banner Container */}
                  <div className="relative h-44 w-full bg-slate-50 overflow-hidden border-b border-slate-100">
                    {bannerUrl ? (
                      <img
                        src={bannerUrl}
                        alt={category.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30 text-slate-300">
                        <Layers className="size-10 opacity-60" />
                      </div>
                    )}

                    {/* Subtly Absolute Tag Overlay */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center rounded-lg bg-slate-900/80 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur-xs shadow-xs tracking-wide uppercase">
                        #{category.id}
                      </span>
                    </div>
                  </div>

                  {/* Content Details Area */}
                  <div className="flex flex-col flex-1 p-4.5">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {category.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-auto pt-1">
                      <Calendar className="size-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Added {createdDate}</span>
                    </div>
                  </div>

                  {/* Bottom Actions Divider Bar */}
                  <div className="flex items-center justify-end gap-1.5 border-t border-slate-100/80 bg-slate-50/50 px-4 py-2.5 shrink-0">
                    <button
                      type="button"
                      title="Edit Category"
                      onClick={() => setEditingCategory(category)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <Pencil className="size-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      title="Delete Category"
                      onClick={() => setDeletingCategory(category)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Pagination Section */}
      {meta && meta.total_pages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.total_pages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Declarative Modals */}
      <AddCategoryModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddSubmit}
      />

      <EditCategoryModal
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onSubmit={handleEditSubmit}
      />

      <DeleteCategoryModal
        open={!!deletingCategory}
        categoryName={deletingCategory?.title || "this category"}
        isDeleting={isDeleting}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteConfirm}
      />
    </main>
  );
}
