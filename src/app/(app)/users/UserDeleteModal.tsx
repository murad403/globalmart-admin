"use client"

import React from "react"

import AppModal from "@/components/shared/AppModal"
import { Button } from "@/components/ui/button"

import type { UserRecord } from "./types"

type UserDeleteModalProps = {
  open: boolean
  user: UserRecord | null
  onClose: () => void
  onConfirmDelete: (userId: number) => void
}

const UserDeleteModal = ({
  open,
  user,
  onClose,
  onConfirmDelete,
}: UserDeleteModalProps) => {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Delete User"
      subtitle="This action cannot be undone"
      maxWidthClassName="max-w-md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
              if (!user) {
                return
              }
              onConfirmDelete(user.id)
              onClose()
            }}
          >
            Delete User
          </Button>
        </div>
      }
    >
      <p className="text-sm text-slate-600">
        Are you sure you want to delete
        <span className="mx-1 font-semibold text-slate-900">{user?.name}</span>
        from the platform?
      </p>
    </AppModal>
  )
}

export default UserDeleteModal
