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

export interface IUser {
    firstName: string;
    lastName: string;
    createAt?: string;
    role?: string;
}