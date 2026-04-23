"use client"

import React from "react"

import AppModal from "@/components/shared/AppModal"

import type { UserRecord } from "./types"

type UserDetailsModalProps = {
  open: boolean
  user: UserRecord | null
  onClose: () => void
}

const UserDetailsModal = ({ open, user, onClose }: UserDetailsModalProps) => {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="User Details"
      subtitle="Full profile and platform activity"
      maxWidthClassName="max-w-2xl"
    >
      {!user ? null : (
        <div className="space-y-4">
          <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Full Name</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{user.name}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Email</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{user.email}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Phone</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{user.phone}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Country</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{user.country}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Segment</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{user.segment}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Total Orders</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{user.totalOrders}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Total Spent</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                ${user.totalSpent.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Status</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{user.status}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Last Login</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{user.lastLogin}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Joined Date</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{user.joinedDate}</p>
            </div>
          </div>
        </div>
      )}
    </AppModal>
  )
}

export default UserDetailsModal
