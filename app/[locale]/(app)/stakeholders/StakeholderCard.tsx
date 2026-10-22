"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ICompany, IParticularStakeholder } from "@/src/types/apiResponseType";
import { StakeholderDetailsSheet } from "./StakeholderDetailsSheet";
import { useMemo, useState } from "react";
import { TStakeholder } from "./StakeholdersPage";
import { EContractStatus } from "@/src/model/entities";
import { selectAllContracts } from "@/src/store/api/contractsSlice";
import { useAppSelector } from "@/src/store/reduxHooks";

interface IStakeholderCard {
  stakeholder: TStakeholder;
  setSthToModify: (v: TStakeholder) => void;
}

const COLOR_ICON_CARD = [
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
];

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const StakeholderCard = ({
  stakeholder,
  setSthToModify,
}: IStakeholderCard) => {
  const allContracts = useAppSelector(selectAllContracts);

  const activeContractsCount = useMemo(() => {
    return allContracts.filter(
      (contract) =>
        contract.company?.id === stakeholder.id &&
        contract.status === EContractStatus.ACTIVE,
    ).length;
  }, [allContracts, stakeholder.id]);

  const pendingContractsCount = useMemo(() => {
    return allContracts.filter(
      (contract) =>
        contract.company?.id === stakeholder.id &&
        contract.status === EContractStatus.PENDING,
    ).length;
  }, [allContracts, stakeholder.id]);

  const [isDetailsSheetOpened, setIsDetailedSheetOpened] = useState(false);
  const iconColor = shuffle(COLOR_ICON_CARD)[0];

  const isCompany = "siret" in stakeholder;

  const displayName = useMemo(() => {
    if (isCompany) {
      return (stakeholder as ICompany).name;
    }
    const particular = stakeholder as IParticularStakeholder;
    return `${particular.firstName} ${particular.lastName}`.trim();
  }, [stakeholder, isCompany]);

  const clientType = isCompany ? "Entreprise (B2B)" : "Particulier (B2C)";

  const contactName = useMemo(() => {
    if (isCompany) {
      const company = stakeholder as ICompany;
      return company.mainContact
        ? `${company.mainContact.firstName} ${company.mainContact.lastName}`
        : "Aucun contact";
    }
    return "Lui-même";
  }, [stakeholder, isCompany]);

  const displayAddress = stakeholder.address
    ? stakeholder.address.toUpperCase()
    : "NON RENSEIGNÉE";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center font-bold text-lg`}
        >
          {/* Première lettre du nom calculé */}
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-md font-bold text-slate-900 line-clamp-1">
            {displayName}
          </h3>
          <p className="text-xs text-slate-500">{clientType}</p>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Contact principal</span>
          <span className="font-medium text-slate-800 line-clamp-1 text-right ml-2">
            {contactName}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Contrats actifs</span>
          <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            {activeContractsCount}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Contrats en attente</span>
          <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
            {pendingContractsCount}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Adresse</span>
          <span className="font-medium text-slate-800 truncate max-w-37.5 text-right ml-2">
            {displayAddress}
          </span>
        </div>
      </div>
      <Sheet
        open={isDetailsSheetOpened}
        onOpenChange={setIsDetailedSheetOpened}
      >
        <SheetTrigger className="w-full py-2 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
          Voir la fiche détaillée
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto border-l border-slate-200 p-0">
          <StakeholderDetailsSheet
            stakeholder={stakeholder}
            setSthToModify={setSthToModify}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
