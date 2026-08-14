export const downloadContractPdf = async (
  contractId: string,
  isTemplate: boolean,
) => {
  try {
    const routeParam = isTemplate ? "templates" : "contracts";

    //Call the spring boot
    const contractResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${routeParam}/${contractId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!contractResponse.ok) {
      throw new Error(
        `Impossible de récupérer le contrat (${contractResponse.status})`,
      );
    }

    const contract = await contractResponse.json();

    console.log(contract);
    const contractContent = isTemplate
      ? contract.body
      : contract.content.bodyJson;

    if (!contractContent) {
      throw new Error("Le contrat ne contient aucun contenu.");
    }

    //Call NextJS backend
    const pdfResponse = await fetch(
      `/api/contracts/${contract.id}/export-pdf`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: contractContent,
          name: contract.name ?? "contrat",
        }),
      },
    );

    if (!pdfResponse.ok) {
      const errorBody = await pdfResponse.json().catch(() => null);

      throw new Error(
        errorBody?.message ??
          `Impossible de générer le PDF (${pdfResponse.status})`,
      );
    }

    // 2. On récupère la réponse sous forme de Blob (fichier binaire)
    const blob = await pdfResponse.blob();

    // 3. Astuce classique du navigateur pour forcer le téléchargement d'un Blob
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Nettoyage du nom de fichier
    // const safeFileName = defaultFileName
    //   .replace(/[^a-z0-9]/gi, "_")
    //   .toLowerCase();

    // link.setAttribute(
    //   "download",
    //   `${safeFileName}_${contractId.substring(0, 5)}.pdf`,
    // );

    link.download = `${contract.name.split(" ").join("_") ?? "contract"}_${contractId.substring(0, 5)}.pdf`;

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
