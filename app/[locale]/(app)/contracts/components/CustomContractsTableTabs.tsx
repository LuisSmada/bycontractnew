import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  EContractsListTabs,
  EContractStatus,
  ETemplateListTabs,
  TTableDocumentType,
} from "@/src/model/entities";
import { Search, Filter } from "lucide-react";
import { motion } from "motion/react";
import React, { useMemo } from "react";

interface ICustomContractsTableTabs {
  documents: TTableDocumentType[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  activeTab: EContractsListTabs | ETemplateListTabs | string;
  setActiveTab: (
    activeTab: EContractsListTabs | ETemplateListTabs | string,
  ) => void;
  setSelectedIds: (ids: string[]) => void;
  setCurrentPage: (value: number) => void;
  isForTemplates: boolean;
}

export const CustomContractsTableTabs = ({
  documents,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  setSelectedIds,
  setCurrentPage,
  isForTemplates,
}: ICustomContractsTableTabs) => {
  const counts = useMemo(() => {
    if (!isForTemplates) {
      return {
        [EContractsListTabs.ALL]: documents.length,
        [EContractsListTabs.ACTIVE]: documents.filter(
          (c) =>
            c.status === EContractStatus.ACTIVE ||
            c.status === EContractStatus.SIGNED,
        ).length,
        [EContractsListTabs.PENDING]: documents.filter(
          (c) => c.status === EContractStatus.PENDING,
        ).length,
        [EContractsListTabs.RISK]: documents.filter(
          (c) => c.status === EContractStatus.RISKED,
        ).length,
        // [EContractsListTabs.TEMPLATE]: documents.filter(
        //   (c) => c.class === EContractsListTabs.TEMPLATE,
        // ).length,
        [EContractsListTabs.DRAFT]: documents.filter(
          (c) => c.status === EContractStatus.DRAFT,
        ).length,
        [EContractsListTabs.ARCHIVED]: documents.filter(
          (c) =>
            c.status === EContractStatus.EXPIRED ||
            c.status === EContractStatus.TERMINATED,
        ).length,
      };
    } else {
      //FOR TEMPLATES
      return {
        [EContractsListTabs.ALL]: documents.length,
        [EContractsListTabs.ACTIVE]: documents.filter(
          (c) => c.status === EContractStatus.ACTIVE,
        ).length,
        [EContractsListTabs.DRAFT]: documents.filter(
          (c) => c.status === EContractStatus.DRAFT,
        ).length,
        [EContractsListTabs.ARCHIVED]: documents.filter(
          (c) => c.status === "EXPIRED" || c.status === "TERMINATED",
        ).length,
      };
    }
  }, [documents, isForTemplates]);

  const CONTRACTS_TABS = [
    {
      id: EContractsListTabs.ALL,
      label: "Tous",
      count: counts[EContractsListTabs.ALL],
      color: "text-ui-brand",
      badgeClass: "bg-indigo-50 text-ui-brand",
    },
    {
      id: EContractsListTabs.ACTIVE,
      label: "Actifs",
      count: counts[EContractsListTabs.ACTIVE],
      color: "text-emerald-700",
      badgeClass: "bg-emerald-100 text-emerald-700",
    },
    {
      id: EContractsListTabs.PENDING,
      label: "En attente",
      count: counts[EContractsListTabs.PENDING],
      color: "text-amber-700",
      badgeClass: "bg-amber-100 text-amber-700",
    },
    {
      id: EContractsListTabs.RISK,
      label: "Risques",
      count: counts[EContractsListTabs.RISK],
      color: "text-rose-700",
      badgeClass: "bg-rose-100 text-rose-700",
    },
    {
      id: EContractsListTabs.DRAFT,
      label: "Brouillons",
      count: counts[EContractsListTabs.DRAFT],
      color: "text-indigo-700",
      badgeClass: "bg-indigo-100 text-indigo-700",
    },
    { id: "separator", isSeparator: true },
    {
      id: EContractsListTabs.ARCHIVED, // Ou ETemplateListTabs.ARCHIVED pour la page Modèles
      label: "Archivés",
      count: counts[EContractsListTabs.ARCHIVED],
      color: "text-slate-700",
      badgeClass: "bg-slate-200 text-slate-700", // Le bg-slate-200 offre un meilleur contraste ici
    },
    // {
    //   id: EContractsListTabs.TEMPLATE,
    //   label: "Modèles",
    //   count: counts[EContractsListTabs.TEMPLATE],
    //   color: "text-indigo-700",
    //   badgeClass: "bg-indigo-100 text-indigo-700",
    // },
  ];

  const TEMPLATES_TABS = [
    {
      id: EContractsListTabs.ALL,
      label: "Tous",
      count: counts[EContractsListTabs.ALL],
      color: "text-ui-brand",
      badgeClass: "bg-indigo-50 text-ui-brand",
    },
    {
      id: EContractsListTabs.ACTIVE,
      label: "Actifs",
      count: counts[EContractsListTabs.ACTIVE],
      color: "text-emerald-700",
      badgeClass: "bg-emerald-100 text-emerald-700",
    },
    {
      id: EContractsListTabs.DRAFT,
      label: "Brouillons",
      count: counts[EContractsListTabs.DRAFT],
      color: "text-indigo-700",
      badgeClass: "bg-indigo-100 text-indigo-700",
    },
    { id: "separator", isSeparator: true },
    {
      id: EContractsListTabs.ARCHIVED, // Ou ETemplateListTabs.ARCHIVED pour la page Modèles
      label: "Archivés",
      count: counts[EContractsListTabs.ARCHIVED],
      color: "text-slate-700",
      badgeClass: "bg-slate-200 text-slate-700", // Le bg-slate-200 offre un meilleur contraste ici
    },
  ];

  const TABS = isForTemplates ? TEMPLATES_TABS : CONTRACTS_TABS;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
      {/* Onglets (Pills animés) */}
      <div className="bg-slate-100/80 p-1 rounded-xl flex items-center gap-1 border border-slate-200/40 self-start">
        {TABS.map((tab, idx) => {
          if (tab.isSeparator) {
            return (
              <div key={`sep-${idx}`} className="w-px h-6 bg-slate-300 mx-1" />
            );
          }

          const isActive = activeTab === tab.id;
          const isTabActiveClass = isActive
            ? `bg-white shadow-sm border border-slate-200/50 ${tab.color} hover:bg-white`
            : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-transparent";

          return (
            <Button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedIds([]);
                setCurrentPage(1);
              }}
              className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${isTabActiveClass}`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded-md text-xs font-semibold ${isActive ? tab.badgeClass : "bg-slate-200/60 text-slate-600"}`}
              >
                {tab.count}
              </span>

              {/* Soulignement animé Framer Motion */}
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className={`absolute -bottom-5.25 left-4 right-4 h-0.5 bg-ui-brand rounded-full `}
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Button>
          );
        })}
      </div>

      {/* Recherche et Filtres */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 pr-4 py-1.5 bg-white rounded-lg text-xs w-48 transition-all input-form"
          />
        </div>
        <Button className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm">
          <Filter className="w-3.5 h-3.5" />
          Filtrer
        </Button>
      </div>
    </div>
  );
};
