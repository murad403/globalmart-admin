export interface ContentItem {
  id: number;
  title: string;
  sub_title: string;
  content: string;
}

export interface MetaData {
  total_items: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  per_page: number;
}

export interface GetAllContentsResponse {
  success: boolean;
  message: string;
  request_id?: string;
  meta: MetaData;
  data: ContentItem[];
}

export interface AddContentRequest {
  title: string;
  sub_title: string;
  content: string;
}

export interface AddContentResponse {
  success: boolean;
  message: string;
  request_id?: string;
  data: ContentItem;
}

export interface UpdateContentRequest {
  title?: string;
  sub_title?: string;
  content?: string;
}

export interface UpdateContentResponse {
  success: boolean;
  message: string;
  request_id?: string;
  data: ContentItem;
}
