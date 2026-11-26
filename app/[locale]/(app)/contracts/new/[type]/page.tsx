"use client";

import { ContractEditorWrapper } from "@/components/custom/ContractEditor";
import { useParams, useSearchParams } from "next/navigation";

export default function NewContractPage() {
  const { type } = useParams<{
    type: "template" | "contract";
  }>();

  const searchParams = useSearchParams();

  const templateId = searchParams.get("templateId");

  const isForCreateTemplate = type === "template";

  return (
    <div className="flex-1">
      <ContractEditorWrapper
        document={null}
        idTemplate={templateId}
        isForCreateTemplate={isForCreateTemplate}
      />
    </div>
  );
}
