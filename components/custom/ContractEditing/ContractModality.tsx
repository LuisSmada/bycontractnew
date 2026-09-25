import { Switch } from "@/components/ui/switch";
import { formatForDateInput } from "@/src/helpers/generic";
import {
  TContractEditorContract,
  TContractEditorDocument,
} from "@/src/types/apiResponseType";
import { CalendarDays, DollarSign, Euro, RefreshCw } from "lucide-react";
import React, { FC, useState } from "react";

interface IContractModality {
  isReadOnly: boolean;
  document: TContractEditorContract | null;
  onContractValueChange: (val: number) => void;
  onContractEffectiveDateChange: (val: string) => void;
  onContractExpirationDateChange: (val: string) => void;
  onContractAutoRenewChange: (val: boolean) => void;
}

export const ContractModality: FC<IContractModality> = ({
  document,
  isReadOnly,
  onContractValueChange,
  onContractEffectiveDateChange,
  onContractExpirationDateChange,
  onContractAutoRenewChange,
}) => {
  const [currency, setCurrency] = useState<string>("EUR");

  return (
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
            {currency === "EUR" && (
              <Euro className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
            )}
            {currency === "USD" && (
              <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
            )}
            <input
              type="number"
              onChange={(e) => onContractValueChange(Number(e.target.value))}
              value={document?.value.toString()}
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
            onChange={(e) => onContractEffectiveDateChange(e.target.value)}
            disabled={isReadOnly}
            value={formatForDateInput(document?.effectiveDate ?? "")}
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
            onChange={(e) => onContractExpirationDateChange(e.target.value)}
            disabled={isReadOnly}
            value={formatForDateInput(document?.expirationDate ?? "")}
            className="w-full text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-2 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all disabled:opacity-60 text-slate-700"
          />
        </div>
      </div>

      {/* Renouvellement Tacite (Toggle) */}
      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2">
          <RefreshCw
            className={`w-4 h-4 ${document?.autoRenew ? "text-indigo-600" : "text-slate-400"}`}
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
          checked={document?.autoRenew}
          onClick={() => onContractAutoRenewChange(!document?.autoRenew)}
          disabled={isReadOnly}
          className={`shrink-0 cursor-pointer  ${document?.autoRenew ? "data-checked:bg-indigo-600" : "data-checked:bg-slate-300"} `}
        />
      </div>
    </div>
  );
};
