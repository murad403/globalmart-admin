import baseApi from "@/redux/api/baseApi";
import { 
    GetAllContentsResponse, 
    AddContentRequest, 
    AddContentResponse, 
    UpdateContentRequest, 
    UpdateContentResponse 
} from "./contents.type";

const contentsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllContents: builder.query<GetAllContentsResponse, Record<string, string | number | undefined> | void>({
            query: (params) => {
                return {
                    url: "/admin/contents/",
                    method: "GET",
                    params: params ?? undefined,
                };
            },
            providesTags: ["contents"],
        }),
        addContent: builder.mutation<AddContentResponse, AddContentRequest>({
            query: (data) => {
                return {
                    url: "/admin/contents/",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["contents"],
        }),
        updateContent: builder.mutation<UpdateContentResponse, { id: number; data: UpdateContentRequest }>({
            query: ({ id, data }) => {
                return {
                    url: `/admin/contents/${id}/`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["contents"],
        }),
        deleteContent: builder.mutation<{ success: boolean; message: string }, number>({
            query: (id) => {
                return {
                    url: `/admin/contents/${id}/`,
                    method: "DELETE"
                };
            },
            invalidatesTags: ["contents"],
        }),
    }),
});

export const {
    useGetAllContentsQuery,
    useAddContentMutation,
    useUpdateContentMutation,
    useDeleteContentMutation
} = contentsApi;