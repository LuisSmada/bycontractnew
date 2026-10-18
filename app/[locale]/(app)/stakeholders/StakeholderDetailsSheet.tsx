"use client";

import { SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";

// Adapte cette interface selon le type réel retourné par ton API
interface IStakeholderDetails {
  id: string;
  name: string;
  siret?: string;
  address?: string;
  mainContact: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

interface IStakeholderDetailsSheetProps {
  stakeholder: IStakeholderDetails;
}

export const StakeholderDetailsSheet = ({
  stakeholder,
}: IStakeholderDetailsSheetProps) => {
  const isB2B = !!stakeholder.siret;

  return (
    <>
      {/* HEADER DE LA FICHE */}
      <div className="p-6 bg-slate-50 border-b border-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-2xl mb-4">
          {stakeholder.name.charAt(0).toUpperCase()}
        </div>
        <SheetTitle className="text-2xl font-bold text-slate-900 font-display">
          {stakeholder.name}
        </SheetTitle>
        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 font-medium">
          {isB2B ? (
            <Building2 className="w-4 h-4" />
          ) : (
            <User className="w-4 h-4" />
          )}
          {isB2B ? `Entreprise • SIRET: ${stakeholder.siret}` : "Particulier"}
        </div>
      </div>

      {/* CONTENU (Informations) */}
      <div className="p-6 space-y-8 flex-1">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Contact Principal
          </h3>

          <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="font-semibold text-slate-800">
              {stakeholder.mainContact.firstName}{" "}
              {stakeholder.mainContact.lastName}
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <a
                href={`mailto:${stakeholder.mainContact.email}`}
                className="hover:text-indigo-600 transition-colors"
              >
                {stakeholder.mainContact.email}
              </a>
            </div>

            {stakeholder.mainContact.phone && (
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <a
                  href={`tel:${stakeholder.mainContact.phone}`}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {stakeholder.mainContact.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {stakeholder.address && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Localisation
            </h3>
            <div className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{stakeholder.address}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Activité
          </h3>
          <div className="flex items-center gap-3 text-sm text-slate-600 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>
              <strong className="text-indigo-700">0</strong> contrats actifs
            </span>
          </div>
        </div>
      </div>

      {/* ACTIONS RAPIDES (Footer) */}
      <div className="p-6 bg-white border-t border-slate-100 flex justify-between gap-3 shrink-0">
        <Button
          variant="outline"
          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-transparent"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Supprimer
        </Button>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white">
          <Edit className="w-4 h-4 mr-2" /> Modifier
        </Button>
      </div>
    </>
  );
};
