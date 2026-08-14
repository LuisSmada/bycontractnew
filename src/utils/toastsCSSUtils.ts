const baseStyle = {
  color: "#ffffff", // Texte en blanc
  borderRadius: "0.75rem", // Bords arrondis (rounded-xl)
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)", // Ombre prononcée
};

export const TOASTSTYLES = {
  // 🟢 SUCCÈS (Vert sombre élégant)
  SUCCESS: {
    ...baseStyle,
    backgroundColor: "#022c22", // emerald-950
    border: "1px solid #065f46", // emerald-800
  },

  // 🔵 INFO (Indigo sombre / Bleu nuit)
  INFO: {
    ...baseStyle,
    backgroundColor: "#1e1b4b", // indigo-950
    border: "1px solid #3730a3", // indigo-800
  },

  // 🟠 ATTENTION / AVERTISSEMENT (Ambre sombre)
  WARNING: {
    ...baseStyle,
    backgroundColor: "#451a03", // amber-950
    border: "1px solid #92400e", // amber-800
  },

  // 🔴 ERREUR / DANGER (Rose sombre / Rouge)
  ERROR: {
    ...baseStyle,
    backgroundColor: "#4c0519", // rose-950
    border: "1px solid #9f1239", // rose-800
  },

  // ⏳ CHARGEMENT / PROMESSE (Slate très sombre, style par défaut)
  LOADING: {
    ...baseStyle,
    backgroundColor: "#0f172a", // slate-900
    border: "1px solid #1e293b", // slate-800
  },

  // ⚪ MESSAGE STANDARD / CUSTOM / DISMISS (Noir profond)
  DEFAULT: {
    ...baseStyle,
    backgroundColor: "#020617", // slate-950
    border: "1px solid #1e293b", // slate-800
  },
};
