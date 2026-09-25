import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { TContractType } from "@/src/model/entities";
import {
  ICompany,
  TCompanyInfos,
  TContractEditorContract,
} from "@/src/types/apiResponseType";
import { Building2, Mail, Plus, Search, X } from "lucide-react";
import React, { FC, useEffect, useState } from "react";

type TTypeContractItem = { value: TContractType; label: string };

interface IContractClassification {
  isReadOnly: boolean;
  setSearchQuery: (v: string) => void;
  setIsSearching: (v: boolean) => void;
  searchQuery: string;
  allStakeholders?: ICompany[];
  isSearching: boolean;
  document: TContractEditorContract | null;
  onContractTypeChange: (v: TContractType) => void;
  onContractStakeholdersChange: (v: TCompanyInfos) => void;
}

export const ContractClassification: FC<IContractClassification> = ({
  isReadOnly,
  setSearchQuery,
  setIsSearching,
  searchQuery,
  allStakeholders,
  isSearching,
  document,
  onContractTypeChange,
  onContractStakeholdersChange,
}) => {
  const contractTypes: TTypeContractItem[] = [
    {
      value: "NDA",
      label: "Accord de confidentialité (NDA)",
    },
    {
      value: "SERVICE",
      label: "Contrat de prestation",
    },
    {
      value: "CDI",
      label: "Contrat de travail (CDI)",
    },
    {
      value: "BAIL",
      label: "Bail commercial",
    },
  ];

  // Pas besoin de tableau, on travaille directement avec l'objet
  // const currentCompany = document?.company || null;

  // const removeParty = () => {
  //   // S'il n'y a qu'une entreprise, la retirer équivaut à mettre null (ou undefined selon ton type)
  //   onContractStakeholdersChange(null);
  // };

  // const addParty = (newParty: ICompany) => {
  //   // On écrase la compagnie existante avec la nouvelle
  //   onContractStakeholdersChange(newParty);
  //   setIsSearching(false);
  //   setSearchQuery("");
  // };

  const selectedContractType = contractTypes.find(
    (item) => item.value === document?.contractType,
  );

  const selectedStakeholders = document?.company ? [document.company] : [];

  // Fonction pour retirer un tiers
  const removeParty = (idToRemove: string) => {
    const updateCompanies = selectedStakeholders.filter(
      (p) => p.id !== idToRemove,
    );
    onContractStakeholdersChange(updateCompanies[0]);
  };

  // Fonction pour ajouter un tiers depuis la recherche
  const addParty = (newParty: ICompany) => {
    const updatedCompanies = [...selectedStakeholders, newParty];
    onContractStakeholdersChange(updatedCompanies[0]);
    setIsSearching(false);
    setSearchQuery("");
  };

  const removeSignatory = (partyId: string) => {
    const updatedCompanies = selectedStakeholders.map((p) =>
      p.id === partyId ? { ...p, signatory: undefined } : p,
    );
    onContractStakeholdersChange(updatedCompanies[0]);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
        Classification
      </h4>

      {/* Type de Document */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">
          Type de document
        </label>
        <Combobox
          items={contractTypes}
          value={selectedContractType}
          onValueChange={(type) => {
            if (type) {
              onContractTypeChange(type.value);
            }
          }}
          disabled={isReadOnly}
        >
          <ComboboxInput
            className={
              "mt-1 h-8.5 w-full rounded-lg  font-medium placeholder:text-slate-400 disabled:opacity-60 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none"
            }
            placeholder="Type de document"
          />
          <ComboboxContent>
            <ComboboxEmpty className={"text-xs"}>
              Aucun element trouve.
            </ComboboxEmpty>
            <ComboboxList>
              {(item, idx) => (
                <ComboboxItem
                  key={idx}
                  value={item}
                  className="text-xs data-highlighted:bg-ui-brand data-highlighted:text-white"
                >
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {}
      {/* Tiers / Entreprise (Masqué si c'est un Template) */}
      {!document?.isTemplate && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Partie(s) prenante(s)
            </label>
            <span className="text-[9px] bg-indigo-50 text-indigo-600 0 px-1.5 py-0.5 rounded font-bold">
              {selectedStakeholders.length}
            </span>
          </div>

          {/* Liste des entreprises déjà sélectionnées avec Scroll Interne */}
          {selectedStakeholders.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1 -mr-1">
              {selectedStakeholders.map((party) => (
                <div
                  key={party.id}
                  className="flex flex-col bg-white border border-slate-200 rounded-lg group overflow-hidden shadow-sm shrink-0"
                >
                  {/* En-tête Entreprise */}
                  <div className="flex items-center justify-between p-2 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 leading-none">
                          {party.name}
                        </span>
                        <span className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wide">
                          {party.siret ? "Client B2B" : "Client B2C"}
                        </span>
                      </div>
                    </div>
                    {!isReadOnly && (
                      <button
                        onClick={() => removeParty(party.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Signataire (Contact) */}
                  <div className="p-2 bg-white flex items-center gap-2">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      {party.mainContact ? (
                        <div className="flex items-center justify-between w-full">
                          <p className="text-[10px] font-medium text-slate-700 truncate pr-2">
                            {`${party.mainContact.firstName} ${party.mainContact.lastName}`}
                            <span className="text-slate-400">
                              ({party.mainContact.email})
                            </span>
                          </p>
                          {!isReadOnly && (
                            <button
                              onClick={() => removeSignatory(party.id)}
                              className="p-1 -mr-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors shrink-0"
                              title="Retirer ce signataire"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <button className="text-[10px] text-indigo-600 font-medium hover:underline">
                          + Ajouter un signataire
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {}
          {/* Bouton ou Barre de recherche pour ajouter */}

          {!isReadOnly && selectedStakeholders.length === 0 && (
            <div className="pt-1">
              {!isSearching ? (
                <Button
                  onClick={() => setIsSearching(true)}
                  className={
                    "w-full border border-dashed border-slate-300 rounded-lg px-3 py-2 bg-slate-50 flex items-center justify-center gap-2 hover:bg-white hover:border-ui-brand hover:text-ui-brand text-slate-500 text-xs"
                  }
                >
                  <Plus />
                  <span>Ajouter une partie</span>
                </Button>
              ) : (
                <div className="relative border border-indigo-500 bg-white rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 overflow-hidden">
                  <div className="flex items-center px-2 py-1.5">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Rechercher une entreprise..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs font-medium bg-transparent border-none outline-none px-2 py-0.5 text-slate-800"
                    />
                    <Button
                      onClick={() => setIsSearching(false)}
                      className=" text-slate-400 hover:text-slate-700 w-3 h-5 bg-transparent hover:bg-slate-100 "
                    >
                      <X className="w-2 h-2" />
                    </Button>
                  </div>

                  {/* Dropdown de résultats */}
                  {searchQuery.length > 1 && (
                    <div className="border-t border-slate-100 bg-slate-50 max-h-32 overflow-y-auto">
                      {allStakeholders &&
                        allStakeholders.map((stk) => {
                          return (
                            <div
                              onClick={() => addParty(stk)}
                              key={stk.id}
                              className={
                                "w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-ui-brand cursor-pointer"
                              }
                            >
                              {stk.name}
                            </div>
                          );
                        })}

                      {/* <button className="w-full text-left px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center gap-1.5">
                          <Plus className="w-3 h-3" /> Créer
                        </button> */}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
