"use client";

import React from "react";
import AppModal from "@/components/shared/AppModal";
import { Button } from "@/components/ui/button";
import { CheckCircle2, DollarSign, Store, Hash } from "lucide-react";
import { PaymentConfirmationMutationResponse } from "@/redux/features/overview/overview.type";

type PaymentAcceptModalProps = {
  open: boolean;
  result: PaymentConfirmationMutationResponse | null;
  onClose: () => void;
};

const PaymentAcceptModal = ({ open, result, onClose }: PaymentAcceptModalProps) => {
  if (!result) return null;

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Payment Confirmed Successfully"
      subtitle="Transaction processed and balances synchronized"
      maxWidthClassName="max-w-md"
      footer={
        <div className="flex justify-end w-full">
          <Button
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 py-2.5 text-xs font-bold shadow-xs cursor-pointer"
            onClick={onClose}
          >
            Close Window
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-2 text-slate-700">
        {/* Outstanding Check Icon header banner */}
        <div className="flex flex-col items-center justify-center py-3 bg-emerald-50 rounded-xl border border-emerald-100/80">
          <CheckCircle2 className="size-10 text-emerald-600 mb-2" />
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Credited to Seller Account</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">
            ${parseFloat(result.amount_credited || result.seller_new_balance || "0").toFixed(2)}
          </p>
        </div>

        {/* Message description */}
        <p className="text-xs text-slate-600 text-center leading-relaxed font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          {result.message || `Payment verified successfully for Order #${result.order_id}.`}
        </p>

        {/* Transaction detailed specs grid */}
        <div className="grid grid-cols-2 gap-2 text-xs divide-x divide-slate-100 border-t border-slate-100 pt-3">
          <div className="flex flex-col gap-1 pr-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Hash className="size-3 text-slate-400" /> Order ID
            </span>
            <span className="font-bold text-slate-900">#{result.order_id}</span>
          </div>

          <div className="flex flex-col gap-1 pl-3">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Store className="size-3 text-slate-400" /> Seller Ref
            </span>
            <span className="font-bold text-slate-900">
              {result.seller_id ? `Seller #${result.seller_id}` : "N/A"}
            </span>
          </div>
        </div>

        {result.transaction_id && (
          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-50">
            <span>Transaction Ledger ID:</span>
            <strong className="text-slate-600">#{result.transaction_id}</strong>
          </div>
        )}
      </div>
    </AppModal>
  );
};

export default PaymentAcceptModal;
