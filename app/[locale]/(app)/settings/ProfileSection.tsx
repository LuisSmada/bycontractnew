"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { IUser } from "@/src/model/entities";
import { operationError, operationSuccess } from "@/src/utils/operationsToasts";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { useUpdateUserMutation } from "@/src/store/api/usersApiSlice";
import { IUpdateUserRequest } from "@/src/types/apiResponseType";
import { responseErrorApi } from "@/src/utils/responseErrorApi";

interface IProfileSection {
  currentUser: IUser;
}

const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères."),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.email("Veuillez entrer une adresse email valide."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileSection: FC<IProfileSection> = ({ currentUser }) => {
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: {
      errors: profileErrors,
      isDirty: isProfileDirty,
      isSubmitting: isUpdatingProfile,
    },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
    },
  });

  // --- SOUMISSION : PROFIL ---
  const onSubmitProfile = async (data: ProfileFormValues) => {
    try {
      const payload: Partial<IUpdateUserRequest> = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      };
      await updateUser({ id: currentUser.id, request: payload }).unwrap();

      operationSuccess("Vos informations ont été mises à jour avec succès.");

      // 2. On met à jour les defaultValues pour réinitialiser le "isDirty"
      resetProfile(data);
      setIsEditing(false);
    } catch (error) {
      responseErrorApi(error);
    }
  };

  // On annule les modifications en rechargeant les valeurs par défaut
  const handleCancelEdit = () => {
    resetProfile();
    setIsEditing(false);
  };

  const getErrorClass = (hasError: boolean) =>
    hasError ? "border-red-500 focus-visible:ring-red-500" : "";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* --- EN-TÊTE --- */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Informations personnelles
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gérez vos informations de contact et de sécurité.
          </p>
        </div>
        <Button
          variant="outline"
          className="text-xs font-semibold bg-transparent"
          onClick={() => setIsPasswordModalOpen(true)}
        >
          Changer le mot de passe
        </Button>
      </div>

      {/* --- AVATAR (Visuel non géré par RHF pour le moment) --- */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200">
          <Avatar className="w-20 h-20 flex items-center justify-center">
            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl font-bold">
              {`${currentUser.firstName.charAt(0).toUpperCase()}${currentUser.lastName.charAt(0).toUpperCase()}`}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <Button className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors">
            Uploader un avatar
          </Button>
          <p className="text-[10px] text-slate-400 mt-2">
            JPG, GIF ou PNG. Max 1Mo.
          </p>
        </div>
      </div>

      {/* --- FORMULAIRE PROFIL --- */}
      <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
        {/* Contrôleur d'édition */}
        <div className="flex justify-end mb-4">
          {!isEditing ? (
            <Button
              type="button"
              variant="secondary"
              className="text-xs font-semibold"
              onClick={() => setIsEditing(true)}
            >
              Éditer le profil
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              onClick={handleCancelEdit}
              disabled={isUpdatingProfile}
            >
              Annuler
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-semibold text-slate-700">
                Prénom
              </Label>
              {profileErrors.firstName && (
                <span className="text-[10px] text-red-500">
                  {profileErrors.firstName.message}
                </span>
              )}
            </div>
            <Input
              type="text"
              disabled={!isEditing || isUpdatingProfile}
              className={cn(
                "input-form transition-all",
                getErrorClass(!!profileErrors.firstName),
                !isEditing && "bg-slate-50 cursor-not-allowed",
              )}
              {...registerProfile("firstName")}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-semibold text-slate-700">
                Nom
              </Label>
              {profileErrors.lastName && (
                <span className="text-[10px] text-red-500">
                  {profileErrors.lastName.message}
                </span>
              )}
            </div>
            <Input
              type="text"
              disabled={!isEditing || isUpdatingProfile}
              className={cn(
                "input-form transition-all",
                getErrorClass(!!profileErrors.lastName),
                !isEditing && "bg-slate-50 cursor-not-allowed",
              )}
              {...registerProfile("lastName")}
            />
          </div>

          <div className="space-y-1.5 col-span-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-semibold text-slate-700">
                Adresse Email
              </Label>
              {profileErrors.email && (
                <span className="text-[10px] text-red-500">
                  {profileErrors.email.message}
                </span>
              )}
            </div>
            <Input
              type="email"
              disabled={!isEditing || isUpdatingProfile}
              className={cn(
                "input-form transition-all",
                getErrorClass(!!profileErrors.email),
                !isEditing && "bg-slate-50 cursor-not-allowed",
              )}
              {...registerProfile("email")}
            />
          </div>
        </div>

        {/* BOUTON SAUVEGARDE PROFIL */}
        {isEditing && (
          <div className="mt-6 flex justify-end pt-6 border-t border-slate-100">
            <Button
              type="submit"
              className="primary-button min-w-50"
              disabled={!isProfileDirty || isUpdatingProfile || isUpdatingUser}
            >
              {isUpdatingProfile || isUpdatingUser ? (
                <span className="flex items-center gap-2">
                  <Spinner className="size-4 text-white" /> Enregistrement...
                </span>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </div>
        )}
      </form>

      {/* ---------------------------------------------------- */}
      {/* MODALE CHANGEMENT DE MOT DE PASSE                    */}
      {/* ---------------------------------------------------- */}
      <ChangePasswordDialog
        isPasswordModalOpen={isPasswordModalOpen}
        setIsPasswordModalOpen={setIsPasswordModalOpen}
      />
    </div>
  );
};
