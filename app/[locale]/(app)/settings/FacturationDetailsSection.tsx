"use client";

import { SyntheticEvent, useState } from "react";
import { Building2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  useGetFacturationInformationsQuery,
  useUpdateFacturationInformationsMutation,
} from "@/src/store/api/subscriptionsApiSlice";
import { IFacturationInformations } from "@/src/types/apiResponseType";
import { operationError, operationSuccess } from "@/src/utils/operationsToasts";
import { responseErrorApi } from "@/src/utils/responseErrorApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRIES = [
  { code: "FR", label: "France" },
  { code: "BE", label: "Belgique" },
  { code: "CH", label: "Suisse" },
  { code: "LU", label: "Luxembourg" },
  { code: "CA", label: "Canada" },
  //   { code: "DE", label: "Allemagne" },
  { code: "ES", label: "Espagne" },
  //   { code: "IT", label: "Italie" },
  { code: "GB", label: "Royaume-Uni" },
  { code: "US", label: "États-Unis" },
];

export const FacturationDetailsSection = () => {
  const { data, isLoading, isError } = useGetFacturationInformationsQuery();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* HEADER */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Informations de facturation
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ces coordonnées apparaîtront sur vos prochaines factures PDF.
          </p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
          <Building2 className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      {isLoading ? (
        <div className="p-10 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Spinner className="size-5 text-indigo-600" />
          <p className="text-xs">Chargement de vos coordonnées...</p>
        </div>
      ) : isError || !data ? (
        <div className="p-6">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            Impossible de charger vos informations de facturation.
          </div>
        </div>
      ) : (
        /* La prop `key` réinitialise proprement le formulaire si `data` change après un PUT */
        <FacturationDetailsForm key={JSON.stringify(data)} initialData={data} />
      )}
    </div>
  );
};

const FacturationDetailsForm = ({
  initialData,
}: {
  initialData: IFacturationInformations;
}) => {
  const [updateFacturationInformations, { isLoading: isUpdating }] =
    useUpdateFacturationInformationsMutation();

  const [formData, setFormData] = useState<IFacturationInformations>({
    name: initialData.name ?? "",
    email: initialData.email ?? "",
    line1: initialData.line1 ?? "",
    line2: initialData.line2 ?? "",
    city: initialData.city ?? "",
    postalCode: initialData.postalCode ?? "",
    country: initialData.country || "FR",
  });

  const handleChange = (
    field: keyof IFacturationInformations,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isDirty =
    formData.name !== (initialData.name ?? "") ||
    formData.email !== (initialData.email ?? "") ||
    formData.line1 !== (initialData.line1 ?? "") ||
    (formData.line2 ?? "") !== (initialData.line2 ?? "") ||
    formData.city !== (initialData.city ?? "") ||
    formData.postalCode !== (initialData.postalCode ?? "") ||
    formData.country !== (initialData.country || "FR");

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await updateFacturationInformations({
        ...formData,
        line2: formData.line2?.trim() || undefined,
      }).unwrap();
      operationSuccess("Informations de facturation mises à jour.");
    } catch (error) {
      responseErrorApi(error);
      operationError(
        "Impossible de mettre à jour les informations de facturation.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 bg-white space-y-5">
        {/* Nom / Raison sociale & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="billing-name"
              className="text-xs font-semibold text-slate-700"
            >
              Nom complet ou Raison sociale
            </Label>
            <Input
              id="billing-name"
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ex: Groupe BEYOND SAS"
              className="rounded-xl border-slate-200 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="billing-email"
              className="text-xs font-semibold text-slate-700"
            >
              Email de facturation
            </Label>
            <Input
              id="billing-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="comptabilite@entreprise.fr"
              className="rounded-xl border-slate-200 text-sm"
            />
          </div>
        </div>

        {/* Adresse Ligne 1 & Ligne 2 */}
        <div className="space-y-1.5">
          <Label
            htmlFor="billing-line1"
            className="text-xs font-semibold text-slate-700"
          >
            Adresse
          </Label>
          <Input
            id="billing-line1"
            required
            value={formData.line1}
            onChange={(e) => handleChange("line1", e.target.value)}
            placeholder="10 Rue de la Paix"
            className="rounded-xl border-slate-200 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="billing-line2"
            className="text-xs font-semibold text-slate-700"
          >
            Complément d&apos;adresse{" "}
            <span className="text-slate-400 font-normal">(optionnel)</span>
          </Label>
          <Input
            id="billing-line2"
            value={formData.line2 ?? ""}
            onChange={(e) => handleChange("line2", e.target.value)}
            placeholder="Bâtiment B, 3ème étage"
            className="rounded-xl border-slate-200 text-sm"
          />
        </div>

        {/* Code postal, Ville & Pays */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="billing-postalCode"
              className="text-xs font-semibold text-slate-700"
            >
              Code postal
            </Label>
            <Input
              id="billing-postalCode"
              required
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              placeholder="75002"
              className="rounded-xl border-slate-200 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="billing-city"
              className="text-xs font-semibold text-slate-700"
            >
              Ville
            </Label>
            <Input
              id="billing-city"
              required
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Paris"
              className="rounded-xl border-slate-200 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="billing-country"
              className="text-xs font-semibold text-slate-700"
            >
              Pays
            </Label>
            <Select
              value={formData.country}
              onValueChange={(value) => handleChange("country", value ?? "")}
              required
            >
              <SelectTrigger
                id="billing-country"
                className="w-full rounded-xl border-slate-200 bg-white text-sm text-slate-900"
              >
                <SelectValue placeholder="Sélectionner un pays" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
        <Button
          type="submit"
          disabled={!isDirty || isUpdating}
          className="primary-button text-xs font-bold flex items-center gap-2 disabled:opacity-50"
        >
          {isUpdating ? (
            <>
              <Spinner className="size-3.5" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
