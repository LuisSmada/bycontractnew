"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

import { operationError, operationSuccess } from "@/src/utils/operationsToasts";
import { responseErrorApi } from "@/src/utils/responseErrorApi";
import { useResetPasswordMutation } from "@/src/store/api/authApiSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/custom/PasswordInput";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!token) {
      operationError("Lien de réinitialisation invalide ou expiré.");
      return;
    }

    try {
      await resetPassword({ token, newPassword: data.newPassword }).unwrap();
      operationSuccess("Votre mot de passe a été modifié avec succès.");
      router.push("/fr/login");
    } catch (err) {
      responseErrorApi(err);
      operationError(
        "Le lien est invalide ou a expiré. Veuillez refaire une demande.",
      );
    }
  };

  const getErrorClass = (hasError: boolean) =>
    hasError ? "border-red-500 focus-visible:ring-red-500" : "";

  return (
    <div className="flex w-full h-full flex-col px-8 py-12 md:px-16 md:py-10 justify-center relative overflow-y-auto custom-scrollbar ">
      <div className="mb-10">
        <Image
          src={"/svg/BYC.svg"}
          alt="Logo Miniaturized"
          className="w-24"
          width={96}
          height={96}
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-ui-text mb-2">
          Nouveau mot de passe
        </h1>
        <p className="text-sm text-ui-textSubtle font-medium mb-8">
          Veuillez choisir un nouveau mot de passe sécurisé pour votre compte.
        </p>

        <div className="flex flex-col mb-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-ui-text mb-1">
              Nouveau mot de passe
            </Label>
            {errors.newPassword && (
              <span className="text-[10px] text-red-500 mt-1">
                {errors.newPassword.message}
              </span>
            )}
          </div>
          <PasswordInput
            className={cn(
              "input-form focus-visible:ring-transparent",
              getErrorClass(!!errors.newPassword),
            )}
            disabled={isLoading}
            {...register("newPassword")}
          />
        </div>

        <div className="flex flex-col mb-8">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-ui-text mb-1">
              Confirmer le mot de passe
            </Label>
            {errors.confirmPassword && (
              <span className="text-[10px] text-red-500 mt-1">
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

        <Button
          type="submit"
          className="w-full justify-center primary-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner className="size-4 text-white" />
              Modification en cours...
            </span>
          ) : (
            "Enregistrer le nouveau mot de passe"
          )}
        </Button>
      </form>
    </div>
  );
};
