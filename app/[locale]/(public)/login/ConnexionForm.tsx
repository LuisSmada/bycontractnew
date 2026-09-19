"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { PasswordInput } from "@/components/custom/PasswordInput";
import { useLoginMutation } from "@/src/store/api/authApiSlice";
import { TOASTSTYLES } from "@/src/utils/toastsCSSUtils";

export const ConnexionForm = () => {
  const [userLogin, setUserLogin] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const router = useRouter();

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!userLogin || !userPassword) {
      toast.error("Complete all the fields");
      return;
    }

    try {
      // On utilise .unwrap() pour pouvoir capturer l'erreur directement dans le catch
      await login({
        email: userLogin,
        password: userPassword,
      }).unwrap();

      toast.success("Login successfully", {
        position: "top-right",
        style: TOASTSTYLES.SUCCESS,
      });
      router.push("/fr/dashboard");
    } catch (err: unknown) {
      // 1. On remplace 'any' par 'unknown' (le standard TS)

      // 2. On "cast" l'erreur pour dire à TS : "Fais-moi confiance, c'est une erreur API"
      const error = err as FetchBaseQueryError;
      if (error?.status === 401 || error?.status === 403) {
        toast.error("Identifiants incorrects. Veuillez réessayer.", {
          position: "top-right",
          style: TOASTSTYLES.ERROR,
        });
      } else {
        toast.error(
          "Une erreur est survenue lors de la connexion au serveur.",
          { position: "top-right", style: TOASTSTYLES.ERROR },
        );
      }
    }
  };

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

      <form onSubmit={handleLogin} className="flex flex-col w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenue sur la plateforme BYCONTRACT
        </h1>
        <p className="text-sm text-gray-500 font-medium mb-8">
          Connectez-vous pour continuer
        </p>

        <div className="flex flex-col mb-4">
          <label className="text-sm font-medium text-gray-900 mb-1">
            {"Email ou Nom d'utilisateur"}
          </label>
          <Input
            className="input-form"
            type="text"
            value={userLogin}
            onChange={(e) => setUserLogin(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col mb-6">
          <label className="text-sm font-medium text-gray-900 mb-1">
            Mot de passe
          </label>
          <PasswordInput
            className="input-form"
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-2 mb-8">
          <Checkbox
            checked={isChecked}
            onCheckedChange={setIsChecked}
            className={"data-checked:bg-ui-brand"}
          />
          <label
            className="text-sm font-medium text-gray-700 cursor-pointer"
            onClick={() => setIsChecked(!isChecked)}
          >
            Se rappeler moi
          </label>
        </div>

        <Button
          type="submit"
          className="w-full justify-center primary-button"
          disabled={isLoading}
        >
          {isLoading ? "Connexion en cours" : "Connexion"}
        </Button>
      </form>

      <div className="mt-10">
        <Button
          onClick={() => {}}
          className="text-sm font-medium  bg-white hover:bg-white  border border-ui-border text-ui-textSubtle cursor-pointer"
        >
          Français
        </Button>
      </div>
    </div>
  );
};
