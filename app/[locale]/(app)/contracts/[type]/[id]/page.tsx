"use client";

import { ContractEditor } from "@/components/custom/ContractEditor";
import { useGetContractByIdQuery } from "@/src/store/api/contractsSlice";
import { useGetTemplateByIdQuery } from "@/src/store/api/templatesApiSlice";
import {
  IFindContractResponse,
  IFindTemplate,
} from "@/src/types/apiResponseType";
import { useParams } from "next/navigation";

export type TContractEditorDocument = {
  id: string;
  name: string;
  body: object;
  isTemplate: boolean;
};

export default function ContractUnit() {
  const { id, type } = useParams<{
    id: string;
    type: "template" | "contract";
  }>();

  const isTemplate = type === "template";

  const {
    data: template,
    isLoading: isLoadingTemplate,
    isError: isErrorTemplate,
  } = useGetTemplateByIdQuery(id, { skip: !isTemplate });
  const {
    data: contract,
    isLoading: isLoadingContract,
    isError: isErrorContract,
  } = useGetContractByIdQuery(id, { skip: isTemplate });

  if (isTemplate) {
    if (isLoadingTemplate) {
      return <p>Chargement...</p>;
    }

    if (isErrorTemplate || !template) {
      return <p>Template introuvable.</p>;
    }

    const document: TContractEditorDocument = {
      id: template.id,
      name: template.name,
      body: template.body,
      isTemplate: isTemplate,
    };

    return <ContractEditor document={document} />;
  }

  if (isLoadingContract) {
    return <p>Chargement...</p>;
  }

  if (isErrorContract || !contract) {
    return <p>Contrat introuvable.</p>;
  }

  const document: TContractEditorDocument = {
    id: contract.id ?? id,
    name: contract.name,
    body: contract.content.bodyJson,
    isTemplate: isTemplate,
  };

  return <ContractEditor document={document} />;
}
