"use client";

import { ContractEditor } from "@/components/custom/ContractEditor";
import { TAuthorInfos } from "@/src/model/entities";
import { useGetContractByIdQuery } from "@/src/store/api/contractsSlice";
import { useGetTemplateByIdQuery } from "@/src/store/api/templatesApiSlice";
import {
  IFindContractResponse,
  IFindTemplate,
  TContractEditorDocument,
} from "@/src/types/apiResponseType";
import { useParams } from "next/navigation";

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
      createdAt: template.createdAt,
      modifiedAt: template.modifiedAt,
      author: {
        id: template.author.id,
        firstName: template.author.firstName,
        lastName: template.author.lastName,
      },
      variablesDefinition: "",
    };

    return <ContractEditor document={document} />;
  }

  if (isLoadingContract) {
    return <p>Chargement...</p>;
  }

  if (isErrorContract || !contract) {
    return <p>Contrat introuvable.</p>;
  }

  const { content, ...restOfContract } = contract;

  const document: TContractEditorDocument = {
    ...restOfContract,
    body: content.bodyJson,
    isTemplate: false,
  };

  return <ContractEditor document={document} />;
}
