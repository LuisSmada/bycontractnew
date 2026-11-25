"use client";

import {
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  FileText,
  Receipt,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  EInvoiceStatus,
  ISubscriptionInvoiceResponse,
} from "@/src/types/apiResponseType";
import { useGetInvoicesQuery } from "@/src/store/api/subscriptionsApiSlice";
import { useState } from "react";

const STATUS_CONFIG: Record<
  EInvoiceStatus,
  { label: string; className: string }
> = {
  paid: {
    label: "Payée",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  open: {
    label: "En attente",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  void: {
    label: "Annulée",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  uncollectible: {
    label: "Impayée",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
  draft: {
    label: "Brouillon",
    className: "bg-slate-100 text-slate-500 border-slate-200",
  },
};

const formatDate = (isoDate: string) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
};

const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
};

const INITIAL_VISIBLE_COUNT = 5;

export const InvoicesSection = () => {
  const { data: invoices, isLoading, isError } = useGetInvoicesQuery();

  const [showAll, setShowAll] = useState(false);

  const visibleInvoices = showAll
    ? invoices
    : invoices?.slice(0, INITIAL_VISIBLE_COUNT);

  const hasMore = (invoices?.length ?? 0) > INITIAL_VISIBLE_COUNT;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Historique des factures
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Téléchargez vos justificatifs comptables au format PDF.
          </p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
          <Receipt className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        {isLoading && (
          <div className="py-10 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Spinner className="size-5 text-indigo-600" />
            <p className="text-xs">Chargement de vos factures...</p>
          </div>
        )}

        {isError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            Impossible de récupérer vos factures pour le moment.
          </div>
        )}

        {!isLoading && !isError && (!invoices || invoices.length === 0) && (
          <div className="py-10 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Aucune facture disponible
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Vos factures apparaîtront ici dès votre premier paiement.
            </p>
          </div>
        )}

        {!isLoading && !isError && invoices && invoices.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-3">Facture</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Montant</th>
                  <th className="pb-3">Statut</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {invoices.map((invoice: ISubscriptionInvoiceResponse) => {
                  const statusInfo =
                    STATUS_CONFIG[invoice.status] ?? STATUS_CONFIG.open;

                  return (
                    <tr
                      key={invoice.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 font-mono text-xs font-semibold text-slate-800">
                        {invoice.number || "—"}
                      </td>
                      <td className="py-3.5 text-xs text-slate-600">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="py-3.5 text-xs font-bold text-slate-900">
                        {formatAmount(invoice.amount, invoice.currency)}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border",
                            statusInfo.className,
                          )}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {invoice.hostedInvoiceUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs text-slate-500 hover:text-slate-900"
                              title="Voir la facture en ligne"
                            >
                              <a
                                href={invoice.hostedInvoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </Button>
                          )}

                          {invoice.invoicePdfUrl && (
                            <a
                              href={invoice.invoicePdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className={cn(
                                buttonVariants({
                                  variant: "outline",
                                  size: "sm",
                                }),
                                "h-8 px-3 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-50",
                              )}
                            >
                              <Download className="w-3.5 h-3.5 mr-1.5" />
                              PDF
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {hasMore && (
              <div className="pt-4 mt-2 border-t border-slate-100 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 gap-1.5"
                >
                  {showAll ? (
                    <>
                      Réduire la liste
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      Voir toutes les factures ({invoices?.length})
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
