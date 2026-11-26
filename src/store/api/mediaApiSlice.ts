import { IUploadMediaResponse } from "@/src/types/apiResponseType";
import { apiSlice } from "./apiSlice";

export const mediaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadMedia: builder.mutation<IUploadMediaResponse, FormData>({
      query: (formData) => ({
        url: "/media/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useUploadMediaMutation } = mediaApiSlice;
