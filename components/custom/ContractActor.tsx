"use client";

import { useEditor, EditorContent, EditorContext } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ResizableImage } from "./ResizableImage";
import { ContractEditorToolbar } from "./ContractEditorToolbar";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import FileHandler from "@tiptap/extension-file-handler";
import BlockQuote from "@tiptap/extension-blockquote";
import { TableKit } from "@tiptap/extension-table";
import { useMemo } from "react";

interface IContractActor {
  content: object | null;
}

export const ContractActor = ({ content }: IContractActor) => {
  const documentContent = content ? content : "";

  const editor = useEditor({
    extensions: [
      ResizableImage,
      BlockQuote,
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

  console.log(JSON.stringify(editor?.getJSON()));

  const providerValue = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={providerValue}>
      <div className="flex-1 flex flex-col bg-slate-50/50 h-screen overflow-hidden relative">
        {/* 2. ESPACE DE TRAVAIL (Split : Éditeur A4 + Barre latérale) */}
        <div className="flex-1 flex overflow-hidden">
          {/* A. Zone centrale de l'éditeur (fond gris) - SCROLL DÉSACTIVÉ ICI */}
          <div className="flex-1 flex justify-center py-8 px-4 bg-slate-50/50 overflow-hidden">
            {/* Le "Papier A4" - HAUTEUR MAX FIXÉE (h-full) avec OVERFLOW HIDDEN */}
            <div className="w-full max-w-[21cm] h-full bg-white border border-slate-200/60 shadow-lg rounded-xl flex flex-col overflow-hidden">
              {/* Toolbar - Reste fixe en haut grâce au flex-col du parent */}
              <div className="shrink-0 z-20 bg-white">
                <ContractEditorToolbar editor={editor} />
              </div>

              {/* Conteneur du texte - C'EST ICI QU'ON ACTIVE LE SCROLL (overflow-y-auto) */}
              <div className="p-12 flex-1 overflow-y-auto custom-scrollbar">
                <EditorContent editor={editor} className="tiptap" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </EditorContext.Provider>
  );
};
