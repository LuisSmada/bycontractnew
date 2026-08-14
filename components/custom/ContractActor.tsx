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
