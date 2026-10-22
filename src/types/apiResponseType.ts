import {
  EContractStatus,
  EContractType,
  IMainContactCompany,
  TAuthorInfos,
  UniqueID,
} from "../model/entities";

// ------------------TEMPLATE------------------------//

export interface ICreateTemplateRequest {
  name: string;
  idAuthor: UniqueID;
  status: EContractStatus;
  body: object;
}

export interface ITemplateResponse {
  id: UniqueID;
  name: string;
  author: TAuthorInfos;
  status: EContractStatus;
  createdAt: string;
  modifiedAt: string;
}

export interface IFindTemplate extends ITemplateResponse {
  body: object;
  variablesDefinition: string;
}

// ------------------COMPANY------------------------//

export interface ICompany {
  id: UniqueID;
  name: string;
  siret: string;
  address: string;
  createdAt: string;
  modifiedAt: string;
  mainContact: IMainContactCompany;
}

export interface ICreateCompanyRequest {
  name: string;
  siret: string;
  address: string;
  mainContact: IMainContactCompany;
}

// ------------------CONTRACT------------------------//

interface IContractGeneric {
  autoRenew: boolean;
  contractType: EContractType;
  effectiveDate: string;
  expirationDate: string | null;
  id: UniqueID | null;
  name: string;
  value: string;
  status: EContractStatus;
  idTemplate: string | null;
}

export interface ICreateContractRequest extends Omit<IContractGeneric, "id"> {
  idAuthor: UniqueID;
  idCompany: UniqueID;
  bodyJson: object;
  bodyText: string;
}

export interface IListContractResponse {
  id: UniqueID;
  name: string;
  status: EContractStatus;
  type: EContractType;
  author: TAuthorInfos;
  company: {
    id: string;
    name: string;
  };
  createdAt: string;
  modifiedAt: string;
  expirationDate: string | null;
  idTemplate: string | null;
}

export interface IFindContractResponse extends IContractGeneric {
  author: TAuthorInfos;
  company: TCompanyInfos;
  content: {
    bodyJson: object;
    plaintext: string;
    signedPdfUrl: string;
    modifiedAt: string;
  };
  createdAt: string;
  modifiedAt: string;
  version: number;
}

export interface IUpdateContractRequest {
  name: string;
  idCompany: string;
  bodyText: string;
  bodyJson: object;
  effectiveDate: string;
  expirationDate: string | null;
  contractType: EContractType;
  status: EContractStatus;
  value: string;
  autoRenew: boolean;
}

export interface IUploadSignedContractRequest {
  id: string;
  file: File;
}

//****************** */

export type TCompanyInfos = Pick<
  ICompany,
  "id" | "name" | "mainContact" | "siret"
>;

export type TContractEditorTemplate = IFindTemplate & {
  isTemplate: true;
};

export type TContractEditorContract = Omit<
  IFindContractResponse,
  "content" | "version"
> & {
  isTemplate: false;
  body: object;
};

export type TContractEditorDocument =
  TContractEditorTemplate | TContractEditorContract;

// ------------------PARTICULAR STAKEHOLDER ------------------------//

export interface ICreateParticularStakeholderRequest extends IMainContactCompany {
  address: string | null;
}
export interface IParticularStakeholder extends IMainContactCompany {
  id: string;
  address: string | null;
  createdAt: string;
  modifiedAt: string;
}

export interface IParticularStakeholderListResponse {
  content: IParticularStakeholder[];
  pageable: object;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
