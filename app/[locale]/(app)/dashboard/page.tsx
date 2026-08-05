"use client";

import { useAppSelector } from "@/src/store/reduxHooks";
import { currentUserSelector } from "@/src/store/selectors";
import { CircleCheck, Euro, Pencil, TriangleAlert } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { DashboardTask } from "./DashboardTask";
import { DashboardStatusChart } from "./DashboardStatusChart";

export default function DashboardPage() {
  const currentUser = useAppSelector(currentUserSelector);

  const countTasks = 3;

  return (
    <div className="p-8 w-full mx-auto space-y-8 flex-1 pb-32 overflow-y-auto no-scrollbar ">
      {/* max-w-7xl */}
      {/* FIRST LINE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display text-slate-950 flex items-center gap-2">
            Ravi de vous revoir, {currentUser.firstName} !
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Vous avez{" "}
            <span
              id="dashboard-task-counter"
              className="text-indigo-600 font-semibold underline"
            >
              {countTasks} tâches critiques
            </span>{" "}
            à accomplir aujourd hui.
          </p>
        </div>
        {/* <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              PROD ENVIRONMENT
            </span>
          </div> */}
      </div>

      {/* STATS ZONE */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title={"Contrats actifs"}
          Icon={CircleCheck}
          textColor={"text-emerald-600"}
          bgColor={"bg-emerald-50/80"}
          statsNumber={"3"}
          statsDescription={"+12%"}
        />

        <DashboardCard
          title={"Signatures en attente"}
          Icon={Pencil}
          textColor={"text-amber-600"}
          bgColor={"bg-amber-50"}
          statsNumber={"2"}
          statsDescription={"Action(s) requise(s)"}
        />

        <DashboardCard
          title={"Échéances critiques (<30j)"}
          Icon={TriangleAlert}
          textColor={"text-rose-600"}
          bgColor={"bg-rose-50"}
          statsNumber={"1"}
          statsDescription={"À renouveler"}
        />

        <DashboardCard
          title={"Valeur du portefeuille"}
          Icon={Euro}
          textColor={"text-indigo-600"}
          bgColor={"bg-indigo-50/80"}
          statsNumber={"3.5M€"}
          statsDescription={"+8.1%"}
        />
      </div>

      {/* DECISIONAL WORKFLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        {/* <!-- VOLET DE TRAITEMENT DES ALERTES OPÉRATIONNELLES (ACTION ZONE - 2/3 WIDTH) --> */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col  space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-950 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                Centre de Traitement Urgent
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Actions directes et urgentes recommandées par l analyse
                sémantique.
              </p>
            </div>
            <span
              id="urgent-count-badge"
              className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-medium"
            >
              {countTasks} Tâches actives
            </span>
          </div>

          <div id="urgent-tasks-container" className="space-y-4 ">
            {/* <!-- Dynamically populated from JS state to allow status changes! --> */}
            <DashboardTask
              contractType="CDI"
              title="Corriger CDI Sophie Dubois"
              alert="Clause de non-concurrence non conforme"
              description="Cliquez sur Inspecter pour ouvrir l’inspecteur légal assisté par IA."
              onPrimaryAction={() => {
                console.log("Correction via IA");
              }}
              onSecondaryAction={() => {
                console.log("Ouverture de l’inspecteur");
              }}
              primaryActionLabel="Corriger via IA"
              secondaryActionLabel="Inspecter"
            />

            <DashboardTask
              contractType="BAIL"
              title="Négocier Bail Commercial Lyon"
              alert="Clause de non-concurrence non conforme"
              severity="critical"
              description="Cliquez sur Inspecter pour ouvrir l’inspecteur légal assisté par IA."
              primaryActionLabel="Donner congés"
              secondaryActionLabel="Inspecter"
              onPrimaryAction={() => console.log("Donner congé")}
              onSecondaryAction={() => console.log("Inspecter")}
            />

            <DashboardTask
              contractType="NDA"
              title="Contresigner NDA Stripe"
              alert="Clause de non-concurrence non conforme"
              severity="warning"
              description="Cliquez sur Inspecter pour ouvrir l’inspecteur légal assisté par IA."
              primaryActionLabel="Signer en 1-clic"
              secondaryActionLabel="Inspecter"
              onPrimaryAction={() => console.log("Signer")}
              onSecondaryAction={() => console.log("Inspecter")}
            />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-md font-bold font-display text-slate-950">
                Statuts globaux
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Synthèse en temps réel.
              </p>
            </div>

            <div className="relative flex items-center justify-center my-6">
              <DashboardStatusChart signed={50} pending={33} risk={17} />

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  id="donut-total"
                  className="text-xl font-bold font-display text-slate-900"
                >
                  6
                </span>
                <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider">
                  contrats
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-50">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-medium text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Signés (<span id="legend-signed-pct">50</span>%)
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-medium text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  En attente (<span id="legend-pending-pct">33</span>%)
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-medium text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Alertes/Risques (<span id="legend-risk-pct">17</span>%)
                </div>
              </div>
            </div>
          </div>

          {/* <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-md font-bold font-display text-slate-950">
              Historique d audit
            </h2>
            <div
              id="audit-logs"
              className="space-y-4 text-xs max-h-40 overflow-y-auto no-scrollbar"
            >
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-800">16h37 :</span>
                  Ouverture de l inspecteur pour : Bail Commercial - Locaux Lyon
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-800">11h50 : </span>
                  Ouverture de l inspecteur pour : Bail Commercial - Locaux Lyon
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-800">10h30 :</span>L
                  Assistant IA a identifié un conflit de clause dans le CDI de
                  Sophie Dubois.
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
