import { ICompany } from "@/src/model/entities";
import { ICreateCompanyRequest } from "@/src/types/apiResponseType";
import { apiSlice } from "./apiSlice";

export const companiesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCompanies: builder.query<ICompany[], void>({
      query: () => "/companies",
      providesTags: ["Company"],
    }),

    createCompany: builder.mutation<ICompany, ICreateCompanyRequest>({
      query: (request) => ({
        url: "/companies",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Company"],
    }),

    deleteCompany: builder.mutation<void, string>({
      query: (id) => ({
        url: `/companies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Company"],
    }),
  }),
});

export const {
  useGetAllCompaniesQuery,
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
} = companiesApiSlice;
