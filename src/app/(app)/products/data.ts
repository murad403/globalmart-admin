export type ProductStatus = "Active" | "Flagged" | "Removed"

export type ProductRecord = {
  id: string
  name: string
  seller: string
  category: string
  status: ProductStatus
  dateAdded: string
  price: number
  oldPrice: number
  discountLabel: string
  rating: number
  reviewCount: number
  stock: number
  sku: string
  color: string
  sizes: string[]
  description: string
}

export const productRecords: ProductRecord[] = [
  {
    id: "wireless-headphones-xt",
    name: "Wireless Headphones XT",
    seller: "TechSource Ltd",
    category: "Electronics",
    status: "Active",
    dateAdded: "2024-05-15",
    price: 129.99,
    oldPrice: 169.99,
    discountLabel: "24% OFF",
    rating: 4.7,
    reviewCount: 389,
    stock: 86,
    sku: "TS-HP-XT-001",
    color: "Black",
    sizes: ["Standard"],
    description:
      "Experience immersive audio with active noise cancellation and all-day comfort. Designed for long listening sessions and professional calls.",
  },
  {
    id: "summer-cotton-dress",
    name: "Summer Cotton Dress",
    seller: "Global Garments",
    category: "Clothing",
    status: "Flagged",
    dateAdded: "2024-05-14",
    price: 39.9,
    oldPrice: 59.9,
    discountLabel: "33% OFF",
    rating: 4.3,
    reviewCount: 214,
    stock: 42,
    sku: "GG-DR-SM-221",
    color: "Navy",
    sizes: ["S", "M", "L"],
    description:
      "A lightweight breathable cotton dress tailored for warm weather with a flattering fit and minimalist style.",
  },
  {
    id: "smart-watch-pro",
    name: "Smart Watch Pro",
    seller: "TechSource Ltd",
    category: "Electronics",
    status: "Active",
    dateAdded: "2024-05-13",
    price: 189,
    oldPrice: 229,
    discountLabel: "17% OFF",
    rating: 4.6,
    reviewCount: 301,
    stock: 63,
    sku: "TS-WT-PRO-008",
    color: "Space Gray",
    sizes: ["Standard"],
    description:
      "Fitness tracking, heart-rate monitoring, and crisp AMOLED display wrapped in a premium metal body.",
  },
  {
    id: "yoga-mat-premium",
    name: "Yoga Mat Premium",
    seller: "SportyWay",
    category: "Sports",
    status: "Removed",
    dateAdded: "2024-05-12",
    price: 24.5,
    oldPrice: 29.9,
    discountLabel: "18% OFF",
    rating: 4.1,
    reviewCount: 92,
    stock: 15,
    sku: "SP-YG-PR-411",
    color: "Purple",
    sizes: ["Standard"],
    description:
      "Extra-grip premium yoga mat with anti-slip texture for better stability during workouts.",
  },
  {
    id: "coffee-maker-2000",
    name: "Coffee Maker 2000",
    seller: "KitchenWiz",
    category: "Home",
    status: "Active",
    dateAdded: "2024-05-11",
    price: 79.99,
    oldPrice: 99.99,
    discountLabel: "20% OFF",
    rating: 4.5,
    reviewCount: 167,
    stock: 27,
    sku: "KW-CF-2000",
    color: "Silver",
    sizes: ["Standard"],
    description:
      "Automatic programmable coffee machine with fast brew cycles and thermal keep-warm functionality.",
  },
  {
    id: "premium-leather-wallet",
    name: "Premium Leather Wallet",
    seller: "LuxeLeather",
    category: "Accessories",
    status: "Active",
    dateAdded: "2024-05-10",
    price: 49.99,
    oldPrice: 79.99,
    discountLabel: "38% OFF",
    rating: 4.8,
    reviewCount: 256,
    stock: 120,
    sku: "LL-WL-PR-101",
    color: "Black",
    sizes: ["Standard", "Large"],
    description:
      "Experience luxury with our Premium Leather Wallet. Crafted from 100% genuine Italian leather, this wallet combines timeless elegance with modern functionality. Perfect for the discerning individual who appreciates quality and style.",
  },
]
