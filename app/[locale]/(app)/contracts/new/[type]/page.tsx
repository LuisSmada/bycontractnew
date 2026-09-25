"use client";

import { ContractEditor } from "@/components/custom/ContractEditor";
import { assertsNonNullable } from "@/src/helpers/generic";
import { IUser } from "@/src/model/entities";
import { useGetCurrentUserQuery } from "@/src/store/api/authApiSlice";
import {
  TContractEditorContract,
  TContractEditorDocument,
  TContractEditorTemplate,
} from "@/src/types/apiResponseType";
import { useParams } from "next/navigation";

export default function NewContractPage() {
  const { type } = useParams<{
    type: "template" | "contract";
  }>();

  // const { data: currentUser } = useGetCurrentUserQuery();
  // assertsNonNullable(currentUser);

  // const createNewContract = (currentUser: IUser): TContractEditorContract => ({
  //   id: null,
  //   name: "",
  //   body: {},
  //   isTemplate: false,
  //   contractType: "NDA",
  //   effectiveDate: new Date().toISOString(),
  //   expirationDate: "",
  //   autoRenew: false,
  //   value: 0,
  //   status: "DRAFT",
  //   createdAt: new Date().toISOString(),
  //   modifiedAt: new Date().toISOString(),
  //   author: {
  //     id: currentUser.id,
  //     firstName: currentUser.firstName,
  //     lastName: currentUser.lastName,
  //   },
  //   idTemplate: "",
  //   company: {
  //     id: "",
  //     name: "",
  //     mainContact: {
  //       firstName: "",
  //       lastName: "",
  //       email: "",
  //       phone: "",
  //     },
  //     siret: "",
  //   },
  // });

  // const createNewTemplate = (currentUser: IUser): TContractEditorTemplate => ({
  //   id: "",
  //   name: "",
  //   body: {},
  //   isTemplate: true,
  //   createdAt: new Date().toISOString(),
  //   modifiedAt: new Date().toISOString(),
  //   author: {
  //     id: currentUser.id,
  //     firstName: currentUser.firstName,
  //     lastName: currentUser.lastName,
  //   },
  //   variablesDefinition: "",
  // });

  // const defaultDocument =
  //   type === "contract"
  //     ? createNewContract(currentUser)
  //     : createNewTemplate(currentUser);

  return (
    <div>
      <ContractEditor document={null} />
    </div>
  );
}
