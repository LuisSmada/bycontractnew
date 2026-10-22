"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  useCreateCompanyMutation,
  useUpdateCompanyByIdMutation,
} from "@/src/store/api/companiesApiSlice";
import { operationError, operationSuccess } from "@/src/utils/operationsToasts";
import { responseErrorApi } from "@/src/utils/responseErrorApi";
import {
  ICreateCompanyRequest,
  ICreateParticularStakeholderRequest,
} from "@/src/types/apiResponseType";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  useCreateParticularStakeholderMutation,
  useUpdateParticularStakeholderByIdMutation,
} from "@/src/store/api/particularStakeholdersApiSlice";
import { TStakeholder } from "./StakeholdersPage";

interface IStakeholderFormProps {
  sthToModify?: TStakeholder | null;
  setIsCreateSheetOpen?: (v: boolean) => void;
  setSthToModify?: (v: TStakeholder | null) => void;
}

export const StakeholderForm = ({
  sthToModify,
  setIsCreateSheetOpen,
  setSthToModify,
}: IStakeholderFormProps) => {
  const isEditMode = !!sthToModify;
  const initialType = sthToModify
    ? "siret" in sthToModify
      ? "B2B"
      : "B2C"
    : "B2B";

  const [createCompany, { isLoading: isCreatingCompany }] =
    useCreateCompanyMutation();
  const [createParticularStakeholder, { isLoading: isCreatingParticularSth }] =
    useCreateParticularStakeholderMutation();
  const [updateCompany, { isLoading: isUpdatingCompany }] =
    useUpdateCompanyByIdMutation();
  const [
    updateParticularStakeholder,
    { isLoading: isUpdatingParticularStakeholder },
  ] = useUpdateParticularStakeholderByIdMutation();

  const [siret, setSiret] = useState(() => {
    if (sthToModify && "siret" in sthToModify) {
      return sthToModify.siret;
    }
    return "";
  });
  const [stakeholderType, setStakeholderType] = useState<"B2B" | "B2C">(
    initialType,
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const isSiretInvalid = siret.length > 0 && siret.length !== 14;

  const defaultValues = {
    name: sthToModify && "siret" in sthToModify ? sthToModify.name : "",
    address: sthToModify?.address || "",
    firstName: sthToModify
      ? "siret" in sthToModify
        ? sthToModify.mainContact.firstName
        : sthToModify.firstName
      : "",
    lastName: sthToModify
      ? "siret" in sthToModify
        ? sthToModify.mainContact.lastName
        : sthToModify.lastName
      : "",
    email: sthToModify
      ? "siret" in sthToModify
        ? sthToModify.mainContact.email
        : sthToModify.email
      : "",
    phone: sthToModify
      ? "siret" in sthToModify
        ? sthToModify.mainContact.phone
        : sthToModify.phone
      : "",
  };

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

    console.log("data", Object.fromEntries(formData.entries()));

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      operationError(
        "Veuillez remplir tous les champs obligatoires correctement.",
      );
      return;
    }

    try {
      if (stakeholderType === "B2B") {
        const payloadB2B: ICreateCompanyRequest = {
          name: data.name as string,
          siret: siret,
          address: data.address as string,
          mainContact: {
            firstName: data.firstName as string,
            lastName: data.lastName as string,
            email: data.email as string,
            phone: (data.phone as string) || null,
          },
        };

        if (isEditMode && sthToModify) {
          // MODE UPDATE
          await updateCompany({
            id: sthToModify.id,
            request: payloadB2B,
          }).unwrap();
          operationSuccess("Entreprise modifiée avec succès !");
        } else {
          // MODE CRÉATION
          await createCompany(payloadB2B).unwrap();
          operationSuccess("Entreprise créée avec succès !");
        }
      } else {
        const payloadB2C: ICreateParticularStakeholderRequest = {
          address: (data.address as string) || null,
          firstName: data.firstName as string,
          lastName: data.lastName as string,
          email: data.email as string,
          phone: (data.phone as string) || null,
        };

        if (isEditMode && sthToModify) {
          await updateParticularStakeholder({
            id: sthToModify.id,
            request: payloadB2C,
          }).unwrap();
          operationSuccess("Particulier modifié avec succès !");
        } else {
          await createParticularStakeholder(payloadB2C).unwrap();
          operationSuccess("Particulier créé avec succès !");
        }
      }

      setIsCreateSheetOpen?.(false);
      setSthToModify?.(null);
    } catch (error: unknown) {
      console.error(error);
      responseErrorApi(error);
    }
  };

  const getErrorClass = (hasError: boolean) =>
    hasError ? "border-red-500" : "";

  console.log("errors", errors);

  const isCreating = isCreatingCompany || isCreatingParticularSth;
  const isUpdating = isUpdatingCompany || isUpdatingParticularStakeholder;
  const isProcessing = isCreating || isUpdating;

  const getButtonText = () => {
    if (isCreating) {
      return "Création...";
    }
    if (isUpdating) {
      return "Mise à jour...";
    }
    if (isEditMode) {
      return "Mettre à jour le tiers";
    }
    return "Créer le tiers";
  };

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
        key={sthToModify ? sthToModify.id : "new-stakeholder"}
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
              disabled={isEditMode}
              onClick={() => {
                setStakeholderType("B2B");
                setErrors({}); // On nettoie les erreurs quand on change de mode
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${isEditMode ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${
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
              disabled={isEditMode}
              onClick={() => {
                setStakeholderType("B2C");
                setErrors({}); // On nettoie les erreurs quand on change de mode
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${isEditMode ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${
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
                  defaultValue={defaultValues.name}
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
                  defaultValue={defaultValues.address}
                  className={cn(
                    "input-form focus-visible:ring-transparent",
                    getErrorClass(errors.address),
                  )}
                  placeholder="123 rue de la Paix, 75000 Paris"
                  onChange={() => clearError("address")}
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
                  defaultValue={defaultValues.firstName}
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
                  defaultValue={defaultValues.lastName}
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
                defaultValue={defaultValues.email}
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
                defaultValue={defaultValues.phone ?? ""}
                placeholder="+33 6 00 00 00 00"
              />
            </div>
            {stakeholderType === "B2C" && (
              <div className="space-y-2">
                <Label htmlFor="particularAddress">Adresse postale</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={defaultValues.address}
                  className={cn("input-form", getErrorClass(errors.address))}
                  placeholder="123 rue de la Paix, 75000 Paris"
                  onChange={() => clearError("address")}
                />
              </div>
            )}
          </div>
        </div>
      </form>

      {/* FOOTER DU SHEET */}
      <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            setIsCreateSheetOpen?.(false);
            if (sthToModify) {
              setSthToModify?.(null);
            }
          }}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          form="stakeholder-form"
          disabled={isProcessing}
          className="primary-button disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {/* Si ça charge, on affiche un spinner natif */}
          {isProcessing && <Spinner className="size-4 text-white" />}
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};
