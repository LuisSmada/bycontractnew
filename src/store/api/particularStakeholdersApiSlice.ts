import {
  ICreateParticularStakeholderRequest,
  IParticularStakeholder,
  IParticularStakeholderListResponse,
} from "@/src/types/apiResponseType";
import { apiSlice } from "./apiSlice";

export const particularStakeholdersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllParticularStakeholders: builder.query<
      IParticularStakeholderListResponse,
      void
    >({
      query: () => "/particular-stakeholders",
      providesTags: ["ParticularStakeholder"],
    }),
    getParticularStakeholderById: builder.query<IParticularStakeholder, string>(
      {
        query: (id) => `/particular-stakeholders/${id}`,
        providesTags: ["ParticularStakeholder"],
      },
    ),
    createParticularStakeholder: builder.mutation<
      IParticularStakeholder,
      ICreateParticularStakeholderRequest
    >({
      query: (request) => ({
        url: "/particular-stakeholders",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["ParticularStakeholder"],
    }),
    updateParticularStakeholderById: builder.mutation<
      IParticularStakeholder,
      { id: string; request: Partial<ICreateParticularStakeholderRequest> }
    >({
      query: ({ id, request }) => ({
        url: `/particular-stakeholders/${id}`,
        method: "PATCH",
        body: request,
      }),
      invalidatesTags: ["ParticularStakeholder"],
    }),
    deleteParticularStakeholder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/particular-stakeholders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ParticularStakeholder"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateParticularStakeholderMutation,
  useGetAllParticularStakeholdersQuery,
  useGetParticularStakeholderByIdQuery,
  useUpdateParticularStakeholderByIdMutation,
  useDeleteParticularStakeholderMutation,
} = particularStakeholdersApiSlice;
