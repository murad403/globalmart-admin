"use client"

import React from "react"

import AppModal from "@/components/shared/AppModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AddCategoryModalProps = {
  open: boolean
  title: string
  submitLabel?: string
  value: string
  onChange: (value: string) => void
  onClose: () => void
  onSubmit: () => void
}

const AddCategoryModal = ({
  open,
  title,
  submitLabel = "Add Category",
  value,
  onChange,
  onClose,
  onSubmit,
}: AddCategoryModalProps) => {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
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
            {submitLabel}
          </Button>
        </div>
      }
    >
      <div className="space-y-2 pt-2">
        <label htmlFor="category-name" className="text-sm font-medium text-slate-700">
          Category Name
        </label>
        <Input
          id="category-name"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="e.g. Fashion"
          className="h-11"
        />
      </div>
    </AppModal>
  )
}

export default AddCategoryModal
