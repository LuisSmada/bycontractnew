"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetAllMyCompaniesQuery } from "@/src/store/api/companiesApiSlice";
import { Plus, Search } from "lucide-react";
import { StakeholderCard } from "./StakeholderCard";
import { ErrorScreen } from "@/components/custom/ErrorScreen";
import { LoadingScreen } from "@/components/custom/LoadingScreen";
import { StakeholderForm } from "./StakeholderForm";
import { useGetAllParticularStakeholdersQuery } from "@/src/store/api/particularStakeholdersApiSlice";
import { ICompany, IParticularStakeholder } from "@/src/types/apiResponseType";

export type TStakeholder = ICompany | IParticularStakeholder;

export const StakeholdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [sthToModify, setSthToModify] = useState<TStakeholder | null>(null);

  const openSthFormSheet = isCreateSheetOpen || !!sthToModify;

  const {
    data: professionalStakeholders,
    isLoading: isLoadingProfessionalStakeholders,
    isError: isErrorProfessionalStakeholders,
    refetch: refetchProfessionalStakeholders,
  } = useGetAllMyCompaniesQuery();

  const {
    data: particularStakeholders,
    isLoading: isLoadingParticularStakeholders,
    isError: isErrorParticularStakeholders,
    refetch: refetchParticularStakeholders,
  } = useGetAllParticularStakeholdersQuery();

  const handleRefetchall = () => {
    refetchProfessionalStakeholders();
    refetchParticularStakeholders();
  };

  const stakeholders: TStakeholder[] = [
    ...(professionalStakeholders ?? []),
    ...(particularStakeholders?.content ?? []),
  ];

  if (isLoadingProfessionalStakeholders && isLoadingParticularStakeholders)
    return <LoadingScreen />;

  if (isErrorProfessionalStakeholders && isErrorParticularStakeholders) {
    return (
      <ErrorScreen
        title="Erreur de chargement"
        message="Certaines données n'ont pas pu être récupérées."
        onRetry={handleRefetchall}
      />
    );
  }

  // Filtrage local basé sur la recherche
  const filteredStakeholders = (stakeholders || []).filter((sth) => {
    const query = searchQuery.toLowerCase();

    if ("siret" in sth) {
      const company = sth as ICompany;
      return company.name.toLowerCase().includes(query);
    }

    const particular = sth as IParticularStakeholder;
    const fullName =
      `${particular.firstName} ${particular.lastName}`.toLowerCase();
    return fullName.includes(query);
  });

  const handleSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setIsCreateSheetOpen(false);
      setSthToModify(null);
    } else {
      setIsCreateSheetOpen(true);
    }
  };

  return (
    <>
      <div
        id="view-parties"
        className="p-8 w-full mx-auto space-y-8 flex-1 overflow-y-auto no-scrollbar"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-display text-slate-950">
              Annuaire des Tiers
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Gérez vos clients, fournisseurs et partenaires liés à vos
              contrats.
            </p>
          </div>

          {/* INTEGRATION DU SHEET SHADCN ICI */}
          <Sheet open={openSthFormSheet} onOpenChange={handleSheetOpenChange}>
            <SheetTrigger className="bg-ui-brand text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 hover:bg-ui-brandHover transition-colors cursor-pointer">
              <Plus className="w-4 h-4" />
              Ajouter un tiers
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto border-l border-slate-200 p-0">
              {/* On passe la fonction de fermeture au formulaire pour le fermer après la sauvegarde */}
              <StakeholderForm
                sthToModify={sthToModify}
                setIsCreateSheetOpen={setIsCreateSheetOpen}
                setSthToModify={setSthToModify}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="relative max-w-md">
          <Input
            type="text"
            placeholder="Rechercher une entreprise ou un contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStakeholders.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              Aucun tiers trouvé pour {searchQuery}
            </div>
          ) : (
            filteredStakeholders.map((sth) => {
              return (
                <StakeholderCard
                  key={sth.id}
                  stakeholder={sth}
                  setSthToModify={setSthToModify}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
