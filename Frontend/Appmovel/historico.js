function textoHistorico(status) {

  if (status === "Aberto")
    return "🟢 Chamado aberto";

  if (status === "EmAtendimento")
    return "🔵 Atendimento iniciado";

  if (status === "Reagendado")
    return "🟡 Chamado reagendado";

  if (status === "Finalizado")
    return "✅ Chamado finalizado";

  return status;
}

module.exports = textoHistorico;