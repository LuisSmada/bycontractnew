"use client";

import { useState } from "react";
import { User, CreditCard, Users, Blocks } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileSection } from "./ProfileSection";
import { BillingSection } from "./BillingSection";
import { useAppSelector } from "@/src/store/reduxHooks";
import { currentUserSelector } from "@/src/store/selectors";

// Configuration du menu pour l'évolutivité
const SETTINGS_MENU = [
  { id: "profile", label: "Profil & Sécurité", icon: User },
  { id: "billing", label: "Abonnement & Facturation", icon: CreditCard },
  { id: "team", label: "Membres de l'équipe", icon: Users },
  { id: "integrations", label: "Intégrations (API/CRM)", icon: Blocks },
] as const;

type SettingsTab = (typeof SETTINGS_MENU)[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const currentUser = useAppSelector(currentUserSelector);

  return (
    <div
      id="view-settings"
      className="p-8 w-full mx-auto space-y-8 flex-1 overflow-y-auto no-scrollbar"
    >
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-display text-slate-950">
          {"Paramètres de l'Organisation"}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gérez votre profil, vos collaborateurs et votre facturation SaaS.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* MENU LATÉRAL (Sidebar) */}
          <div className="md:col-span-1 space-y-1">
            {SETTINGS_MENU.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left",
                  activeTab === item.id
                    ? "bg-indigo-50 text-ui-brand" // Onglet Actif
                    : "text-slate-600 bg-transparent hover:bg-slate-100", // Onglet Inactif
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4",
                    activeTab === item.id ? "text-ui-brand" : "text-slate-400",
                  )}
                />
                {item.label}
              </button>
            ))}
          </div>

          {/* CONTENU DYNAMIQUE (Zone de droite) */}
          <div className="md:col-span-3 space-y-8">
            {activeTab === "profile" && (
              <ProfileSection currentUser={currentUser} />
            )}
            {activeTab === "billing" && <BillingSection />}

            {/* Zones prévues pour plus tard */}
            {activeTab === "team" && (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-500">
                {"Gestion de l'équipe à venir..."}
              </div>
            )}
            {activeTab === "integrations" && (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-500">
                Intégrations à venir...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
