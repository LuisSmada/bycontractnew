"use client";

import {
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { operationError, operationSuccess } from "@/src/utils/operationsToasts";
import { cn } from "@/lib/utils";
import { ESubscriptionStatus } from "@/src/types/apiResponseType";
import { useAppSelector } from "@/src/store/reduxHooks";
import {
  subscriptionStatusDataSelector,
  useCancelSubscriptionMutation,
  useCreateCheckoutMutation,
  useCreateCustomerPortalMutation,
  useReactivateSubscriptionMutation,
} from "@/src/store/api/subscriptionsApiSlice";
import { sanitizeDate } from "@/src/helpers/generic";
import { usePathname } from "next/navigation";
import { responseErrorApi } from "@/src/utils/responseErrorApi";
import { SubscriptionTrialing } from "./SubscriptionTrialing";
import { SubscriptionActive } from "./SubscriptionActive";
import { SubscriptionEnd } from "./SubscriptionEnd";
import { useState } from "react";

interface IBillingData {
  status: ESubscriptionStatus;
  cancelAtPeriodEnd: boolean;
  planName: string;
  planPrice?: string;
  trialEndsAt?: string;
  nextBillingDate?: string;
  cardBrand?: string;
  cardLast4?: string;
}

export const BillingSection = () => {
  const pathname = usePathname();

  const [createCustomerPortalSession, { isLoading: isCreatingCustomerPortal }] =
    useCreateCustomerPortalMutation();
  const [createCheckoutSession, { isLoading: isCreatingCheckoutSession }] =
    useCreateCheckoutMutation();
  const [cancelSubscription, { isLoading: isCancelingSubscription }] =
    useCancelSubscriptionMutation();
  const [reactivateSubscription, { isLoading: isReactivatingSubscription }] =
    useReactivateSubscriptionMutation();

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const subscriptionStatusData = useAppSelector(subscriptionStatusDataSelector);

  const displayPlan = () => {
    switch (subscriptionStatusData?.status) {
      case ESubscriptionStatus.TRIALING:
        return "Essai gratuit";
      case ESubscriptionStatus.ACTIVE:
      case ESubscriptionStatus.CANCEL_AT_THE_END:
        return subscriptionStatusData?.planName;
      case (ESubscriptionStatus.PAST_DUE,
      ESubscriptionStatus.CANCELED,
      ESubscriptionStatus.INACTIVE):
        return "Aucun plan en cours";
      default:
        return "Aucun plan en cours";
    }
  };

  const getHeaderBadgeConfig = (status: ESubscriptionStatus) => {
    switch (status) {
      case ESubscriptionStatus.ACTIVE:
        return {
          label: "Actif",
          badgeClass: "bg-emerald-100 text-emerald-700",
          iconBoxClass: "bg-emerald-50 border-emerald-100",
          iconClass: "text-emerald-600",
          Icon: CheckCircle2,
        };
      case ESubscriptionStatus.CANCEL_AT_THE_END:
        return {
          label: "Résiliation programmée",
          badgeClass: "bg-amber-100 text-amber-700",
          iconBoxClass: "bg-amber-50 border-amber-100",
          iconClass: "text-amber-600",
          Icon: AlertTriangle,
        };
      case ESubscriptionStatus.TRIALING:
        return {
          label: "Essai gratuit",
          badgeClass: "bg-amber-100 text-amber-700",
          iconBoxClass: "bg-amber-50 border-amber-100",
          iconClass: "text-amber-600",
          Icon: Clock,
        };
      case ESubscriptionStatus.PAST_DUE:
      case ESubscriptionStatus.CANCELED:
      case ESubscriptionStatus.INACTIVE:
      default:
        return {
          label: "Expiré",
          badgeClass: "bg-rose-100 text-rose-700",
          iconBoxClass: "bg-rose-50 border-rose-100",
          iconClass: "text-rose-600",
          Icon: AlertCircle,
        };
    }
  };

  const isCancelAtPeriodEnd =
    subscriptionStatusData?.status === ESubscriptionStatus.CANCEL_AT_THE_END;

  console.log("subscriptionData", subscriptionStatusData);

  const billingData: IBillingData = {
    status: subscriptionStatusData?.status ?? ESubscriptionStatus.TRIALING,
    // status: ESubscriptionStatus.ACTIVE,
    cancelAtPeriodEnd: isCancelAtPeriodEnd,
    planName: displayPlan(),
    planPrice: `${subscriptionStatusData?.planPrice} € HT / mois`,
    trialEndsAt: sanitizeDate(subscriptionStatusData?.trialEndDate ?? ""),
    nextBillingDate: sanitizeDate(
      subscriptionStatusData?.currentPeriodEnd ?? "",
    ),
    cardBrand: subscriptionStatusData?.cardBrand?.toUpperCase() ?? "",
    cardLast4: subscriptionStatusData?.cardLast4 ?? "",
  };

  // --- ACTIONS ---
  const handleSubscribe = async () => {
    try {
      const origin = window.location.origin;
      const response = await createCheckoutSession({
        idPrice: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID as string,
        successUrl: `${origin}/fr/billing/success`,
        cancelUrl: `${origin}${pathname}`,
      }).unwrap();
      window.open(response.url);
      // Redirection : window.location.href = res.url;
    } catch (error) {
      responseErrorApi(error);
      operationError("Erreur lors de la redirection vers Stripe.");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const origin = window.location.origin;
      const response = await createCustomerPortalSession({
        returnUrl: `${origin}/fr/settings`,
      }).unwrap();
      window.open(response.url);
      await new Promise((r) => setTimeout(r, 1000));
    } catch (error) {
      responseErrorApi(error);
      operationError("Impossible d'ouvrir le portail Stripe.");
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription().unwrap();
      operationSuccess("Résiliation programmée en fin de période.");
    } catch {
      operationError("Impossible de résilier l'abonnement.");
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      await reactivateSubscription().unwrap();
      operationSuccess("Votre abonnement a été réactivé.");
    } catch {
      operationError("Impossible de réactiver l'abonnement.");
    }
  };

  const isSubscriptionActive =
    billingData.status === ESubscriptionStatus.ACTIVE ||
    billingData.status === ESubscriptionStatus.CANCEL_AT_THE_END;
  const isSubscriptionTrialing =
    billingData.status === ESubscriptionStatus.TRIALING;
  //   const isSubscriptionTrialEndOrCanceled = billingData.status === "TRIAL_EXPIRED" || billingData.status === "CANCELED"
  const isSubscriptionTrialEndOrCanceled =
    billingData.status === ESubscriptionStatus.PAST_DUE ||
    billingData.status === ESubscriptionStatus.CANCELED ||
    billingData.status === ESubscriptionStatus.INACTIVE;

  const headerConfig = getHeaderBadgeConfig(billingData.status);
  const StatusIcon = headerConfig.Icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* HEADER COMMUN */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Votre Abonnement
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1",
                headerConfig.badgeClass,
              )}
            >
              <StatusIcon className="w-3 h-3" />
              {headerConfig.label}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gérez votre plan, vos moyens de paiement et vos factures.
          </p>
        </div>

        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center border",
            headerConfig.iconBoxClass,
          )}
        >
          <CreditCard className={cn("w-5 h-5", headerConfig.iconClass)} />
        </div>
      </div>

      {/* CONTENU SPÉCIFIQUE (ESSAI GRATUIT) */}
      {isSubscriptionTrialing && (
        <SubscriptionTrialing
          planName={billingData.planName}
          trialEndDate={billingData.trialEndsAt}
          handleSubscribe={handleSubscribe}
          isCreatingCheckoutSession={isCreatingCheckoutSession}
        />
      )}

      {/* CONTENU SPÉCIFIQUE (ABONNEMENT ACTIF) */}
      {isSubscriptionActive && (
        <SubscriptionActive
          planName={billingData.planName}
          planPrice={billingData.planPrice}
          nextBillingDate={billingData.nextBillingDate}
          cardBrand={billingData.cardBrand}
          cardLast4={billingData.cardLast4}
          cancelAtPeriodEnd={billingData.cancelAtPeriodEnd}
          handleManageSubscription={handleManageSubscription}
          isCreatingCustomerPortal={isCreatingCustomerPortal}
          handleCancelSubscription={handleCancelSubscription}
          isCancelingSubscription={isCancelingSubscription}
          handleReactivateSubscription={handleReactivateSubscription}
          isReactivatingSubscription={isReactivatingSubscription}
        />
      )}

      {/* CONTENU SPÉCIFIQUE (EXPIRÉ / RÉSILIÉ) */}
      {isSubscriptionTrialEndOrCanceled && (
        <SubscriptionEnd
          handleSubscribe={handleSubscribe}
          isCreatingCheckoutSession={isCreatingCheckoutSession}
        />
      )}
    </div>
  );
};
