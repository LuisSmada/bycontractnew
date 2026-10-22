"use client";

import { ComingSoon } from "@/components/custom/ComingSoon";
import { ErrorScreen } from "@/components/custom/ErrorScreen";
import { LoadingScreen } from "@/components/custom/LoadingScreen";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EContractsListTabs,
  EContractStatus,
  TTableDocumentType,
} from "@/src/model/entities";
import { useGetAllTemplatesQuery } from "@/src/store/api/templatesApiSlice";
import { ITemplateResponse } from "@/src/types/apiResponseType";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileBadge2,
  PenTool,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { act, useEffect, useMemo, useRef, useState } from "react";
import { ActionBtn } from "../contracts/components/ActionBtn";
import { downloadContractPdf } from "../contracts/downloadContractPdf";
import { CreateDocumentDropdown } from "../contracts/components/CreateDocumentDropdown";
import { CustomContractsTableTabs } from "../contracts/components/CustomContractsTableTabs";
import {
  sanitizeDocumentStatus,
  traductContractStatus,
} from "@/src/utils/documentsUtils";

export const TemplatesPage = () => {
  const ITEMS_PER_PAGE = 5;
  const router = useRouter();
  const globalCheckBoxRef = useRef<HTMLInputElement | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<EContractsListTabs | string>(
    EContractsListTabs.ALL,
  );

  const {
    data: templates,
    isLoading: isLoadingTemplates,
    isError: isErrorTemplates,
    refetch: refetchTemplates,
  } = useGetAllTemplatesQuery();

  const mapTemplates = (
    templates: ITemplateResponse[],
  ): TTableDocumentType[] => {
    return templates.map((t) => {
      const day = new Date(t.createdAt).getDay().toString().padStart(2, "0");
      const month = new Date(t.createdAt)
        .getMonth()
        .toString()
        .padStart(2, "0");
      const year = new Date(t.createdAt).getFullYear();
      const { tabClass } = sanitizeDocumentStatus(t.status);
      return {
        id: t.id,
        name: t.name,
        type: "MODÈLE",
        tier: "-",
        status: t.status,
        class: tabClass,
        date: `Créé le ${day}/${month}/${year}`,
        color: "bg-indigo-100 text-indigo-700",
        author: {
          id: t.author.id,
          firstName: t.author.firstName,
          lastName: t.author.lastName,
        },
      };
    });
  };

  const adaptedTemplates = mapTemplates(templates ?? []);

  const filteredTemplates = useMemo(() => {
    let result: TTableDocumentType[] = adaptedTemplates;

    if (activeTab === EContractsListTabs.ALL) {
      result = result;
    } else {
      result = result.filter((t) => t.class === activeTab);
    }

    // Filtrage par Recherche
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }

    return result;
  }, [activeTab, adaptedTemplates, searchQuery]);

  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);

  const handleSelectAll = (value: boolean) => {
    setSelectedIds(value ? filteredTemplates.map((c) => c.id) : []);
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isAllSelected =
    filteredTemplates.length > 0 &&
    selectedIds.length === filteredTemplates.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < filteredTemplates.length;

  useEffect(() => {
    if (globalCheckBoxRef.current) {
      globalCheckBoxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  if (isLoadingTemplates) {
    return <LoadingScreen />;
  }

  if (isErrorTemplates) {
    return (
      <ErrorScreen
        title="Erreur de chargement"
        message="Certaines données n'ont pas pu être récupérées."
        onRetry={refetchTemplates}
      />
    );
  }

  return (
    <div className="p-8 w-full mx-auto space-y-8 flex-1 pb-32 ">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ui-text">
            Bibliothèque de modèles
          </h1>
          <p className="text-sm text-ui-textSubtle mt-1">
            Gérez tous vos modèles de contrats.
          </p>
        </div>

        <CreateDocumentDropdown
          setIsTemplateModalOpened={() => {}}
          isForTemplate
        />
      </div>

      <CustomContractsTableTabs
        documents={adaptedTemplates}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedIds={setSelectedIds}
        setCurrentPage={setCurrentPage}
        isForTemplates={true}
      />

      {/* 3. TABLEAU DE DONNÉES */}
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
                {"Date de création"}
              </TableHead>
              <TableHead className="p-4 pr-6 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                Actions rapides
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTemplates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="p-12 text-center text-slate-400 text-sm"
                >
                  Aucun document trouvé dans cette vue.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTemplates.map((document) => {
                const isSelected = selectedIds.includes(document.id);
                const isTemplate =
                  document.class === EContractsListTabs.TEMPLATE;
                const isTemplateClass = isTemplate
                  ? "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200"
                  : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600";

                const docType = isTemplate ? "template" : "contract";
                return (
                  <TableRow
                    key={document.id}
                    className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors group text-slate-800 h-16 ${isSelected ? "bg-indigo-50/30" : ""}`}
                  >
                    <TableCell className="p-4 pl-6 align-middle">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSelectOne(document.id)}
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
                            document.type.slice(0, 4).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ui-text leading-none">
                            {document.name}
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
                      {document.tier}
                    </TableCell>
                    <TableCell className="p-4 align-middle">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${document.color}`}
                      >
                        {traductContractStatus(document.status)}
                      </span>
                    </TableCell>
                    <TableCell className="p-4 text-sm text-slate-500 align-middle">
                      {document.date}
                    </TableCell>

                    <TableCell className="p-4 pr-6 text-right align-middle">
                      {/* Boutons d'action : Visibles uniquement au survol du tableau (premium UI style) */}
                      <div className="flex items-center justify-end">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-sm">
                          <ActionBtn
                            icon={PenTool}
                            title="Éditer le modèle"
                            onClick={() =>
                              router.push(
                                `/fr/contracts/template/${document.id}`,
                              )
                            }
                          />

                          <ActionBtn
                            icon={Eye}
                            title="Inspecter"
                            onClick={() => {}}
                          />

                          {/* <ActionBtn
                                    icon={Sparkles}
                                    title="Analyser IA"
                                    onClick={() =>
                                      console.log("AI analyze", contract.id)
                                    }
                                  /> */}

                          <ActionBtn
                            icon={Trash2}
                            title="Supprimer le document"
                            onClick={() => {}}
                          />

                          <ActionBtn
                            icon={Download}
                            title="Télécharger PDF"
                            isNeutral
                            onClick={() =>
                              downloadContractPdf(
                                document.id,
                                document.class === EContractsListTabs.TEMPLATE
                                  ? true
                                  : false,
                              )
                            }
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

        {filteredTemplates.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
            <div className="text-xs font-medium text-slate-500">
              Affichage de{" "}
              <span className="font-bold text-slate-700">{startIndex + 1}</span>{" "}
              à{" "}
              <span className="font-bold text-slate-700">
                {Math.min(endIndex, filteredTemplates.length)}
              </span>{" "}
              sur{" "}
              <span className="font-bold text-slate-700">
                {filteredTemplates.length}
              </span>{" "}
              documents
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {}}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>

              <div className="px-2 text-xs font-bold text-slate-400">
                Page <span className="text-slate-700">{currentPage}</span> /{" "}
                {totalPages}
              </div>

              <button
                onClick={() => {}}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
