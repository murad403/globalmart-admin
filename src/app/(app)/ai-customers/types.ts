export type AiCustomerStatus = "Active" | "Inactive"

export type AiCustomerRecord = {
  id: number
  name: string
  email: string
  location: string
  reseller: string
  status: AiCustomerStatus
}

export type OrderStatus = "pending" | "accepted" | "completed" | "shipped"

export type RecentOrderRecord = {
  id: string
  product: string
  customerName: string
  reseller: string
  amount: number
  status: OrderStatus
}

export type ProductOption = {
  id: string
  name: string
  wholesalePrice: number
  moq: number
  estimatedSellingPrice: number
}
