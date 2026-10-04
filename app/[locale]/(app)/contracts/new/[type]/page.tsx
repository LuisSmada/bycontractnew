"use client";

import { ContractEditor } from "@/components/custom/ContractEditor";
import { LoadingScreen } from "@/components/custom/LoadingScreen";
import { useGetTemplateByIdQuery } from "@/src/store/api/templatesApiSlice";
import { useParams, useSearchParams } from "next/navigation";

export default function NewContractPage() {
  const { type } = useParams<{
    type: "template" | "contract";
  }>();

  const searchParams = useSearchParams();

  const templateId = searchParams.get("templateId") ?? "";
  const { data, isLoading } = useGetTemplateByIdQuery(templateId, {
    skip: !templateId,
  });

  console.log("templateId", templateId);
  console.log("data", data);

  const templateContent = data ? data.body : null;

  return (
    <>
      {templateId && isLoading ? (
        <LoadingScreen message="Chargement du modèle sélectionné..." />
      ) : (
        <div className="flex-1">
          <ContractEditor document={null} templateContent={templateContent} />
        </div>
      )}
    </>
  );
}
