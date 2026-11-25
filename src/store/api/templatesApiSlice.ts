import { apiSlice } from "./apiSlice";
import {
  ITemplateResponse,
  IFindTemplate,
  ICreateTemplateRequest,
  IUpdateTemplateRequest,
} from "@/src/types/apiResponseType";

export const templateApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTemplate: builder.mutation<ICreateTemplateRequest, ITemplateResponse>(
      {
        query: (request) => ({
          url: "/templates",
          method: "POST",
          body: request,
        }),
        invalidatesTags: ["Template"],
      },
    ),
    getAllTemplates: builder.query<ITemplateResponse[], void>({
      query: () => "/templates",
      providesTags: ["Template"],
    }),

    getTemplateById: builder.query<IFindTemplate, string>({
      query: (id) => `/templates/${id}`,
      providesTags: ["Template"],
    }),

    updateTemplate: builder.mutation<
      IFindTemplate,
      { id: string; request: Partial<IUpdateTemplateRequest> }
    >({
      query: ({ id, request }) => ({
        url: `/templates/${id}`,
        method: "PATCH",
        body: request,
      }),
      invalidatesTags: ["Template"],
    }),
    deleteTemplate: builder.mutation<void, string>({
      query: (id) => ({
        url: `/templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Template"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllTemplatesQuery,
  useGetTemplateByIdQuery,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} = templateApiSlice;
