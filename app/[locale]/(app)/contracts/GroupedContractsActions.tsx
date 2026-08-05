import { PenTool, Download, Archive } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

interface IGroupedContractsActions {
  selectedIds: string[];
}

export const GroupedContractsActions = ({
  selectedIds,
}: IGroupedContractsActions) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      exit={{ y: 100, opacity: 0, x: "-50%" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="fixed bottom-8 left-1/2 bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-6 z-50"
    >
      <div className="flex items-center gap-2 border-r border-slate-700 pr-6">
        <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center shadow-inner">
          {selectedIds.length}
        </span>
        <span className="text-xs font-medium text-slate-300">
          document(s) sélectionné(s)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-900/50">
          <PenTool className="w-3.5 h-3.5" />
          Signer groupé
        </button>
        <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2">
          <Download className="w-3.5 h-3.5" />
          Télécharger .ZIP
        </button>
        <button className="text-rose-400 hover:bg-rose-500/10 text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2">
          <Archive className="w-3.5 h-3.5" />
          Archiver
        </button>
      </div>
    </motion.div>
  );
};
