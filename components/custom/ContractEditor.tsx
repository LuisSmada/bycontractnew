"use client";

import { ArrowLeft, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { ContractActor } from "./ContractActor";
import { useRouter } from "next/navigation";
import { IFindTemplate } from "@/src/types/apiResponseType";
import { downloadContractPdf } from "@/app/[locale]/(app)/contracts/downloadContractPdf";

interface IContractEditor {
  template: IFindTemplate | null;
}

export const ContractEditor = ({ template }: IContractEditor) => {
  const [title, setTitle] = useState(
    template ? template?.name : "Nouveau document sans titre",
  );
  const router = useRouter();

  return (
    <>
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer bg-transparent hover:bg-transparent"
            title="Retour aux contrats"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="h-4 w-px bg-ui-separator"></div>

          {/* Titre éditable */}
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-bold font-sans text-slate-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-100 rounded px-2 w-80 transition-all hover:bg-slate-50"
          />
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md ml-2 border border-slate-200">
            Brouillon
          </span>
          <span className="text-[10px] text-slate-400 italic hidden sm:inline">
            Enregistré à l instant
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-transparent hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer hidden sm:block">
            Partager
          </Button>
          <Button
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-transparent hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer hidden sm:block"
            onClick={() =>
              downloadContractPdf(template?.id ?? "", template?.name)
            }
          >
            {"Télécharger"}
          </Button>
          {/* <Button className="px-4 py-1.5 bg-ui-brand hover:bg-ui-brandHover text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2">
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Finaliser & Signer</span>
            <span className="sm:hidden">Signer</span>
          </Button> */}
          <Button className="px-4 py-1.5 bg-ui-brand hover:bg-ui-brandHover text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2">
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sauvegarder</span>
            <span className="sm:hidden">Sauvegarder</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <ContractActor content={template?.body ?? null} />
        {/* <ContractEditorSide /> */}
      </div>
    </>
  );
};
