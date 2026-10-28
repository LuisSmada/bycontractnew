import { CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BillingSection = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Votre Abonnement
            <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Premium
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {" Vous êtes actuellement sur le plan d'entreprise annuel."}
          </p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
          <CreditCard className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      <div className="p-6 bg-slate-50/50 space-y-6">
        {/* Encart Prix */}
        <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Prochain paiement
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold font-display text-slate-900">
                1 490 €
              </span>
              <span className="text-xs text-slate-500">/ an</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">
              Renouvellement automatique le
            </p>
            <p className="text-sm font-bold text-slate-800">12 Février 2027</p>
          </div>
        </div>

        {/* Moyen de paiement */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Moyen de paiement
          </h3>
          <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
                <span className="text-[10px] font-bold text-slate-600">
                  VISA
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Visa terminant par •••• 4242
                </p>
                <p className="text-[10px] text-slate-500">Expire le 12/28</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Modifier
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <Button
          variant="ghost"
          className="text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50"
        >
          {"Résilier l'abonnement"}
        </Button>
        <Button className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-2">
          <ExternalLink className="w-3.5 h-3.5" />
          Gérer sur Stripe
        </Button>
      </div>
    </div>
  );
};
