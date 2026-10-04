import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import { TOASTSTYLES } from "./toastsCSSUtils";

export const responseErrorApi = (e: unknown) => {
  const error = e as FetchBaseQueryError;

  if (error?.status === 400 || error?.status === 422) {
    toast.error(
      "Des informations sont manquantes ou invalides. Veuillez vérifier les champs.",
      {
        position: "top-right",
        style: TOASTSTYLES.ERROR,
      },
    );
  } else if (error?.status === 401 || error?.status === 403) {
    toast.error(
      "Vous n'avez pas les droits nécessaires ou votre session a expiré.",
      {
        position: "top-right",
        style: TOASTSTYLES.ERROR,
      },
    );
  } else {
    toast.error("Une erreur est survenue lors de la connexion au serveur.", {
      position: "top-right",
      style: TOASTSTYLES.ERROR,
    });
  }
};
