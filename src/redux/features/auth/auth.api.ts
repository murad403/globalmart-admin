import baseApi from "@/redux/api/baseApi";
import { 
    SignInRequest, 
    SignInResponse, 
    ForgotPasswordRequest, 
    ForgotPasswordResponse, 
    VerifyOtpRequest, 
    VerifyOtpResponse, 
    ResetPasswordRequest, 
    ResetPasswordResponse, 
    ChangePasswordRequest, 
    ChangePasswordResponse,
    GetPlatformBrandingResponse,
    UpdatePlatformBrandingResponse 
} from "./auth.type";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation<SignInResponse, SignInRequest>({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data
            })
        }),
        forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
            query: (data) => ({
                url: "/auth/forget-password",
                method: "POST",
                body: data
            })
        }),
        verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
            query: (data) => ({
                url: "/auth/otp-verify",
                method: "POST",
                body: data
            })
        }),
        resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
            query: (data) => ({
                url: "/auth/reset-password",
                method: "POST",
                body: data
            })
        }),
        changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
            query: (data) => ({
                url: "/auth/change-password",
                method: "POST",
                body: data
            })
        }),
        getProfile: builder.query({
            query: () => ({
                url: "/profiles/me/",
                method: "GET"
            })
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: "/profiles/me/",
                method: "PATCH",
                body: data
            })
        }),
        getPlateformBranding: builder.query<GetPlatformBrandingResponse, void>({
            query: () => ({
                url: "/admin/platform-branding/",
                method: "GET",
            }),
            providesTags: ["platform-branding"]
        }),
        updatePlateformBranding: builder.mutation<UpdatePlatformBrandingResponse, FormData>({
            query: (data) => ({
                url: "/admin/platform-branding/",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["platform-branding"]
        })
    })
});

export const {
    useSignInMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetPlateformBrandingQuery,
    useUpdatePlateformBrandingMutation
} = authApi;