import { Building2 } from "lucide-react";

export const ContractEditorSide = () => {
  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]  md:flex">
      {/* Onglets du panneau */}
      <div className="flex border-b border-slate-100">
        <button className="flex-1 py-3 text-xs font-bold text-indigo-600 border-b-2 border-indigo-600">
          Paramètres
        </button>
        <button className="flex-1 py-3 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors border-b-2 border-transparent">
          Assistants
        </button>
      </div>

      {/* Contenu du panneau */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="space-y-3">
          <div>
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Informations Générales
            </h4>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Type de document
              </label>
              <select className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-indigo-100 outline-none">
                <option>Accord de confidentialité (NDA)</option>
                <option>Contrat de prestation</option>
                <option>Contrat de travail</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Partie(s) prenante(s)
            </label>
            <div className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">
                Associer une entreprise...
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100"></div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Variables détectées
            </h4>
            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 rounded">
              0
            </span>
          </div>
          <div className="text-center p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-[10px] text-slate-500">
              Aucune variable dynamique <code>{"{{...}}"}</code> détectée dans
              le texte pour le moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
