import { apiSlice } from "./apiSlice";
import {
  IListContractResponse,
  ICreateContractRequest,
  IFindContractResponse,
  IUpdateContractRequest,
  IUploadSignedContractRequest,
} from "@/src/types/apiResponseType";

export const contractsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllContracts: builder.query<IListContractResponse[], void>({
      query: () => "/contracts",
      providesTags: ["Contract"],
    }),
    getContractById: builder.query<IFindContractResponse, string>({
      query: (id) => `/contracts/${id}`,
      providesTags: ["Contract"],
    }),
    createContract: builder.mutation<
      IListContractResponse,
      ICreateContractRequest
    >({
      query: (request) => ({
        url: "/contracts",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Contract"],
    }),
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
    deleteContract: builder.mutation<void, string>({
      query: (id) => ({
        url: `/contracts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contract"],
    }),
    uploadSignedContract: builder.mutation<
      IFindContractResponse,
      IUploadSignedContractRequest
    >({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/contracts/${id}/signature`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Contract"],
    }),
    getSignedContractUrl: builder.query<Record<string, string>, string>({
      query: (id) => `/contracts/${id}/signature-url`,
      providesTags: ["Contract"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateContractMutation,
  useGetAllContractsQuery,
  useGetContractByIdQuery,
  useUpdateContractMutation,
  useDeleteContractMutation,
  useUploadSignedContractMutation,
  useGetSignedContractUrlQuery,
  useLazyGetSignedContractUrlQuery,
} = contractsSlice;
