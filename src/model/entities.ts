export interface IGlobalState {
  appliState: IApplicationState;
}

export interface IApplicationState {
  currentUser: IUser;
  language: string;
  activeTab: IDashboardTabsListType;
  currentPath: string;
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
  phone: string;
}

export type TContractType = "NDA" | "CDI" | "BAIL" | "SERVICE";
export type TContractStatus = "DRAFT" | "PENDING" | "SIGNED" | "RISKED";

export enum EContractsListTabs {
  ALL = "ALL",
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  RISK = "RISK",
  TEMPLATE = "TEMPLATE",
  DRAFT = "DRAFT",
}

export type TContractEditorSidebarMode = "contract" | "template";
