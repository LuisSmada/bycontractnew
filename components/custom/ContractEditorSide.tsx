"use client";

import {
  Building2,
  CalendarDays,
  Clock,
  Euro,
  FileBadge2,
  FileText,
  Mail,
  Plus,
  RefreshCw,
  Search,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { Switch } from "../ui/switch";
import { useGetCurrentUserQuery } from "@/src/store/api/authApiSlice";
import { assertsNonNullable } from "@/src/helpers/generic";
import { usePathname } from "next/navigation";
import { useGetAllCompaniesQuery } from "@/src/store/api/companiesApiSlice";
import { Button } from "../ui/button";

export type SidebarMode = "contract" | "template";

export interface Signatory {
  name: string;
  email: string;
}

export interface Party {
  id: string;
  name: string;
  role: string;
  signatory?: Signatory;
}

interface IContractEditorSide {
  // mode: "template" | "contract"; // "contract" ou "template"
  // isReadOnly: boolean; // Passer à true si on regarde un contrat archivé/signé
  mode?: SidebarMode;
  isReadOnly?: boolean;
  currentStatus?: string;
}

export const ContractEditorSide = ({
  mode = "contract",
  isReadOnly = false,
  currentStatus = "Brouillon",
}: IContractEditorSide) => {
  const { data: currentUser } = useGetCurrentUserQuery();
  assertsNonNullable(currentUser);

  const { data: allStakeholders } = useGetAllCompaniesQuery();

  const [activeTab, setActiveTab] = useState<"parametres" | "assistants">(
    "parametres",
  );
  const [contractType, setContractType] = useState<ContractType | null>(null);
  const [autoRenew, setAutoRenew] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>("EUR");

  const path = usePathname();
  const isNewDocument = path.includes("new");

  // Liste des entreprises avec un contact signataire fortement typée
  const [selectedParties, setSelectedParties] = useState<Party[]>([
    {
      id: "1",
      name: "Acme Corporation",
      role: "Client",
      signatory: { name: "John Doe", email: "john@acme.com" },
    },
  ]);

  // État pour afficher/masquer la barre de recherche
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fonction pour retirer un tiers
  const removeParty = (idToRemove: string) => {
    setSelectedParties(selectedParties.filter((p) => p.id !== idToRemove));
  };

  // Fonction pour ajouter un tiers depuis la recherche
  const addParty = (newParty: Party) => {
    setSelectedParties([...selectedParties, newParty]);
    setIsSearching(false);
    setSearchQuery("");
  };

  const removeSignatory = (partyId: string) => {
    setSelectedParties(
      selectedParties.map((p) =>
        p.id === partyId ? { ...p, signatory: undefined } : p,
      ),
    );
  };

  const contractTypes = [
    {
      value: "NDA",
      label: "Accord de confidentialité (NDA)",
    },
    {
      value: "PRESTATION",
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
    {
      value: "SAAS",
      label: "Contrat SaaS",
    },
  ] as const;

  type ContractType = (typeof contractTypes)[number]["value"];

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] md:flex h-full">
      {/* ONGLETS DU PANNEAU */}
      <div className="flex border-b border-slate-100 shrink-0">
        <button
          onClick={() => setActiveTab("parametres")}
          className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${activeTab === "parametres" ? "text-indigo-600 border-indigo-600" : "text-slate-500 hover:text-slate-800 border-transparent"}`}
        >
          Paramètres
        </button>
        <button
          onClick={() => setActiveTab("assistants")}
          className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${activeTab === "assistants" ? "text-indigo-600 border-indigo-600" : "text-slate-500 hover:text-slate-800 border-transparent"}`}
        >
          Variables & IA
        </button>
      </div>

      {/* CONTENU : PARAMÈTRES */}
      {activeTab === "parametres" && (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8 pb-20">
          {/* BLOC 1 : CLASSIFICATION */}
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
                value={contractType}
                onValueChange={(value) => {
                  setContractType(value as ContractType);
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
            {mode === "contract" && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Partie(s) prenante(s)
                  </label>
                  <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">
                    {selectedParties.length}
                  </span>
                </div>

                {/* Liste des entreprises déjà sélectionnées avec Scroll Interne */}
                {selectedParties.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1 -mr-1">
                    {selectedParties.map((party) => (
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
                                {party.role}
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
                            {party.signatory ? (
                              <div className="flex items-center justify-between w-full">
                                <p className="text-[10px] font-medium text-slate-700 truncate pr-2">
                                  {party.signatory.name}{" "}
                                  <span className="text-slate-400">
                                    ({party.signatory.email})
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

                {!isReadOnly && (
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
                                    onClick={() =>
                                      addParty({
                                        id: Date.now().toString(),
                                        name: stk.name,
                                        role: stk.siret,
                                      })
                                    }
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

          {}
          {/* BLOC 2 : FINANCIER ET CALENDRIER (Masqué si Template) */}
          {mode === "contract" && (
            <div className="space-y-4">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-6">
                Modalités
              </h4>

              {/* Valeur du Contrat & Devise */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Valeur du contrat (HT)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1 flex items-center">
                    <Euro className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
                    <input
                      type="number"
                      placeholder="0.00"
                      disabled={isReadOnly}
                      className="w-full text-xs font-medium border border-slate-200 rounded-lg pl-8 pr-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all disabled:opacity-60"
                    />
                  </div>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    disabled={isReadOnly}
                    className="w-20 text-xs font-bold border border-slate-200 rounded-lg px-2 py-2 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-slate-600 disabled:opacity-60"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              {/* Dates d'Effet et Expiration */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3 text-slate-400" />
                    {"Date d'effet"}
                  </label>
                  <input
                    type="date"
                    disabled={isReadOnly}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-2 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all disabled:opacity-60 text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3 text-slate-400" />
                    Échéance
                  </label>
                  <input
                    type="date"
                    disabled={isReadOnly}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-2 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all disabled:opacity-60 text-slate-700"
                  />
                </div>
              </div>

              {/* Renouvellement Tacite (Toggle) */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <RefreshCw
                    className={`w-4 h-4 ${autoRenew ? "text-indigo-600" : "text-slate-400"}`}
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Tacite reconduction
                    </p>
                    <p className="text-[9px] text-slate-500 mt-0.5">
                      Renouvellement automatique
                    </p>
                  </div>
                </div>
                {/* Toggle Button stylisé Tailwind */}
                <Switch
                  checked={autoRenew}
                  onClick={() => setAutoRenew(!autoRenew)}
                  disabled={isReadOnly}
                  className={`shrink-0 cursor-pointer  ${autoRenew ? "data-checked:bg-indigo-600" : "data-checked:bg-slate-300"} `}
                />
              </div>
            </div>
          )}

          {}
          {/* BLOC 3 : MÉTA-INFORMATIONS SYSTÈME */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Informations Système
            </h4>

            <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-3">
              {mode === "contract" && (
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500 font-semibold">
                    Statut actuel
                  </span>
                  <span className="font-bold text-amber-600 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-md">
                    {currentStatus}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Auteur
                </span>
                <span className="font-medium text-slate-800">{`${currentUser.firstName} ${currentUser.lastName}`}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Créé le
                </span>
                <span className="font-medium text-slate-800">
                  {"Aujourd'hui"}
                </span>
              </div>
              {mode === "contract" && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <FileBadge2 className="w-3.5 h-3.5" /> Modèle source
                  </span>
                  <span
                    className="font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded cursor-pointer hover:bg-indigo-100 transition-colors truncate max-w-[100px]"
                    title="NDA Standard V2"
                  >
                    NDA Standard
                  </span>
                </div>
              )}
            </div>

            {/* Notes Internes */}
            {!isReadOnly && (
              <div className="mt-4 space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3 h-3" /> Notes internes (privé)
                </label>
                <textarea
                  placeholder="Commentaire caché pour l'équipe..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none resize-none min-h-[80px]"
                ></textarea>
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {/* CONTENU : VARIABLES & ASSISTANTS */}
      {activeTab === "assistants" && (
        <div className=" overflow-y-auto p-5 space-y-6 h-screen">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                {mode === "template"
                  ? "Définition des Variables"
                  : "Variables Détectées"}
              </h4>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 rounded font-bold">
                0
              </span>
            </div>

            {mode === "template" ? (
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
