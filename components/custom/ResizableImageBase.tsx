import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

export type ImageAlignment = "left" | "center" | "right";

export const ResizableImageBase = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      align: {
        default: "left",

        parseHTML: (element: HTMLElement): ImageAlignment => {
          const align = element.getAttribute("data-align");

          if (align === "center" || align === "right") {
            return align;
          }

          return "left";
        },
      },

      width: {
        default: null,

        parseHTML: (element: HTMLElement) => {
          const attributeWidth = element.getAttribute("width");
          const styleWidth = element.style.width;

          if (attributeWidth) {
            return Number.parseInt(attributeWidth, 10);
          }

          if (styleWidth) {
            return Number.parseInt(styleWidth, 10);
          }

          return null;
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const align = (
      HTMLAttributes.align === "center" || HTMLAttributes.align === "right"
        ? HTMLAttributes.align
        : "left"
    ) as ImageAlignment;

    const parsedWidth =
      typeof HTMLAttributes.width === "number"
        ? HTMLAttributes.width
        : Number.parseInt(HTMLAttributes.width, 10);

    const width = Number.isFinite(parsedWidth) ? `${parsedWidth}px` : "auto";

    const alignmentStyles: Record<ImageAlignment, string> = {
      left: "margin-left: 0; margin-right: auto;",
      center: "margin-left: auto; margin-right: auto;",
      right: "margin-left: auto; margin-right: 0;",
    };

    const {
      align: _align,
      width: _width,
      style: existingStyle,
      ...attributes
    } = HTMLAttributes;

    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, attributes, {
        "data-align": align,
        width: Number.isFinite(parsedWidth) ? parsedWidth : undefined,
        style: [
          "display: block",
          "max-width: 100%",
          "height: auto",
          `width: ${width}`,
          alignmentStyles[align],
          existingStyle,
        ]
          .filter(Boolean)
          .join("; "),
      }),
    ];
  },
});
