import baseApi from "@/redux/api/baseApi";
import { GetOrdersResponse } from "./order.type";

export interface GetOrdersParams {
    page?: number;
    status?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
}

const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<GetOrdersResponse, GetOrdersParams>({
            query: (params) => {
                // Filter out undefined or empty strings to build query string cleanly
                const filteredParams: Record<string, any> = {};
                if (params?.page) filteredParams.page = params.page;
                if (params?.status) filteredParams.status = params.status;
                if (params?.search) filteredParams.search = params.search;
                if (params?.date_from) filteredParams.date_from = params.date_from;
                if (params?.date_to) filteredParams.date_to = params.date_to;

                return {
                    url: "/admin/order-management/",
                    method: "GET",
                    params: filteredParams,
                };
            },
        }),
        getOrderDetails: builder.query({
            query: (id: string) => {
                return {
                    url: `/admin/order-management/${id}/`,
                    method: "GET",
                };
            },
        }),
    }),
});

export const { useGetOrdersQuery, useGetOrderDetailsQuery } = orderApi;