import baseApi from "@/redux/api/baseApi";
import { GetOverviewResponse, GetReportsResponse } from "./overview.type";

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
    }),
});

export const {
    useGetOverviewQuery,
    useGetReportsQuery
} = overviewApi;