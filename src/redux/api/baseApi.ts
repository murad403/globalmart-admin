import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCurrentUser } from "@/utils/auth";

// base query-----------------------------------------------------------------------------------------------
const baseQuery = fetchBaseQuery({
     baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: async(headers) => {
        const {access} = await getCurrentUser();
        if (access) {
            headers.set('Authorization', `Bearer ${access}`);
        }
        return headers;
    }
})


const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQuery,
    tagTypes: ["auth", "withdrawals", "users", "faqs", "categories", 'products', "payment-confirmation", 'platform-branding'],
    endpoints: () => ({})
})


export default baseApi;