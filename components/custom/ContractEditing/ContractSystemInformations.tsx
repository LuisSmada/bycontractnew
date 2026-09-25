import { sanitizeDate } from "@/src/helpers/generic";
import { TContractEditorDocument } from "@/src/types/apiResponseType";
import { Clock, FileBadge2, User } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

interface IContractSystemInformations {
  document: TContractEditorDocument | null;
}

export const ContractSystemInformations = (
  props: IContractSystemInformations,
) => {
  const path = usePathname();
  const isNewDocument = path.includes("new");

  return (
    <div className="space-y-3 pt-6 border-t border-slate-100">
      <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
        Informations Système
      </h4>

      <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-3">
        {!props.document?.isTemplate && (
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
            <span className="text-slate-500 font-semibold">Statut actuel</span>
            <span className="font-bold text-amber-600 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-md">
              {!props.document?.isTemplate && props.document?.status === "DRAFT"
                ? "Brouillon"
                : "Autre"}
            </span>
          </div>
        )}
        {!isNewDocument && (
          <>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Auteur
              </span>
              <span className="font-medium text-slate-800">{`${props.document?.author.firstName} ${props.document?.author.lastName}`}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Créé le
              </span>
              <span className="font-medium text-slate-800">
                {sanitizeDate(props.document?.createdAt ?? "")}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Modifié le
              </span>
              <span className="font-medium text-slate-800">
                {sanitizeDate(props.document?.modifiedAt ?? "")}
              </span>
            </div>
          </>
        )}
        {!props.document?.isTemplate && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <FileBadge2 className="w-3.5 h-3.5" /> Modèle source
            </span>
            <span
              className="font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded cursor-pointer hover:bg-indigo-100 transition-colors truncate max-w-25"
              title="NDA Standard V2"
            >
              {props.document?.idTemplate
                ? props.document?.idTemplate.slice(0, 6)
                : "Aucun"}
            </span>
          </div>
        )}
      </div>

      {/* Notes Internes */}
      {/* {!isReadOnly && (
              <div className="mt-4 space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3 h-3" /> Notes internes (privé)
                </label>
                <textarea
                  placeholder="Commentaire caché pour l'équipe..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none resize-none min-h-[80px]"
                ></textarea>
              </div>
            )} */}
    </div>
  );
};
