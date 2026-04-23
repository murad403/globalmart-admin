"use client"

import React from "react"

import AppModal from "@/components/shared/AppModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type EditCategoryModalProps = {
  open: boolean
  value: string
  onChange: (value: string) => void
  onClose: () => void
  onSubmit: () => void
}

const EditCategoryModal = ({
  open,
  value,
  onChange,
  onClose,
  onSubmit,
}: EditCategoryModalProps) => {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Edit Category"
      maxWidthClassName="max-w-xl"
      footer={
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="h-auto py-3" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="h-auto bg-blue-600 py-3 hover:bg-blue-700"
            onClick={onSubmit}
            disabled={!value.trim()}
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <div className="space-y-2 pt-2">
        <label htmlFor="edit-category-name" className="text-sm font-medium text-slate-700">
          Category Name
        </label>
        <Input
          id="edit-category-name"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Electronics"
          className="h-11"
        />
      </div>
    </AppModal>
  )
}

export default EditCategoryModal
