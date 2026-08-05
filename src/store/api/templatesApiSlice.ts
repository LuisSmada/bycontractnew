import { apiSlice } from "./apiSlice";
import { ITemplateResponse, IFindTemplate } from "@/src/types/apiResponseType";

export const templateApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTemplates: builder.query<ITemplateResponse[], void>({
      query: () => "/templates",
      providesTags: ["Template"],
    }),

    getTemplateById: builder.query<IFindTemplate, string>({
      query: (id) => `/templates/${id}`,
      providesTags: ["Template"],
    }),
  }),
});

export const { useGetAllTemplatesQuery, useGetTemplateByIdQuery } =
  templateApiSlice;
