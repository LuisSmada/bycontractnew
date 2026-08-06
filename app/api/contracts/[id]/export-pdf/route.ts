import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TableKit } from "@tiptap/extension-table";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { ResizableImageBase } from "@/components/custom/ResizableImageBase";
import { createPdfHtml } from "@/src/utils/generatePdfUtils";
import { JSONContent } from "@tiptap/react";

interface ExportPdfRequestBody {
  name?: string;
  body: JSONContent;
}

interface ErrorResponseBody {
  error: string;
  message?: string;
}

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: Request, { params }: RouteContext): Promise<NextResponse> {

  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;
  let requestBody: ExportPdfRequestBody;

  try {

    const { id: contractId } = await params;

    try {
      requestBody = (await request.json()) as ExportPdfRequestBody;
    } catch {
      return NextResponse.json<ErrorResponseBody>(
        {
          error: "Le corps de la requête n'est pas un JSON valide.",
        },
        {
          status: 400,
        },
      );
    }

    const { body: jsonBody, name } = requestBody;

    if (!jsonBody) {
      return NextResponse.json(
        { error: "Le document ne contient aucun contenu." },
        { status: 422 },
      );
    }

    const url = new URL(request.url);

    // 2. TRES IMPORTANT : Convertir le JSON Tiptap en HTML pur CÔTÉ SERVEUR
    // Pas besoin d'afficher l'éditeur, @tiptap/html fait la traduction !
    const htmlContent = generateHTML(jsonBody, [
      StarterKit,
      ResizableImageBase,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Subscript,
      Superscript,
      TableKit,
      TextStyle, // Obligatoire pour utiliser FontFamily
      FontFamily,
    ]);

    const fullHtmled = createPdfHtml({
      baseUrl: url.origin,
      htmlContent,
      title: name ?? `Document ${contractId}`,
    });

    // 4. Lancer Puppeteer (navigateur invisible)
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Injecter notre HTML
    await page.setContent(fullHtmled, {
      waitUntil: "load",
      timeout: 30_000,
    });

    await page.evaluate(async () => {
      await document.fonts.ready;

      await Promise.all(
        Array.from(document.images).map((image) => {
          if (image.complete) {
            return Promise.resolve();
          }

          return new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), {
              once: true,
            });

            image.addEventListener("error", () => resolve(), {
              once: true,
            });
          });
        }),
      );
    });

    // 5. Générer le PDF
    const pdfBytes = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      waitForFonts: true,
    });

    await browser.close();

    const pdfBuffer = Buffer.from(pdfBytes);

    // 6. Renvoyer le fichier PDF au Frontend
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="contrat_${contractId}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Erreur serveur lors de la génération PDF :", error);
    return NextResponse.json(
      {
        error: "Erreur de génération PDF",
        message: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    );
  } finally {
    await browser?.close();
  }
}
