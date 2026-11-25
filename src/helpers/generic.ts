export function assertsNonNullable<T>(
  val: T,
  msg = "should not be null or undefined",
): asserts val is NonNullable<T> {
  if (val === null || val === undefined) {
    throw new Error(msg);
  }
}

export function assertsIsNumber(val: number): asserts val is number {
  if (typeof val !== "number" || Number.isNaN(val)) {
    throw new Error(`${val} should be a number`);
  }
}

export const sanitizeDate = (dateString: string) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "Date invalide";

  // Formate automatiquement en JJ/MM/AAAA (norme française)
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatForDateInput = (dateString: string): string => {
  if (!dateString) return "";

  // Méthode 1 : Si c'est déjà une string ISO 'YYYY-MM-DDTHH:mm:ss'
  if (dateString.includes("T")) {
    return dateString.split("T")[0];
  }

  // Méthode 2 : Fallback avec l'objet Date
  try {
    const d = new Date(dateString);
    // On s'assure d'avoir YYYY-MM-DD avec les zéros (ex: 2026-08-02)
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

// Utilitaire pour formater la taille du fichier (ex: 2.4 MB)
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const calculateSubscriptionDaysLeft = (
  endDateString: string | undefined,
): number => {
  if (!endDateString) return 0;

  const endDate = new Date(endDateString);
  const today = new Date();

  // On réinitialise les heures, minutes et secondes à zéro
  // pour que la différence se fasse uniquement sur des "jours entiers"
  endDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // Différence en millisecondes
  const diffTime = endDate.getTime() - today.getTime();

  // Si la date de fin est passée (différence négative), on renvoie 0
  if (diffTime <= 0) return 0;

  // Conversion des millisecondes en jours (1000 ms * 60 s * 60 min * 24 h)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};
