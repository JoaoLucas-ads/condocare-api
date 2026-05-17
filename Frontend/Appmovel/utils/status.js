export function corStatus(status) {
  switch (status) {
    case "Aberto":
      return {
        fundo: "#DBEAFE",
        texto: "#1D4ED8"
      };

    case "EmAtendimento":
      return {
        fundo: "#FEF3C7",
        texto: "#92400E"
      };

    case "Reagendado":
      return {
        fundo: "#E0E7FF",
        texto: "#3730A3"
      };

    case "Finalizado":
      return {
        fundo: "#DCFCE7",
        texto: "#166534"
      };

    default:
      return {
        fundo: "#E5E7EB",
        texto: "#374151"
      };
  }
}