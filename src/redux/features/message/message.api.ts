import baseApi from "@/redux/api/baseApi";



const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createInbox: builder.mutation({
            query: (data) => {
                return {
                    url: `/chats/inboxes`,
                    method: "POST",
                    body: data
                };
            },
            invalidatesTags: ["messages"]
        }),
        inboxList: builder.query({
            query: () => {
                return {
                    url: `/chats/inboxes`,
                    method: "GET",
                };
            },
            providesTags: ["messages"]
        }),
        inboxMessageList: builder.query({
            query: (id) => {
                return {
                    url: `/chats/messages/${id}`,
                    method: "GET",
                };
            },
            providesTags: ["messages"]
        }),
        sendMessage: builder.mutation({
            query: (data) => ({
                url: `/chats/messages`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["messages"]
        }),
    }),
});




export const {
    useCreateInboxMutation,
    useInboxListQuery,
    useInboxMessageListQuery,
    useSendMessageMutation
} = messageApi;