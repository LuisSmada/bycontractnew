export const downloadContractPdf = async (
  contractId: string,
  defaultFileName = "contrat",
) => {
  try {
    // 1. On appelle notre route API backend
    const response = await fetch(`/api/contracts/${contractId}/export-pdf`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la génération du PDF");
    }

    // 2. On récupère la réponse sous forme de Blob (fichier binaire)
    const blob = await response.blob();

    // 3. Astuce classique du navigateur pour forcer le téléchargement d'un Blob
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Nettoyage du nom de fichier
    const safeFileName = defaultFileName
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    link.setAttribute(
      "download",
      `${safeFileName}_${contractId.substring(0, 5)}.pdf`,
    );

    document.body.appendChild(link);
    link.click(); // Simule le clic

    // Nettoyage de la mémoire
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Échec du téléchargement PDF :", error);
    alert("Impossible de générer le PDF pour le moment.");
  }
};
