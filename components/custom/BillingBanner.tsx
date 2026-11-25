"use client";

import { FC } from "react";
import { AlertTriangle, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useCreateCheckoutMutation } from "@/src/store/api/subscriptionsApiSlice";
import { operationError } from "@/src/utils/operationsToasts";
import { responseErrorApi } from "@/src/utils/responseErrorApi";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ESubscriptionStatus,
  ISubscriptionStatusResponse,
} from "@/src/types/apiResponseType";
import { calculateSubscriptionDaysLeft } from "@/src/helpers/generic";

interface IBillingBanner {
  subscriptionData: ISubscriptionStatusResponse;
}

export const BillingBanner: FC<IBillingBanner> = ({ subscriptionData }) => {
  const pathname = usePathname();

  const { status, trialEndDate } = subscriptionData;
  const trialDaysLeft = calculateSubscriptionDaysLeft(trialEndDate);

  const [createCheckout, { isLoading }] = useCreateCheckoutMutation();

  // Si l'abonnement est actif ou s'il reste plus de 7 jours d'essai, on n'affiche rien
  if (
    status === ESubscriptionStatus.ACTIVE ||
    status === ESubscriptionStatus.CANCELING_AT_THE_END ||
    (status === ESubscriptionStatus.TRIALING && trialDaysLeft > 7)
  ) {
    return null;
  }

  const handleSubscribe = async () => {
    try {
      const origin = window.location.origin;
      const response = await createCheckout({
        idPrice: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID as string,
        successUrl: `${origin}/fr/checkout-success`,
        cancelUrl: `${origin}${pathname}`,
      }).unwrap();
      //   window.location.href = response.url;
      window.open(response.url);
    } catch (error) {
      responseErrorApi(error);
      operationError("Impossible d'initialiser le paiement.");
    }
  };

  // --- CONFIGURATION DE L'AFFICHAGE SELON LE STATUT ---
  let bannerConfig = {
    color: "",
    icon: <Clock className="w-5 h-5 shrink-0" />,
    message: "",
    subMessage: "",
    buttonText: "Choisir mon abonnement",
  };

  if (status === ESubscriptionStatus.TRIALING && trialDaysLeft <= 7) {
    bannerConfig = {
      color: "bg-amber-50 border-amber-200 text-amber-800",
      icon: <Clock className="w-5 h-5 text-amber-600 shrink-0" />,
      message: `Votre période d'essai se termine dans ${trialDaysLeft} jour${trialDaysLeft > 1 ? "s" : ""}.`,
      subMessage:
        "Ajoutez un moyen de paiement pour ne pas perdre l'accès à la modification de vos contrats.",
      buttonText: "Choisir mon abonnement",
    };
  } else if (
    status === ESubscriptionStatus.INACTIVE ||
    status === ESubscriptionStatus.CANCELED
  ) {
    bannerConfig = {
      color: "bg-rose-50 border-rose-200 text-rose-800",
      icon: <Lock className="w-5 h-5 text-rose-600 shrink-0" />,
      message: "Votre période d'essai est terminée. L'édition est désactivée.",
      subMessage:
        "Vos contrats restent consultables. Souscrivez pour créer et modifier à nouveau.",
      buttonText: "Réactiver mon accès",
    };
  } else {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div
          className={cn(
            "w-full border-b px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all",
            bannerConfig.color,
          )}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{bannerConfig.icon}</div>
            <div>
              <p className="text-sm font-bold">{bannerConfig.message}</p>
              <p className="text-xs opacity-90 mt-0.5">
                {bannerConfig.subMessage}
              </p>
            </div>
          </div>

          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white border-0 text-xs font-semibold px-4 h-9 shadow-sm"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-3.5 text-white" />
                Redirection...
              </span>
            ) : (
              bannerConfig.buttonText
            )}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
