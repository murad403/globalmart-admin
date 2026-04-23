"use client"

import React from "react"
import { Eye, Pencil, Trash2 } from "lucide-react"

import UserDeleteModal from "./UserDeleteModal"
import UserDetailsModal from "./UserDetailsModal"
import UserEditModal from "./UserEditModal"
import type { UserRecord, UserSegment } from "./types"

const tabs: Array<UserSegment | "All Users"> = [
  "Wholesalers",
  "Retailers",
  "Customers",
  "All Users",
]

const initialUsers: UserRecord[] = [
  {
    id: 1,
    name: "TechSource Ltd",
    email: "contact@techsource.com",
    status: "Active",
    joinedDate: "2025-10-19",
    segment: "Wholesalers",
    phone: "+1 415 558 6201",
    country: "USA",
    totalOrders: 142,
    totalSpent: 82500,
    lastLogin: "2026-04-22",
  },
  {
    id: 2,
    name: "HomeStyle Pro",
    email: "info@homestyle.com",
    status: "Active",
    joinedDate: "2023-08-26",
    segment: "Retailers",
    phone: "+44 020 7946 2911",
    country: "UK",
    totalOrders: 85,
    totalSpent: 21400,
    lastLogin: "2026-04-21",
  },
  {
    id: 3,
    name: "KitchenWiz",
    email: "hello@kitchenwiz.com",
    status: "Active",
    joinedDate: "2022-11-30",
    segment: "Customers",
    phone: "+49 30 2284 0088",
    country: "Germany",
    totalOrders: 64,
    totalSpent: 11800,
    lastLogin: "2026-04-20",
  },
]

const UsersTable = () => {
  const [users, setUsers] = React.useState<UserRecord[]>(initialUsers)
  const [activeTab, setActiveTab] = React.useState<UserSegment | "All Users">("Wholesalers")
  const [selectedUser, setSelectedUser] = React.useState<UserRecord | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  const filteredUsers = users.filter((user) => {
    if (activeTab === "All Users") {
      return true
    }

    return user.segment === activeTab
  })

  const handleOpenDetails = (user: UserRecord) => {
    setSelectedUser(user)
    setIsDetailsOpen(true)
  }

  const handleOpenEdit = (user: UserRecord) => {
    setSelectedUser(user)
    setIsEditOpen(true)
  }

  const handleOpenDelete = (user: UserRecord) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 pt-3">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 pb-2 text-sm transition-colors ${
                  activeTab === tab
                    ? "border-blue-500 font-medium text-blue-500"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="border-b border-slate-200 text-sm text-slate-700">
                  <td className="px-4 py-4 text-slate-500">{index + 1}</td>
                  <td className="px-4 py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-4 text-slate-600">{user.email}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{user.joinedDate}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(user)}
                        className="text-slate-500 transition-colors hover:text-blue-600"
                        aria-label={`View ${user.name}`}
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(user)}
                        className="text-blue-500 transition-colors hover:text-blue-700"
                        aria-label={`Edit ${user.name}`}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenDelete(user)}
                        className="text-red-500 transition-colors hover:text-red-700"
                        aria-label={`Delete ${user.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                    No users found in this segment.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <UserDetailsModal
        open={isDetailsOpen}
        user={selectedUser}
        onClose={() => setIsDetailsOpen(false)}
      />

      <UserEditModal
        key={selectedUser?.id ?? "new"}
        open={isEditOpen}
        user={selectedUser}
        onClose={() => setIsEditOpen(false)}
        onSave={(updatedUser) => {
          setUsers((prevUsers) =>
            prevUsers.map((existingUser) =>
              existingUser.id === updatedUser.id ? updatedUser : existingUser
            )
          )
        }}
      />

      <UserDeleteModal
        open={isDeleteOpen}
        user={selectedUser}
        onClose={() => setIsDeleteOpen(false)}
        onConfirmDelete={(userId) => {
          setUsers((prevUsers) => prevUsers.filter((existingUser) => existingUser.id !== userId))
        }}
      />
    </>
  )
}

export default UsersTable
