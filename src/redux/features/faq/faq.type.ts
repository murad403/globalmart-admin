export interface Faq {
    id: number;
    category: string;
    question: string;
    answer: string;
}

export interface FaqMeta {
    total_items: number;
    total_pages: number;
    current_page: number;
    next: string | null;
    previous: string | null;
    per_page: number;
}

export interface GetFaqsResponse {
    success: boolean;
    message: string;
    request_id?: string;
    meta: FaqMeta;
    data: Faq[];
}

export interface AddFaqResponse {
    success: boolean;
    message: string;
    request_id?: string;
    data: Faq;
}

export interface UpdateFaqResponse {
    success: boolean;
    message: string;
    request_id?: string;
    data: Faq;
}

export interface DeleteFaqResponse {
    success: boolean;
    message: string;
    request_id?: string;
    data: {
        id: number;
    };
}
