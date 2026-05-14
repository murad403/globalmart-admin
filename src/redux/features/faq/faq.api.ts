import baseApi from "@/redux/api/baseApi";
import { GetFaqsResponse, AddFaqResponse, UpdateFaqResponse, DeleteFaqResponse } from "./faq.type";

export interface GetFaqsParams {
    page?: number;
    category?: string;
    search?: string;
}

const faqApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFaqs: builder.query<GetFaqsResponse, GetFaqsParams>({
            query: (params) => {
                const filteredParams: Record<string, any> = {};
                if (params?.page) filteredParams.page = params.page;
                if (params?.category && params.category !== "all") filteredParams.category = params.category;
                if (params?.search) filteredParams.search = params.search;

                return {
                    url: "/admin/faqs/",
                    method: "GET",
                    params: filteredParams,
                };
            },
            providesTags: ["faqs"],
        }),
        addFaq: builder.mutation<AddFaqResponse, { category: string; question: string; answer: string }>({
            query: (data) => ({
                url: "/admin/faqs/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["faqs"],
        }),
        updateFaq: builder.mutation<UpdateFaqResponse, { id: number; data: { category: string; question: string; answer: string } }>({
            query: ({ id, data }) => ({
                url: `/admin/faqs/${id}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["faqs"],
        }),
        deleteFaq: builder.mutation<DeleteFaqResponse, { id: number }>({
            query: ({ id }) => ({
                url: `/admin/faqs/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["faqs"],
        }),
    }),
});

export const {
    useGetFaqsQuery,
    useAddFaqMutation,
    useUpdateFaqMutation,
    useDeleteFaqMutation,
} = faqApi;