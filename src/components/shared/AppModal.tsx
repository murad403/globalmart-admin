"use client"

import React from "react"
import { X } from "lucide-react"

type AppModalProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidthClassName?: string
}

const AppModal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidthClassName = "max-w-lg",
}: AppModalProps) => {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal overlay"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
      />

      <div
        className={`relative z-10 w-full ${maxWidthClassName} overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl`}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-6 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-4 py-3">{children}</div>

        {footer ? <div className="border-t border-slate-200 px-4 py-3">{footer}</div> : null}
      </div>
    </div>
  )
}

export default AppModal