export interface OrderUser {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
    image: string | null;
    user_type: string;
}

export interface OrderProductDetail {
    id: number;
    name: string;
    brand: string;
    description: string;
    category: string;
    wholesaler_id: number;
    wholesale_price: string;
    mrp: string;
    status: string;
    images: any[];
}

export interface OrderItem {
    id: number;
    product: OrderProductDetail;
    qty: number;
    listing_type: string;
    unit_price: string;
    line_total: string;
}

export interface Order {
    id: number;
    seller: OrderUser;
    buyer: OrderUser;
    products: OrderItem[];
    order_total_price: string;
    status: string;
    payment_status: string;
    is_paid: boolean;
    is_cash_on_delivery: boolean;
    is_fake: boolean;
    is_delete: boolean;
    order_cancel_note_seller: string;
    order_cancel_note_buyer: string;
    created_at: string;
    updated_at: string;
}

export interface OrderMeta {
    total_items: number;
    total_pages: number;
    current_page: number;
    next: string | null;
    previous: string | null;
    per_page: number;
}

export interface GetOrdersResponse {
    success: boolean;
    message: string;
    request_id?: string;
    meta: OrderMeta;
    data: Order[];
}
