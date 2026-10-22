"use client";

import { ContractEditorWrapper } from "@/components/custom/ContractEditor";
import { ErrorScreen } from "@/components/custom/ErrorScreen";
import { LoadingScreen } from "@/components/custom/LoadingScreen";
import { useGetContractByIdQuery } from "@/src/store/api/contractsSlice";
import { useGetTemplateByIdQuery } from "@/src/store/api/templatesApiSlice";
import { TContractEditorDocument } from "@/src/types/apiResponseType";
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
    refetch: refetchTemplate,
  } = useGetTemplateByIdQuery(id, { skip: !isTemplate });
  const {
    data: contract,
    isLoading: isLoadingContract,
    isError: isErrorContract,
    refetch: refetchContract,
  } = useGetContractByIdQuery(id, { skip: isTemplate });

  if (isTemplate) {
    if (isLoadingTemplate) {
      return (
        <LoadingScreen className="min-h-0" message="Chargement du modèle..." />
      );
    }

    if (isErrorTemplate || !template) {
      return (
        <ErrorScreen
          showBackButton={true}
          onRetry={refetchTemplate}
          message="Modèle introuvable."
        />
      );
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
      status: template.status,
    };

    return <ContractEditorWrapper document={document} />;
  }

  if (isLoadingContract) {
    return (
      <LoadingScreen className="min-h-0" message="Chargement du contrat..." />
    );
  }

  if (isErrorContract || !contract) {
    return (
      <ErrorScreen
        showBackButton={true}
        onRetry={refetchContract}
        message="Contrat introuvable."
      />
    );
  }

  const { content, ...restOfContract } = contract;

  const document: TContractEditorDocument = {
    ...restOfContract,
    body: content.bodyJson,
    isTemplate: false,
  };

  console.log(document);

  return (
    <ContractEditorWrapper
      document={document}
      idTemplate={document.idTemplate}
    />
  );
}
