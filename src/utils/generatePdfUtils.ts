import { PDF_TAILWIND_CSS } from "@/app/lib/pdf/generated-pdf-tailwind";

export const PDF_DOCUMENT_CLASSES = [
  "tiptap",
  "outline-none",
  "font-serif",
  "text-sm",
  "leading-relaxed",
  "text-slate-800",
  "prose",
  "prose-slate",
  "max-w-none",
  "prose-headings:font-serif",
  "prose-headings:font-bold",
].join(" ");

const PDF_PRINT_CSS = `
  @page {
    size: A4;
    margin: 20mm;
  }

  html {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  body {
    margin: 0;
  }

  /* Évite les coupures disgracieuses */

  .tiptap img,
  .tiptap li {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Titres */

  .tiptap h1 {
    margin: 1.5rem 0 0.5rem;
    color: #0f172a;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .tiptap h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
    color: #0f172a;
    font-size: 1.2rem;
    font-weight: 700;
  }

  .tiptap p {
    margin-bottom: 1rem;
  }

  /* Tableaux */

  .tiptap table {
    width: 100%;
    margin-top: 2em;
    margin-bottom: 2em;
    border-collapse: collapse;
  }

  .tiptap thead {
    display: table-header-group;
  }

  .tiptap tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .tiptap table th,
  .tiptap table td {
    padding: 0.75rem !important;
    border: 1px solid #cbd5e1;
    vertical-align: top;
  }

  .tiptap table th {
    background-color: #f8fafc;
    font-weight: 600;
    text-align: left;
  }

  /* Images Tiptap redimensionnables */

  .tiptap img {
    display: block;
    max-width: 100%;
    height: auto;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .tiptap img[data-align="left"] {
    margin-left: 0 !important;
    margin-right: auto !important;
  }

  .tiptap img[data-align="center"] {
    margin-left: auto !important;
    margin-right: auto !important;
  }

  .tiptap img[data-align="right"] {
    margin-left: auto !important;
    margin-right: 0 !important;
  }

  /* Compatibilité avec les anciens documents */

  .tiptap img[style*="margin-left: auto"],
  .tiptap img[style*="margin-left:auto"] {
    display: block !important;
  }

  /* Saut de page personnalisé */

  .tiptap .page-break,
  .tiptap [data-type="page-break"] {
    break-before: page;
    page-break-before: always;
  }
`;

interface CreatePdfHtmlParameters {
  baseUrl: string;
  htmlContent: string;
  title?: string;
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function createPdfHtml({
  baseUrl,
  htmlContent,
  title = "Document BYCONTRACT",
}: CreatePdfHtmlParameters): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        >

        <title>${escapeHtmlAttribute(title)}</title>

        <base href="${escapeHtmlAttribute(baseUrl)}">

        <style>
          ${PDF_TAILWIND_CSS}
          ${PDF_PRINT_CSS}
        </style>
      </head>

      <body class="bg-white">
        <main class="${PDF_DOCUMENT_CLASSES}">
          ${htmlContent}
        </main>
      </body>
    </html>
  `;
}
