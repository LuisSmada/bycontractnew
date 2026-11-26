import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { EContractType, IMainContactCompany } from "@/src/model/entities";
import { useGetAllMyCompaniesQuery } from "@/src/store/api/companiesApiSlice";
import { useGetAllParticularStakeholdersQuery } from "@/src/store/api/particularStakeholdersApiSlice";
import {
  ICompany,
  IParticularStakeholder,
  TCompanyInfos,
  TContractEditorContract,
} from "@/src/types/apiResponseType";
import { Building2, Mail, Plus, Search, User, X } from "lucide-react";
import { FC, useMemo } from "react";

type TTypeContractItem = { value: EContractType; label: string };

interface IContractClassification {
  isReadOnly: boolean;
  setSearchQuery: (v: string) => void;
  setIsSearching: (v: boolean) => void;
  searchQuery: string;
  isSearching: boolean;
  document: TContractEditorContract | null;
  onContractTypeChange: (v: EContractType) => void;
  onContractCompanyChange: (v: TCompanyInfos | null) => void;
  onParticularStakeholderChange: (
    particular: IParticularStakeholder | null,
  ) => void;
}

export const ContractClassification: FC<IContractClassification> = ({
  isReadOnly,
  setSearchQuery,
  setIsSearching,
  searchQuery,
  isSearching,
  document,
  onContractTypeChange,
  onContractCompanyChange,
  onParticularStakeholderChange,
}) => {
  const { data: companies = [] } = useGetAllMyCompaniesQuery();
  const { data: particularStakeholders = [] } =
    useGetAllParticularStakeholdersQuery();

  const contractTypes: TTypeContractItem[] = [
    {
      value: EContractType.NDA,
      label: "Accord de confidentialité (NDA)",
    },
    {
      value: EContractType.SERVICE,
      label: "Contrat de prestation",
    },
    {
      value: EContractType.CDI,
      label: "Contrat de travail (CDI)",
    },
    {
      value: EContractType.BAIL,
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

  const selectedContractType =
    contractTypes.find((item) => item.value === document?.contractType) ?? null;

  const selectedCompany = document?.company ?? null;
  const selectedParticular = document?.particularStakeholder ?? null;
  const hasStakeholder = Boolean(selectedCompany || selectedParticular);

  const filteredCompanies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) {
      return [];
    }
    return companies.filter((c) => c.name.toLowerCase().includes(q));
  }, [companies, searchQuery]);

  const filteredParticulars = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) {
      return [];
    }
    return particularStakeholders.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      return (
        fullName.includes(q) || (p.email?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [particularStakeholders, searchQuery]);

  const selectCompany = (company: ICompany) => {
    onParticularStakeholderChange(null);
    onContractCompanyChange(company);
    setIsSearching(false);
    setSearchQuery("");
  };

  const selectParticular = (particular: IParticularStakeholder) => {
    onContractCompanyChange(null);
    onParticularStakeholderChange(particular);
    setIsSearching(false);
    setSearchQuery("");
  };

  const removeCompany = () => onContractCompanyChange(null);
  const removeParticular = () => onParticularStakeholderChange(null);

  const removeSignatory = () => {
    if (!selectedCompany) {
      return;
    }
    onContractCompanyChange({
      ...selectedCompany,
      mainContact: {} as IMainContactCompany,
    });
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
            if (type) onContractTypeChange(type.value);
          }}
          disabled={isReadOnly}
        >
          <ComboboxInput
            className="mt-1 h-8.5 w-full rounded-lg font-medium placeholder:text-slate-400 disabled:opacity-60 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none"
            placeholder="Type de document"
          />
          <ComboboxContent>
            <ComboboxEmpty className="text-xs">
              Aucun élément trouvé.
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

      {/* Partie prenante (Masqué si Template) */}
      {!document?.isTemplate && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Partie prenante
            </label>
            <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold">
              {hasStakeholder ? 1 : 0}
            </span>
          </div>

          {/* Affichage ENTREPRISE */}
          {selectedCompany && (
            <div className="flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <div className="flex items-center justify-between p-2 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 leading-none truncate">
                      {selectedCompany.name}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wide">
                      Client B2B
                    </span>
                  </div>
                </div>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={removeCompany}
                    className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="p-2 bg-white flex items-center gap-2">
                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  {selectedCompany.mainContact ? (
                    <div className="flex items-center justify-between w-full">
                      <p className="text-[10px] font-medium text-slate-700 truncate pr-2">
                        {`${selectedCompany.mainContact.firstName} ${selectedCompany.mainContact.lastName}`}{" "}
                        <span className="text-slate-400">
                          ({selectedCompany.mainContact.email})
                        </span>
                      </p>
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={removeSignatory}
                          className="p-1 -mr-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors shrink-0"
                          title="Retirer ce signataire"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="text-[10px] text-indigo-600 font-medium hover:underline"
                    >
                      + Ajouter un signataire
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Affichage PARTICULIER */}
          {selectedParticular && (
            <div className="flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <div className="flex items-center justify-between p-2 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 leading-none truncate">
                      {`${selectedParticular.firstName} ${selectedParticular.lastName}`}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wide">
                      Particulier (B2C)
                    </span>
                  </div>
                </div>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={removeParticular}
                    className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="p-2 bg-white flex items-center gap-2">
                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                <p className="text-[10px] font-medium text-slate-600 truncate">
                  {selectedParticular.email || "Aucun email renseigné"}
                </p>
              </div>
            </div>
          )}

          {/* Bouton ou Barre de recherche */}
          {!isReadOnly && !hasStakeholder && (
            <div className="pt-1">
              {!isSearching ? (
                <Button
                  type="button"
                  onClick={() => setIsSearching(true)}
                  className="w-full border border-dashed border-slate-300 rounded-lg px-3 py-2 bg-slate-50 flex items-center justify-center gap-2 hover:bg-white hover:border-ui-brand hover:text-ui-brand text-slate-500 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une partie</span>
                </Button>
              ) : (
                <div className="relative border border-indigo-500 bg-white rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 overflow-hidden">
                  <div className="flex items-center px-2 py-1.5">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Rechercher une entreprise ou un particulier..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs font-medium bg-transparent border-none outline-none px-2 py-0.5 text-slate-800"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        setIsSearching(false);
                        setSearchQuery("");
                      }}
                      className="text-slate-400 hover:text-slate-700 w-5 h-5 p-0 bg-transparent hover:bg-slate-100"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Dropdown de résultats combinés */}
                  {searchQuery.trim().length > 1 && (
                    <div className="border-t border-slate-100 bg-slate-50 max-h-44 overflow-y-auto divide-y divide-slate-100">
                      {filteredCompanies.map((company) => (
                        <button
                          type="button"
                          onClick={() => selectCompany(company)}
                          key={`company-${company.id}`}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-ui-brand cursor-pointer flex items-center justify-between gap-2"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate">{company.name}</span>
                          </span>
                          <span className="text-[9px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded shrink-0">
                            B2B
                          </span>
                        </button>
                      ))}

                      {filteredParticulars.map((particular) => (
                        <button
                          type="button"
                          onClick={() => selectParticular(particular)}
                          key={`particular-${particular.id}`}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer flex items-center justify-between gap-2"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">
                              {`${particular.firstName} ${particular.lastName}`}
                            </span>
                          </span>
                          <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                            B2C
                          </span>
                        </button>
                      ))}

                      {filteredCompanies.length === 0 &&
                        filteredParticulars.length === 0 && (
                          <div className="px-3 py-2.5 text-xs text-slate-400 text-center">
                            Aucun résultat trouvé.
                          </div>
                        )}
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
