"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { PasswordInput } from "@/components/custom/PasswordInput";
import { useLoginMutation } from "@/src/store/api/authApiSlice";
import { operationError, operationSuccess } from "@/src/utils/operationsToasts";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

const loginSchema = z.object({
  userLogin: z.string().min(1, "L'identifiant est requis"),
  userPassword: z.string().min(1, "Le mot de passe est requis"),
  rememberMe: z.boolean(),
});

// Génération automatique du type TypeScript basé sur le schéma
type LoginFormValues = z.infer<typeof loginSchema>;

export const ConnexionForm = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userLogin: "",
      userPassword: "",
      rememberMe: false,
    },
  });

  // On "observe" le champ en temps réel
  // const isRememberMeChecked = watch("rememberMe")
  // En résumé :
  // Tu veux afficher/cacher un élément HTML selon une valeur ? ➔ Utilise watch("nomDuChamp").
  // Tu veux juste faire un if(...) dans une fonction Javascript ? ➔ Utilise getValues("nomDuChamp").

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login({
        email: data.userLogin,
        password: data.userPassword,
      }).unwrap();

      operationSuccess("Connexion réussie.");
      router.push("/fr/dashboard");
    } catch (err: unknown) {
      const error = err as FetchBaseQueryError;
      if (error?.status === 401 || error?.status === 403) {
        operationError("Identifiants incorrects. Veuillez réessayer.");
      } else {
        operationError(
          "Une erreur est survenue lors de la connexion au serveur.",
        );
      }
    }
  };

  // 4. SOUMISSION INVALIDE (Erreurs Zod capturées)
  const onInvalid = () => {
    operationError("Veuillez remplir tous les champs obligatoires.");
  };

  const getErrorClass = (hasError: boolean) =>
    hasError ? "border-red-500" : "";

  return (
    <div className="flex w-full h-full flex-col px-8 py-12 md:px-16 md:py-10 justify-center relative overflow-y-auto custom-scrollbar">
      <div className="mb-10">
        <Image
          src={"/svg/BYC.svg"}
          alt="Logo Miniaturized"
          className="w-24"
          width={96}
          height={96}
        />
      </div>

      {/* handleSubmit prend deux fonctions : succès et échec */}
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="flex flex-col w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-ui-text mb-2">
          Bienvenue sur la plateforme BYCONTRACT
        </h1>
        <p className="text-sm text-ui-textSubtle font-medium mb-8">
          Connectez-vous pour continuer
        </p>

        {/* CHAMP USER LOGIN */}
        <div className="flex flex-col mb-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-ui-text mb-1">
              {"Email ou Nom d'utilisateur"}
            </Label>
            {errors.userLogin && (
              <span className="text-xs text-red-500 mt-1">
                {errors.userLogin.message}
              </span>
            )}
          </div>
          <Input
            type="text"
            className={cn(
              "input-form focus-visible:ring-transparent",
              getErrorClass(!!errors.userLogin),
            )}
            disabled={isLoading}
            {...register("userLogin")}
          />
        </div>

        {/* CHAMP MOT DE PASSE */}
        <div className="flex flex-col mb-6">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-ui-text mb-1">
              Mot de passe
            </Label>
            {errors.userPassword && (
              <span className="text-xs text-red-500 mt-1">
                {errors.userPassword.message}
              </span>
            )}
          </div>
          <PasswordInput
            type="password"
            className={cn(
              "input-form focus-visible:ring-transparent",
              getErrorClass(!!errors.userPassword),
            )}
            disabled={isLoading}
            {...register("userPassword")}
          />
          <div className="w-full flex justify-end mt-2">
            <Link
              href="/fr/forgot-password" // 👈 Adapte la route si besoin
              className="text-xs font-bold text-ui-brand hover:underline transition-all"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        {/* CHAMP CHECKBOX (Nécessite le composant Controller de RHF) */}
        <div className="flex items-center gap-2 mb-8">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
                className="data-checked:bg-ui-brand data-checked:border-0"
              />
            )}
          />
          {/* Label cliquable relié à la checkbox */}
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <label
                className="text-sm font-medium ext-ui-text cursor-pointer"
                onClick={() => {
                  if (!isLoading) {
                    field.onChange(!field.value);
                  }
                }}
              >
                Se souvenir de moi
              </label>
            )}
          />
        </div>

        {/* BOUTON SOUMISSION */}
        <Button
          type="submit"
          className="w-full justify-center primary-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner className="size-4 text-white" />
              Connexion en cours
            </span>
          ) : (
            "Connexion"
          )}
        </Button>
      </form>

      <div className="mt-10">
        <p className="text-center text-sm text-ui-textSubtle mb-8">
          {"Vous n'avez pas de compte ? "}{" "}
          <Link
            href="/fr/register"
            className="text-ui-brand font-bold hover:underline"
          >
            {"Créer un compte"}
          </Link>
        </p>

        <Button
          onClick={() => {}}
          disabled
          className="text-sm font-medium bg-white hover:bg-white border border-ui-border text-ui-textSubtle"
        >
          Français
        </Button>
      </div>
    </div>
  );
};
