"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { AlertTriangle, ArrowLeft, X } from "lucide-react";
import { SetStateAction } from "react";

interface IUnsavedChangesDialog {
  isUnsavedModalOpened: boolean;
  setIsUnsavedModalOpened: (value: SetStateAction<boolean>) => void;
  onConfirmLeave: () => void;
}

export const UnsavedChangesDialog = ({
  isUnsavedModalOpened,
  setIsUnsavedModalOpened,
  onConfirmLeave,
}: IUnsavedChangesDialog) => {
  return (
    <Dialog
      open={isUnsavedModalOpened}
      onOpenChange={() => {
        setIsUnsavedModalOpened((v) => !v);
      }}
    >
      <DialogContent className="bg-white rounded-3xl w-120 shadow-2xl overflow-hidden p-0">
        <DialogHeader>
          <div className="p-6 bg-slate-50 border-b border-slate-100 text-center relative overflow-hidden">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-4 relative z-10 text-rose-500">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold font-display text-slate-900 relative z-10">
              Modifications non sauvegardées
            </h2>
            <p className="text-sm text-slate-500 mt-2 relative z-10 px-4">
              Vous avez apporté des modifications à ce document. Si vous quittez
              maintenant, toutes les modifications non enregistrées seront
              perdues.
            </p>
          </div>
        </DialogHeader>

        <div className="p-6 bg-white space-y-3">
          <Button
            onClick={() => setIsUnsavedModalOpened(false)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Rester sur la page
          </Button>

          <Button
            onClick={() => {
              onConfirmLeave();
              setIsUnsavedModalOpened(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            Quitter sans sauvegarder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
