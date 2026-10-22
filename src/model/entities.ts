export interface IGlobalState {
  appliState: IApplicationState;
}

export interface IApplicationState {
  currentUser: IUser;
  language: string;
  activeTab: IDashboardTabsListType;
  currentPath: string;
  selectedTemplateId: string | null;
}

export interface ILanguageApplication {
  language: TLanguageApplication;
}

export type TLanguageApplication = "en" | "fr";

export type UniqueID = string;

export type TAuthorInfos = Pick<IUser, "id" | "firstName" | "lastName">;

export interface IDashboardTabsListType {
  path: string;
  title: string;
}

export type TUserRole = "USER" | "ADMIN";

export interface IUser {
  id: UniqueID;
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: string;
  modifiedAt: string;
  role?: TUserRole;
}

export interface IMainContactCompany {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

export enum EContractType {
  NDA = "NDA",
  CDI = "CDI",
  BAIL = "BAIL",
  SERVICE = "SERVICE",
}

export enum EContractStatus {
  //TEMPLATE USE ONLY THE FIRSTS
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",

  PENDING = "PENDING",
  SIGNED = "SIGNED",
  RISKED = "RISKED",
  EXPIRED = "EXPIRED",
  TERMINATED = "TERMINATED",
}

// export enum ETemplateStatus {
//   DRAFT = "DRAFT",
//   ACTIVE = "ACTIVE",
// }

// export type TContractStatus =
//   | "DRAFT"
//   | "PENDING"
//   | "SIGNED"
//   | "ACTIVE"
//   | "RISKED"
//   | "ËXPIRED"
//   | "TERMINATED";
// DRAFT
// IN_REVIEW
// AWAITING_SIGNATURE
// SIGNED
// ACTIVE
// EXPIRED
// TERMINATED

// ARCHIVED: archived = true when is expired

export enum EContractsListTabs {
  ALL = "ALL",
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  RISK = "RISK",
  TEMPLATE = "TEMPLATE",
  DRAFT = "DRAFT",
  ARCHIVED = "ARCHIVED",
}

export enum ETemplateListTabs {
  ALL = "ALL",
  ACTIVE = "ACTIVE",
  DRAFT = "DRAFT",
  ARCHIVED = "ARCHIVED",
}

export type TContractEditorSidebarMode = "contract" | "template";

export type TToastType = "success" | "info" | "warning" | "error";

export type TTableDocumentType = {
  id: string;
  name: string;
  type: string;
  tier: string;
  status: EContractStatus;
  class: EContractsListTabs;
  date: string;
  color: string;
  author: TAuthorInfos;
};
