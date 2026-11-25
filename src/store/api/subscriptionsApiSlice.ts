import {
  ICheckoutPaymentRequest,
  IFacturationInformations,
  IOpenCustomerPortalRequest,
  ISubscriptionInvoiceResponse,
  ISubscriptionStatusResponse,
} from "@/src/types/apiResponseType";
import { apiSlice } from "./apiSlice";
import { createSelector } from "@reduxjs/toolkit";

export const subscriptionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCheckout: builder.mutation<
      Record<"url", string>,
      ICheckoutPaymentRequest
    >({
      query: (request) => ({
        url: "/subscriptions/checkout",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Subscription", "User"],
    }),

    createCustomerPortal: builder.mutation<
      Record<"url", string>,
      IOpenCustomerPortalRequest
    >({
      query: (request) => ({
        url: "/subscriptions/customer-portal",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Subscription", "User"],
    }),

    getSubscriptionStatus: builder.query<ISubscriptionStatusResponse, void>({
      query: () => "/subscriptions/status",
      providesTags: ["Subscription", "User"],
    }),

    getInvoices: builder.query<ISubscriptionInvoiceResponse[], void>({
      query: () => "/subscriptions/me/invoices",
      providesTags: ["Subscription", "User"],
    }),

    cancelSubscription: builder.mutation<void, void>({
      query: () => ({
        url: "/subscriptions/cancel",
        method: "POST",
      }),
      invalidatesTags: ["User", "Subscription"], // Remplace par ton tag de profil utilisateur
    }),
    reactivateSubscription: builder.mutation<void, void>({
      query: () => ({
        url: "/subscriptions/reactivate",
        method: "POST",
      }),
      invalidatesTags: ["User", "Subscription"],
    }),
    getFacturationInformations: builder.query<IFacturationInformations, void>({
      query: () => "/subscriptions/details",
      providesTags: ["Subscription"],
    }),
    updateFacturationInformations: builder.mutation<
      IFacturationInformations,
      IFacturationInformations
    >({
      query: (body) => ({
        url: "/subscriptions/details",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateCheckoutMutation,
  useGetInvoicesQuery,
  useGetSubscriptionStatusQuery,
  useCreateCustomerPortalMutation,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
  useGetFacturationInformationsQuery,
  useUpdateFacturationInformationsMutation,
} = subscriptionsApiSlice;

const selectSubscriptionStatusResult =
  subscriptionsApiSlice.endpoints.getSubscriptionStatus.select();

export const subscriptionStatusDataSelector = createSelector(
  selectSubscriptionStatusResult,
  (subscriptionStatusData) => subscriptionStatusData.data,
);
