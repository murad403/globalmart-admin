"use client";

import React from "react";
import { useForm } from "react-hook-form";

interface TriggerOrderFormData {
  product: string;
  reseller: string;
  customer: string;
  quantity: number;
}

const products = [
  { id: "smart-watch-pro", name: "Smart Watch Pro", price: 89, moq: 30, sellingPrice: 151.3 },
  { id: "bluetooth-headphones", name: "Wireless Bluetooth Headphones", price: 129, moq: 20, sellingPrice: 159.98 },
  { id: "usb-c-cable", name: "USB-C Fast Charging Cable", price: 19, moq: 50, sellingPrice: 79.95 },
];

const resellers = ["Electronics Hub", "Tech Reseller Store", "Smart Gadgets Pro"];
const customers = ["David Kim - Seattle, WA", "Sarah Johnson - Los Angeles, CA", "Michael Chen - New York, NY"];

interface Props {
  onClose: () => void;
}

const TriggerOrderModal = ({ onClose }: Props) => {
  const { register, handleSubmit, watch } = useForm<TriggerOrderFormData>({
    defaultValues: {
      product: products[0].id,
      reseller: resellers[0],
      customer: customers[0],
      quantity: 1,
    },
  });

  const selectedProductId = watch("product");
  const quantity = watch("quantity");
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const totalOrderValue = (selectedProduct.sellingPrice * quantity).toFixed(2);

  const onSubmit = (data: TriggerOrderFormData) => {
    console.log("Order triggered:", data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Trigger Order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-light"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Product</label>
            <select
              {...register("product")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - ${p.price} (MOQ: {p.moq})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Reseller</label>
            <select
              {...register("reseller")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {resellers.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select AI Customer</label>
            <select
              {...register("customer")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {customers.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
            <input
              type="number"
              min={1}
              {...register("quantity", { valueAsNumber: true, min: 1 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Order Preview */}
          <div className="bg-blue-50 rounded-xl p-4 space-y-1.5">
            <p className="text-blue-700 font-semibold text-sm mb-2">Order Preview</p>
            <p className="text-blue-600 text-xs">Product: <span className="font-medium">{selectedProduct.name}</span></p>
            <p className="text-blue-600 text-xs">Wholesale Price: <span className="font-medium">${selectedProduct.price}</span></p>
            <p className="text-blue-600 text-xs">MOQ Required: <span className="font-medium">{selectedProduct.moq} units</span></p>
            <p className="text-blue-600 text-xs">Estimated Selling Price: <span className="font-medium">${selectedProduct.sellingPrice}</span></p>
            <p className="text-blue-600 text-xs">Total Order Value: <span className="font-medium">${totalOrderValue}</span></p>
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
              Trigger Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TriggerOrderModal;