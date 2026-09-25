import React, { FC, SetStateAction } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";
import { downloadContractPdf } from "@/app/[locale]/(app)/contracts/downloadContractPdf";
import { TContractEditorDocument } from "@/src/types/apiResponseType";

interface IContractEditorContextBar {
  workingDocument: TContractEditorDocument | null;
  isDocumentModified: boolean;
  updateField: <K extends keyof TContractEditorDocument>(
    field: K,
    value: TContractEditorDocument[K],
  ) => void;
  cannotSave: boolean | null;
  setIsSaveModalOpened: (value: SetStateAction<boolean>) => void;
  setIsUnsavedModalOpened: (value: SetStateAction<boolean>) => void;
}

export const ContractEditorContextBar: FC<IContractEditorContextBar> = ({
  workingDocument,
  isDocumentModified,
  updateField,
  setIsSaveModalOpened,
  setIsUnsavedModalOpened,
  cannotSave,
}) => {
  const router = useRouter();

  const path = usePathname();
  const isNewDocument = path.includes("new");

  const handleGoBack = () => {
    if (isDocumentModified) {
      setIsUnsavedModalOpened(true);
    } else {
      router.back();
    }
  };

  return (
    <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          onClick={handleGoBack}
          className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer bg-transparent hover:bg-transparent"
          title="Retour aux contrats"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="h-4 w-px bg-ui-separator"></div>

        {/* Titre éditable */}
        <Input
          type="text"
          value={workingDocument?.name || ""}
          placeholder="Nouveau document sans titre"
          onChange={(e) => updateField("name", e.target.value)}
          className="text-lg font-bold font-sans text-slate-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-100 rounded px-2 w-80 transition-all hover:bg-slate-50"
        />
        {/* <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md ml-2 border border-slate-200">
            Brouillon
          </span>
          <span className="text-[10px] text-slate-400 italic hidden sm:inline">
            Enregistré à l instant
          </span> */}
      </div>

      <div className="flex items-center gap-3">
        {!isNewDocument && (
          <>
            <Button className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-transparent hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer hidden sm:block">
              Partager
            </Button>
            <Button
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-transparent hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer hidden sm:block"
              onClick={() =>
                downloadContractPdf(
                  workingDocument?.id ?? "",
                  workingDocument?.isTemplate ?? false,
                )
              }
            >
              {"Télécharger"}
            </Button>
          </>
        )}
        {/* <Button className="px-4 py-1.5 bg-ui-brand hover:bg-ui-brandHover text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2">
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Finaliser & Signer</span>
            <span className="sm:hidden">Signer</span>
          </Button> */}
        <Button
          className="px-4 py-1.5 bg-ui-brand hover:bg-ui-brandHover text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2"
          onClick={() => setIsSaveModalOpened(true)}
          disabled={cannotSave ?? false}
        >
          <Save className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sauvegarder</span>
          <span className="sm:hidden">Sauvegarder</span>
        </Button>
      </div>
    </div>
  );
};
