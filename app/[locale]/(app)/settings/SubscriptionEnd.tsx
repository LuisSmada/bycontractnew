"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle } from "lucide-react";
import { FC } from "react";

interface ISubscriptionEnd {
  handleSubscribe: VoidFunction;
  isCreatingCheckoutSession: boolean;
}

export const SubscriptionEnd: FC<ISubscriptionEnd> = ({
  handleSubscribe,
  isCreatingCheckoutSession,
}) => {
  return (
    <>
      <div className="p-6 bg-white space-y-6">
        <div className="p-4 border border-rose-200 bg-rose-50 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-rose-900">Accès restreint</p>
            <p className="text-xs text-rose-700 mt-1">
              {
                "Votre abonnement ou période d'essai a expiré. Vous pouvez consulter vos contrats existants, mais la création et l'édition sont bloquées."
              }
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
        <Button
          onClick={handleSubscribe}
          disabled={isCreatingCheckoutSession}
          className="bg-slate-900 hover:bg-slate-800 text-white"
        >
          {isCreatingCheckoutSession ? (
            <Spinner className="size-4" />
          ) : (
            "Réactiver mon abonnement"
          )}
        </Button>
      </div>
    </>
  );
};
