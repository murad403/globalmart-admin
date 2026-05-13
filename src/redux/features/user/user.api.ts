import baseApi from "@/redux/api/baseApi";
import { 
    GetAllUsersResponse, 
    GetAllUsersParams, 
    GetUserDetailsResponse, 
    ToggleStatusResponse,
    CreateAiCustomerRequest
} from "./user.type";

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

        getAllAiUsers: builder.query<GetAllUsersResponse, { page?: number; search?: string }>({
            query: (params) => {
                const filteredParams: Record<string, any> = {
                    is_ai_customer: true
                };
                if (params?.page) filteredParams.page = params.page;
                if (params?.search) filteredParams.search = params.search;

                return {
                    url: `/admin/users/`,
                    method: "GET",
                    params: filteredParams,
                };
            },
            providesTags: ["users"],
        }),
        createAiCustomer: builder.mutation<any, any>({
            query: (body) => {
                return {
                    url: `/admin/users/`,
                    method: "POST",
                    body: body,
                };
            },
            invalidatesTags: ["users"],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useUserDetailsQuery,
    useStatusToggleMutation,
    useGetAllAiUsersQuery,
    useCreateAiCustomerMutation
} = userApi;