import { IUser } from "@/src/model/entities";
import { apiSlice } from "./apiSlice";
import {
  IChangePasswordRequest,
  IUpdateUserRequest,
} from "@/src/types/apiResponseType";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation<
      IUser,
      { id: string; request: Partial<IUpdateUserRequest> }
    >({
      query: ({ id, request }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: request,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<void, IChangePasswordRequest>({
      query: (request) => ({
        url: `/users/change-password`,
        method: "PATCH",
        body: request,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

export const { useUpdateUserMutation, useChangePasswordMutation } =
  userApiSlice;
