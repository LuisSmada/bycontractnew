"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronRight,
  Clock,
  FileCode2,
  FileText,
  LayoutTemplate,
  Search,
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

export interface IFindTemplate {
  id: string;
  name: string;
  authorName: string;
  createdAt: string;
  // body, variablesDefinition, etc. ignorés ici pour l'affichage de la liste
  category?: string; // Ajouté pour le visuel
}

interface ITemplateSelectionDialog {
  isTemplateModalOpened: boolean;
  setIsTemplateModalOpened: (value: boolean) => void;
  onSelectTemplate: (template: IFindTemplate) => void;
}

const MOCK_TEMPLATES: IFindTemplate[] = [
  {
    id: "1",
    name: "Accord de Confidentialité (NDA Standard)",
    authorName: "Adam Dupont",
    createdAt: "12 Oct 2026",
    category: "Confidentialité",
  },
  {
    id: "2",
    name: "Contrat de Prestation B2B",
    authorName: "Sophie Dubois",
    createdAt: "05 Sept 2026",
    category: "Services",
  },
  {
    id: "3",
    name: "Contrat de Travail (CDI)",
    authorName: "Equipe RH",
    createdAt: "28 Août 2026",
    category: "Ressources Humaines",
  },
  {
    id: "4",
    name: "Bail Commercial (3-6-9)",
    authorName: "Adam Dupont",
    createdAt: "15 Juil 2026",
    category: "Immobilier",
  },
  {
    id: "5",
    name: "Conditions Générales de Vente (CGV)",
    authorName: "Sophie Dubois",
    createdAt: "02 Juin 2026",
    category: "Commercial",
  },
  {
    id: "6",
    name: "Pacte d'Actionnaires simplifé",
    authorName: "Adam Dupont",
    createdAt: "10 Mai 2026",
    category: "Corporate",
  },
  {
    id: "7",
    name: "Pacte d'Actionnaires simplifé",
    authorName: "Adam Dupont",
    createdAt: "10 Mai 2026",
    category: "Corporate",
  },
  {
    id: "8",
    name: "Pacte d'Actionnaires simplifé",
    authorName: "Adam Dupont",
    createdAt: "10 Mai 2026",
    category: "Corporate",
  },
  {
    id: "9",
    name: "Pacte d'Actionnaires simplifé",
    authorName: "Adam Dupont",
    createdAt: "10 Mai 2026",
    category: "Corporate",
  },
];

export const TemplateSelectionDialog = ({
  isTemplateModalOpened,
  setIsTemplateModalOpened,
  onSelectTemplate,
}: ITemplateSelectionDialog) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrage dynamique
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_TEMPLATES;
    const query = searchQuery.toLowerCase();
    return MOCK_TEMPLATES.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.category?.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <Dialog
      open={isTemplateModalOpened}
      onOpenChange={setIsTemplateModalOpened}
    >
      {/* 
        Modification clé : max-w-[1080px] w-[90vw] 
        Cela force le modal à prendre une grande largeur tout en gardant des marges sur les petits écrans.
      */}
      <DialogContent className=" w-[95vw] max-w-270 sm:max-w-[1080px]  h-[72vh] max-h-[72vh]  p-0 gap-0 bg-slate-50 border-slate-200 shadow-2xl rounded-3xl overflow-hidden text-left">
        {/* HEADER & RECHERCHE (Plus aéré avec p-8) */}
        <DialogHeader className="bg-white border-b border-slate-100 p-8 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                <LayoutTemplate className="w-7 h-7" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-2xl font-bold font-display text-slate-900">
                  Bibliothèque de Modèles
                </DialogTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Explorez et sélectionnez une base pré-configurée pour générer
                  votre document plus rapidement.
                </p>
              </div>
            </div>
          </div>

          {/* BARRE DE RECHERCHE (Agrandie et modernisée) */}
          <div className="relative mt-8 z-10 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom de modèle, type, ou département..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-slate-800 font-medium placeholder-slate-400 shadow-inner"
              autoFocus
            />
          </div>
        </DialogHeader>

        {/* CONTENU (GRILLE DE MODÈLES) */}
        {/* On utilise grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pour aérer et gap-6 */}
        <div className="py-7 px-8 overflow-y-auto max-h-[65vh] custom-scrollbar bg-slate-50/50">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-5">
                <FileText className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Aucun modèle trouvé
              </h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                {"Nous n'avons trouvé aucun modèle correspondant à"}{" "}
                <span className="font-semibold text-slate-700">{`"${searchQuery}"`}</span>
                . Essayez un autre mot-clé ou modifiez vos filtres.
              </p>
              <Button
                onClick={() => setSearchQuery("")}
                className="mt-6 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
              >
                Réinitialiser la recherche
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    onSelectTemplate(template);
                    setIsTemplateModalOpened(false);
                  }}
                  className="group bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden h-48"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 flex items-center justify-center text-slate-400 transition-colors shrink-0">
                        <FileCode2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1.5 block">
                          {template.category}
                        </span>
                        <h3 className="text-[15px] font-bold text-slate-900 leading-tight pr-2">
                          {template.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-5 text-[11px] font-medium text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-20">
                          {template.authorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {template.createdAt}
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 flex items-center justify-center transition-all duration-300">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
