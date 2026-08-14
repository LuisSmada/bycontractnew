import { apiSlice } from "./apiSlice";
import {
  IContractResponse,
  ICreateContractRequest,
  IFindContractResponse,
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
  }),
});

export const {
  useCreateContractMutation,
  useGetAllContractsQuery,
  useGetContractByIdQuery,
} = contractsSlice;
