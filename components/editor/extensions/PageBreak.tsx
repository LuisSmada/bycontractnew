import { Node, mergeAttributes } from "@tiptap/core";

// Permet à TypeScript de connaître la nouvelle commande
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pageBreak: {
      setPageBreak: () => ReturnType;
    };
  }
}

export const PageBreak = Node.create({
  name: "pageBreak",
  group: "block",
  selectable: true,

  // Ce que Tiptap lit quand il charge un document existant
  parseHTML() {
    return [{ tag: 'hr[data-type="page-break"]' }];
  },

  // Ce que Tiptap écrit dans le DOM
  renderHTML({ HTMLAttributes }) {
    return [
      "hr",
      mergeAttributes(HTMLAttributes, {
        "data-type": "page-break",
        class: "page-break",
      }),
    ];
  },

  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ chain }) => {
          return (
            chain()
              .insertContent({ type: this.name })
              // On ajoute un paragraphe vide en dessous pour pouvoir continuer à écrire
              .insertContent({ type: "paragraph" })
              .focus()
              .run()
          );
        },
    };
  },

  // Le raccourci standard de Word (Ctrl+Entrée ou Cmd+Entrée)
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => this.editor.commands.setPageBreak(),
    };
  },
});
