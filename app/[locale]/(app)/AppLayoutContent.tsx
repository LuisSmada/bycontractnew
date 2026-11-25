"use client";

import { FC, ReactNode, useEffect } from "react";
import { BillingBanner } from "@/components/custom/BillingBanner";
import { LoadingScreen } from "@/components/custom/LoadingScreen";
import { Sidebar } from "@/components/custom/Sidebar";
import { Topbar } from "@/components/custom/Topbar";
import { useGetCurrentUserQuery } from "@/src/store/api/authApiSlice";
import { useAppDispatch } from "@/src/store/reduxHooks";
import { setCurrentUser } from "@/src/store/slices/applicationSlice/applicationSlice";
import { useRouter } from "next/navigation";
import { EUserRole } from "@/src/model/entities";
import { useGetSubscriptionStatusQuery } from "@/src/store/api/subscriptionsApiSlice";

interface IAppLayoutContent {
  children: ReactNode;
}

export const AppLayoutContent: FC<IAppLayoutContent> = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: user, isLoading, isError } = useGetCurrentUserQuery();
  const { data: subscriptionData } = useGetSubscriptionStatusQuery();

  const isSuperAdmin = user?.role === EUserRole.SUPER_ADMIN;

  useEffect(() => {
    // Si la requête s'arrête et qu'elle est en erreur (ex: cookie expiré ou absent)
    // On redirige immédiatement vers la page de connexion
    if (!isLoading && isError) {
      router.push("/fr/login");
    }
  }, [isLoading, isError, router]);

  useEffect(() => {
    if (user) {
      dispatch(setCurrentUser(user));
    }
  }, [dispatch, user]);

  // Pendant que le backend vérifie le cookie HttpOnly, on affiche un écran d'attente

  if (isLoading) {
    return (
      <LoadingScreen message="Préparation de votre espace de travail..." />
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex bg-gray-50 flex-col relative overflow-x-hidden">
        <Topbar />
        <Sidebar />

        <div className="flex flex-1 flex-col w-full md:pl-20 pt-14">
          {!isSuperAdmin && subscriptionData && (
            <BillingBanner subscriptionData={subscriptionData} />
          )}
          <main className="flex-1 w-full">{children}</main>
        </div>
      </div>
    );
  }

  return null;
};
