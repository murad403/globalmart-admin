"use client"

import React from "react"
import { CheckCircle2 } from "lucide-react"

import AppModal from "@/components/shared/AppModal"
import { Button } from "@/components/ui/button"

type ApproveProductModalProps = {
  open: boolean
  productName: string
  note: string
  onNoteChange: (value: string) => void
  onClose: () => void
  onConfirm: () => void
}

const ApproveProductModal = ({
  open,
  productName,
  note,
  onNoteChange,
  onClose,
  onConfirm,
}: ApproveProductModalProps) => {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Approve Product"
      subtitle="Confirm moderation approval and publish status"
      maxWidthClassName="max-w-md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={onConfirm}>
            Confirm Approval
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <p className="text-sm text-emerald-800">
            You are approving
            <span className="mx-1 font-semibold">{productName}</span>
            for live listing.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="approval-note" className="text-xs font-medium text-slate-700">
            Approval Note (Optional)
          </label>
          <textarea
            id="approval-note"
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={4}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
            placeholder="e.g. Product listing verified and approved"
          />
        </div>
      </div>
    </AppModal>
  )
}

export default ApproveProductModal
