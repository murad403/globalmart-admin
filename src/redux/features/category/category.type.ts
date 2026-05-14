export interface Category {
    id: number;
    title: string;
    image: string | null;
    created_at: string;
}

export interface CategoryMeta {
    total_items: number;
    total_pages: number;
    current_page: number;
    next: string | null;
    previous: string | null;
    per_page: number;
}

export interface GetCategoriesResponse {
    success: boolean;
    message: string;
    request_id?: string;
    meta: CategoryMeta;
    data: Category[];
}

export interface AddCategoryResponse {
    success: boolean;
    message: string;
    request_id?: string;
    data: Category;
}

export interface UpdateCategoryResponse {
    success: boolean;
    message: string;
    request_id?: string;
    data: Category;
}

export interface DeleteCategoryResponse {
    success: boolean;
    message: string;
    request_id?: string;
    data: {
        id: number;
    };
}
