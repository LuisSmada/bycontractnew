"use client";

import { Sidebar } from "@/components/custom/Sidebar";
import { Topbar } from "@/components/custom/Topbar";
import { useGetCurrentUserQuery } from "@/src/store/api/authApiSlice";
import { useAppDispatch } from "@/src/store/reduxHooks";
import { setCurrentUser } from "@/src/store/slices/applicationSlice/applicationSlice";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: user, isLoading, isError } = useGetCurrentUserQuery();

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
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <p className="text-sm font-medium text-gray-500">
          Chargement de la session...
        </p>
      </div>
    );
  }

  if (user) {
    console.log(user);
    return (
      <div className="min-h-screen flex bg-gray-50 flex-col relative overflow-x-hidden">
        <Topbar />
        <Sidebar />
        <div className="flex flex-1 md:pl-20 w-full">{children}</div>
      </div>
    );
  }

  return null;
}
