"use client";

import { useState } from "react";
import { useGetCurrentUserQuery } from "@/src/store/api/authApiSlice";
import { assertsNonNullable } from "@/src/helpers/generic";
import { useGetAllMyCompaniesQuery } from "@/src/store/api/companiesApiSlice";
import { ContractModality } from "./ContractEditing/ContractModality";
import { ContractSystemInformations } from "./ContractEditing/ContractSystemInformations";
import { ContractClassification } from "./ContractEditing/ContractClassification";
import {
  TCompanyInfos,
  TContractEditorContract,
  TContractEditorDocument,
} from "@/src/types/apiResponseType";
import { TContractType } from "@/src/model/entities";

interface IContractEditorSide {
  document: TContractEditorDocument | null;
  updateField: <K extends keyof TContractEditorDocument>(
    field: K,
    value: TContractEditorDocument[K],
  ) => void;
}

export const ContractEditorSide = ({
  document,
  updateField,
}: IContractEditorSide) => {
  const { data: currentUser } = useGetCurrentUserQuery();
  assertsNonNullable(currentUser);
  assertsNonNullable(document);
  assertsNonNullable(document?.author);

  const { data: allStakeholders } = useGetAllMyCompaniesQuery();

  const [activeTab, setActiveTab] = useState<"parametres" | "assistants">(
    "parametres",
  );
  // État pour afficher/masquer la barre de recherche
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const updateContractField = updateField as <
    K extends keyof TContractEditorContract,
  >(
    field: K,
    value: TContractEditorContract[K],
  ) => void;

  const isDocumentContract = !document.isTemplate;
  const isDocumentTemplate = document.isTemplate;

  const isReadOnly = isDocumentContract && document.status === "SIGNED";

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] md:flex h-screen">
      {/* ONGLETS DU PANNEAU */}
      <div className="flex border-b border-slate-100 shrink-0">
        <button
          onClick={() => setActiveTab("parametres")}
          className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${activeTab === "parametres" ? "text-indigo-600 border-indigo-600" : "text-slate-500 hover:text-slate-800 border-transparent"}`}
        >
          Paramètres
        </button>
        {/* <button
          onClick={() => setActiveTab("assistants")}
          className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${activeTab === "assistants" ? "text-indigo-600 border-indigo-600" : "text-slate-500 hover:text-slate-800 border-transparent"}`}
        >
          Variables & IA
        </button> */}
      </div>

      {/* CONTENU : PARAMÈTRES */}
      {activeTab === "parametres" && (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8 pb-20">
          {/* BLOC 1 : CLASSIFICATION */}
          {isDocumentContract && (
            <ContractClassification
              document={document}
              isReadOnly={isReadOnly}
              setSearchQuery={setSearchQuery}
              setIsSearching={setIsSearching}
              searchQuery={searchQuery}
              allStakeholders={allStakeholders}
              isSearching={isSearching}
              onContractTypeChange={(value: TContractType) =>
                updateContractField("contractType", value)
              }
              onContractStakeholdersChange={(value: TCompanyInfos) =>
                updateContractField("company", value)
              }
            />
          )}

          {}
          {/* BLOC 2 : FINANCIER ET CALENDRIER (Masqué si Template) */}

          {isDocumentContract && (
            <ContractModality
              document={document}
              isReadOnly={isReadOnly}
              onContractValueChange={(value: string) =>
                updateContractField("value", value)
              }
              onContractEffectiveDateChange={(date: string) =>
                updateContractField("effectiveDate", date)
              }
              onContractExpirationDateChange={(date: string) =>
                updateContractField("expirationDate", date)
              }
              onContractAutoRenewChange={(value: boolean) =>
                updateContractField("autoRenew", value)
              }
            />
          )}

          {}
          {/* BLOC 3 : MÉTA-INFORMATIONS SYSTÈME */}

          {document?.author && (
            <ContractSystemInformations document={document} />
          )}
        </div>
      )}

      {}
      {/* CONTENU : VARIABLES & ASSISTANTS */}
      {activeTab === "assistants" && (
        <div className=" overflow-y-auto p-5 space-y-6 h-screen">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                {isDocumentTemplate
                  ? "Définition des Variables"
                  : "Variables Détectées"}
              </h4>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 rounded font-bold">
                0
              </span>
            </div>

            {isDocumentTemplate ? (
              <div className="p-4 border border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 text-center">
                <p className="text-[11px] text-indigo-800 font-medium">
                  Utilisez le bouton <b>{"{}"}</b> dans la barre {"d'outils"}{" "}
                  pour insérer des champs dynamiques dans votre matrice.
                </p>
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                <p className="text-[10px] text-slate-500">
                  Aucune variable dynamique <code>{"{{...}}"}</code> détectée
                  dans le texte pour le moment.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
