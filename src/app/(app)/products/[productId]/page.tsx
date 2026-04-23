import React from "react"
import { Check, ImageIcon, Star } from "lucide-react"
import Link from "next/link"

import { productRecords } from "../data"

type ProductDetailsPageProps = {
  params: Promise<{ productId: string }>
}

const ProductDetailsPage = async ({ params }: ProductDetailsPageProps) => {
  const { productId } = await params
  const product = productRecords.find((entry) => entry.id === productId)

  if (!product) {
    return (
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-lg font-semibold text-slate-900">Product not found</p>
        <Link href="/products" className="text-sm text-blue-600 hover:text-blue-700">
          Back to products
        </Link>
      </div>
    )
  }

  return (
    <main className="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
        <div className="mb-6">
            <Link href="/products" className="text-base text-blue-600 hover:text-blue-700">
              &larr; Back to products
            </Link>
        </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section>
          <div className="grid h-[340px] place-items-center rounded-lg bg-linear-to-br from-slate-900 via-slate-700 to-slate-500 md:h-[500px]">
            <div className="rounded-2xl bg-white/10 p-10 backdrop-blur-sm">
              <ImageIcon className="size-20 text-white" />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((thumb) => (
              <div
                key={thumb}
                className={`grid h-18 place-items-center rounded-lg border ${
                  thumb === 0
                    ? "border-blue-500 bg-linear-to-br from-slate-800 to-slate-500"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                {thumb === 0 ? (
                  <ImageIcon className="size-6 text-white" />
                ) : (
                  <ImageIcon className="size-7 text-slate-400" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <span className="inline-flex rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white">
            {product.seller}
          </span>

          <h1 className="text-3xl font-semibold text-slate-900">{product.name}</h1>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} className="size-4 fill-current" />
              ))}
              <Star className="size-4" />
            </div>
            <span>
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-4xl font-semibold text-blue-600">${product.price}</span>
            <span className="text-xl text-slate-400 line-through">${product.oldPrice}</span>
            <span className="rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">
              {product.discountLabel}
            </span>
          </div>

          <p className="border-b border-slate-200 pb-4 text-sm leading-6 text-slate-600">
            {product.description}
          </p>

          <div className="space-y-3 text-sm">
            <div className="space-y-2">
              <p className="font-medium text-slate-800">Color: {product.color}</p>
              <div className="flex flex-wrap gap-2">
                {[
                  product.color,
                  "Brown",
                  "Tan",
                  "Navy",
                ].map((color, index) => (
                  <button
                    type="button"
                    key={color}
                    className={`rounded-md border px-3 py-1.5 text-xs ${
                      index === 0
                        ? "border-blue-500 bg-blue-50 text-slate-900"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-slate-800">Size: {product.sizes[0]}</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    type="button"
                    key={size}
                    className={`rounded-md border px-3 py-1.5 text-xs ${
                      index === 0
                        ? "border-blue-500 bg-blue-50 text-slate-900"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="font-medium text-slate-800">Quantity:</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center overflow-hidden rounded-md border border-slate-200">
                  <button
                    type="button"
                    className="grid h-8 w-8 place-items-center bg-slate-50 text-slate-500"
                  >
                    -
                  </button>
                  <span className="grid h-8 w-10 place-items-center text-xs">1</span>
                  <button
                    type="button"
                    className="grid h-8 w-8 place-items-center bg-slate-50 text-slate-500"
                  >
                    +
                  </button>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                  <Check className="size-3.5" /> In Stock
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Total Quantity</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{product.stock} Units</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">SKU</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{product.sku}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Category</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{product.category}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Date Added</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{product.dateAdded}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ProductDetailsPage
