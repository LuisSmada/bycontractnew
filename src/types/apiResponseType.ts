import {
  IMainContactCompany,
  TAuthorInfos,
  TContractStatus,
  TContractType,
  UniqueID,
} from "../model/entities";

// ------------------TEMPLATE------------------------//

export interface ITemplateResponse {
  id: UniqueID;
  name: string;
  author: TAuthorInfos;
  createdAt: string;
  modifiedAt: string;
}

export interface IFindTemplate extends ITemplateResponse {
  body: object;
  variablesDefinition: string;
  createdAt: string;
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
}

// ------------------CONTRACT------------------------//

interface IContractGeneric {
  autoRenew: boolean;
  contractType: TContractType;
  effectiveDate: string;
  expirationDate: string;
  id: UniqueID | null;
  name: string;
  value: string;
  status: TContractStatus;
  idTemplate: string | null;
}

export interface ICreateContractRequest extends Omit<
  IContractGeneric,
  "id" | "status"
> {
  idAuthor: UniqueID;
  idCompany: UniqueID;
  bodyJson: object;
  bodyText: string;
}

export interface IContractResponse {
  id: UniqueID;
  name: string;
  status: TContractStatus;
  author: TAuthorInfos;
  company: {
    id: string;
    name: string;
  };
  createdAt: string;
  modifiedAt: string;
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
}

//****************** */

export type TCompanyInfos = Pick<
  ICompany,
  "id" | "name" | "mainContact" | "siret"
>;

export type TContractEditorTemplate = IFindTemplate & {
  isTemplate: true;
};

export type TContractEditorContract = Omit<IFindContractResponse, "content"> & {
  isTemplate: false;
  body: object;
};

export type TContractEditorDocument =
  TContractEditorTemplate | TContractEditorContract;
