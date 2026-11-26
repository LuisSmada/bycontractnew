import {
  EContractStatus,
  EContractType,
  IMainContactCompany,
  TAuthorInfos,
  UniqueID,
} from "../model/entities";

export interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

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

export interface IUpdateTemplateRequest {
  name: string;
  status: EContractStatus;
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
  value: number;
}

export interface IGetContractsParams {
  page?: number;
  size?: number;
  sort?: string;
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

// ------------------USER ------------------------//
export interface IUpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// ------------------SUBSCRIPTION ------------------------//
export interface ICheckoutPaymentRequest {
  idPrice: string;
  successUrl: string;
  cancelUrl: string;
}

export interface IOpenCustomerPortalRequest {
  returnUrl: string;
}

export enum ESubscriptionStatus {
  ACTIVE = "active",
  TRIALING = "trialing",
  CANCELED = "canceled",
  PAST_DUE = "past_due",
  INACTIVE = "inactive",
  CANCEL_AT_THE_END = "cancel_at_the_end",
}

export interface ISubscriptionStatusResponse {
  status: ESubscriptionStatus;
  trialEndDate: string;
  cardBrand: string;
  cardLast4: string;
  planName: string;
  planPrice: string;
  currentPeriodEnd: string;
}

export enum EInvoiceStatus {
  PAID = "paid",
  OPEN = "open",
  VOID = "void",
  UNCOLLETIBLE = "uncollectible",
  DRAFT = "draft",
}

export interface ISubscriptionInvoiceResponse {
  id: string;
  number: string;
  date: string;
  amount: number;
  currency: string;
  status: EInvoiceStatus;
  invoicePdfUrl: string | null;
  hostedInvoiceUrl: string | null;
}

export interface IFacturationInformations {
  name: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

// ------------------MEDIA  ------------------------//

export interface IUploadMediaResponse {
  key: string;
  url?: string;
}
