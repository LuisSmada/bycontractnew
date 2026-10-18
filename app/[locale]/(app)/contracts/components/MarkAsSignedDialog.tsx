"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { operationError, operationSuccess } from "@/src/utils/operationsToasts";
import { responseErrorApi } from "@/src/utils/responseErrorApi";
import { formatFileSize } from "@/src/helpers/generic";
import { useUploadSignedContractMutation } from "@/src/store/api/contractsSlice";

export interface IMarkAsSignedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contractName: string;
  idContract: string;
}

export const MarkAsSignedDialog = ({
  isOpen,
  onClose,
  contractName,
  idContract,
}: IMarkAsSignedDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadSignedDocument, { isLoading }] =
    useUploadSignedContractMutation();

  // Gestion du Drag & Drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndSetFile = (file?: File) => {
    if (!file) {
      return;
    }

    // Vérification du type (PDF uniquement)
    if (file.type !== "application/pdf") {
      operationError("Veuillez importer un fichier au format PDF uniquement.");
      //   setError
      return;
    }

    // Vérification de la taille (ex: max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      operationError("Le fichier est trop lourd (maximum 10 MB).");
      //   setError
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  }, []);

  // Gestion du clic classique sur l'input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile) {
      return;
    }

    setIsUploading(true);
    try {
      await uploadSignedDocument({
        id: idContract,
        file: selectedFile,
      }).unwrap();
      operationSuccess("Le contrat a bien été marqué comme signé.");
      handleClose();
    } catch (err) {
      responseErrorApi(err);
      //   setError("Une erreur est survenue lors de l'envoi du document.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (isUploading) {
      return;
    }
    setSelectedFile(null);
    setError(null);
    setIsDragging(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-ui-surface p-0 overflow-hidden rounded-2xl border-slate-200 shadow-2xl">
        <DialogHeader className="p-6 border-b border-slate-100 bg-slate-50/50 relative overflow-hidden">
          <DialogTitle className="text-xl font-bold font-display text-ui-text leading-tight">
            Importer la version signée
          </DialogTitle>
          <DialogDescription className="text-sm text-ui-textSubtle mt-1">
            {contractName}
          </DialogDescription>
        </DialogHeader>

        {/* BODY - ZONE DE DROP OU CARTE FICHIER */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {!selectedFile ? (
            // ÉTAT 1 : ZONE DE DRAG & DROP
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-ui-brand bg-indigo-50/50"
                  : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-slate-50/80"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,application/pdf"
                className="hidden"
              />

              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isDragging ? "bg-indigo-100 text-ui-brand" : "bg-white text-slate-400 border border-slate-200 shadow-sm"}`}
              >
                <UploadCloud className="w-6 h-6" />
              </div>

              <h4 className="text-sm font-bold text-ui-text mb-1">
                Cliquez ou glissez votre PDF ici
              </h4>
              <p className="text-[11px] text-ui-textSubtle text-center max-w-62.5">
                Importez le scan ou le PDF final comportant les signatures de
                toutes les parties. (Max 10 MB)
              </p>
            </div>
          ) : (
            // ÉTAT 2 : CARTE DU FICHIER SÉLECTIONNÉ
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
              {/* Petite barre verte décorative à gauche */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>

              <div className="flex items-start gap-4 max-w-100">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm font-bold text-ui-text truncate pr-6 max-w-66.5">
                    {selectedFile.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-medium text-ui-textSubtle">
                      {formatFileSize(selectedFile.size)}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Prêt
                    </span>
                  </div>
                </div>

                {!isUploading && (
                  <button
                    onClick={removeFile}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    title="Retirer ce fichier"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="bg-slate-50 rounded-xl p-3 flex gap-2">
            <AlertCircle className="w-4 h-4 text-ui-textSubtle shrink-0 mt-0.5" />
            <p className="text-[10px] text-ui-textSubtle leading-relaxed">
              En important ce document, il deviendra la version de référence
              juridique. Le statut du contrat passera à{" "}
              <strong className="text-ui-text">Signé</strong>{" "}
              {`(et basculera en `}
              <strong className="text-ui-text">Actif</strong>{" "}
              {`à sa date d'effet).`}
            </p>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-slate-100 bg-white sm:justify-between flex-row">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isUploading}
            className="text-xs font-semibold text-ui-text hover:bg-slate-100"
          >
            Annuler
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={!selectedFile || isUploading}
            className={`text-xs font-bold px-6 shadow-md transition-all ${
              !selectedFile
                ? "bg-slate-100 text-ui-textSubtle hover:bg-slate-100"
                : "bg-ui-brand hover:bg-ui-brandHover text-white shadow-indigo-600/20"
            }`}
          >
            {isUploading && isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Envoi vers le coffre-fort...
              </>
            ) : (
              "Confirmer la signature"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
