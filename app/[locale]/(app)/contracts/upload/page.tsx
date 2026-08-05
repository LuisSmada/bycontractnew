"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, CloudUpload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function UploadContractPage() {
  const router = useRouter();

  const uploadButtonRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="p-8 w-full mx-auto space-y-8 flex-1 ">
      <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={() => router.back()}
          className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer bg-transparent hover:bg-transparent"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display text-slate-950">
            Import IA & Audit
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Glissez un PDF ou un Word. L Intelligence Artificielle extraira
            automatiquement les métadonnées clés.
          </p>
        </div>
      </div>

      <div
        onClick={() => {
          uploadButtonRef.current?.click();
        }}
        id="import-step-1"
        className="flex-1 flex items-center justify-center "
      >
        <div
          className="w-full max-w-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50/80 hover:border-indigo-400 transition-all rounded-3xl p-16 flex flex-col items-center justify-center text-center cursor-pointer group"
          onClick={() => {}}
        >
          <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <CloudUpload className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 font-display">
            Glissez votre document ici
          </h3>
          <input type="file" ref={uploadButtonRef} className="hidden" />
          <p className="text-sm text-slate-500 mt-2 max-w-sm">
            Formats acceptés : PDF (pour audit OCR) ou DOCX (pour édition
            riche). Max 25MB.
          </p>
          <div className="mt-8 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-700 text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all pointer-events-none">
            Parcourir mes fichiers
          </div>
        </div>
      </div>

      {/* <div id="import-step-2" className="flex-1 flex-col items-center justify-center hidden">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <svg className="animate-spin w-full h-full text-indigo-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="30 60"></circle></svg>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 font-display">Analyse sémantique en cours...</h3>
              <p id="processing-text" className="text-sm text-slate-500 mt-2">Lecture du PDF via OCR...</p>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div id="import-progress" className="bg-indigo-600 h-2 rounded-full w-0 transition-all duration-300"></div>
            </div>
          </div>
        </div> */}
    </div>
  );
}
