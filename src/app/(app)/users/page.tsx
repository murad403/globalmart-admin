import React from "react"

import PageHeader from "@/components/shared/PageHeader"

import UsersTable from "./UsersTable"

const Page = () => {
  return (
    <main className="space-y-4 md:space-y-5">
      <PageHeader title="Users" description="Manage and monitor all platform participants" />
      <UsersTable />
    </main>
  )
}

export default Page
