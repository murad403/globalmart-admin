"use client";

import React from "react";
import AppModal from "@/components/shared/AppModal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type DeleteCategoryModalProps = {
  open: boolean;
  categoryName: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteCategoryModal = ({
  open,
  categoryName,
  isDeleting = false,
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
        <div className="flex items-center justify-end gap-3 w-full">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl px-4 py-2.5 text-xs font-bold"
          >
            Cancel
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-xs" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="size-3.5 animate-spin" />}
            <span>Delete Category</span>
          </Button>
        </div>
      }
    >
      <p className="text-sm text-slate-600 leading-relaxed pt-1">
        Are you sure you want to permanently delete the category
        <span className="mx-1 font-bold text-slate-950">"{categoryName}"</span>? All catalog items mapped under this identifier may be impacted.
      </p>
    </AppModal>
  );
};

export default DeleteCategoryModal;
