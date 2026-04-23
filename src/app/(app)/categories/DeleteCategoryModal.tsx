"use client"

import React from "react"

import AppModal from "@/components/shared/AppModal"
import { Button } from "@/components/ui/button"

type DeleteCategoryModalProps = {
  open: boolean
  categoryName: string
  onClose: () => void
  onConfirm: () => void
}

const DeleteCategoryModal = ({
  open,
  categoryName,
  onClose,
  onConfirm,
}: DeleteCategoryModalProps) => {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Delete Category"
      subtitle="This action cannot be undone"
      maxWidthClassName="max-w-md"
      footer={
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>
            Delete Category
          </Button>
        </div>
      }
    >
      <p className="text-sm text-slate-600">
        Are you sure you want to delete
        <span className="mx-1 font-semibold text-slate-900">{categoryName}</span>?
      </p>
    </AppModal>
  )
}

export default DeleteCategoryModal
