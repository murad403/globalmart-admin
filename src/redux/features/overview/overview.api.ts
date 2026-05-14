import baseApi from "@/redux/api/baseApi";
import { 
    GetOverviewResponse, 
    GetReportsResponse, 
    GetPaymentConfirmationResponse, 
    PaymentConfirmationRequest, 
    PaymentConfirmationMutationResponse 
} from "./overview.type";

const overviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOverview: builder.query<GetOverviewResponse, void>({
            query: () => {
                return {
                    url: "/admin/overview/",
                    method: "GET",
                };
            }
        }),
        getReports: builder.query<GetReportsResponse, void>({
            query: () => {
                return {
                    url: "/admin/analytics/report/",
                    method: "GET",
                };
            }
        }),
        getPaymentConfirmation: builder.query<GetPaymentConfirmationResponse, Record<string, string | number | undefined> | void>({
            query: (params) => {
                return {
                    url: "/admin/payment-confirmation/",
                    method: "GET",
                    params: params ?? undefined,
                };
            }, 
            providesTags: ["payment-confirmation"],
        }),
        paymentConfirmation: builder.mutation<PaymentConfirmationMutationResponse, PaymentConfirmationRequest>({
            query: (data) => {
                return {
                    url: "/admin/payment-confirmation/",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["payment-confirmation"],
        }),
    }),
});

export const {
    useGetOverviewQuery,
    useGetReportsQuery,
    useGetPaymentConfirmationQuery,
    usePaymentConfirmationMutation
} = overviewApi;