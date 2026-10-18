import { apiSlice } from "./apiSlice";
import {
  ITemplateResponse,
  IFindTemplate,
  ICreateTemplateRequest,
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
  }),
  overrideExisting: true,
});

export const { useGetAllTemplatesQuery, useGetTemplateByIdQuery } =
  templateApiSlice;
