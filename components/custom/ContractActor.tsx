"use client";

import { EditorContent, EditorContext, Editor } from "@tiptap/react";
import { ContractEditorToolbar } from "./ContractEditorToolbar";
import { useMemo } from "react";

interface IContractActor {
  editor: Editor | null;
}

export const ContractActor = ({ editor }: IContractActor) => {
  // console.log(JSON.stringify(editor?.get()));

  const providerValue = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={providerValue}>
      <div className="flex-1 flex flex-col bg-slate-50/50 h-screen overflow-hidden relative">
        {/* A. TOOLBAR PLEINE LARGEUR EN HAUT */}
        <div className="shrink-0 z-20 bg-white border-b border-slate-200 shadow-sm px-4">
          <div className="max-w-6xl mx-auto">
            {" "}
            {/* Optionnel : pour centrer la toolbar sur les très grands écrans */}
            <ContractEditorToolbar editor={editor} />
          </div>
        </div>

        {/* B. ZONE DE TRAVAIL (Fond gris) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conteneur avec Scroll (c'est le fond gris qui scrolle) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex justify-center py-8 px-4 bg-slate-50/50">
            {/* Le "Papier A4" (qui garde ses 21cm stricts et s'allonge avec le texte) */}
            <div className="w-full max-w-[21cm] min-h-[29.7cm] bg-white border border-slate-200/60 shadow-lg rounded-xl p-12 mb-8">
              <EditorContent editor={editor} className="tiptap" />
            </div>
          </div>
        </div>
      </div>
    </EditorContext.Provider>
  );
};
