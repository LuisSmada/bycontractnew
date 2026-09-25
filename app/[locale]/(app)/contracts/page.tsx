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
import { Download, Eye, FileBadge2, PenTool, Sparkles } from "lucide-react";
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
import {
  IContractResponse,
  ITemplateResponse,
} from "@/src/types/apiResponseType";
import { EContractsListTabs } from "@/src/model/entities";
import { downloadContractPdf } from "./downloadContractPdf";
import { useGetAllTemplatesQuery } from "@/src/store/api/templatesApiSlice";
import { useGetAllContractsQuery } from "@/src/store/api/contractsSlice";
import {
  IFindTemplate,
  TemplateSelectionDialog,
} from "./components/TemplateSelectionDialog";

type TMockContractType = {
  id: string;
  name: string;
  type: string;
  tier: string;
  status: string;
  class: EContractsListTabs;
  date: string;
  color: string;
};

const MOCK_CONTRACTS: TMockContractType[] = [
  {
    id: "1",
    name: "NDA - Vercel Inc",
    type: "NDA",
    tier: "Vercel Inc.",
    status: "Signé",
    class: EContractsListTabs.ACTIVE,
    date: "12 Déc 2026",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "2",
    name: "Contrat Prestation - Nike Europe",
    type: "Prestation",
    tier: "Nike Inc.",
    status: "Signé",
    class: EContractsListTabs.ACTIVE,
    date: "08 Juin 2027",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "3",
    name: "CDI - Sophie Dubois",
    type: "RH",
    tier: "Interne",
    status: "En attente",
    class: EContractsListTabs.PENDING,
    date: "N/A",
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "4",
    name: "Bail Commercial - Locaux Lyon",
    type: "Bail",
    tier: "ImmoGroup",
    status: "Risque",
    class: EContractsListTabs.RISK,
    date: "30 Juil 2026",
    color: "bg-rose-100 text-rose-700",
  },
  {
    id: "5",
    name: "Contrat Fournisseur - AWS Cloud",
    type: "SaaS",
    tier: "Amazon Web Services",
    status: "Signé",
    class: EContractsListTabs.ACTIVE,
    date: "15 Nov 2026",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "6",
    name: "NDA - Stripe S.A.S",
    type: "NDA",
    tier: "Stripe",
    status: "En attente",
    class: EContractsListTabs.PENDING,
    date: "N/A",
    color: "bg-amber-100 text-amber-700",
  },
];

export default function ContractsPage() {
  const router = useRouter();

  const { data: contracts } = useGetAllContractsQuery();
  const { data: templates } = useGetAllTemplatesQuery();

  console.log(contracts);

  const mapTemplates = (templates: ITemplateResponse[]) => {
    return templates.map((t) => {
      const day = new Date(t.createdAt).getDay().toString().padStart(2, "0");
      const month = new Date(t.createdAt)
        .getMonth()
        .toString()
        .padStart(2, "0");
      const year = new Date(t.createdAt).getFullYear();
      return {
        id: t.id,
        name: t.name,
        type: "MODÈLE",
        tier: "-",
        status: "Matrice No-Code",
        class: EContractsListTabs.TEMPLATE,
        date: `Créé le ${day}/${month}/${year}`,
        color: "bg-indigo-100 text-indigo-700",
      };
    });
  };

  const mapContracts = (contracts: IContractResponse[]) => {
    return contracts.map((c) => {
      const day = new Date(c.createdAt).getDay().toString().padStart(2, "0");
      const month = new Date(c.createdAt)
        .getMonth()
        .toString()
        .padStart(2, "0");
      const year = new Date(c.createdAt).getFullYear();
      return {
        id: c.id,
        name: c.name,
        type: "CDI",
        tier: c.company.name,
        status: c.status === "DRAFT" ? "Brouillon" : c.status,
        class: EContractsListTabs.DRAFT,
        date: `Créé le ${day}/${month}/${year}`,
        color: "bg-indigo-100 text-indigo-700",
      };
    });
  };

  const adaptedTemplates = mapTemplates(templates ?? []);
  const adaptedContracts = mapContracts(contracts ?? []);

  const allDocuments = useMemo(() => {
    return [...MOCK_CONTRACTS, ...adaptedTemplates, ...adaptedContracts];
  }, [adaptedTemplates, adaptedContracts]);

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

  const globalCheckBoxRef = useRef<HTMLInputElement | null>(null);

  const inspectedContract = useMemo(() => {
    return MOCK_CONTRACTS.find((c) => c.id === inspectedContractId) || null;
  }, [inspectedContractId]);

  const filteredContracts = useMemo(() => {
    let result: TMockContractType[] = allDocuments;

    // Filtrage par Onglet
    if (activeTab === EContractsListTabs.ALL) {
      result = result.filter((c) => c.class !== EContractsListTabs.TEMPLATE);
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

  useEffect(() => {
    if (globalCheckBoxRef.current) {
      globalCheckBoxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

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
          />
        </div>

        {/* 2. BARRE D'ONGLETS & RECHERCHE */}
        {/* <ContractsTableTabs /> */}

        <CustomContractsTableTabs
          contracts={allDocuments}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedIds={setSelectedIds}
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

                  const docType = isTemplate ? "template" : "contract";
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
                            <ActionBtn
                              icon={PenTool}
                              title="Éditer le modèle"
                              onClick={() =>
                                router.push(
                                  `/fr/contracts/${docType}/${contract.id}`,
                                )
                              }
                            />

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
                              icon={Download}
                              title="Télécharger PDF"
                              isNeutral
                              onClick={() =>
                                downloadContractPdf(
                                  contract.id,
                                  contract.class === EContractsListTabs.TEMPLATE
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
        onSelectTemplate={() => {}}
      />
    </>
  );
}
