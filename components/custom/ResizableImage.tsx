"use client";

import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/core";
import NextImage from "next/image";
import React, { useRef, useState } from "react";

import { ResizableImageBase, type ImageAlignment } from "./ResizableImageBase";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customImage: {
      setImageAlign: (align: ImageAlignment) => ReturnType;
    };
  }
}

const ResizableImageNode = ({
  node,
  selected,
  updateAttributes,
}: NodeViewProps) => {
  const { src, alt, title, width, align } = node.attrs;

  const [isResizing, setIsResizing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const parsedWidth =
    typeof width === "number" ? width : Number.parseInt(width, 10);

  const currentWidth = Number.isFinite(parsedWidth) ? parsedWidth : 500;

  const currentAlignment: ImageAlignment =
    align === "center" || align === "right" ? align : "left";

  const alignmentClass: Record<ImageAlignment, string> = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  };

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsResizing(true);

    const startX = event.clientX;
    const startWidth = imageRef.current?.clientWidth ?? currentWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const nextWidth = startWidth + moveEvent.clientX - startX;

      updateAttributes({
        width: Math.max(50, nextWidth),
      });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);

      document.removeEventListener("mouseup", onMouseUp);

      setIsResizing(false);
    };

    document.addEventListener("mousemove", onMouseMove);

    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <NodeViewWrapper
      className={`group relative block w-fit ${
        alignmentClass[currentAlignment]
      }`}
      data-align={currentAlignment}
      data-drag-handle
    >
      <NextImage
        ref={imageRef}
        src={src}
        alt={alt || "Imported image"}
        title={title}
        width={currentWidth}
        height={currentWidth}
        unoptimized
        draggable={false}
        className={`block max-w-full rounded-md transition-all ${
          selected ? "ring-2 ring-indigo-500 shadow-md" : ""
        }`}
        style={{
          width: `${currentWidth}px`,
          height: "auto",
        }}
        onDragStart={(event) => event.preventDefault()}
      />

      {selected && (
        <div
          contentEditable={false}
          className={`absolute -right-2 -bottom-2 z-50 h-4 w-4 cursor-nwse-resize rounded-full border-2 border-white bg-indigo-600 shadow-sm ${
            isResizing ? "scale-110" : ""
          }`}
          onMouseDown={onMouseDown}
        />
      )}
    </NodeViewWrapper>
  );
};

export const ResizableImage = ResizableImageBase.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNode);
  },

  addCommands() {
    return {
      ...this.parent?.(),

      setImageAlign:
        (align: ImageAlignment) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, {
            align,
          }),
    };
  },
});
