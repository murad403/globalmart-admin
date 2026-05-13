import baseApi from "@/redux/api/baseApi";
import { GetOrdersResponse, GetWithdrawalsResponse } from "./order.type";

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
        getOrderWithdrawalsRequest: builder.query<GetWithdrawalsResponse, { page?: number; status?: string; search?: string }>({
            query: (params) => {
                const filteredParams: Record<string, any> = {};
                if (params?.page) filteredParams.page = params.page;
                if (params?.status && params.status !== "all") filteredParams.status = params.status;
                if (params?.search) filteredParams.search = params.search;

                return {
                    url: `/admin/withdrawal-requests/`,
                    method: "GET",
                    params: filteredParams,
                };
            },
            providesTags: ["withdrawals"],
        }),
        updateWithdrawalStatus: builder.mutation<any, any>({
            query: (data) => ({
                url: `/admin/withdrawal-requests/approval/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["withdrawals"],
        }),
    }),
});

export const { useGetOrdersQuery, useGetOrderDetailsQuery, useGetOrderWithdrawalsRequestQuery, useUpdateWithdrawalStatusMutation } = orderApi;