import { IUser } from "@/src/model/entities";
import { ILoginResponse, IAuthCredentials } from "@/src/types/authTypes";
import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // - User : Le format de la donnée renvoyée par Spring Boot
    // - void : Indique strictement à TypeScript qu'aucun argument n'est requis
    getCurrentUser: builder.query<IUser, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    // Une "mutation" sert à MODIFIER des données (POST, PUT, DELETE)
    // Exemple pour le login : il renvoie un objet (ou any) et prend un objet Credentials en paramètre
    login: builder.mutation<ILoginResponse, IAuthCredentials>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      // Après un login réussi, on force RTK Query à refaire le "getMe" pour mettre à jour l'interface
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<ILoginResponse, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      // Après un logout réussi, on force RTK Query à refaire le "getMe" pour mettre à jour l'interface
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetCurrentUserQuery, useLoginMutation, useLogoutMutation } = authApiSlice;
