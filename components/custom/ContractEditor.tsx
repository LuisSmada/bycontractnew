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
import { toast } from "sonner";
import { TOASTSTYLES } from "@/src/utils/toastsCSSUtils";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { TContractStatus, TToastType } from "@/src/model/entities";

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

  const [createContract, { isLoading: isLodingCreateContract }] =
    useCreateContractMutation();
  const [updateContrat] = useUpdateContractMutation();

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

  const handleSaveContract = async (
    status: TContractStatus,
    message: string,
    toastType: TToastType = "info",
  ) => {
    try {
      // 1. Validation de sécurité rapide
      if (!workingDocument) {
        setIsSaveModalOpened(false);
        // CORRECTION : Utilisation de toast.warning au lieu de toast.success
        toast.warning("Les données ne sont pas complètes pour la sauvegarde.", {
          position: "top-right",
          style: TOASTSTYLES.WARNING,
        });
        return; // On arrête la fonction ici
      }

      // Optionnel : Gérer ici la logique spécifique aux templates si besoin
      if (workingDocument.isTemplate) {
        // Logique de sauvegarde de template...
        // return;
      } else {
        // 2. Construction du Payload Commun (Mutualisation du code)
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
          contractStatus: status,
        };

        // 3. Appel de l'API (Création vs Mise à jour)
        if (!initialDocument) {
          // C'est un nouveau contrat
          const createPayload: ICreateContractRequest = {
            ...basePayload,
            idTemplate: null,
            idAuthor: currentUser.id, // Requis uniquement pour la création
          };
          await createContract(createPayload).unwrap();
        } else {
          console.log("Update called");
          console.log("basePayload", basePayload);
          // C'est une mise à jour
          await updateContrat({
            id: workingDocument.id ?? "",
            request: basePayload as Partial<IUpdateContractRequest>,
          }).unwrap();
        }
      }

      // 4. Succès de l'opération
      setIsSaveModalOpened(false);

      if (toastType === "success") {
        toast.success(message, {
          position: "top-right",
          style: TOASTSTYLES.SUCCESS, // CORRECTION : Était INFO
        });
      } else {
        toast.info(message, {
          position: "top-right",
          style: TOASTSTYLES.INFO,
        });
      }

      // Retour à la page précédente
      router.back();
    } catch (e: unknown) {
      console.error(e);
      const error = e as FetchBaseQueryError;

      // Bonne pratique : fermer la modale même si ça plante, pour ne pas bloquer l'utilisateur
      setIsSaveModalOpened(false);

      // CORRECTION : Codes HTTP adaptés
      if (error?.status === 400 || error?.status === 422) {
        toast.error(
          "Des informations sont manquantes ou invalides. Veuillez vérifier les champs.",
          {
            position: "top-right",
            style: TOASTSTYLES.ERROR,
          },
        );
      } else if (error?.status === 401 || error?.status === 403) {
        toast.error(
          "Vous n'avez pas les droits nécessaires ou votre session a expiré.",
          {
            position: "top-right",
            style: TOASTSTYLES.ERROR,
          },
        );
      } else {
        toast.error(
          "Une erreur est survenue lors de la connexion au serveur.",
          {
            position: "top-right",
            style: TOASTSTYLES.ERROR,
          },
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
