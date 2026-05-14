import baseApi from "@/redux/api/baseApi";
import { GetProductsResponse, GetProductDetailsResponse } from "./product.type";

const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<GetProductsResponse, Record<string, string | number> | void>({
            query: (params) => {
                return {
                    url: "/admin/products/",
                    method: "GET",
                    params: params ?? undefined,
                };
            },
        }),
        getProductDetails: builder.query<GetProductDetailsResponse, string>({
            query: (id: string) => {
                return {
                    url: `/admin/products/${id}/`,
                    method: "GET"
                };
            },
            providesTags: ["products"],
        }),
        deleteProduct: builder.mutation<{ success: boolean; message?: string }, string>({
            query: (id: string) => {
                return {
                    url: `/admin/products/${id}/`,
                    method: "DELETE"
                };
            },
            invalidatesTags: ["products"],
        }),
    }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery, useDeleteProductMutation } = productApi;