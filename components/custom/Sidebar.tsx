"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users2,
  Sparkles,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Utilitaire de fusion de classes standard Shadcn
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const entries = [
    {
      id: "home",
      name: "Accueil",
      path: "/fr/dashboard",
      icon: LayoutDashboard,
      tooltip: "Tableau de bord décisionnel",
    },
    {
      id: "contracts",
      name: "Contrats",
      path: "/fr/contracts",
      icon: FileText,
      tooltip: "Contrathèque",
    },
    // {
    //   id: "sign",
    //   name: "Signer",
    //   path: "/fr/signatures",
    //   icon: PenTool,
    //   tooltip: "2 signatures en attente",
    //   badge: 2,
    // },
    {
      id: "delay",
      name: "Échéances",
      path: "/fr/deadlines",
      icon: Calendar,
      tooltip: "Suivi des risques d'expirations",
    },
    {
      id: "contacts",
      name: "Parties",
      path: "/fr/stakeholders",
      icon: Users2,
      tooltip: "Annuaire des co-signataires et clients",
    },
    {
      id: "copilot",
      name: "Copilot",
      path: "",
      icon: Sparkles,
      tooltip: "Assistant IA BYCONTRACT",
      isAi: true,
    },
  ];

  return (
    <div className="fixed top-14 bottom-0 left-0 z-30 w-20 bg-[#0a0e1a] border-r border-slate-950 flex flex-col justify-between md:flex shadow-2xl">
      <div className="p-2 py-4 flex flex-col items-center space-y-5 w-full">
        <div className="text-center text-[9px] font-extrabold text-slate-600 uppercase tracking-widest mb-1">
          Espaces
        </div>

        {entries.map((entry) => {
          const Icon = entry.icon;
          const isActive = pathname === entry.path;

          console.log(pathname);

          return (
            <div key={entry.id} className="relative group/tooltip w-full">
              <Tooltip>
                <TooltipTrigger
                  onClick={() => router.push(entry.path)}
                  className={cn(
                    "w-full flex flex-col items-center justify-center gap-1.5 p-3 h-auto rounded-xl transition-all duration-200 text-center cursor-pointer relative",
                    isActive
                      ? "bg-ui-brand text-white shadow-lg shadow-indigo-600/15 hover:bg-ui-brand"
                      : "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive
                        ? "text-indigo-200"
                        : "text-slate-400 group-hover:text-slate-200",
                    )}
                  />

                  <span className="text-[10px] font-medium tracking-wide leading-none">
                    {entry.name}
                  </span>

                  {/* {entry.badge && (
                    <span className="absolute top-1.5 right-1.5 bg-amber-500 text-[#0a0e1a] text-[8px] font-extrabold px-1 rounded border border-[#0a0e1a]">
                      {entry.badge}
                    </span>
                  )} */}
                </TooltipTrigger>

                <TooltipContent
                  side="right"
                  className={
                    "bg-slate-900 text-white text-xs px-2.5 py-1.5 left-5"
                  }
                >
                  {entry.tooltip}
                </TooltipContent>

                {/* <div className="absolute left-24 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50 border border-slate-800">
                
              </div> */}
              </Tooltip>
            </div>
          );
        })}
      </div>

      {/* Bouton réglages en bas de page */}
      <div className="p-2 border-t border-slate-900 w-full">
        <div className="relative group/tooltip w-full">
          <Button
            onClick={() => router.push("/dashboard/settings")}
            className="w-full flex flex-col items-center justify-center gap-1 p-2.5 h-auto bg-transparent text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            <span className="text-[10px] font-medium tracking-wide">
              Réglages
            </span>
          </Button>
          <div className="absolute left-24 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50 border border-slate-800">
            Configuration générale
          </div>
        </div>
      </div>
    </div>
  );
};
