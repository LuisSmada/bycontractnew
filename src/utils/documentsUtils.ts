import { EContractsListTabs, EContractStatus } from "../model/entities";

export const traductContractStatus = (status: EContractStatus): string => {
  switch (status) {
    case EContractStatus.DRAFT:
      return "Brouillon";
    case EContractStatus.PENDING:
      return "En attente";
    case EContractStatus.ACTIVE:
      return "Actif";
    case EContractStatus.SIGNED:
      return "Signé (À venir)";
    case EContractStatus.RISKED:
      return "Risque";
    case EContractStatus.TERMINATED:
      return "Terminé";
    case EContractStatus.EXPIRED:
      return "Expiré";
    default:
      return "Brouillon";
  }
};

export const sanitizeDocumentStatus = (
  status: EContractStatus,
): { tabClass: EContractsListTabs; color: string } => {
  switch (status) {
    case EContractStatus.DRAFT:
      return {
        tabClass: EContractsListTabs.DRAFT,
        color: "bg-indigo-100 text-indigo-700",
      };
    case EContractStatus.PENDING:
      return {
        tabClass: EContractsListTabs.PENDING,
        color: "bg-amber-100 text-amber-700",
      };
    case EContractStatus.ACTIVE:
      return {
        tabClass: EContractsListTabs.ACTIVE,
        color: "bg-emerald-100 text-emerald-700",
      };
    case EContractStatus.SIGNED:
      return {
        tabClass: EContractsListTabs.ACTIVE,
        color: "bg-blue-100 text-blue-700",
      };
    case EContractStatus.RISKED:
      return {
        tabClass: EContractsListTabs.RISK,
        color: "bg-rose-100 text-rose-700",
      };
    case (EContractStatus.TERMINATED, EContractStatus.EXPIRED):
      return {
        tabClass: EContractsListTabs.ARCHIVED,
        color: "bg-slate-200 text-slate-700",
      };
    default:
      return {
        tabClass: EContractsListTabs.DRAFT,
        color: "bg-indigo-100 text-indigo-700",
      };
  }
};
