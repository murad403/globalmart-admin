"use client";

import React, { useState, useEffect } from "react";
import AppModal from "@/components/shared/AppModal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type PaymentRejectModalProps = {
  open: boolean;
  orderId: number | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
};

const PaymentRejectModal = ({
  open,
  orderId,
  isSubmitting,
  onClose,
  onSubmit,
}: PaymentRejectModalProps) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);

  const handleSubmit = async () => {
    const finalReason = reason.trim() || "Invalid payment transaction detected.";
    await onSubmit(finalReason);
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={`Reject Payment for Order #${orderId || ""}`}
      subtitle="Please provide a descriptive reason for rejecting this transaction"
      maxWidthClassName="max-w-md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="rounded-xl px-4 py-2.5 text-xs font-bold"
          >
            Cancel
          </Button>
          <Button
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-5 py-2.5 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
            <span>Confirm Rejection</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-3 pt-2">
        <label htmlFor="reject-reason" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Rejection Reason
        </label>
        <textarea
          id="reject-reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Invalid payment transaction detected."
          className="w-full rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-950 placeholder:text-slate-400 resize-none transition-all"
        />
        <p className="text-[11px] text-slate-400">
          If left blank, a default reason ("Invalid payment transaction detected.") will be submitted automatically.
        </p>
      </div>
    </AppModal>
  );
};

export default PaymentRejectModal;