"use client";

import { useState, useEffect, FC } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Checkbox } from "../ui/checkbox";
import { useDeleteContractMutation } from "@/src/store/api/contractsSlice";
import { operationSuccess } from "@/src/utils/operationsToasts";
import { responseErrorApi } from "@/src/utils/responseErrorApi";

interface IConfirmationDeleteModal {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  idDocumentToDelete: string;
}

export const ConfirmationDeleteModal: FC<IConfirmationDeleteModal> = ({
  isOpen,
  onClose,
  documentName,
  idDocumentToDelete,
}) => {
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const [deleteContract, { isLoading }] = useDeleteContractMutation();

  const handleDeleteDocument = async () => {
    try {
      await deleteContract(idDocumentToDelete).unwrap();
      onClose();
      operationSuccess("Le document a bien été supprimé.");
    } catch (e: unknown) {
      onClose();
      responseErrorApi(e);
    }
  };

  // Réinitialiser la case à cocher à chaque fois que la modale s'ouvre ou se ferme
  useEffect(() => {
    if (!isOpen) {
      // Un petit délai pour que la case ne se décoche pas visuellement pendant l'animation de fermeture
      setTimeout(() => setHasConfirmed(false), 300);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-120 p-0 overflow-hidden bg-white border-slate-200 shadow-2xl rounded-3xl">
        {/* HEADER */}
        <DialogHeader className="p-7 pb-0 text-left relative">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-5 shadow-sm">
            <Trash2 className="w-7 h-7 text-rose-600" />
          </div>

          <DialogTitle className="text-xl font-bold text-ui-text">
            Suppression définitive
          </DialogTitle>

          <p className="text-sm text-ui-textSubtle mt-2 leading-relaxed">
            Vous êtes sur le point de supprimer le document{" "}
            <span className="font-semibold text-ui-text">
              {`"${documentName}"`}.
            </span>
          </p>
        </DialogHeader>

        <div className="p-7 pt-5">
          {/* ZONE DE CONFIRMATION AVEC CHECKBOX */}
          <label className="flex items-start gap-3 p-4 mt-2  border border-rose-100 rounded-xl cursor-pointer  group">
            <div className="flex items-center h-5 mt-0.5">
              <Checkbox
                checked={hasConfirmed}
                onCheckedChange={setHasConfirmed}
                className={"data-checked:bg-rose-600 data-checked:border-0"}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-ui-text">
                Je valide la suppression
              </span>
              <span className="text-xs font-medium text-rose-700/70 mt-0.5">
                Cette action est irréversible.
              </span>
            </div>
          </label>

          {/* BOUTONS D'ACTION */}
          <div className="flex items-center justify-end gap-3 mt-8">
            <Button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDeleteDocument}
              disabled={!hasConfirmed || isLoading}
              className="px-5 py-2.5 text-sm font-bold text-white bg-rose-600 border border-transparent rounded-xl hover:bg-rose-700 disabled:opacity-50 disabled:hover:bg-rose-600 transition-all shadow-sm flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner className="size-4 text-white" />
                  Suppression...
                </>
              ) : (
                <>Supprimer</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
