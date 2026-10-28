import { IUser } from "@/src/model/entities";
import {
  IAuthCredentials,
  IAuthResponse,
  IForgotPasswordRequest,
  IRegisterUserRequest,
  IResetPasswordRequest,
} from "@/src/types/authTypes";
import { apiSlice } from "./apiSlice";
import { createSelector } from "@reduxjs/toolkit";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<IAuthResponse, IRegisterUserRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    // - User : Le format de la donnée renvoyée par Spring Boot
    // - void : Indique strictement à TypeScript qu'aucun argument n'est requis
    getCurrentUser: builder.query<IUser, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    // Une "mutation" sert à MODIFIER des données (POST, PUT, DELETE)
    // Exemple pour le login : il renvoie un objet (ou any) et prend un objet Credentials en paramètre
    login: builder.mutation<IAuthResponse, IAuthCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      // Après un login réussi, on force RTK Query à refaire le "getMe" pour mettre à jour l'interface
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<IAuthResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // Après un logout réussi, on force RTK Query à refaire le "getMe" pour mettre à jour l'interface
      invalidatesTags: ["User"],
    }),

    forgotPassword: builder.mutation<void, IForgotPasswordRequest>({
      query: (request) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: request,
      }),
    }),
    resetPassword: builder.mutation<void, IResetPasswordRequest>({
      query: (request) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: request,
      }),
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;

const selectCurrentUserResult = authApiSlice.endpoints.getCurrentUser.select();

export const currentUserSelector = createSelector(
  selectCurrentUserResult,
  (currentUser) => currentUser.data,
);
