export interface IGlobalState {
  appliState: IApplicationState;
  entities: IEntities;
}

export interface IApplicationState {
  currentUser: IUser;
  language: string;
  activeTab: IDashboardTabsListType;
  currentPath: string;
}

export interface IEntities {
  files: IFile;
  folders: IFolder;
}

export interface ILanguageApplication {
  language: TLanguageApplication;
}

export type TLanguageApplication = "en" | "fr";

export type UniqueID = string;

type TFileSystemType = "folder" | "file";

interface IGenericDocumentContent {
  id: UniqueID;
  author: string;
  date: string;
  name: string;
  parentId: string | null;
  path: string;
  size: number | null;
  type: TFileSystemType;
}

export interface IFolder extends IGenericDocumentContent {
  type: "folder";
  children: { [key: string]: IFile | IFolder } | null;
}

export interface IFolderGlobal {
  byId: { [key: string]: IFolder };
  allFoldersIds: string[];
}

export interface IFile extends IGenericDocumentContent {
  type: "file";
}

export interface IFileGlobal {
  byId: { [key: string]: IFile };
  allFilesIds: string[];
}

export interface IDashboardTabsListType {
  path: string;
  title: string;
}

export type TUserRole = "USER" | "ADMIN";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  createAt?: string;
  role?: TUserRole;
}

export interface ICompany {
  id: string;
  name: string;
  siret: string;
  address: string;
  createdAt: string;
  modifiedAt: string;
}

export interface ITemplateModel {
  id: string;
  name: string;
  body: string;
  variablesDefinition: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  modifiedAt: string;
}

export type TContractType = "NDA" | "CDI" | "BAIL";
export type TContractStatus = "DRAFT" | "PENDING" | "SIGNED" | "RISKED";

export enum EContractsListTabs {
  ALL = "ALL",
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  RISK = "RISK",
  TEMPLATE = "TEMPLATE",
  DRAFT = "DRAFT",
}

// export interface IContract {
//   id: UniqueID;
//   name: string;
//   contractType: TContractType;
//   contractStatus: TContractStatus;
//   company: {
//     id: string;
//     name: string;
//   };
//   author: {
//     id: string;
//     firstName: string;
//     lastName: string;
//   };
//   idTemplateModel: {
//     id: string;
//     name: string;
//   } | null;
//   effectiveDate: string;
//   expirationDate: string;
//   autoRenew: boolean | null;
//   value: number;
//   content: string;
//   createdAt: string;
//   modifiedAt: string;
// }

// export interface IContractGlobal {
//   byId: { [key: string]: IContract };
//   allFoldersIds: string[];
// }
