"use client";

import Image from "next/image";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ILoadingScreenProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export const LoadingScreen = ({
  message = "Préparation de votre document...",
  className,
}: ILoadingScreenProps) => {
  return (
    <div
      className={cn(
        "w-full flex flex-1 items-center justify-center flex-col gap-6 min-h-[60vh] mt-15",
        className,
      )}
    >
      <div className="relative w-28 h-28 animate-pulse">
        <Image
          src="/images/BYCONTRACT.png"
          alt="Chargement BYCONTRACT"
          fill
          className="object-contain"
          priority
          width={undefined}
          height={undefined}
        />
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-bold text-xl text-ui-text">Veuillez patienter</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <Spinner className="size-4 text-indigo-600" />
          <span className="text-ui-textSubtle">{message}</span>
        </div>
      </div>
    </div>
  );
};
