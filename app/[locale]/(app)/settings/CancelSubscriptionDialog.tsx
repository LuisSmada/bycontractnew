"use client";

import { FC, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";

interface ICancelSubscriptionDialog {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  nextBillingDate?: string;
  onConfirmCancel: () => Promise<void>;
  isLoading: boolean;
}

export const CancelSubscriptionDialog: FC<ICancelSubscriptionDialog> = ({
  isOpen,
  onClose,
  planName,
  nextBillingDate,
  onConfirmCancel,
  isLoading,
}) => {
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      setHasConfirmed(false);
      onClose();
    }
  };

  const handleConfirm = async () => {
    await onConfirmCancel();
    setHasConfirmed(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-120 p-0 overflow-hidden bg-white border-slate-200 shadow-2xl rounded-3xl">
        {/* HEADER */}
        <DialogHeader className="p-7 pb-0 text-left relative">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-5 shadow-sm">
            <AlertTriangle className="w-7 h-7 text-rose-600" />
          </div>

          <DialogTitle className="text-xl font-bold text-ui-text">
            Résilier votre abonnement {planName} ?
          </DialogTitle>

          <p className="text-sm text-ui-textSubtle mt-2 leading-relaxed">
            Votre accès restera actif jusqu&apos;au{" "}
            <span className="font-semibold text-ui-text">
              {nextBillingDate}
            </span>
            . Passé cette date, votre espace passera en lecture seule.
          </p>
        </DialogHeader>

        <div className="p-7 pt-5">
          {/* ZONE DE CONFIRMATION AVEC CHECKBOX */}
          <label className="flex items-start gap-3 p-4 mt-2 border border-rose-100 rounded-xl cursor-pointer group">
            <div className="flex items-center h-5 mt-0.5">
              <Checkbox
                checked={hasConfirmed}
                onCheckedChange={(checked) => setHasConfirmed(Boolean(checked))}
                className="data-checked:bg-rose-600 data-checked:border-0"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-ui-text">
                Je confirme la résiliation de mon abonnement
              </span>
              <span className="text-xs font-medium text-rose-700/70 mt-0.5">
                Vous pourrez toujours réactiver avant le {nextBillingDate}.
              </span>
            </div>
          </label>

          {/* BOUTONS D'ACTION */}
          <div className="flex items-center justify-end gap-3 mt-8">
            <Button
              type="button"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
              Conserver
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!hasConfirmed || isLoading}
              className="px-5 py-2.5 text-sm font-bold text-white bg-rose-600 border border-transparent rounded-xl hover:bg-rose-700 disabled:opacity-50 disabled:hover:bg-rose-600 transition-all shadow-sm flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner className="size-4 text-white" />
                  Résiliation...
                </>
              ) : (
                <>Confirmer la résiliation</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
