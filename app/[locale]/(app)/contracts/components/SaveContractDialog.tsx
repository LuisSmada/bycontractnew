"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { TOASTSTYLES } from "@/src/utils/toastsCSSUtils";
import { Button } from "@base-ui/react";
import { CheckCircle2, Download, EditIcon } from "lucide-react";
import { SetStateAction } from "react";
import { toast } from "sonner";

interface ISaveContractDialog {
  isSaveModalOpened: boolean;
  setIsSaveModalOpened: (value: SetStateAction<boolean>) => void;
}

export const SaveContractDialog = ({
  isSaveModalOpened,
  setIsSaveModalOpened,
}: ISaveContractDialog) => {
  return (
    <Dialog
      open={isSaveModalOpened}
      onOpenChange={() => {
        setIsSaveModalOpened((v) => !v);
      }}
    >
      <DialogContent className="bg-white rounded-3xl w-120 shadow-2xl overflow-hidden p-0">
        <DialogHeader>
          <div
            className={
              "p-6 bg-slate-50 border-b border-slate-100 text-center  overflow-hidden"
            }
          >
            <div className="absolute top-0 right-0 bg-indigo-100 rounded-full blur-3xl  pointer-events-none"></div>
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-4 relative z-10 text-indigo-600">
              <Download className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 relative ">
              Enregistrer le document
            </h2>
            <p className="text-sm text-slate-500 mt-1 relative z-10">
              Sélectionnez le statut de sauvegarde approprié.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div
              onClick={() => {
                setIsSaveModalOpened(false);
                toast.success("Enregistré comme Brouillon.", {
                  position: "top-right",
                  style: TOASTSTYLES.INFO,
                });
              }}
              className="w-full group flex items-start gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-white hover:border-indigo-500 hover:bg-indigo-50/30 transition-all text-left cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <EditIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  Brouillon de travail
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Le document reste modifiable par votre équipe interne. Il n
                  est pas envoyé dans le circuit de signature.
                </p>
              </div>
            </div>

            <div
              onClick={() => {
                setIsSaveModalOpened(false);
                toast.success("Document figé, prêt à être signé.", {
                  position: "top-right",
                  style: TOASTSTYLES.SUCCESS,
                });
              }}
              className="w-full group flex items-start gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-white hover:border-emerald-500 hover:bg-emerald-50/30 transition-all text-left cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Version Finale (Prêt)
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Fige le contenu du document. Requis pour lancer le circuit de
                  validation et de signature légale.
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
          <Button
            onClick={() => {
              setIsSaveModalOpened(false);
            }}
            className="text-xs font-bold text-slate-500 bg-transparent hover:text-slate-800 transition-colors px-4 py-2 rounded-lg hover:bg-slate-200/50 cursor-pointer"
          >
            {"Annuler l'opération"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
