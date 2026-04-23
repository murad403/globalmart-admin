export type UserSegment = "Wholesalers" | "Retailers" | "Customers"
export type UserStatus = "Active" | "Inactive" | "Blocked"

export type UserRecord = {
  id: number
  name: string
  email: string
  status: UserStatus
  joinedDate: string
  segment: UserSegment
  phone: string
  country: string
  totalOrders: number
  totalSpent: number
  lastLogin: string
}