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
