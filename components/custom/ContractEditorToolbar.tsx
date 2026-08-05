"use client";

import type { Editor } from "@tiptap/core";
import {
  Undo2,
  Redo2,
  HeadingIcon,
  List,
  BoldIcon,
  Italic,
  Strikethrough,
  Underline,
  Superscript,
  Subscript,
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  ImageUp,
  Table,
} from "lucide-react";
import { ContractToolbarButton } from "./ContractToolbarButton";
import { useEditorState } from "@tiptap/react";

type Alignment = "left" | "center" | "right";

export const ContractEditorToolbar = ({
  editor,
}: {
  editor: Editor | null;
}) => {
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return {
          isBold: false,
          isItalic: false,
          isStrike: false,
          isUnderline: false,
          isSuperscript: false,
          isSubscript: false,
          isBulletList: false,
          isTable: false,
          isAlignLeft: true,
          isAlignCenter: false,
          isAlignRight: false,
          isAlignJustify: false,
          canUndo: false,
          canRedo: false,
        };
      }

      const imageSelected = editor.isActive("image");

      console.log("imageSelected", imageSelected);

      return {
        isBold: editor.isActive("bold"),
        isItalic: editor.isActive("italic"),
        isStrike: editor.isActive("strike"),
        isUnderline: editor.isActive("underline"),
        isSuperscript: editor.isActive("superscript"),
        isSubscript: editor.isActive("subscript"),
        isBulletList: editor.isActive("bulletList"),
        isTable: editor.isActive("table"),

        isAlignLeft: imageSelected
          ? editor.isActive("image", { align: "left" })
          : editor.isActive({ textAlign: "left" }),

        isAlignCenter: imageSelected
          ? editor.isActive("image", { align: "center" })
          : editor.isActive({ textAlign: "center" }),

        isAlignRight: imageSelected
          ? editor.isActive("image", { align: "right" })
          : editor.isActive({ textAlign: "right" }),

        isAlignJustify: editor.isActive({ textAlign: "justify" }),

        canUndo: editor.can().chain().focus().undo().run(),
        canRedo: editor.can().chain().focus().redo().run(),
      };
    },
  });

  if (!editor) {
    return null;
  }

  const setAlignment = (align: Alignment) => {
    if (!editor) return;

    if (editor.isActive("image")) {
      editor.chain().focus().setImageAlign(align).run();
      return;
    }

    editor.chain().focus().setTextAlign(align).run();
  };

  return (
    <div className="h-12 border-b border-slate-100 flex items-center px-4 gap-2 text-slate-500 shrink-0 sticky top-0 bg-white/95 backdrop-blur rounded-t-xl z-10">
      <div className="flex items-center gap-x-1">
        <ContractToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
          disabled={!editorState?.canUndo}
        >
          <Undo2 />
        </ContractToolbarButton>

        <ContractToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
          disabled={!editorState?.canRedo}
        >
          <Redo2 />
        </ContractToolbarButton>
      </div>

      <div className="w-px h-4 bg-slate-200 mx-1"></div>

      <div className="flex items-center gap-x-1">
        <ContractToolbarButton onClick={() => {}} isActive={false}>
          <HeadingIcon />
        </ContractToolbarButton>

        <ContractToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editorState?.isBulletList ?? false}
        >
          <List />
        </ContractToolbarButton>
      </div>

      <div className="w-px h-4 bg-slate-200 mx-1"></div>

      <div className="flex items-center gap-x-1">
        <ContractToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editorState?.isBold ?? false}
        >
          <BoldIcon />
        </ContractToolbarButton>

        <ContractToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editorState?.isItalic ?? false}
        >
          <Italic />
        </ContractToolbarButton>

        <ContractToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editorState?.isStrike ?? false}
        >
          <Strikethrough />
        </ContractToolbarButton>

        <ContractToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editorState?.isUnderline ?? false}
        >
          <Underline />
        </ContractToolbarButton>
      </div>

      <div className="w-px h-4 bg-slate-200 mx-1"></div>

      <div className="flex items-center gap-x-1">
        <ContractToolbarButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editorState?.isSuperscript ?? false}
        >
          <Superscript />
        </ContractToolbarButton>

        <ContractToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editorState?.isSubscript ?? false}
        >
          <Subscript />
        </ContractToolbarButton>
      </div>

      <div className="w-px h-4 bg-slate-200 mx-1"></div>

      <div className="flex items-center gap-x-1">
        <ContractToolbarButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          isActive={editorState?.isTable ?? false}
        >
          <Table />
        </ContractToolbarButton>
      </div>

      <div className="w-px h-4 bg-slate-200 mx-1"></div>

      <div className="flex items-center gap-x-1">
        <ContractToolbarButton
          onClick={() => setAlignment("left")}
          isActive={editorState?.isAlignLeft ?? false}
        >
          <TextAlignStart />
        </ContractToolbarButton>

        <ContractToolbarButton
          onClick={() => setAlignment("center")}
          isActive={editorState?.isAlignCenter ?? false}
        >
          <TextAlignCenter />
        </ContractToolbarButton>

        <ContractToolbarButton
          onClick={() => setAlignment("right")}
          isActive={editorState?.isAlignRight ?? false}
        >
          <TextAlignEnd />
        </ContractToolbarButton>

        <ContractToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editorState?.isAlignJustify ?? false}
        >
          <TextAlignJustify />
        </ContractToolbarButton>
      </div>

      <div className="w-px h-4 bg-slate-200 mx-1"></div>

      <div className="flex items-center gap-x-1">
        <ContractToolbarButton onClick={() => {}} isActive={false}>
          <ImageUp />
          <span className="font-normal text-xs">Ajouter</span>
        </ContractToolbarButton>
      </div>

      {/* Sélecteur de niveaux de titre */}
      {/* <select 
        onChange={(e) => {
          const val = e.target.value;
          if (val === 'p') editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: parseInt(val) }).run();
        }}
        className="text-xs bg-transparent outline-none cursor-pointer border-none font-medium hover:bg-slate-50 p-1 rounded text-slate-700"
      >
        <option value="p">Paragraphe</option>
        <option value="1">Titre 1</option>
        <option value="2">Titre 2</option>
        <option value="3">Titre 3</option>
      </select> */}

      <div className="flex-1"></div>

      {/* Bouton IA intégré à l'éditeur */}
      {/* <button className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-xs font-bold transition-colors cursor-pointer">
        <Sparkles className="w-3.5 h-3.5" />
        Générer clause
      </button> */}
    </div>
  );
};
