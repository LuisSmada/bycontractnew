import { apiSlice } from "./apiSlice";
import {
  IContractResponse,
  ICreateContractRequest,
  IFindContractResponse,
  IUpdateContractRequest,
} from "@/src/types/apiResponseType";

export const contractsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllContracts: builder.query<IContractResponse[], void>({
      query: () => "/contracts",
      providesTags: ["Contract"],
    }),
    getContractById: builder.query<IFindContractResponse, string>({
      query: (id) => `/contracts/${id}`,
      providesTags: ["Contract"],
    }),
    createContract: builder.mutation<IContractResponse, ICreateContractRequest>(
      {
        query: (request) => ({
          url: "/contracts",
          method: "POST",
          body: request,
        }),
        invalidatesTags: ["Contract"],
      },
    ),
    updateContract: builder.mutation<
      IFindContractResponse,
      { id: string; request: Partial<IUpdateContractRequest> }
    >({
      query: ({ id, request }) => ({
        url: `/contracts/${id}`,
        method: "PATCH",
        body: request,
      }),
      invalidatesTags: ["Contract"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateContractMutation,
  useGetAllContractsQuery,
  useGetContractByIdQuery,
  useUpdateContractMutation,
} = contractsSlice;
