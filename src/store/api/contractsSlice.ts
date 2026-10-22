import { createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import {
  IListContractResponse,
  ICreateContractRequest,
  IFindContractResponse,
  IUpdateContractRequest,
  IUploadSignedContractRequest,
} from "@/src/types/apiResponseType";
import { TRootState } from "../store";
import { EContractStatus } from "@/src/model/entities";

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

// 1. On récupère le résultat brut de la requête depuis le cache.
// Note : S'il y a des paramètres à ta query, il faut les passer dans le select().
// Comme getAllContracts prend "void", on ne met rien
const selectContractsResult = contractsSlice.endpoints.getAllContracts.select();

// 2. On crée un sélecteur mémoïsé qui extrait juste le tableau de contrats
export const selectAllContracts = createSelector(
  selectContractsResult,
  (contractsResult) => contractsResult?.data ?? [],
);

// 3. TON SÉLECTEUR MÉTIER : Calcule le nombre de contrats actifs/en attente pour un tiers donné
// export const selectContractsCountByStakeholder = createSelector(
//   [
//     selectAllContracts,
//     (state: TRootState, idStakeholder: string, docStatus: EContractStatus) =>
//       idStakeholder,
//     (state: TRootState, idStakeholder: string, docStatus: EContractStatus) =>
//       docStatus,
//   ],
//   (contracts, idStakeholder, docStatus) => {
//     // 👇 Adapte "contract.stakeholderId" et "contract.status" avec tes vrais noms de variables
//     return contracts.filter(
//       (contract) =>
//         contract.company.id === idStakeholder && contract.status === docStatus,
//     ).length;
//   },
// );
