"use client";

import React from "react";
import { useForm } from "react-hook-form";

interface EditAiCustomerFormData {
  aiName: string;
  assignedReseller: string;
  status: string;
}

interface Props {
  onClose: () => void;
  defaultValues?: Partial<EditAiCustomerFormData>;
  onSave?: (data: EditAiCustomerFormData) => void;
}

const EditAiCustomerModal = ({
  onClose,
  defaultValues = { aiName: "rfgd", assignedReseller: "sdgv", status: "" },
  onSave,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditAiCustomerFormData>({ defaultValues });

  const onSubmit = (data: EditAiCustomerFormData) => {
    onSave?.(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit AI Customer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-light"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">AI Name</label>
            <input
              type="text"
              {...register("aiName", { required: "AI Name is required" })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.aiName && <p className="text-red-500 text-xs mt-1">{errors.aiName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Assigned Reseller</label>
            <input
              type="text"
              {...register("assignedReseller", { required: "Assigned Reseller is required" })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.assignedReseller && (
              <p className="text-red-500 text-xs mt-1">{errors.assignedReseller.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <input
              type="text"
              {...register("status")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAiCustomerModal;