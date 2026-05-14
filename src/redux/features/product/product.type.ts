export interface Wholesaler {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    image: string | null;
    user_type: string;
}

export interface Category {
    id: number;
    title: string;
    image: string | null;
    created_at: string;
}

export interface ProductImage {
    id?: number;
    image?: string;
    [key: string]: unknown;
}

export interface ProductItem {
    id: number;
    wholesaler: Wholesaler | null;
    name: string;
    category: Category | null;
    brand: string | null;
    product_type: string | null;
    description: string | null;
    images: ProductImage[];
    wholesale_price: string;
    mrp: string;
    minimum_order_qty: number;
    allow_cash_on_delivary: boolean;
    color: string | null;
    size: string | null;
    stock: number;
    low_stock_alert_threshold: number;
    weight: number | null;
    length: number | null;
    height: number | null;
    shipping_type: string | null;
    processing_time: string | null;
    status: string;
    is_admin_approved: boolean;
    allow_resell: boolean;
    reseller_price_control: string | null;
    is_features: boolean;
    product_rating: string;
    created_at: string;
}

export interface PaginationMeta {
    total_items: number;
    total_pages: number;
    current_page: number;
    next: string | null;
    previous: string | null;
    per_page: number;
}

export interface GetProductsResponse {
    success: boolean;
    message: string;
    request_id: string;
    meta: PaginationMeta;
    data: ProductItem[];
}

export interface GetProductDetailsResponse {
    success: boolean;
    message: string;
    request_id: string;
    data: ProductItem;
}
