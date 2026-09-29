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
    month: "2-digit",
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
