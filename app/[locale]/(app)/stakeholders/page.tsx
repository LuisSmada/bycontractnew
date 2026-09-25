"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllMyCompaniesQuery } from "@/src/store/api/companiesApiSlice";
import { Plus, Search } from "lucide-react";
import { StakeholderCard } from "./StakeholderCard";
import { SkeletonStakeHolder } from "./SkeletonStakeHolder";

export default function StakeholdersPage() {
  const { data: stakeholders, isLoading } = useGetAllMyCompaniesQuery();

  return (
    <div
      id="view-parties"
      className="p-8  w-full mx-auto space-y-8 flex-1 overflow-y-auto no-scrollbar"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display text-slate-950">
            Annuaire des Tiers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gérez vos clients, fournisseurs et partenaires liés à vos contrats.
          </p>
        </div>
        <Button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          Ajouter un tiers
        </Button>
      </div>

      <div className="relative max-w-md">
        <Input
          type="text"
          placeholder="Rechercher une entreprise ou un contact..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && <SkeletonStakeHolder />}
        {!isLoading &&
          stakeholders &&
          stakeholders.map((sth) => {
            const clientType = sth.siret ? "Client B2B" : "Client B2C";
            return (
              <StakeholderCard
                key={sth.id}
                name={sth.name}
                role={clientType}
                activeContracts={0}
                address={sth.address}
                mainContact={`${sth.mainContact.firstName} ${sth.mainContact.lastName}`}
              />
            );
          })}
      </div>
    </div>
  );
}
