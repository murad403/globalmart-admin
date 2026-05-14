import baseApi from "@/redux/api/baseApi";
import { GetCategoriesResponse } from "./category.type";

export interface GetCategoriesParams {
    page?: number;
    search?: string;
}

const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<GetCategoriesResponse, GetCategoriesParams>({
            query: (params) => {
                const filteredParams: Record<string, any> = {};
                if (params?.page) filteredParams.page = params.page;
                if (params?.search) filteredParams.search = params.search;

                return {
                    url: "/admin/categories/",
                    method: "GET",
                    params: filteredParams,
                };
            },
            providesTags: ["categories"],
        }),
        addCategory: builder.mutation<any, FormData>({
            query: (data) => ({
                url: "/admin/categories/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["categories"],
        }),
        updateCategory: builder.mutation<any, { id: number; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/admin/categories/${id}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["categories"],
        }),
        deleteCategory: builder.mutation<any, { id: number }>({
            query: ({ id }) => ({
                url: `/admin/categories/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["categories"],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoriesApi;