"use client"

import React from "react"
import Link from "next/link"
import { CheckCircle2, Eye, XCircle } from "lucide-react"

import PageHeader from "@/components/shared/PageHeader"

import ApproveProductModal from "./ApproveProductModal"
import RejectProductModal from "./RejectProductModal"
import { productRecords, type ProductRecord, type ProductStatus } from "./data"

const statusClasses: Record<ProductStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Flagged: "bg-amber-100 text-amber-700",
  Removed: "bg-red-100 text-red-700",
}

const Page = () => {
  const [products, setProducts] = React.useState<ProductRecord[]>(productRecords)
  const [selectedProduct, setSelectedProduct] = React.useState<ProductRecord | null>(null)
  const [isApproveOpen, setIsApproveOpen] = React.useState(false)
  const [approveNote, setApproveNote] = React.useState("")
  const [isRejectOpen, setIsRejectOpen] = React.useState(false)
  const [rejectReason, setRejectReason] = React.useState("")

  const openApproveModal = (product: ProductRecord) => {
    setSelectedProduct(product)
    setApproveNote("")
    setIsApproveOpen(true)
  }

  const openRejectModal = (product: ProductRecord) => {
    setSelectedProduct(product)
    setRejectReason("")
    setIsRejectOpen(true)
  }

  return (
    <main className="space-y-4 md:space-y-5">
      <PageHeader title="Products" description="Review and moderate product listings" />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-240">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-3 font-medium">Product Name</th>
                <th className="px-4 py-3 font-medium">Seller</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date Added</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-slate-200 text-sm text-slate-700">
                  <td className="px-4 py-4">
                    <Link
                      href={`/products/${product.id}`}
                      className="font-medium text-blue-600 transition-colors hover:text-blue-700"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{product.seller}</td>
                  <td className="px-4 py-4 text-blue-600">{product.category}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusClasses[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{product.dateAdded}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-slate-500 transition-colors hover:text-blue-600"
                        aria-label={`View ${product.name}`}
                      >
                        <Eye className="size-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => openApproveModal(product)}
                        className="text-emerald-600 transition-colors hover:text-emerald-700"
                        aria-label={`Approve ${product.name}`}
                      >
                        <CheckCircle2 className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openRejectModal(product)}
                        className="text-red-500 transition-colors hover:text-red-700"
                        aria-label={`Reject ${product.name}`}
                      >
                        <XCircle className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ApproveProductModal
        open={isApproveOpen}
        productName={selectedProduct?.name ?? ""}
        note={approveNote}
        onNoteChange={setApproveNote}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={() => {
          if (!selectedProduct) {
            return
          }

          setProducts((prevProducts) =>
            prevProducts.map((existingProduct) =>
              existingProduct.id === selectedProduct.id
                ? { ...existingProduct, status: "Active" }
                : existingProduct
            )
          )
          setIsApproveOpen(false)
        }}
      />

      <RejectProductModal
        open={isRejectOpen}
        productName={selectedProduct?.name ?? ""}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={() => {
          if (!selectedProduct) {
            return
          }

          setProducts((prevProducts) =>
            prevProducts.map((existingProduct) =>
              existingProduct.id === selectedProduct.id
                ? { ...existingProduct, status: "Removed" }
                : existingProduct
            )
          )
          setIsRejectOpen(false)
        }}
      />
    </main>
  )
}

export default Page
