"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, ExternalLink } from "lucide-react";

export default function SettingsPage() {
  return (
    <div
      id="view-profile"
      className="p-8 w-full mx-auto space-y-8 flex-1 overflow-y-auto no-scrollbar"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-display text-slate-950">
          Paramètres de l Organisation
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gérez votre profil, vos collaborateurs et votre facturation SaaS.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-1">
            <Button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-50 hover:bg-indigo-50 text-indigo-700 transition-colors">
              Profil & Sécurité
            </Button>
            <Button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 bg-transparent hover:bg-slate-100 transition-colors">
              Abonnement & Facturation
            </Button>
            <Button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 bg-transparent hover:bg-slate-100 transition-colors">
              Membres de l équipe
            </Button>
            <Button className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 bg-transparent hover:bg-slate-100 transition-colors">
              Intégrations (API/CRM)
            </Button>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">
                Informations personnelles
              </h2>

              <div className="flex items-center gap-6 mb-8">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200">
                  <Avatar
                    className={"w-20 h-20 flex items-center justify-center"}
                  >
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback>{"AA"}</AvatarFallback>
                  </Avatar>
                  {/* <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80"
                  alt="Adam Dupont"
                  className="w-full h-full object-cover"
                  width={80}
                  height={80}
                /> */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-xs font-semibold">
                      Modifier
                    </span>
                  </div>
                </div>
                <div>
                  <Button className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors">
                    Uploader un avatar
                  </Button>
                  <p className="text-[10px] text-slate-400 mt-2">
                    JPG, GIF ou PNG. Max 1Mo.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Prénom
                  </label>
                  <Input
                    type="text"
                    value="Adam"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Nom
                  </label>
                  <Input
                    type="text"
                    value="Dupont"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Adresse Email
                  </label>
                  <Input
                    type="email"
                    value="adam.dupont@beyond-group.com"
                    disabled
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 outline-none cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-400">
                    Géré par le SSO de votre entreprise.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => {}}
                  className="px-5 py-2 bg-ui-brand text-white text-xs font-bold rounded-xl shadow-sm hover:bg-ui-brandHover transition-colors"
                >
                  Enregistrer les modifications
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Votre Abonnement
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Premium
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Vous êtes actuellement sur le plan d entreprise annuel.
                  </p>
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                </div>
              </div>

              <div className="p-6 bg-slate-50/50 space-y-6">
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
                    <p className="text-sm font-bold text-slate-800">
                      12 Février 2027
                    </p>
                  </div>
                </div>

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
                        <p className="text-[10px] text-slate-500">
                          Expire le 12/28
                        </p>
                      </div>
                    </div>
                    <Button className="text-xs font-semibold bg-transparent hover:bg-transparent text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer">
                      Modifier
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <Button className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors bg-transparent hover:bg-transparent cursor-pointer">
                  Résilier l abonnement
                </Button>
                <Button
                  onClick={() => {}}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Gérer sur Stripe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
