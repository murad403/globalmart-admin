import baseApi from "@/redux/api/baseApi";
import { GetAllUsersResponse, GetAllUsersParams, GetUserDetailsResponse, ToggleStatusResponse } from "./user.type";

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query<GetAllUsersResponse, GetAllUsersParams>({
            query: (params) => {
                const filteredParams: Record<string, any> = {};
                if (params?.page) filteredParams.page = params.page;
                if (params?.search) filteredParams.search = params.search;
                if (params?.user_type && params.user_type !== "all") {
                    filteredParams.user_type = params.user_type;
                }

                return {
                    url: `/admin/users/`,
                    method: "GET",
                    params: filteredParams,
                };
            },
            providesTags: ["users"],
        }),
        userDetails: builder.query<GetUserDetailsResponse, string>({
            query: (id: string) => {
                return {
                    url: `/admin/users/${id}/`,
                    method: "GET",
                };
            },
            providesTags: ["users"],
        }),
        statusToggle: builder.mutation<ToggleStatusResponse, { id: number | string; is_active: boolean }>({
            query: ({ id, is_active }) => {
                return {
                    url: `/admin/users/${id}/toggle-status/`,
                    method: "PATCH",
                    body: { is_active }
                };
            },
            invalidatesTags: ["users"],
        }),
    }),
});

export const { 
    useGetAllUsersQuery,
    useUserDetailsQuery,
    useStatusToggleMutation
} = userApi;