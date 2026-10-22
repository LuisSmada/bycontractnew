"use client";

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
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileBadge2,
  FileSignature,
  PenTool,
  Trash2,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GroupedContractsActions } from "./GroupedContractsActions";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { CreateDocumentDropdown } from "./components/CreateDocumentDropdown";
import { ActionBtn } from "./components/ActionBtn";
import { CustomContractsTableTabs } from "./components/CustomContractsTableTabs";
import { IListContractResponse } from "@/src/types/apiResponseType";
import {
  EContractsListTabs,
  EContractStatus,
  TTableDocumentType,
} from "@/src/model/entities";
import { downloadContractPdf } from "./downloadContractPdf";
import {
  useGetAllContractsQuery,
  useLazyGetSignedContractUrlQuery,
} from "@/src/store/api/contractsSlice";
import { TemplateSelectionDialog } from "./components/TemplateSelectionDialog";
import { LoadingScreen } from "@/components/custom/LoadingScreen";
import { ErrorScreen } from "@/components/custom/ErrorScreen";
import { ConfirmationDeleteModal } from "@/components/custom/ConfirmationDeleteModal";
import {
  sanitizeDocumentStatus,
  traductContractStatus,
} from "@/src/utils/documentsUtils";
import { sanitizeDate } from "@/src/helpers/generic";
import { MarkAsSignedDialog } from "./components/MarkAsSignedDialog";
import { responseErrorApi } from "@/src/utils/responseErrorApi";

export const ContractsPage = () => {
  const router = useRouter();
  const ITEMS_PER_PAGE = 5;

  const {
    data: contracts,
    isLoading: isLoadingContracts,
    isError: isErrorContracts,
    refetch: refetchContracts,
  } = useGetAllContractsQuery();

  const [getSignedUrl] = useLazyGetSignedContractUrlQuery();

  const mapContracts = (
    contracts: IListContractResponse[],
  ): TTableDocumentType[] => {
    return contracts.map((c) => {
      const exDate = c.expirationDate
        ? sanitizeDate(c.expirationDate)
        : "Tacite reconduction";
      const { color, tabClass } = sanitizeDocumentStatus(c.status);
      return {
        id: c.id,
        name: c.name,
        type: c.type,
        tier: c.company.name,
        status: c.status,
        class: tabClass,
        date: exDate,
        color: color,
        author: {
          id: c.author.id,
          firstName: c.author.firstName,
          lastName: c.author.lastName,
        },
      };
    });
  };

  const allDocuments = useMemo(() => {
    return mapContracts(contracts ?? []);
  }, [contracts]);

  const [activeTab, setActiveTab] = useState<EContractsListTabs | string>(
    EContractsListTabs.ALL,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inspectedContractId, setInspectedContractId] = useState<string | null>(
    null,
  );
  const [isTemplateModalOpened, setIsTemplateModalOpened] =
    useState<boolean>(false);

  const [isDeleteModalOpened, setIsDeleteModalOpened] =
    useState<boolean>(false);

  const [documentNameToDelete, setDocumentNameToDelete] = useState<string>("");
  const [idDocumentToDelete, setIdDocumentToDelete] = useState<string>("");
  const [isMarkSignedModalOpened, setIsMarkSignedModalOpened] = useState(false);
  const [documentNameToMarkAsSigned, setDocumentNameToMarkAsSigned] =
    useState<string>("");
  const [documentIdToMarkAsSigned, setDocumentIdToMarkAsSigned] =
    useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);

  const globalCheckBoxRef = useRef<HTMLInputElement | null>(null);

  const inspectedContract = useMemo(() => {
    return allDocuments.find((c) => c.id === inspectedContractId) || null;
  }, [allDocuments, inspectedContractId]);

  const filteredContracts = useMemo(() => {
    let result: TTableDocumentType[] = allDocuments;

    console.log(allDocuments);

    // Filtrage par Onglet
    if (activeTab === EContractsListTabs.ALL) {
      result = result;
    } else {
      result = result.filter((c) => c.class === activeTab);
    }

    // Filtrage par Recherche
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      if (activeTab === EContractsListTabs.TEMPLATE) {
        result = result.filter((c) => c.name.toLowerCase().includes(q));
      } else {
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.tier.toLowerCase().includes(q),
        );
      }
    }

    return result;
  }, [activeTab, allDocuments, searchQuery]);

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

  const totalPages = Math.ceil(filteredContracts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedContracts = filteredContracts.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleRefetchAll = () => {
    refetchContracts();
  };

  const handleDownloadSignedContract = async (id: string, name: string) => {
    try {
      const response = await getSignedUrl(id).unwrap();
      const fileUrl = response.url;

      if (fileUrl) {
        // 3. Astuce pour forcer le téléchargement du fichier
        const link = document.createElement("a");
        link.href = fileUrl;
        link.target = "_blank"; // Ouvre dans un nouvel onglet si le navigateur bloque
        link.download = `Contrat_Signe_${name}.pdf`; // Suggère un nom de fichier
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      responseErrorApi(e);
    }
  };

  useEffect(() => {
    if (globalCheckBoxRef.current) {
      globalCheckBoxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  if (isLoadingContracts) {
    return <LoadingScreen />;
  }

  if (isErrorContracts) {
    return (
      <ErrorScreen
        title="Erreur de chargement"
        message="Certaines données n'ont pas pu être récupérées."
        onRetry={handleRefetchAll}
      />
    );
  }

  return (
    <>
      <div className="p-8 w-full mx-auto space-y-8 flex-1 pb-32 ">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ui-text">
              Espace Contrats
            </h1>
            <p className="text-sm text-ui-textSubtle mt-1">
              Gérez le cycle de vie de vos documents, auditez les clauses et
              appliquez des actions groupées.
            </p>
          </div>

          <CreateDocumentDropdown
            setIsTemplateModalOpened={setIsTemplateModalOpened}
            isForTemplate={false}
          />
        </div>

        {/* 2. BARRE D'ONGLETS & RECHERCHE */}
        {/* <ContractsTableTabs /> */}

        <CustomContractsTableTabs
          documents={allDocuments}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedIds={setSelectedIds}
          setCurrentPage={setCurrentPage}
          isForTemplates={false}
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
                  {activeTab === EContractsListTabs.TEMPLATE
                    ? "Date de création"
                    : "Echéance"}
                </TableHead>
                <TableHead className="p-4 pr-6 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                  Actions rapides
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContracts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="p-12 text-center text-slate-400 text-sm"
                  >
                    Aucun document trouvé dans cette vue.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedContracts.map((contract) => {
                  const isSelected = selectedIds.includes(contract.id);
                  const isTemplate =
                    contract.class === EContractsListTabs.TEMPLATE;
                  const isTemplateClass = isTemplate
                    ? "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200"
                    : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600";

                  const docType = isTemplate ? "template" : "contract";

                  const canBeSigned =
                    contract.status === EContractStatus.PENDING;
                  const canBeModified =
                    contract.status === EContractStatus.DRAFT ||
                    contract.status === EContractStatus.PENDING;
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
                              contract.type.valueOf().slice(0, 4).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-ui-text leading-none">
                              {contract.name}
                            </p>
                            <span className="text-xs text-slate-400 mt-1 block">
                              {isTemplate
                                ? "Matrice globale"
                                : `Rédigé par ${contract.author.firstName} ${contract.author.lastName}`}
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
                          {traductContractStatus(contract.status)}
                        </span>
                      </TableCell>
                      <TableCell className="p-4 text-sm text-slate-500 align-middle">
                        {contract.date}
                      </TableCell>

                      <TableCell className="p-4 pr-6 text-right align-middle">
                        {/* Boutons d'action : Visibles uniquement au survol du tableau (premium UI style) */}
                        <div className="flex items-center justify-end">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-sm">
                            {canBeModified && (
                              <ActionBtn
                                icon={PenTool}
                                title="Éditer le modèle"
                                onClick={() =>
                                  router.push(
                                    `/fr/contracts/${docType}/${contract.id}`,
                                  )
                                }
                              />
                            )}

                            <ActionBtn
                              icon={Eye}
                              title="Inspecter"
                              onClick={() =>
                                setInspectedContractId(contract.id)
                              }
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
                              onClick={() => {
                                setIdDocumentToDelete(contract.id);
                                setDocumentNameToDelete(contract.name);
                                setIsDeleteModalOpened(true);
                              }}
                            />

                            {canBeSigned && (
                              <ActionBtn
                                icon={FileSignature}
                                title="Marquer comme signé"
                                onClick={() => {
                                  setDocumentIdToMarkAsSigned(contract.id);
                                  setDocumentNameToMarkAsSigned(contract.name);
                                  setIsMarkSignedModalOpened(true);
                                }} // Ta fonction pour ouvrir le Modal
                              />
                            )}

                            <ActionBtn
                              icon={Download}
                              title="Télécharger PDF"
                              isNeutral
                              onClick={() => {
                                if (
                                  contract.status === EContractStatus.ACTIVE ||
                                  contract.status === EContractStatus.SIGNED
                                ) {
                                  handleDownloadSignedContract(
                                    contract.id,
                                    contract.name,
                                  );
                                } else {
                                  downloadContractPdf(
                                    contract.id,
                                    contract.class ===
                                      EContractsListTabs.TEMPLATE
                                      ? true
                                      : false,
                                  );
                                }
                              }}
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

          {filteredContracts.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
              <div className="text-xs font-medium text-slate-500">
                Affichage de{" "}
                <span className="font-bold text-slate-700">
                  {startIndex + 1}
                </span>{" "}
                à{" "}
                <span className="font-bold text-slate-700">
                  {Math.min(endIndex, filteredContracts.length)}
                </span>{" "}
                sur{" "}
                <span className="font-bold text-slate-700">
                  {filteredContracts.length}
                </span>{" "}
                documents
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
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
                  onClick={handleNext}
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
      </div>

      <TemplateSelectionDialog
        isTemplateModalOpened={isTemplateModalOpened}
        setIsTemplateModalOpened={setIsTemplateModalOpened}
      />

      <ConfirmationDeleteModal
        isOpen={isDeleteModalOpened}
        onClose={() => setIsDeleteModalOpened(false)}
        documentName={documentNameToDelete}
        idDocumentToDelete={idDocumentToDelete}
      />

      <MarkAsSignedDialog
        isOpen={isMarkSignedModalOpened}
        onClose={() => setIsMarkSignedModalOpened(false)}
        contractName={documentNameToMarkAsSigned}
        idContract={documentIdToMarkAsSigned}
        // onConfirmUpload={() => {}}
      />
    </>
  );
};
