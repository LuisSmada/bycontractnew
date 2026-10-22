import { ICompany, ICreateCompanyRequest } from "@/src/types/apiResponseType";
import { apiSlice } from "./apiSlice";

export const companiesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMyCompanies: builder.query<ICompany[], void>({
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
    updateCompanyById: builder.mutation<
      ICompany,
      { id: string; request: Partial<ICreateCompanyRequest> }
    >({
      query: ({ id, request }) => ({
        url: `/companies/${id}`,
        method: "PATCH",
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
  useGetAllMyCompaniesQuery,
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useUpdateCompanyByIdMutation,
} = companiesApiSlice;
