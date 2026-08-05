"use client";

import {
  TableHead,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  FileBadge2,
  PenTool,
  Eye,
  Sparkles,
  Download,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActionBtn } from "./ActionBtn";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { AnimatePresence } from "motion/react";
import { GroupedContractsActions } from "../GroupedContractsActions";
import { EContractsListTabs } from "@/src/model/entities";

type TContractType = {
  id: string;
  name: string;
  type: string;
  tier: string;
  status: string;
  class: EContractsListTabs;
  date: string;
  color: string;
};

interface IContractsTable {
  contracts: TContractType[];
  activeTab: EContractsListTabs | string;
  searchQuery: string;
}

export const ContractsTable = ({
  contracts,
  activeTab,
  searchQuery,
}: IContractsTable) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inspectedContractId, setInspectedContractId] = useState<string | null>(
    null,
  );

  const globalCheckBoxRef = useRef<HTMLInputElement | null>(null);

  const inspectedContract = useMemo(() => {
    return contracts.find((c) => c.id === inspectedContractId) || null;
  }, [contracts, inspectedContractId]);

  const filteredContracts = useMemo(() => {
    let result = contracts;

    // Filtrage par Onglet
    if (activeTab === EContractsListTabs.ALL) {
      result = result.filter((c) => c.class !== EContractsListTabs.TEMPLATE);
    } else {
      result = result.filter((c) => c.class === activeTab);
    }

    // Filtrage par Recherche
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.tier.toLowerCase().includes(q),
      );
    }

    return result;
  }, [activeTab, searchQuery, contracts]);

  const handleSelectAll = (value: boolean) => {
    setSelectedIds(value ? filteredContracts.map((c) => c.id) : []);
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isAllSelected =
    filteredContracts.length > 0 &&
    selectedIds.length === filteredContracts.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < filteredContracts.length;

  useEffect(() => {
    if (globalCheckBoxRef.current) {
      globalCheckBoxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table className="w-full text-left border-collapse">
          <TableHeader>
            <TableRow className="bg-slate-50/70 border-b border-slate-200">
              <TableHead className="p-4 pl-6 w-12">
                <Checkbox
                  checked={isAllSelected}
                  ref={globalCheckBoxRef}
                  onCheckedChange={(value) => handleSelectAll(value)}
                  className="w-4 h-4  border-slate-300 rounded cursor-pointer data-checked:bg-ui-brand"
                />
              </TableHead>
              <TableHead className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Nom du document
              </TableHead>
              <TableHead className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Tiers
              </TableHead>
              <TableHead className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Statut
              </TableHead>
              <TableHead className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Échéance
              </TableHead>
              <TableHead className="p-4 pr-6 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                Actions rapides
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContracts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="p-12 text-center text-slate-400 text-sm"
                >
                  Aucun document trouvé dans cette vue.
                </TableCell>
              </TableRow>
            ) : (
              filteredContracts.map((contract) => {
                const isSelected = selectedIds.includes(contract.id);
                const isTemplate =
                  contract.class === EContractsListTabs.TEMPLATE;
                const isTemplateClass = isTemplate
                  ? "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200"
                  : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600";

                return (
                  <TableRow
                    key={contract.id}
                    className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors group text-slate-800 h-16 ${isSelected ? "bg-indigo-50/30" : ""}`}
                  >
                    <TableCell className="p-4 pl-6 align-middle">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSelectOne(contract.id)}
                        className="w-4 h-4  cursor-pointer data-checked:bg-ui-brand"
                      />
                    </TableCell>
                    <TableCell className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-xs transition-colors shrink-0 ${isTemplateClass}`}
                        >
                          {isTemplate ? (
                            <FileBadge2 className="w-5 h-5" />
                          ) : (
                            contract.type.slice(0, 4).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ui-text leading-none">
                            {contract.name}
                          </p>
                          <span className="text-xs text-slate-400 mt-1 block">
                            {isTemplate
                              ? "Matrice globale"
                              : "Rédigé par Adam Dupont"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4 text-sm font-medium text-slate-600 align-middle">
                      {contract.tier}
                    </TableCell>
                    <TableCell className="p-4 align-middle">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${contract.color}`}
                      >
                        {contract.status}
                      </span>
                    </TableCell>
                    <TableCell className="p-4 text-sm text-slate-500 align-middle">
                      {contract.date}
                    </TableCell>

                    <TableCell className="p-4 pr-6 text-right align-middle">
                      {/* Boutons d'action : Visibles uniquement au survol du tableau (premium UI style) */}
                      <div className="flex items-center justify-end">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-sm">
                          {isTemplate ? (
                            <ActionBtn
                              icon={PenTool}
                              title="Éditer le modèle"
                              onClick={() => console.log("Edit template")}
                            />
                          ) : (
                            <>
                              <ActionBtn
                                icon={Eye}
                                title="Inspecter"
                                onClick={() =>
                                  setInspectedContractId(contract.id)
                                }
                              />
                              <ActionBtn
                                icon={Sparkles}
                                title="Analyser IA"
                                onClick={() =>
                                  console.log("AI analyze", contract.id)
                                }
                              />
                            </>
                          )}
                          <ActionBtn
                            icon={Download}
                            title="Télécharger PDF"
                            isNeutral
                            onClick={() => console.log("Download", contract.id)}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Drawer
        direction="right"
        open={!!inspectedContractId}
        onOpenChange={(open) => {
          if (!open) {
            setInspectedContractId(null);
          }
        }}
      >
        <DrawerContent className="w-125 h-full ml-auto rounded-l-2xl">
          <DrawerHeader>
            <DrawerTitle>Inspecteur : {inspectedContract?.name}</DrawerTitle>
            <DrawerDescription>
              Détails et actions pour ce contrat.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4">{/* Tes infos de contrat ici */}</div>
        </DrawerContent>
      </Drawer>

      {/* 4. BARRE D'ACTIONS GROUPÉES (BULK ACTIONS) ANIMÉE */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <GroupedContractsActions selectedIds={selectedIds} />
        )}
      </AnimatePresence>
    </>
  );
};
