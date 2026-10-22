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
import { TStakeholder } from "./StakeholdersPage";
import { ICompany, IParticularStakeholder } from "@/src/types/apiResponseType";
import { useDeleteParticularStakeholderMutation } from "@/src/store/api/particularStakeholdersApiSlice";
import { useDeleteCompanyMutation } from "@/src/store/api/companiesApiSlice";
import { Spinner } from "@/components/ui/spinner";
import { responseErrorApi } from "@/src/utils/responseErrorApi";
import { operationSuccess } from "@/src/utils/operationsToasts";

interface IStakeholderDetailsSheetProps {
  stakeholder: TStakeholder;
  setSthToModify: (v: TStakeholder) => void;
}

export const StakeholderDetailsSheet = ({
  stakeholder,
  setSthToModify,
}: IStakeholderDetailsSheetProps) => {
  const [deleteParticularSth, { isLoading: isDeletingParticularSth }] =
    useDeleteParticularStakeholderMutation();
  const [deleteCompany, { isLoading: isDeletingCompany }] =
    useDeleteCompanyMutation();

  const isB2B = "siret" in stakeholder;

  const displayName = isB2B
    ? (stakeholder as ICompany).name
    : `${(stakeholder as IParticularStakeholder).firstName} ${(stakeholder as IParticularStakeholder).lastName}`;

  const displaySiret = isB2B ? (stakeholder as ICompany).siret : null;

  const contactName = isB2B
    ? `${(stakeholder as ICompany).mainContact.firstName} ${(stakeholder as ICompany).mainContact.lastName}`
    : `${(stakeholder as IParticularStakeholder).firstName} ${(stakeholder as IParticularStakeholder).lastName}`;

  const contactEmail = isB2B
    ? (stakeholder as ICompany).mainContact.email
    : (stakeholder as IParticularStakeholder).email;

  const contactPhone = isB2B
    ? (stakeholder as ICompany).mainContact.phone
    : (stakeholder as IParticularStakeholder).phone;

  const handleDeleting = async () => {
    try {
      if (isB2B) {
        await deleteCompany(stakeholder.id).unwrap();
      } else {
        await deleteParticularSth(stakeholder.id).unwrap();
      }
      operationSuccess("Le tiers a bien été supprimé.");
    } catch (e) {
      responseErrorApi(e);
    }
  };

  const isDeleting = isDeletingCompany && isDeletingParticularSth;

  return (
    <>
      {/* HEADER DE LA FICHE */}
      <div className="p-6 bg-slate-50 border-b border-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-2xl mb-4">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <SheetTitle className="text-2xl font-bold text-slate-900 font-display">
          {displayName}
        </SheetTitle>
        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 font-medium">
          {isB2B ? (
            <Building2 className="w-4 h-4" />
          ) : (
            <User className="w-4 h-4" />
          )}
          {isB2B ? `Entreprise • SIRET: ${displaySiret}` : "Particulier"}
        </div>
      </div>

      {/* CONTENU (Informations) */}
      <div className="p-6 space-y-8 flex-1">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isB2B ? "Contact Principal" : "Informations de Contact"}
          </h3>

          <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="font-semibold text-slate-800">{contactName}</div>

            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <a
                href={`mailto:${contactEmail}`}
                className="hover:text-indigo-600 transition-colors"
              >
                {contactEmail}
              </a>
            </div>

            {contactPhone && (
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <a
                  href={`tel:${contactPhone}`}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {contactPhone}
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
          onClick={handleDeleting}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Spinner className="size-4 text-rose-600" />
          ) : (
            <Trash2 className="w-4 h-4 mr-2" />
          )}{" "}
          Supprimer
        </Button>
        <Button
          className="bg-slate-900 hover:bg-slate-800 text-white"
          disabled={isDeleting}
          onClick={() => setSthToModify(stakeholder)}
        >
          <Edit className="w-4 h-4 mr-2" /> Modifier
        </Button>
      </div>
    </>
  );
};
