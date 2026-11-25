"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle, ExternalLink, RotateCcw } from "lucide-react";
import { FC, useState } from "react";
import { CancelSubscriptionDialog } from "./CancelSubscriptionDialog";

export interface ISubscriptionActive {
  planName: string;
  planPrice?: string;
  nextBillingDate?: string;
  cardBrand?: string;
  cardLast4?: string;
  cancelAtPeriodEnd: boolean;
  handleManageSubscription: () => void;
  isCreatingCustomerPortal: boolean;
  handleCancelSubscription: () => Promise<void>;
  isCancelingSubscription: boolean;
  handleReactivateSubscription: () => Promise<void>;
  isReactivatingSubscription: boolean;
}

export const SubscriptionActive: FC<ISubscriptionActive> = ({
  planName,
  planPrice,
  nextBillingDate,
  cardBrand,
  cardLast4,
  cancelAtPeriodEnd,
  handleManageSubscription,
  isCreatingCustomerPortal,
  handleCancelSubscription,
  isCancelingSubscription,
  handleReactivateSubscription,
  isReactivatingSubscription,
}) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const onConfirmCancel = async (e: React.MouseEvent) => {
    e.preventDefault(); // Garde la modale ouverte pendant le chargement
    await handleCancelSubscription();
    setIsCancelDialogOpen(false);
  };

  return (
    <>
      <div className="p-6 bg-white space-y-6">
        {/* Alerte si résiliation programmée */}
        {cancelAtPeriodEnd && (
          <div className="p-4 border border-amber-200 bg-amber-50/70 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-950">
                Résiliation programmée pour le {nextBillingDate}
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                {
                  "Vous conservez l'accès complet jusqu'à cette date. Vous pouvez réactiver votre abonnement à tout moment avant l'échéance."
                }
              </p>
            </div>
          </div>
        )}

        {/* Encart Plan & Date */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Plan {planName}
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold font-display text-slate-900">
                {planPrice}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">
              {cancelAtPeriodEnd ? "Fin d'accès le" : "Prochaine facturation"}
            </p>
            <p className="text-sm font-bold text-slate-800">
              {nextBillingDate}
            </p>
          </div>
        </div>

        {/* Moyen de paiement */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Moyen de paiement
          </h3>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
                <span className="text-[10px] font-bold text-slate-600">
                  {cardBrand}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Carte terminant par •••• {cardLast4}
                </p>
                <p className="text-[10px] text-emerald-600 font-medium">
                  Sécurisé par Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        {cancelAtPeriodEnd ? (
          <Button
            onClick={handleReactivateSubscription}
            disabled={isReactivatingSubscription}
            className="primary-button text-xs font-bold flex items-center gap-2"
          >
            {isReactivatingSubscription ? (
              <Spinner className="size-3.5" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5" />
            )}
            Réactiver mon abonnement
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              onClick={() => setIsCancelDialogOpen(true)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            >
              {"Résilier l'abonnement"}
            </Button>

            <CancelSubscriptionDialog
              isOpen={isCancelDialogOpen}
              onClose={() => setIsCancelDialogOpen(false)}
              planName={planName}
              nextBillingDate={nextBillingDate}
              onConfirmCancel={handleCancelSubscription}
              isLoading={isCancelingSubscription}
            />
          </>
        )}

        <Button
          onClick={handleManageSubscription}
          disabled={isCreatingCustomerPortal}
          className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-2"
        >
          {isCreatingCustomerPortal ? (
            <Spinner className="size-3.5" />
          ) : (
            <ExternalLink className="w-3.5 h-3.5" />
          )}
          Gérer mon abonnement
        </Button>
      </div>
    </>
  );
};
