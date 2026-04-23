"use client"

import React from "react"

import AppModal from "@/components/shared/AppModal"
import { Button } from "@/components/ui/button"

type RejectProductModalProps = {
  open: boolean
  productName: string
  reason: string
  onReasonChange: (value: string) => void
  onClose: () => void
  onConfirm: () => void
}

const RejectProductModal = ({
  open,
  productName,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
}: RejectProductModalProps) => {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Reject Product"
      subtitle="Provide a short moderation reason"
      maxWidthClassName="max-w-md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
            disabled={!reason.trim()}
          >
            Confirm Reject
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-slate-600">
          You are rejecting
          <span className="mx-1 font-semibold text-slate-900">{productName}</span>
          from public listing.
        </p>

        <div className="space-y-1.5">
          <label htmlFor="rejection-reason" className="text-xs font-medium text-slate-700">
            Rejection Reason
          </label>
          <textarea
            id="rejection-reason"
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            rows={4}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
            placeholder="e.g. Policy violation or incomplete product information"
          />
        </div>
      </div>
    </AppModal>
  )
}

export default RejectProductModal
