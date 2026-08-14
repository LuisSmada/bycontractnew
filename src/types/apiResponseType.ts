import { TContractStatus, TContractType } from "../model/entities";

// ------------------TEMPLATE------------------------//

export interface ITemplateResponse {
  id: string;
  name: string;
  authorName: string;
  createdAt: string;
  modifiedAt: string;
}

export interface IFindTemplate {
  id: string;
  name: string;
  authorName: string;
  body: object;
  variablesDefinition: string;
  createdAt: string;
  modifiedAt: string;
}

// ------------------COMPANY------------------------//

export interface ICompany {
  id: string;
  name: string;
  siret: string;
  address: string;
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
  id: string | null;
  name: string;
  value: number;
  status: TContractStatus;
  idTemplate: string | null;
}

export interface ICreateContractRequest extends Exclude<
  IContractGeneric,
  "id"
> {
  idAuthor: string;
  idCompany: string;
  bodyJson: object;
  bodyText: string;
}

export interface IContractResponse {
  id: string;
  name: string;
  status: TContractStatus;
  author: {
    firstName: string;
    lastName: string;
  };
  company: {
    name: string;
  };
  createdAt: string;
  modifiedAt: string;
}

export interface IFindContractResponse extends IContractGeneric {
  author: {
    firstName: string;
    lastName: string;
  };
  company: {
    name: string;
  };
  content: {
    bodyJson: object;
    plaintext: string;
    signedPdfUrl: string;
    modifiedAt: string;
  };
}
