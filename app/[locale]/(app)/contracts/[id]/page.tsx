"use client";

import { ContractEditor } from "@/components/custom/ContractEditor";
import { useGetTemplateByIdQuery } from "@/src/store/api/templatesApiSlice";
import { useParams } from "next/navigation";

export default function ContractUnit() {
  const { id } = useParams<{ id: string }>();

  const { data: template, isLoading, isError } = useGetTemplateByIdQuery(id);

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (isError || !template) {
    return <p>Template introuvable.</p>;
  }

  return (
    <div>
      <ContractEditor template={template} />
    </div>
  );
}
