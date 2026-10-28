"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

import { CheckCircle2, ArrowLeft } from "lucide-react";
import { operationSuccess } from "@/src/utils/operationsToasts";
import { responseErrorApi } from "@/src/utils/responseErrorApi";
import { useForgotPasswordMutation } from "@/src/store/api/authApiSlice";
import { useRouter } from "next/navigation";

const forgotPasswordSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide."),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestReset, { isLoading }] = useForgotPasswordMutation(); // Ton hook API

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      await requestReset({ email: data.email }).unwrap();
      setIsSubmitted(true);
      operationSuccess("Email de réinitialisation envoyé.");
    } catch (err) {
      responseErrorApi(err);
    }
  };

  const getErrorClass = (hasError: boolean) =>
    hasError ? "border-red-500 focus-visible:ring-red-500" : "";

  return (
    <div className="flex w-full h-full flex-col px-8 py-12 md:px-16 md:py-20 justify-center relative">
      <div className="mb-10">
        <Image
          src={"/svg/BYC.svg"}
          alt="Logo Miniaturized"
          className="w-24"
          width={96}
          height={96}
        />
      </div>

      <div className="flex flex-col w-full max-w-sm">
        {isSubmitted ? (
          // ÉTAT DE SUCCÈS
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 text-center space-y-6 bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Consultez vos emails
              </h2>
              <p className="text-sm text-slate-500">
                {
                  "Nous avons envoyé un lien de réinitialisation à l'adresse indiquée. Cliquez sur le lien pour créer un nouveau mot de passe."
                }
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => router.push("/fr/login")}
            >
              {/* <Link href="/fr/login">Retour à la connexion</Link> */}
              Retour à la connexion
            </Button>
          </div>
        ) : (
          // FORMULAIRE DE DEMANDE
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="animate-in fade-in duration-300"
          >
            <h1 className="text-2xl font-bold text-ui-text mb-2">
              Mot de passe oublié ?
            </h1>
            <p className="text-sm text-ui-textSubtle font-medium mb-8">
              {
                "Saisissez l'adresse email associée à votre compte pour recevoir un lien de réinitialisation."
              }
            </p>

            <div className="flex flex-col mb-8">
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
                placeholder="contact@exemple.com"
                className={cn(
                  "input-form focus-visible:ring-transparent",
                  getErrorClass(!!errors.email),
                )}
                disabled={isLoading}
                {...register("email")}
              />
            </div>

            <Button
              type="submit"
              className="w-full justify-center primary-button mb-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner className="size-4 text-white" />
                  Envoi en cours...
                </span>
              ) : (
                "Envoyer le lien"
              )}
            </Button>

            <Link
              // onClick={() => router.push("/fre/")}
              href="/fr/login" // Remplace par ta vraie route de connexion
              className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-ui-brand transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};
