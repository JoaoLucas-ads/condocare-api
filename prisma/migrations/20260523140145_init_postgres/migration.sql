-- CreateEnum
CREATE TYPE "TipoPerfil" AS ENUM ('Administrador', 'Sindico', 'Morador', 'Tecnico');

-- CreateEnum
CREATE TYPE "SubtipoMorador" AS ENUM ('Proprietario', 'Locatario', 'Dependente');

-- CreateEnum
CREATE TYPE "FrequenciaVisita" AS ENUM ('Diario', 'Semanal', 'Quinzenal', 'Mensal');

-- CreateEnum
CREATE TYPE "StatusChamado" AS ENUM ('Aberto', 'EmAtendimento', 'Reagendado', 'Finalizado', 'Cancelado');

-- CreateEnum
CREATE TYPE "StatusMaterial" AS ENUM ('Solicitado', 'Aprovado', 'Comprado', 'Utilizado');

-- CreateTable
CREATE TABLE "unidades" (
    "id_unidade" SERIAL NOT NULL,
    "bloco" TEXT,
    "numero_apartamento" TEXT NOT NULL,
    "id_responsavel" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id_unidade")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "senha" TEXT NOT NULL,
    "tipo_perfil" "TipoPerfil" NOT NULL,
    "subtipo_morador" "SubtipoMorador",
    "id_unidade" INTEGER,
    "id_empresa" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "empresas_prestadoras" (
    "id_empresa" SERIAL NOT NULL,
    "nome_fantasia" TEXT NOT NULL,
    "cnpj" TEXT,
    "frequencia_visita" "FrequenciaVisita" NOT NULL,
    "especialidade" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresas_prestadoras_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "chamados" (
    "id_chamado" SERIAL NOT NULL,
    "id_unidade" INTEGER NOT NULL,
    "id_solicitante" INTEGER NOT NULL,
    "id_empresa_designada" INTEGER,
    "id_tecnico_executor" INTEGER,
    "status" "StatusChamado" NOT NULL DEFAULT 'Aberto',
    "descricao_problema" TEXT NOT NULL,
    "laudo_tecnico" TEXT,
    "observacoes" TEXT,
    "data_abertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_inicio_atendimento" TIMESTAMP(3),
    "data_fim_atendimento" TIMESTAMP(3),
    "data_reagendamento" TIMESTAMP(3),
    "data_finalizacao" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chamados_pkey" PRIMARY KEY ("id_chamado")
);

-- CreateTable
CREATE TABLE "historico_chamados" (
    "id_historico" SERIAL NOT NULL,
    "id_chamado" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "acao" TEXT NOT NULL,
    "status_anterior" TEXT,
    "status_novo" TEXT,
    "descricao" TEXT,
    "data_acao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_chamados_pkey" PRIMARY KEY ("id_historico")
);

-- CreateTable
CREATE TABLE "materiais_chamado" (
    "id_material" SERIAL NOT NULL,
    "id_chamado" INTEGER NOT NULL,
    "descricao_material" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "status_material" "StatusMaterial" NOT NULL DEFAULT 'Solicitado',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "materiais_chamado_pkey" PRIMARY KEY ("id_material")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_prestadoras_cnpj_key" ON "empresas_prestadoras"("cnpj");

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_id_responsavel_fkey" FOREIGN KEY ("id_responsavel") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_unidade_fkey" FOREIGN KEY ("id_unidade") REFERENCES "unidades"("id_unidade") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas_prestadoras"("id_empresa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamados" ADD CONSTRAINT "chamados_id_unidade_fkey" FOREIGN KEY ("id_unidade") REFERENCES "unidades"("id_unidade") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamados" ADD CONSTRAINT "chamados_id_solicitante_fkey" FOREIGN KEY ("id_solicitante") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamados" ADD CONSTRAINT "chamados_id_empresa_designada_fkey" FOREIGN KEY ("id_empresa_designada") REFERENCES "empresas_prestadoras"("id_empresa") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamados" ADD CONSTRAINT "chamados_id_tecnico_executor_fkey" FOREIGN KEY ("id_tecnico_executor") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_chamados" ADD CONSTRAINT "historico_chamados_id_chamado_fkey" FOREIGN KEY ("id_chamado") REFERENCES "chamados"("id_chamado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_chamados" ADD CONSTRAINT "historico_chamados_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materiais_chamado" ADD CONSTRAINT "materiais_chamado_id_chamado_fkey" FOREIGN KEY ("id_chamado") REFERENCES "chamados"("id_chamado") ON DELETE RESTRICT ON UPDATE CASCADE;
