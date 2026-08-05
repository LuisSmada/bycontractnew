import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include", //To send the cookie httpOnly
  }),

  // Les "tags" permettent d'invalider le cache automatiquement (ex: recharger la liste après un ajout)
  tagTypes: ["User", "Template", "Company"],

  endpoints: () => ({}),
});
