-- CreateTable
CREATE TABLE "unidades" (
    "id_unidade" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bloco" TEXT,
    "numero_apartamento" TEXT NOT NULL,
    "id_responsavel" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "unidades_id_responsavel_fkey" FOREIGN KEY ("id_responsavel") REFERENCES "usuarios" ("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "senha" TEXT NOT NULL,
    "tipo_perfil" TEXT NOT NULL,
    "subtipo_morador" TEXT,
    "id_unidade" INTEGER,
    "id_empresa" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "usuarios_id_unidade_fkey" FOREIGN KEY ("id_unidade") REFERENCES "unidades" ("id_unidade") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "usuarios_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas_prestadoras" ("id_empresa") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "empresas_prestadoras" (
    "id_empresa" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_fantasia" TEXT NOT NULL,
    "cnpj" TEXT,
    "frequencia_visita" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "chamados" (
    "id_chamado" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_unidade" INTEGER NOT NULL,
    "id_solicitante" INTEGER NOT NULL,
    "id_empresa_designada" INTEGER,
    "id_tecnico_executor" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'Aberto',
    "descricao_problema" TEXT NOT NULL,
    "laudo_tecnico" TEXT,
    "observacoes" TEXT,
    "data_abertura" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_inicio_atendimento" DATETIME,
    "data_fim_atendimento" DATETIME,
    "data_reagendamento" DATETIME,
    "data_finalizacao" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "chamados_id_unidade_fkey" FOREIGN KEY ("id_unidade") REFERENCES "unidades" ("id_unidade") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chamados_id_solicitante_fkey" FOREIGN KEY ("id_solicitante") REFERENCES "usuarios" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chamados_id_empresa_designada_fkey" FOREIGN KEY ("id_empresa_designada") REFERENCES "empresas_prestadoras" ("id_empresa") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "chamados_id_tecnico_executor_fkey" FOREIGN KEY ("id_tecnico_executor") REFERENCES "usuarios" ("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "historico_chamados" (
    "id_historico" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_chamado" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "acao" TEXT NOT NULL,
    "status_anterior" TEXT,
    "status_novo" TEXT,
    "descricao" TEXT,
    "data_acao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "historico_chamados_id_chamado_fkey" FOREIGN KEY ("id_chamado") REFERENCES "chamados" ("id_chamado") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "historico_chamados_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "materiais_chamado" (
    "id_material" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_chamado" INTEGER NOT NULL,
    "descricao_material" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "status_material" TEXT NOT NULL DEFAULT 'Solicitado',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "materiais_chamado_id_chamado_fkey" FOREIGN KEY ("id_chamado") REFERENCES "chamados" ("id_chamado") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_prestadoras_cnpj_key" ON "empresas_prestadoras"("cnpj");
