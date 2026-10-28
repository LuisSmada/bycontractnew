"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { PasswordInput } from "@/components/custom/PasswordInput";
import { operationSuccess, operationError } from "@/src/utils/operationsToasts";
import { useRegisterUserMutation } from "@/src/store/api/authApiSlice";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Remplir le prénom."),
    lastName: z.string().min(2, "Remplir le nom."),
    email: z.email("Adresse email invalide."),
    password: z.string().min(8, "Doit contenir au moins 8 caractères."),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Differents.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      }).unwrap();

      operationSuccess("Compte créé avec succès ! Bienvenue.");
      router.push("/fr/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      operationError(
        "Impossible de créer le compte. L'email est peut-être déjà utilisé.",
      );
    }
  };

  const onInvalid = () => {
    operationError("Veuillez vérifier les champs du formulaire.");
  };

  const getErrorClass = (hasError: boolean) =>
    hasError ? "border-red-500 focus-visible:ring-red-500" : "";

  return (
    <div className="flex w-full h-full flex-col px-8 py-12 md:px-16 md:py-10 justify-center relative overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <Image
          src={"/svg/BYC.svg"}
          alt="Logo Miniaturized"
          className="w-24"
          width={96}
          height={96}
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="flex flex-col w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-ui-text mb-2">
          Créer un compte
        </h1>
        <p className="text-sm text-ui-textSubtle font-medium mb-8">
          Rejoignez BYCONTRACT en quelques secondes
        </p>

        {/* PRÉNOM & NOM (Sur une même ligne) */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-ui-text mb-1">
                Prénom
              </Label>
            </div>
            <Input
              type="text"
              className={cn(
                "input-form focus-visible:ring-transparent",
                getErrorClass(!!errors.firstName),
              )}
              disabled={isLoading}
              {...register("firstName")}
            />
            {errors.firstName && (
              <span className="text-xs text-red-500 mt-1">
                {errors.firstName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-ui-text mb-1">
                Nom
              </Label>
            </div>
            <Input
              type="text"
              className={cn(
                "input-form focus-visible:ring-transparent",
                getErrorClass(!!errors.lastName),
              )}
              disabled={isLoading}
              {...register("lastName")}
            />
            {errors.lastName && (
              <span className="text-xs text-red-500 mt-1">
                {errors.lastName.message}
              </span>
            )}
          </div>
        </div>

        {/* EMAIL */}
        <div className="flex flex-col mb-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-ui-text mb-1">
              Adresse Email
            </Label>
            {errors.email && (
              <span className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </span>
            )}
          </div>
          <Input
            type="email"
            className={cn(
              "input-form focus-visible:ring-transparent",
              getErrorClass(!!errors.email),
            )}
            disabled={isLoading}
            {...register("email")}
          />
        </div>

        {/* MOT DE PASSE */}
        <div className="flex flex-col mb-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-ui-text mb-1">
              Mot de passe
            </Label>
            {errors.password && (
              <span className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </span>
            )}
          </div>
          <PasswordInput
            className={cn(
              "input-form focus-visible:ring-transparent",
              getErrorClass(!!errors.password),
            )}
            disabled={isLoading}
            {...register("password")}
          />
        </div>

        {/* CONFIRMATION MOT DE PASSE */}
        <div className="flex flex-col mb-6">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-ui-text mb-1">
              Confirmer le mot de passe
            </Label>
            {errors.confirmPassword && (
              <span className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <PasswordInput
            className={cn(
              "input-form focus-visible:ring-transparent",
              getErrorClass(!!errors.confirmPassword),
            )}
            disabled={isLoading}
            {...register("confirmPassword")}
          />
        </div>

        {/* CGU CHECKBOX */}
        <div className="flex flex-col mb-8">
          <div className="flex items-center gap-2">
            <Controller
              name="acceptTerms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                  className={cn(
                    "data-checked:bg-ui-brand data-checked:border-0",
                    errors.acceptTerms && "border-red-500",
                  )}
                />
              )}
            />
            <Controller
              name="acceptTerms"
              control={control}
              render={({ field }) => (
                <label
                  className="text-sm font-medium text-ui-text cursor-pointer select-none"
                  onClick={() => {
                    if (!isLoading) field.onChange(!field.value);
                  }}
                >
                  {"J'accepte les conditions d'utilisation"}
                </label>
              )}
            />
          </div>
          {errors.acceptTerms && (
            <span className="text-xs text-red-500 mt-1">
              {errors.acceptTerms.message}
            </span>
          )}
        </div>

        {/* BOUTON SOUMISSION */}
        <Button
          type="submit"
          className="w-full justify-center primary-button mb-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner className="size-4 text-white" />
              Création en cours
            </span>
          ) : (
            "Créer mon compte"
          )}
        </Button>

        {/* LIEN RETOUR CONNEXION */}
        <p className="text-center text-sm text-ui-textSubtle">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/fr/login" // À adapter avec ta vraie route
            className="text-ui-brand font-bold hover:underline"
          >
            Connectez-vous
          </Link>
        </p>
      </form>

      <div className="mt-10">
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
