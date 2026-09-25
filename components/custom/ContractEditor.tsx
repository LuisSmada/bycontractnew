"use client";

import { SetStateAction, useEffect, useMemo, useState } from "react";
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
import { useCreateContractMutation } from "@/src/store/api/contractsSlice";
import { ContractEditorSide } from "./ContractEditorSide";
import { useGetCurrentUserQuery } from "@/src/store/api/authApiSlice";
import { assertsNonNullable } from "@/src/helpers/generic";
import {
  ICreateContractRequest,
  TContractEditorDocument,
} from "@/src/types/apiResponseType";
import { ContractEditorContextBar } from "./ContractEditorContextBar";
import { UnsavedChangesDialog } from "@/app/[locale]/(app)/contracts/components/UnsavedChangesDialog";
import { toast } from "sonner";
import { TOASTSTYLES } from "@/src/utils/toastsCSSUtils";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface IContractEditor {
  document: TContractEditorDocument | null;
}

export const ContractEditor = (props: IContractEditor) => {
  const initialDocument = props.document;

  const router = useRouter();

  const { data: currentUser } = useGetCurrentUserQuery();
  assertsNonNullable(currentUser);

  const [workingDocument, setWorkingDocument] =
    useState<TContractEditorDocument | null>(initialDocument);

  const [isSaveModalOpened, setIsSaveModalOpened] = useState(false);
  const [isUnsavedModalOpened, setIsUnsavedModalOpened] = useState(false);

  const [createContract, { isLoading }] = useCreateContractMutation();

  const documentContent = workingDocument?.body ?? "";

  const path = usePathname();
  const isNewDocument = path.includes("new");

  const finalDocument = isNewDocument
    ? ({
        ...(workingDocument || {}),
        author: {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
        },
      } as TContractEditorDocument)
    : workingDocument;

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
    content: documentContent,
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

  const handleSaveContract = async () => {
    console.log("Enter");
    try {
      let payload: ICreateContractRequest | null = null;
      if (!initialDocument) {
        if (workingDocument && !workingDocument?.isTemplate) {
          payload = {
            autoRenew: workingDocument?.autoRenew ?? false,
            contractType: workingDocument?.contractType,
            effectiveDate: workingDocument?.effectiveDate,
            expirationDate: workingDocument?.expirationDate,
            name: workingDocument?.name,
            value: workingDocument?.value,
            idTemplate: null,
            idAuthor: currentUser.id,
            idCompany: workingDocument.company?.id,
            bodyJson: workingDocument.body,
            bodyText: editor?.getText() ?? "",
          };
        }
      } else {
        if (workingDocument && !workingDocument?.isTemplate) {
          payload = {
            autoRenew: workingDocument.autoRenew,
            contractType: workingDocument.contractType,
            effectiveDate: workingDocument.effectiveDate,
            expirationDate: workingDocument.expirationDate,
            name: workingDocument.name,
            value: workingDocument.value,
            idTemplate: workingDocument.idTemplate,
            idAuthor: workingDocument.author?.id,
            idCompany: workingDocument.company?.id,
            bodyJson: workingDocument.body,
            bodyText: editor?.getText() ?? "",
          };
        }
      }

      console.log(payload);

      if (payload) {
        await createContract(payload).unwrap();

        setIsSaveModalOpened(false);

        toast.success("Enregistré comme Brouillon.", {
          position: "top-right",
          style: TOASTSTYLES.INFO,
        });

        router.back();
      } else {
        setIsSaveModalOpened(false);

        toast.success("Les donnees ne sont pas completes pour la sauvegarde", {
          position: "top-right",
          style: TOASTSTYLES.INFO,
        });
      }
    } catch (e: unknown) {
      console.error(e);
      const error = e as FetchBaseQueryError;
      if (error?.status === 401 || error?.status === 403) {
        toast.error("Des informations sont manquantes. Veuillez réessayer.", {
          position: "top-right",
          style: TOASTSTYLES.ERROR,
        });
      } else {
        toast.error(
          "Une erreur est survenue lors de la connexion au serveur.",
          { position: "top-right", style: TOASTSTYLES.ERROR },
        );
      }
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
          document={finalDocument}
          updateField={updateField}
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
