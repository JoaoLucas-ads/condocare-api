const textoHistorico = require("./historico");

test("Status Aberto", () => {
  expect(
    textoHistorico("Aberto")
  ).toBe("🟢 Chamado aberto");
});

test("Status Finalizado", () => {
  expect(
    textoHistorico("Finalizado")
  ).toBe("✅ Chamado finalizado");
});

test("Status Reagendado", () => {
  expect(
    textoHistorico("Reagendado")
  ).toBe("🟡 Chamado reagendado");
});