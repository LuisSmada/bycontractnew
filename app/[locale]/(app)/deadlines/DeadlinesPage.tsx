"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  Download,
  MoreVertical,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Building2,
} from "lucide-react";

// --- TYPES & MOCK DATA (À remplacer par tes données API) ---
type TDeadlineType = "ALL" | "RENEWAL" | "EXPIRATION" | "RENEGOTIATION";
type TFinancialImpact = "INCOME" | "EXPENSE" | "NEUTRAL";

interface IDeadline {
  id: string;
  type: TDeadlineType;
  impact: TFinancialImpact;
  date: { month: string; day: string };
  title: string;
  stakeholder: string;
  subtitle: string;
  warningText: string;
  deadlineText: string;
  status: "URGENT" | "WARNING" | "INFO";
  primaryAction: string;
}

const mockDeadlines: IDeadline[] = [
  {
    id: "1",
    type: "RENEWAL",
    impact: "EXPENSE",
    date: { month: "Juil", day: "30" },
    title: "Bail Commercial - Locaux Lyon",
    stakeholder: "ImmoGroup",
    subtitle: "Reconduction tacite 3-6-9",
    warningText: "Préavis : 28 jours restants",
    deadlineText: "Date limite d'opposition : 30 Juin 2026",
    status: "URGENT",
    primaryAction: "Générer Avenant",
  },
  {
    id: "2",
    type: "RENEWAL",
    impact: "EXPENSE",
    date: { month: "Août", day: "15" },
    title: "Licence Logiciel - Salesforce",
    stakeholder: "Salesforce Inc.",
    subtitle: "Renouvellement Annuel",
    warningText: "Préavis : 45 jours restants",
    deadlineText: "Fin d'engagement : 15 Août 2026",
    status: "WARNING",
    primaryAction: "Inspecter",
  },
  {
    id: "3",
    type: "EXPIRATION",
    impact: "INCOME",
    date: { month: "Sept", day: "01" },
    title: "Prestation Développement React",
    stakeholder: "TechCorp SA",
    subtitle: "Contrat à durée déterminée",
    warningText: "Expirera d'elle-même",
    deadlineText: "Fin de prestation : 01 Sept 2026",
    status: "INFO",
    primaryAction: "Proposer Renouvellement",
  },
];

const TABS: { id: TDeadlineType; label: string }[] = [
  { id: "ALL", label: "Toutes les échéances" },
  { id: "RENEWAL", label: "Reconduction Tacite" },
  { id: "EXPIRATION", label: "Expiration" },
  { id: "RENEGOTIATION", label: "Renégociation" },
];

export const DeadlinesPage = () => {
  const [activeTab, setActiveTab] = useState<TDeadlineType>("ALL");

  // Filtrage dynamique
  const filteredDeadlines = mockDeadlines.filter(
    (d) => activeTab === "ALL" || d.type === activeTab,
  );

  return (
    <div
      id="view-deadlines"
      className="p-8 w-full mx-auto space-y-8 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display text-slate-950">
            Calendrier des Échéances
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Anticipez les renouvellements tacites et la fin de vos engagements.
          </p>
        </div>
        <Button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" />
          Exporter (CSV)
        </Button>
      </div>

      {/* ALERTE URGENTE */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-4">
        <div className="p-2 bg-rose-100 text-rose-600 rounded-lg shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-rose-900">
            1 Contrat nécessite une action immédiate
          </h3>
          <p className="text-xs text-rose-700 mt-1">
            Le délai de préavis pour éviter la reconduction automatique expire
            dans moins de 30 jours.
          </p>
        </div>
      </div>

      {/* FILTRES (ONGLETS) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LISTE DES ÉCHÉANCES */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Prochaines Expirations (90 jours)
          </h3>
          <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
            {filteredDeadlines.length} résultat(s)
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredDeadlines.map((deadline) => (
            <div
              key={deadline.id}
              className={`p-5 flex items-center justify-between transition-colors hover:bg-slate-50/80 ${
                deadline.status === "INFO" ? "opacity-75 hover:opacity-100" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {/* CALENDRIER ICONE */}
                <div
                  className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
                    deadline.status === "URGENT"
                      ? "bg-rose-100 text-rose-600 border-rose-200"
                      : deadline.status === "WARNING"
                        ? "bg-amber-100 text-amber-700 border-amber-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase leading-none">
                    {deadline.date.month}
                  </span>
                  <span className="text-lg font-display font-bold leading-none mt-0.5">
                    {deadline.date.day}
                  </span>
                </div>

                {/* INFOS CONTRAT */}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      {deadline.title}
                    </h4>
                    {/* BADGE IMPACT FINANCIER */}
                    {deadline.impact === "INCOME" && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                        <TrendingUp className="w-3 h-3" /> Revenu
                      </span>
                    )}
                    {deadline.impact === "EXPENSE" && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100">
                        <TrendingDown className="w-3 h-3" /> Dépense
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-slate-700 font-semibold hover:text-indigo-600 cursor-pointer transition-colors">
                      <Building2 className="w-3 h-3" />
                      {deadline.stakeholder}
                    </span>
                    <span className="text-slate-300">•</span>
                    {deadline.subtitle}
                  </p>
                </div>
              </div>

              {/* ACTIONS & DÉLAIS */}
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p
                    className={`text-xs font-bold ${
                      deadline.status === "URGENT"
                        ? "text-rose-600"
                        : deadline.status === "WARNING"
                          ? "text-amber-600"
                          : "text-slate-500"
                    }`}
                  >
                    {deadline.warningText}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {deadline.deadlineText}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* BOUTON D'ACTION PRINCIPALE */}
                  <Button
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-sm ${
                      deadline.status === "URGENT"
                        ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {deadline.primaryAction}
                  </Button>

                  {/* MENU D'ACTIONS SECONDAIRES */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-8 h-8 p-0 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
                      <MoreVertical className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 rounded-xl"
                    >
                      <DropdownMenuItem className="text-xs font-medium cursor-pointer">
                        Ouvrir le contrat
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs font-medium cursor-pointer">
                        Voir la fiche tiers
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-xs font-bold text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Marquer comme géré
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
