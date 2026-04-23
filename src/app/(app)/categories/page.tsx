"use client"

import React from "react"
import { Home, Pencil, Plus, Shirt, Trash2, Trophy, TvMinimal, X } from "lucide-react"

import PageHeader from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"

import AddCategoryModal from "./AddCategoryModal"
import DeleteCategoryModal from "./DeleteCategoryModal"
import EditCategoryModal from "./EditCategoryModal"

type CategoryRecord = {
  id: number
  name: string
  subcategories: string[]
}

const initialCategories: CategoryRecord[] = [
  { id: 1, name: "Electronics", subcategories: ["Smartphones", "Laptops", "Accessories"] },
  { id: 2, name: "Clothing", subcategories: ["Men", "Women", "Kids"] },
  { id: 3, name: "Home & Living", subcategories: ["Furniture", "Decor", "Kitchen"] },
  { id: 4, name: "Sports", subcategories: ["Fitness", "Outdoor", "Team Sports"] },
]

const categoryIcons = [TvMinimal, Shirt, Home, Trophy]

const Page = () => {
  const [categories, setCategories] = React.useState<CategoryRecord[]>(initialCategories)
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [addTitle, setAddTitle] = React.useState("Add New Category")
  const [addSubmitLabel, setAddSubmitLabel] = React.useState("Add Category")
  const [addValue, setAddValue] = React.useState("")
  const [editValue, setEditValue] = React.useState("")
  const [editingCategoryId, setEditingCategoryId] = React.useState<number | null>(null)
  const [subCategoryTargetId, setSubCategoryTargetId] = React.useState<number | null>(null)
  const [deletingCategoryId, setDeletingCategoryId] = React.useState<number | null>(null)

  const handleAddCategory = () => {
    const trimmedValue = addValue.trim()
    if (!trimmedValue) {
      return
    }

    if (subCategoryTargetId) {
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === subCategoryTargetId
            ? { ...category, subcategories: [...category.subcategories, trimmedValue] }
            : category
        )
      )
    } else {
      const nextId = categories.length ? Math.max(...categories.map((entry) => entry.id)) + 1 : 1
      setCategories((prevCategories) => [
        ...prevCategories,
        {
          id: nextId,
          name: trimmedValue,
          subcategories: ["General"],
        },
      ])
    }

    setAddValue("")
    setSubCategoryTargetId(null)
    setIsAddOpen(false)
  }

  const openAddCategoryModal = () => {
    setAddTitle("Add New Category")
    setAddSubmitLabel("Add Category")
    setSubCategoryTargetId(null)
    setAddValue("")
    setIsAddOpen(true)
  }

  const openAddSubCategoryModal = (categoryId: number) => {
    setAddTitle("Add New Subcategory")
    setAddSubmitLabel("Add Subcategory")
    setSubCategoryTargetId(categoryId)
    setAddValue("")
    setIsAddOpen(true)
  }

  const openEditModal = (category: CategoryRecord) => {
    setEditingCategoryId(category.id)
    setEditValue(category.name)
    setIsEditOpen(true)
  }

  const handleEditCategory = () => {
    const trimmedValue = editValue.trim()
    if (!trimmedValue || !editingCategoryId) {
      return
    }

    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === editingCategoryId ? { ...category, name: trimmedValue } : category
      )
    )
    setIsEditOpen(false)
    setEditingCategoryId(null)
    setEditValue("")
  }

  const handleDeleteCategory = (categoryId: number) => {
    setDeletingCategoryId(categoryId)
    setIsDeleteOpen(true)
  }

  const handleDeleteSubCategory = (categoryId: number, subCategoryName: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id !== categoryId) {
          return category
        }

        return {
          ...category,
          subcategories: category.subcategories.filter((subCategory) => subCategory !== subCategoryName),
        }
      })
    )
  }

  return (
    <main className="space-y-4 md:space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="Categories" description="Organize the marketplace product hierarchy" />
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={openAddCategoryModal}>
          <Plus className="size-4" />
          Add Category
        </Button>
      </div>

      <section className="space-y-3">
        {categories.map((category, index) => {
          const Icon = categoryIcons[index % categoryIcons.length]

          return (
            <div
              key={category.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="grid size-7 shrink-0 place-items-center rounded-md bg-blue-50 text-blue-600">
                  <Icon className="size-4" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-900">{category.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    {category.subcategories.map((subCategory) => (
                      <button
                        key={subCategory}
                        type="button"
                        onClick={() => handleDeleteSubCategory(category.id, subCategory)}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 transition-colors hover:bg-slate-200"
                        aria-label={`Delete ${subCategory} subcategory from ${category.name}`}
                      >
                        {subCategory}
                        <X className="size-3" />
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => openAddSubCategoryModal(category.id)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      + Add Sub
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => openEditModal(category)}
                  className="text-blue-500 transition-colors hover:text-blue-700"
                  aria-label={`Edit ${category.name}`}
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 transition-colors hover:text-red-700"
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          )
        })}
      </section>

      <AddCategoryModal
        open={isAddOpen}
        title={addTitle}
        submitLabel={addSubmitLabel}
        value={addValue}
        onChange={setAddValue}
        onClose={() => {
          setIsAddOpen(false)
          setSubCategoryTargetId(null)
        }}
        onSubmit={handleAddCategory}
      />

      <EditCategoryModal
        open={isEditOpen}
        value={editValue}
        onChange={setEditValue}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditCategory}
      />

      <DeleteCategoryModal
        open={isDeleteOpen}
        categoryName={
          categories.find((category) => category.id === deletingCategoryId)?.name ?? "this category"
        }
        onClose={() => {
          setIsDeleteOpen(false)
          setDeletingCategoryId(null)
        }}
        onConfirm={() => {
          if (!deletingCategoryId) {
            return
          }

          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== deletingCategoryId)
          )
          setIsDeleteOpen(false)
          setDeletingCategoryId(null)
        }}
      />
    </main>
  )
}

export default Page
