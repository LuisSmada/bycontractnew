"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FC } from "react";

interface ISubscriptionTrialing {
  planName: string;
  trialEndDate?: string;
  handleSubscribe: VoidFunction;
  isCreatingCheckoutSession: boolean;
}

export const SubscriptionTrialing: FC<ISubscriptionTrialing> = ({
  planName,
  handleSubscribe,
  isCreatingCheckoutSession,
  trialEndDate,
}) => {
  return (
    <>
      <div className="p-6 bg-white space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500 mb-1">Plan actuel</p>
            <p className="text-sm font-bold text-slate-900">{planName}</p>
          </div>
          <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500 mb-1">{"Fin de l'essai"}</p>
            <p className="text-sm font-bold text-amber-600">{trialEndDate}</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-amber-200 bg-amber-50/50 rounded-xl">
          <div>
            <p className="text-sm font-bold text-amber-900">
              Aucun moyen de paiement enregistré
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Ajoutez une carte pour continuer à utiliser BYCONTRACT après votre
              essai.
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
        <Button
          onClick={handleSubscribe}
          disabled={isCreatingCheckoutSession}
          className="primary-button"
        >
          {isCreatingCheckoutSession ? (
            <Spinner className="size-4" />
          ) : (
            "S'abonner maintenant"
          )}
        </Button>
      </div>
    </>
  );
};
