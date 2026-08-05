"use client";

import { Button } from "@/components/ui/button";
import { TContractType } from "@/src/model/entities";
import React, { ReactNode } from "react";

type TAlertSeverity = "info" | "warning" | "critical" | "success";

interface IDashboardTask {
  title: string;
  contractType: TContractType;
  description: string;
  alert?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  icon?: ReactNode;
  severity?: TAlertSeverity;
}

const alertSeverityClasses: Record<TAlertSeverity, string> = {
  info: "border-indigo-100 bg-indigo-50 text-indigo-700",
  warning: "border-amber-100 bg-amber-50 text-amber-700",
  critical: "border-rose-100 bg-rose-50 text-rose-700",
  success: "border-emerald-100 bg-emerald-50 text-emerald-700",
};

export const DashboardTask = ({
  title,
  contractType,
  description,
  alert,
  severity = "info",
  onPrimaryAction,
  onSecondaryAction,
  primaryActionLabel,
  secondaryActionLabel,
  icon,
}: IDashboardTask) => {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 p-4 transition-all-custom hover:border-indigo-100 hover:bg-indigo-50/10 sm:flex-row sm:items-center">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
          {icon ?? contractType}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>

            {alert && (
              <span
                className={`
                  rounded-md border px-1.5 py-0.5 text-[9px] font-semibold
                  ${alertSeverityClasses[severity]}
                `}
              >
                {alert}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {onPrimaryAction && (
          <Button
            type="button"
            onClick={onPrimaryAction}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-all-custom hover:bg-indigo-100"
          >
            {primaryActionLabel}
          </Button>
        )}

        {onSecondaryAction && (
          <Button
            type="button"
            onClick={onSecondaryAction}
            className="cursor-pointer rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-all-custom hover:bg-slate-800"
          >
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
