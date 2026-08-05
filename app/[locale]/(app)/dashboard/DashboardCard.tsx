"use client";

import { ElementType } from "react";

interface IDashboardCard {
  title: string;
  Icon: ElementType;
  textColor: string;
  bgColor: string;
  statsNumber: string;
  statsDescription: string;
}

export const DashboardCard = ({
  title,
  Icon,
  textColor,
  bgColor,
  statsNumber,
  statsDescription,
}: IDashboardCard) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-slate-200 hover:shadow-md transition-all-custom">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {title}
        </span>
        <div
          className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center ${textColor}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="my-4 flex items-baseline gap-2">
        <span
          id="kpi-active"
          className={`text-3xl font-bold font-display ${textColor === "text-emerald-600" || textColor === "text-indigo-600" ? "text-slate-900" : textColor}`}
        >
          {statsNumber}
        </span>
        <span
          className={`text-xs font-bold ${textColor} ${bgColor} flex items-center gap-0.5`}
        >
          {statsDescription}
        </span>
      </div>
      {/* <div className="flex items-center justify-between border-t border-slate-50 pt-3">
        <span className="text-xs text-slate-400">Tendance 30 jours</span>
        <svg
          className="w-16 h-6 text-emerald-500"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 64 24"
        >
          <path d="M0,18 Q16,8 32,15 T64,4" stroke-linecap="round" />
        </svg>
      </div> */}

      {/* <div className="flex items-center justify-between border-t border-slate-50 pt-3">
            <span className="text-xs text-slate-400">
              Risque de tacite reconduction
            </span>
          </div> */}

      {/* <div className="flex items-center justify-between border-t border-slate-50 pt-3">
        <span className="text-xs text-slate-400">Temps moyen : 4.2h</span>
      </div> */}
    </div>
  );
};
