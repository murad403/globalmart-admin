export interface UserProfile {
    id?: number;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    business_type?: string;
    business_name?: string | null;
    industry_category?: string;
    industry?: string;
    country?: string;
    state_province?: string;
    city?: string;
    postal_Code?: string;
    postal_code?: string;
    street_address?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ShippingAddress {
    id?: number;
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    country?: string;
    state?: string;
    address?: string;
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    email: string;
    full_name: string;
    phone: string | null;
    user_type: string;
    is_ai_customer: boolean;
    is_active: boolean;
    is_admin_verified: boolean;
    created_at: string;
    profile: {
        business_name?: string | null;
    } | UserProfile | null;
}

export interface UserDetails extends Omit<User, 'profile'> {
    is_email_verified?: boolean;
    is_phone_verified?: boolean;
    status?: boolean;
    updated_at?: string;
    profile: UserProfile | null;
    shiping_address?: ShippingAddress | null;
}

export interface MetaData {
    total_items: number;
    total_pages: number;
    current_page: number;
    next: string | null;
    previous: string | null;
    per_page: number;
}

export interface GetAllUsersResponse {
    success: boolean;
    message: string;
    request_id?: string;
    meta: MetaData;
    data: User[];
}

export interface GetUserDetailsResponse {
    success: boolean;
    message: string;
    request_id?: string;
    data: UserDetails;
}

export interface ToggleStatusResponse {
    success: boolean;
    message: string;
    request_id?: string;
    data: UserDetails;
}

export interface GetAllUsersParams {
    page?: number;
    search?: string;
    user_type?: string;
}

export interface CreateAiCustomerRequest {
    full_name: string;
    email: string;
    phone: string;
    user_type: string;
    is_ai_customer: boolean;
    is_email_verified: boolean;
    is_phone_verified: boolean;
    status: boolean;
    profile: {
        first_name: string;
        last_name: string;
        phone_number: string;
        business_type: string;
        business_name: string;
        industry_category: string;
        industry: string;
        country: string;
        state_province: string;
        city: string;
        postal_code: string;
        street_address: string;
    };
    shiping_address: {
        email: string;
        phone: string;
        first_name: string;
        last_name: string;
        country: string;
        state: string;
        address: string;
    };
}
