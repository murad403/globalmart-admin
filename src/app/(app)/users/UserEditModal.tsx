"use client"

import React from "react"

import AppModal from "@/components/shared/AppModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { UserRecord, UserStatus } from "./types"

type UserEditModalProps = {
  open: boolean
  user: UserRecord | null
  onClose: () => void
  onSave: (updatedUser: UserRecord) => void
}

const UserEditModal = ({ open, user, onClose, onSave }: UserEditModalProps) => {
  const [formState, setFormState] = React.useState<UserRecord | null>(user)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState) {
      return
    }

    onSave(formState)
    onClose()
  }

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Edit User"
      subtitle="Update user information and status"
      maxWidthClassName="max-w-md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="edit-user-form" className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </div>
      }
    >
      {!formState ? null : (
        <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="full-name" className="text-xs font-medium text-slate-700">
              Full Name
            </label>
            <Input
              id="full-name"
              value={formState.name}
              onChange={(event) =>
                setFormState((prev) => (prev ? { ...prev, name: event.target.value } : prev))
              }
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email-address" className="text-xs font-medium text-slate-700">
              Email Address
            </label>
            <Input
              id="email-address"
              type="email"
              value={formState.email}
              onChange={(event) =>
                setFormState((prev) => (prev ? { ...prev, email: event.target.value } : prev))
              }
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="user-status" className="text-xs font-medium text-slate-700">
              Status
            </label>
            <select
              id="user-status"
              value={formState.status}
              onChange={(event) =>
                setFormState((prev) =>
                  prev ? { ...prev, status: event.target.value as UserStatus } : prev
                )
              }
              className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </form>
      )}
    </AppModal>
  )
}

export default UserEditModal
