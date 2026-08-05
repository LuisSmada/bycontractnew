"use client";

import { Button } from "@/components/ui/button";
import { Clock, Download } from "lucide-react";

export default function DeadlinesPage() {
  return (
    <div
      id="view-deadlines"
      className="p-8 w-full mx-auto space-y-8 flex-1  overflow-y-auto no-scrollbar"
    >
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

      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-4">
        <div className="p-2 bg-rose-100 text-rose-600 rounded-lg shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-rose-900">
            2 Contrats nécessitent une action immédiate
          </h3>
          <p className="text-xs text-rose-700 mt-1">
            Le délai de préavis pour éviter la reconduction automatique expire
            dans moins de 30 jours.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Prochaines Expirations (90 jours)
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex flex-col items-center justify-center shrink-0 border border-rose-200">
                <span className="text-[10px] font-bold uppercase leading-none">
                  Juil
                </span>
                <span className="text-lg font-display font-bold leading-none mt-0.5">
                  30
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Bail Commercial - Locaux Lyon
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  ImmoGroup • Reconduction tacite 3-6-9
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-rose-600">
                  Préavis : 28 jours restants
                </p>
                <p className="text-[10px] text-slate-400">
                  Date limite d opposition : 30 Juin 2026
                </p>
              </div>
              <Button
                onClick={() => {}}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm shadow-rose-600/20"
              >
                Générer Avenant
              </Button>
            </div>
          </div>

          <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex flex-col items-center justify-center shrink-0 border border-amber-200">
                <span className="text-[10px] font-bold uppercase leading-none">
                  Août
                </span>
                <span className="text-lg font-display font-bold leading-none mt-0.5">
                  15
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Licence Logiciel - Salesforce
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Salesforce Inc. • Renouvellement Annuel
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-amber-600">
                  Préavis : 45 jours restants
                </p>
                <p className="text-[10px] text-slate-400">
                  Fin d engagement : 15 Août 2026
                </p>
              </div>
              <Button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-lg transition-colors">
                Inspecter
              </Button>
            </div>
          </div>

          <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors opacity-70">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex flex-col items-center justify-center shrink-0 border border-slate-200">
                <span className="text-[10px] font-bold uppercase leading-none">
                  Sept
                </span>
                <span className="text-lg font-display font-bold leading-none mt-0.5">
                  01
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Prestation Nettoyage - Paris
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  CleanPro Services • Contrat à durée déterminée
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-slate-500">
                  Expirera d elle-même
                </p>
              </div>
              <Button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-lg transition-colors">
                Inspecter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
