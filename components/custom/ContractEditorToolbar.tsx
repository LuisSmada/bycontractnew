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
  ListOrdered,
  IndentDecrease,
  IndentIncrease,
  Heading,
  Type,
  Heading1,
  Heading2,
  Heading3,
  ArrowDownToLine,
  Grid3X3,
  ArrowUpToLine,
  ArrowLeftToLine,
  ArrowRightToLine,
  Trash2,
  TableIcon,
  ChevronDown,
  SeparatorHorizontal,
} from "lucide-react";
import { ContractToolbarButton } from "./ContractToolbarButton";
import { useEditorState } from "@tiptap/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRef } from "react";

type Alignment = "left" | "center" | "right";

export const ContractEditorToolbar = ({
  editor,
}: {
  editor: Editor | null;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return {
          isAlignCenter: false,
          isAlignJustify: false,
          isAlignLeft: true,
          isAlignRight: false,
          isBold: false,
          isBulletList: false,
          canUndo: false,
          canRedo: false,
          isHeading: false,
          isItalic: false,
          isOrderedList: false,
          isPageBreak: false,
          isStrike: false,
          isSuperscript: false,
          isSubscript: false,
          isTable: false,
          isUnderline: false,
        };
      }

      const imageSelected = editor.isActive("image");

      return {
        isBold: editor.isActive("bold"),
        isItalic: editor.isActive("italic"),
        isStrike: editor.isActive("strike"),
        isUnderline: editor.isActive("underline"),
        isSuperscript: editor.isActive("superscript"),
        isSubscript: editor.isActive("subscript"),
        isBulletList: editor.isActive("bulletList"),
        isOrderedList: editor.isActive("orderedLits"),
        isTable: editor.isActive("table"),
        isHeading: editor.isActive("heading"),
        isPageBreak: editor.isActive("pageBreak"),

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    // Dans un vrai SaaS, tu enverrais le fichier à ton backend (ex: AWS S3) ici
    // et tu récupérerais une URL publique.
    // Pour l'interface immédiate, on génère une URL locale temporaire :
    const objectUrl = URL.createObjectURL(file);

    editor.chain().focus().setImage({ src: objectUrl }).run();

    // On vide l'input pour pouvoir ré-uploader la même image si besoin
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const setAlignment = (align: Alignment) => {
    if (!editor) return;

    if (editor.isActive("image")) {
      editor.chain().focus().setImageAlign(align).run();
      return;
    }

    editor.chain().focus().setTextAlign(align).run();
  };

  if (!editor) {
    return null;
  }

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
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`flex items-center justify-center contract-toolbar-button transition-colors  ${editorState?.isHeading ? "bg-slate-200 text-slate-900 hover:bg-slate-200" : "hover:bg-slate-100 text-slate-400 hover:text-slate-800"}`}
          >
            <Heading className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 ml-0.5 text-ui-textSubtle" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-40 rounded-xl shadow-xl border-slate-100 p-1"
          >
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`text-xs font-semibold cursor-pointer rounded-lg px-3 py-2 ${
                editor.isActive("paragraph")
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-700"
              }`}
            >
              <Type className="w-4 h-4 mr-2" /> Texte normal
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`text-xs font-semibold cursor-pointer rounded-lg px-3 py-2 ${
                editor.isActive("heading", { level: 1 })
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-700"
              }`}
            >
              <Heading1 className="w-4 h-4 mr-2" /> Titre 1
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`text-xs font-semibold cursor-pointer rounded-lg px-3 py-2 ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-700"
              }`}
            >
              <Heading2 className="w-4 h-4 mr-2" /> Titre 2
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`text-xs font-semibold cursor-pointer rounded-lg px-3 py-2 ${
                editor.isActive("heading", { level: 3 })
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-700"
              }`}
            >
              <Heading3 className="w-4 h-4 mr-2" /> Titre 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ContractToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editorState?.isOrderedList ?? false}
        >
          <ListOrdered />
        </ContractToolbarButton>

        <ContractToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editorState?.isBulletList ?? false}
        >
          <List />
        </ContractToolbarButton>
      </div>

      <div className="w-px h-4 bg-slate-200 mx-1"></div>

      <ContractToolbarButton
        onClick={() => editor.chain().focus().outdent().run()}
        isActive={false}
      >
        <IndentDecrease />
      </ContractToolbarButton>

      <ContractToolbarButton
        onClick={() => editor.chain().focus().indent().run()}
        isActive={false}
      >
        <IndentIncrease />
      </ContractToolbarButton>

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
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`flex items-center justify-center contract-toolbar-button transition-colors ${editorState?.isTable ? "bg-slate-200 text-slate-900 hover:bg-slate-200" : "hover:bg-slate-100 text-slate-400 hover:text-slate-800"}`}
          >
            <TableIcon className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 ml-0.5 text-slate-400" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-56 rounded-xl shadow-xl border-slate-100 p-1"
          >
            {/* VUE 1 : On n'est pas dans un tableau -> Création */}
            {!editorState?.isTable ? (
              <DropdownMenuItem
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }
                className="text-xs font-semibold text-slate-700 cursor-pointer rounded-lg px-3 py-2 hover:bg-slate-50"
              >
                <Grid3X3 className="w-4 h-4 mr-2 text-slate-400" /> Insérer un
                tableau (3x3)
              </DropdownMenuItem>
            ) : (
              /* VUE 2 : On est DANS un tableau -> Manipulation */
              <>
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                  className="text-xs font-medium text-slate-700 cursor-pointer rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  <ArrowUpToLine className="w-4 h-4 mr-2 text-slate-400" />{" "}
                  Insérer une ligne au-dessus
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className="text-xs font-medium text-slate-700 cursor-pointer rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  <ArrowDownToLine className="w-4 h-4 mr-2 text-slate-400" />{" "}
                  Insérer une ligne en-dessous
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1 bg-slate-100" />

                <DropdownMenuItem
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  className="text-xs font-medium text-slate-700 cursor-pointer rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  <ArrowLeftToLine className="w-4 h-4 mr-2 text-slate-400" />{" "}
                  Insérer colonne à gauche
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className="text-xs font-medium text-slate-700 cursor-pointer rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  <ArrowRightToLine className="w-4 h-4 mr-2 text-slate-400" />{" "}
                  Insérer colonne à droite
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1 bg-slate-100" />

                <DropdownMenuItem
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className="text-xs font-medium text-rose-600 focus:text-rose-700 cursor-pointer rounded-lg px-3 py-2 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Supprimer la ligne
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className="text-xs font-medium text-rose-600 focus:text-rose-700 cursor-pointer rounded-lg px-3 py-2 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Supprimer la colonne
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  className="text-xs font-bold text-rose-700 focus:text-rose-800 cursor-pointer rounded-lg px-3 py-2 focus:bg-rose-50 mt-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Supprimer tout le tableau
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
        />
        <ContractToolbarButton
          onClick={() => fileInputRef.current?.click()}
          isActive={false}
        >
          <ImageUp />
          <span className="font-normal text-xs">Ajouter</span>
        </ContractToolbarButton>

        <ContractToolbarButton
          onClick={() => editor.chain().focus().setPageBreak().run()}
          isActive={editorState?.isPageBreak ?? false}
        >
          <SeparatorHorizontal className="w-4 h-4" />
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
