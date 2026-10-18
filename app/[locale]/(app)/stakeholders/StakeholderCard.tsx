"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ICompany } from "@/src/types/apiResponseType";
import { StakeholderDetailsSheet } from "./StakeholderDetailsSheet";
import { useMemo, useState } from "react";

interface IStakeholderCard {
  stakeholder: ICompany;
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

export const StakeholderCard = ({ stakeholder }: IStakeholderCard) => {
  const [isDetailsSheetOpened, setIsDetailedSheetOpened] = useState(false);
  const iconColor = shuffle(COLOR_ICON_CARD)[0];
  const clientType = useMemo(() => {
    return stakeholder.siret ? "Entreprise (B2B)" : "Particulier (B2C)";
  }, [stakeholder]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center font-bold text-lg`}
        >
          {stakeholder.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-md font-bold text-slate-900">
            {stakeholder.name}
          </h3>
          <p className="text-xs text-slate-500">{clientType}</p>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Contact principal</span>
          <span className="font-medium text-slate-800">
            {stakeholder.mainContact
              ? `${stakeholder.mainContact.firstName} ${stakeholder.mainContact.lastName}`
              : "Aucun contact"}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Contrats actifs</span>
          <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            0
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Adresse</span>
          <span className="font-medium text-slate-800 truncate">
            {stakeholder.address.toUpperCase()}
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
          <StakeholderDetailsSheet stakeholder={stakeholder} />
        </SheetContent>
      </Sheet>
    </div>
  );
};
