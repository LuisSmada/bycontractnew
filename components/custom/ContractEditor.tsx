"use client";

import { ArrowLeft, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { ContractActor } from "./ContractActor";
import { usePathname, useRouter } from "next/navigation";
import { downloadContractPdf } from "@/app/[locale]/(app)/contracts/downloadContractPdf";
import { TContractEditorDocument } from "@/app/[locale]/(app)/contracts/[type]/[id]/page";
import { ResizableImage } from "./ResizableImage";
import FileHandler from "@tiptap/extension-file-handler";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import { useEditor, useEditorState } from "@tiptap/react";
import Subscript from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { SaveContractDialog } from "@/app/[locale]/(app)/contracts/components/SaveContractDialog";

interface IContractEditor {
  document: TContractEditorDocument | null;
}

export const ContractEditor = ({ document }: IContractEditor) => {
  const [title, setTitle] = useState(
    document ? document?.name : "Nouveau document sans titre",
  );
  const router = useRouter();

  const [isSaveModalOpened, setIsSaveModalOpened] = useState(false);

  const documentContent = document?.body ? document?.body : "";

  const path = usePathname();

  const isNewDocument = path.includes("new");

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
      return editor?.getText().trim() === "";
    },
  });

  return (
    <>
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer bg-transparent hover:bg-transparent"
            title="Retour aux contrats"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="h-4 w-px bg-ui-separator"></div>

          {/* Titre éditable */}
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-bold font-sans text-slate-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-100 rounded px-2 w-80 transition-all hover:bg-slate-50"
          />
          {/* <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md ml-2 border border-slate-200">
            Brouillon
          </span>
          <span className="text-[10px] text-slate-400 italic hidden sm:inline">
            Enregistré à l instant
          </span> */}
        </div>

        <div className="flex items-center gap-3">
          {!isNewDocument && (
            <>
              <Button className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-transparent hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer hidden sm:block">
                Partager
              </Button>
              <Button
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-transparent hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer hidden sm:block"
                onClick={() =>
                  downloadContractPdf(
                    document?.id ?? "",
                    document?.isTemplate ?? false,
                  )
                }
              >
                {"Télécharger"}
              </Button>
            </>
          )}
          {/* <Button className="px-4 py-1.5 bg-ui-brand hover:bg-ui-brandHover text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2">
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Finaliser & Signer</span>
            <span className="sm:hidden">Signer</span>
          </Button> */}
          <Button
            className="px-4 py-1.5 bg-ui-brand hover:bg-ui-brandHover text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2"
            onClick={() => setIsSaveModalOpened(true)}
            disabled={cannotSave ?? false}
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sauvegarder</span>
            <span className="sm:hidden">Sauvegarder</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <ContractActor editor={editor} />
        {/* <ContractEditorSide /> */}
      </div>

      <SaveContractDialog
        isSaveModalOpened={isSaveModalOpened}
        setIsSaveModalOpened={setIsSaveModalOpened}
      />
    </>
  );
};
