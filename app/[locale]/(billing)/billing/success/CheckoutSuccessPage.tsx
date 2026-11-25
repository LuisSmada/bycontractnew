"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useAppDispatch } from "@/src/store/reduxHooks";
import { apiSlice } from "@/src/store/api/apiSlice";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    // On laisse 2 secondes au Webhook Spring Boot pour mettre à jour PostgreSQL
    const syncTimer = setTimeout(() => {
      // On ordonne à Redux de détruire le cache de ces tags.
      // Dès que l'utilisateur naviguera vers le Dashboard, RTK Query refera un appel API frais.
      dispatch(apiSlice.util.invalidateTags(["User", "Subscription"]));

      // La synchronisation est finie, on autorise le clic
      setIsSyncing(false);
    }, 2000);

    return () => clearTimeout(syncTimer);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2 font-display">
          Paiement réussi !
        </h1>

        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Merci pour votre confiance. Votre abonnement BYCONTRACT est maintenant
          actif.
        </p>

        {/* Info-bulle de synchronisation */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 text-left flex items-center gap-4 min-h-18">
          {isSyncing ? (
            <>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Synchronisation...
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configuration de votre espace
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-sm font-bold text-slate-900">
                  Organisation activée
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Création et édition débloquées
                </p>
              </motion.div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push("/fr/dashboard")}
            disabled={isSyncing}
            className="w-full bg-ui-brand hover:bg-ui-brandHover text-white h-11 text-sm font-bold shadow-md shadow-indigo-200 disabled:opacity-50"
          >
            Accéder à mon espace
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
