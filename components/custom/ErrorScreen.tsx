"use client";

import { AlertTriangle, ArrowLeft, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface IErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showBackButton?: boolean;
}

export const ErrorScreen = ({
  title = "Oups ! Une erreur est survenue",
  message = "Nous n'avons pas pu charger les données. Notre équipe technique travaille à le résoudre. Veuillez réessayer plus tard.",
  onRetry,
  showBackButton = true,
}: IErrorScreenProps) => {
  const router = useRouter();

  return (
    <div className="w-full flex flex-1 items-center justify-center flex-col gap-5 min-h-[60vh] px-6 text-center mt-15">
      <div className="relative">
        <div className="w-24 h-24   rounded-full flex items-center justify-center text-rose-500 relative z-10 ">
          <AlertTriangle className="w-10 h-10" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 max-w-md mt-2">
        <h2 className="font-bold text-2xl font-display text-ui-text">
          {title}
        </h2>
        <p className="text-sm text-ui-textSubtle leading-relaxed">{message}</p>
      </div>

      <div className="flex items-center gap-4 mt-4">
        {showBackButton && (
          <Button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-ui-textSubtle text-slate-600 rounded-xl text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        )}

        {onRetry && (
          <Button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 bg-ui-brand hover:bg-ui-brandHover text-white rounded-xl text-sm font-bold transition-colors "
          >
            <RefreshCcw className="w-4 h-4" />
            Réessayer
          </Button>
        )}
      </div>
    </div>
  );
};
