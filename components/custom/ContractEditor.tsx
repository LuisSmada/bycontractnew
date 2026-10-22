"use client";

import { FC, useEffect, useMemo, useRef, useState } from "react";
import { ContractActor } from "./ContractActor";
import { usePathname, useRouter } from "next/navigation";
import { ResizableImage } from "./ResizableImage";
import FileHandler from "@tiptap/extension-file-handler";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import { useEditor, useEditorState } from "@tiptap/react";
import Subscript from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { SaveContractDialog } from "@/app/[locale]/(app)/contracts/components/SaveContractDialog";
import {
  useCreateContractMutation,
  useUpdateContractMutation,
} from "@/src/store/api/contractsSlice";
import { ContractEditorSide } from "./ContractEditorSide";
import { useGetCurrentUserQuery } from "@/src/store/api/authApiSlice";
import { assertsNonNullable } from "@/src/helpers/generic";
import {
  ICreateContractRequest,
  IUpdateContractRequest,
  TContractEditorDocument,
} from "@/src/types/apiResponseType";
import { ContractEditorContextBar } from "./ContractEditorContextBar";
import { UnsavedChangesDialog } from "@/app/[locale]/(app)/contracts/components/UnsavedChangesDialog";
import { EContractStatus, TToastType } from "@/src/model/entities";
import { responseErrorApi } from "@/src/utils/responseErrorApi";
import {
  operationInfo,
  operationSuccess,
  operationWarning,
} from "@/src/utils/operationsToasts";
import { useGetTemplateByIdQuery } from "@/src/store/api/templatesApiSlice";
import { LoadingScreen } from "./LoadingScreen";
import { Indent } from "../editor/extensions/Indent";
import { PageBreak } from "../editor/extensions/PageBreak";

interface IContractEditorWrapper {
  document: TContractEditorDocument | null;
  idTemplate?: string | null;
}

export const ContractEditorWrapper: FC<IContractEditorWrapper> = ({
  document,
  idTemplate,
}) => {
  const { data, isLoading } = useGetTemplateByIdQuery(idTemplate ?? "", {
    skip: !idTemplate,
  });

  console.log("idTemplate", idTemplate);

  const templateData = {
    id: data?.id,
    name: data?.name,
    content: data?.body,
  };

  if (isLoading) {
    return <LoadingScreen message="Chargement du modèle sélectionné..." />;
  }

  return <ContractEditor document={document} templateData={templateData} />;
};

interface IContractEditor {
  document: TContractEditorDocument | null;
  templateData?: {
    id?: string;
    name?: string;
    content?: object;
  };
}

const ContractEditor = (props: IContractEditor) => {
  const initialDocument = props.document;
  const router = useRouter();
  const path = usePathname();
  const isNewDocument = path.includes("new");

  const { data: currentUser } = useGetCurrentUserQuery();
  assertsNonNullable(currentUser);

  const [createContract, { isLoading: isLoadingCreateContract }] =
    useCreateContractMutation();
  const [updateContrat] = useUpdateContractMutation();

  const [workingDocument, setWorkingDocument] =
    useState<TContractEditorDocument | null>(() => {
      // Cette fonction ne s'exécute qu'une seule fois au chargement du composant

      if (isNewDocument) {
        return {
          ...(initialDocument || {}),
          author: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
          },
          body: props.templateData?.content ?? {},
          idTemplate: props.templateData?.id ?? null,
        } as TContractEditorDocument;
      }

      // Si ce n'est pas un nouveau document, on charge juste le document existant
      return initialDocument;
    });

  const [isSaveModalOpened, setIsSaveModalOpened] = useState(false);
  const [isUnsavedModalOpened, setIsUnsavedModalOpened] = useState(false);

  const documentContent = workingDocument?.body ?? "";

  const updateField = <K extends keyof TContractEditorDocument>(
    field: K,
    value: TContractEditorDocument[K],
  ) => {
    setWorkingDocument((prev) => {
      if (!prev) {
        return {} as TContractEditorDocument;
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  // 3. Détecter si des modifications ont été faites (Dirty State)
  // Utilise JSON.stringify pour une comparaison simple (ou lodash.isEqual pour plus de robustesse)
  const isDocumentModified = useMemo(() => {
    return JSON.stringify(initialDocument) !== JSON.stringify(workingDocument);
  }, [initialDocument, workingDocument]);

  // const handleGoBack = () => {
  //   if (isDocumentModified) {
  //     const confirmLeave = window.confirm(
  //       "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?",
  //     );
  //     if (confirmLeave) {
  //       router.back();
  //     }
  //   } else {
  //     router.back();
  //   }
  // };

  const isNotEditable =
    workingDocument?.status === EContractStatus.SIGNED ||
    workingDocument?.status === EContractStatus.ACTIVE;

  const editor = useEditor({
    extensions: [
      ResizableImage,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      Subscript,
      Superscript,
      Indent,
      PageBreak,
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TableKit.configure({
        table: { resizable: true },
      }),
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
        onDrop: (currentEditor, files, pos) => {
          files.forEach((file) => {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach((file) => {
            if (htmlContent) {
              // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
              // you could extract the pasted file from this url string and upload it to a server for example
              console.log(htmlContent); // oxlint-disable-line no-console
              return false;
            }

            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: "image",
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
      }),
    ],
    content: props.templateData?.content ?? documentContent,
    editable: !isNotEditable,
    onUpdate: ({ editor }) => {
      updateField("body", editor.getJSON());
    },
    editorProps: {
      attributes: {
        lang: "fr",
        spellcheck: "true",
        // Classes Tailwind appliquées directement à la zone de saisie pour correspondre à la maquette
        class:
          "outline-none font-serif text-sm leading-relaxed text-slate-800 min-h-[800px] prose prose-slate max-w-none prose-headings:font-sans prose-headings:font-bold",
      },
    },
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  const cannotSave = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return documentContent === "" ? true : false;
      }
      return editor.isEmpty;
    },
  });

  const handleSaveContract = async (
    status: EContractStatus,
    message: string,
    toastType: TToastType = "info",
  ) => {
    try {
      if (!workingDocument) {
        setIsSaveModalOpened(false);
        operationWarning(
          "Les données ne sont pas complètes pour la sauvegarde.",
        );
        return; // On arrête la fonction ici
      }

      // Optionnel : Gérer ici la logique spécifique aux templates si besoin
      if (workingDocument.isTemplate) {
        // Logique de sauvegarde de template...
        // return;
      } else {
        const basePayload = {
          autoRenew: workingDocument.autoRenew ?? false,
          contractType: workingDocument.contractType,
          effectiveDate: workingDocument.effectiveDate,
          expirationDate: workingDocument.autoRenew
            ? null
            : workingDocument.expirationDate,
          name: workingDocument.name,
          value: workingDocument?.value,
          idCompany: workingDocument.company?.id,
          bodyJson: workingDocument.body,
          bodyText: editor?.getText() ?? "",
          status: status,
        };

        if (!initialDocument) {
          const createPayload: ICreateContractRequest = {
            ...basePayload,
            idAuthor: currentUser.id,
            idTemplate: workingDocument.idTemplate,
          };
          await createContract(createPayload).unwrap();
        } else {
          await updateContrat({
            id: workingDocument.id ?? "",
            request: basePayload as Partial<IUpdateContractRequest>,
          }).unwrap();
        }
      }

      // 4. Succès de l'opération
      setIsSaveModalOpened(false);

      if (toastType === "success") {
        operationSuccess(message);
      } else {
        operationInfo(message);
      }

      router.back();
    } catch (e: unknown) {
      setIsSaveModalOpened(false);
      responseErrorApi(e);
    }
  };

  return (
    <>
      <ContractEditorContextBar
        workingDocument={workingDocument}
        isDocumentModified={isDocumentModified}
        setIsSaveModalOpened={setIsSaveModalOpened}
        setIsUnsavedModalOpened={setIsUnsavedModalOpened}
        updateField={updateField}
        cannotSave={cannotSave}
      />

      <div className="flex-1 flex overflow-hidden">
        <ContractActor editor={editor} />
        <ContractEditorSide
          document={workingDocument}
          updateField={updateField}
          templateName={props.templateData?.name}
        />
      </div>

      <SaveContractDialog
        isSaveModalOpened={isSaveModalOpened}
        setIsSaveModalOpened={setIsSaveModalOpened}
        onContractSave={handleSaveContract}
      />

      <UnsavedChangesDialog
        isUnsavedModalOpened={isUnsavedModalOpened}
        setIsUnsavedModalOpened={setIsUnsavedModalOpened}
        onConfirmLeave={() => router.back()}
      />
    </>
  );
};
