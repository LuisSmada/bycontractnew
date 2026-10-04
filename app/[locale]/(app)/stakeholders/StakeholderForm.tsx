"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useCreateCompanyMutation } from "@/src/store/api/companiesApiSlice";
import { operationError, operationSuccess } from "@/src/utils/operationsToasts";
import { responseErrorApi } from "@/src/utils/responseErrorApi";
import { ICreateCompanyRequest } from "@/src/types/apiResponseType";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface IStakeholderFormProps {
  onSuccess: () => void;
}

type TStakeholderType = "B2B" | "B2C";

export const StakeholderForm = ({ onSuccess }: IStakeholderFormProps) => {
  const [createCompany, { isLoading }] = useCreateCompanyMutation();

  const [siret, setSiret] = useState("");
  const [stakeholderType, setStakeholderType] =
    useState<TStakeholderType>("B2B");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const isSiretInvalid = siret.length > 0 && siret.length !== 14;

  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const newErrors: Record<string, boolean> = {};

    if (!data.email) {
      newErrors.email = true;
    }

    if (stakeholderType === "B2B") {
      if (!data.name) {
        newErrors.name = true;
      }

      if (!data.address) {
        newErrors.address = true;
      }

      if (!siret || siret.length !== 14) {
        newErrors.siret = true;
      }
    }

    if (!data.firstName) {
      newErrors.firstName = true;
    }
    if (!data.lastName) {
      newErrors.lastName = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      operationError(
        "Veuillez remplir tous les champs obligatoires correctement.",
      );
      return;
    }

    // 2. FORMATAGE DU PAYLOAD POUR CORRESPONDRE À ICreateCompanyRequest
    let payload: ICreateCompanyRequest;

    if (stakeholderType === "B2B") {
      const firstName = data.firstName;
      const lastName = data.lastName;

      payload = {
        name: data.name as string,
        siret: siret,
        address: data.address as string,
        mainContact: {
          firstName: firstName as string,
          lastName: lastName as string,
          email: data.email as string,
          phone: (data.phone as string) || "",
        },
      };
    } else {
      // B2C : Le "nom de l'entreprise" devient le nom de la personne
      payload = {
        name: `${data.firstName} ${data.lastName}`,
        siret: "", // Ou une valeur par défaut reconnue par ton backend comme B2C
        address: (data.address as string) || "",
        mainContact: {
          firstName: data.firstName as string,
          lastName: data.lastName as string,
          email: data.email as string,
          phone: (data.phone as string) || "",
        },
      };
    }

    // 3. APPEL API
    try {
      await createCompany(payload).unwrap();
      onSuccess();
      operationSuccess("Tiers créé avec succès !");
    } catch (error: unknown) {
      console.error(error);
      responseErrorApi(error);
    }
  };
  const getErrorClass = (hasError: boolean) =>
    hasError ? "border-red-500 focus-visible:ring-red-500" : "";

  console.log("errors", errors);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 bg-white border-b border-slate-100">
        <h2 className="text-lg font-bold text-ui-text">Nouveau Tiers</h2>
        <p className="text-sm text-ui-textSubtle">
          Ajoutez un partenaire à votre annuaire.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        id="stakeholder-form"
        className="flex-1 overflow-y-auto p-6 space-y-8"
      >
        {/* SÉLECTION DU TYPE */}
        <div className="space-y-3">
          <Label className="text-xs font-bold text-ui-textSubtle uppercase tracking-wider">
            Type de tiers
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {/* Bouton B2B */}
            <button
              type="button"
              onClick={() => {
                setStakeholderType("B2B");
                setErrors({}); // On nettoie les erreurs quand on change de mode
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                stakeholderType === "B2B"
                  ? "border-ui-brand bg-indigo-50 text-ui-brand"
                  : "border-slate-200 bg-white text-ui-textSubtle hover:border-slate-300"
              }`}
            >
              <Building2 className="w-6 h-6" />
              <span className="text-sm font-semibold">Entreprise</span>
            </button>
            {/* Bouton B2C */}
            <button
              type="button"
              onClick={() => {
                setStakeholderType("B2C");
                setErrors({}); // On nettoie les erreurs quand on change de mode
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                stakeholderType === "B2C"
                  ? "border-ui-brand bg-indigo-50 text-ui-brand"
                  : "border-slate-200 bg-white text-ui-textSubtle hover:border-slate-300"
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-sm font-semibold">Particulier</span>
            </button>
          </div>
        </div>

        {/* CHAMPS DYNAMIQUES */}
        <div className="space-y-5">
          {stakeholderType === "B2B" && (
            <>
              {/* Formulaire B2B */}
              <div className="space-y-2">
                <Label htmlFor="companyName">{"Nom de l'entreprise *"}</Label>
                <Input
                  id="companyName"
                  name="name"
                  placeholder="Ex: Groupe BEYOND"
                  className={cn("input-form", getErrorClass(errors.name))}
                  onChange={() => clearError("name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siret">N° SIRET / Registre du commerce *</Label>
                <Input
                  id="siret"
                  name="siret"
                  placeholder="14 chiffres"
                  value={siret}
                  className={cn(
                    "input-form",
                    getErrorClass(errors.siret || isSiretInvalid),
                  )}
                  onChange={(e) => {
                    // Ne garde que les chiffres, et coupe à 14 max
                    const numericValue = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 14);
                    setSiret(numericValue);
                    clearError("siret");
                  }}
                />
                {/* Petit message d'aide pour le SIRET */}
                {isSiretInvalid && (
                  <p className="text-xs text-red-500 mt-1">
                    Le SIRET doit contenir exactement 14 chiffres (
                    {siret.length}/14).
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse postale</Label>
                <Input
                  id="address"
                  name="address"
                  className={cn("input-form", getErrorClass(errors.address))}
                  placeholder="123 rue de la Paix, 75000 Paris"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="contactName"
                  className="text-xs font-bold text-ui-textSubtle uppercase tracking-wider"
                >
                  Contact principal{" "}
                </Label>
              </div>
            </>
          )}

          {/* Champs Communs */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Prénom"
                  className={cn("input-form", getErrorClass(errors.firstName))}
                  onChange={() => clearError("firstName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Nom"
                  className={cn("input-form", getErrorClass(errors.lastName))}
                  onChange={() => clearError("lastName")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Adresse Email *</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="contact@exemple.com"
                className={cn("input-form", getErrorClass(errors.email))}
                onChange={() => clearError("email")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                placeholder="+33 6 00 00 00 00"
              />
            </div>
          </div>
        </div>
      </form>

      {/* FOOTER DU SHEET */}
      <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
        <Button variant="outline" type="button" onClick={onSuccess}>
          Annuler
        </Button>
        <Button
          type="submit"
          form="stakeholder-form"
          disabled={isLoading} // 👈 Désactive le bouton pendant la requête
          className="primary-button disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {/* Si ça charge, on affiche un spinner natif */}
          {isLoading && <Spinner className="size-4 text-white" />}
          {isLoading ? "Création..." : "Créer le tiers"}
        </Button>
      </div>
    </div>
  );
};
