require("dotenv").config();

const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.get("/", (req, res) => {
  res.send("CondoCare API funcionando");
});

app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar usuários",
      erro: error.message
    });
  }
});

app.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, telefone, senha, tipo_perfil, subtipo_morador } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: "Nome, e-mail e senha são obrigatórios."
      });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(400).json({
        mensagem: "Este e-mail já está cadastrado."
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        telefone,
        senha: senhaCriptografada,
        tipo_perfil: tipo_perfil || "Morador",
        subtipo_morador: subtipo_morador || "Proprietario"
      }
    });

    res.json({
      mensagem: "Usuário cadastrado com sucesso",
      usuario
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao cadastrar usuário",
      erro: error.message
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "E-mail e senha são obrigatórios."
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({
        mensagem: "E-mail ou senha inválidos"
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: "E-mail ou senha inválidos"
      });
    }

    res.json({
      mensagem: "Login realizado com sucesso",
      usuario
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao fazer login",
      erro: error.message
    });
  }
});

app.get("/chamados", async (req, res) => {
  try {
    const chamados = await prisma.chamado.findMany({
      include: {
        unidade: true,
        solicitante: true,
        historicos: true
      },
      orderBy: {
        data_abertura: "desc"
      }
    });

    res.json(chamados);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar chamados",
      erro: error.message
    });
  }
});

app.post("/chamados", async (req, res) => {
  try {
    const { condominio, apartamento, id_solicitante, descricao_problema } = req.body;

    if (!condominio || !apartamento || !id_solicitante || !descricao_problema) {
      return res.status(400).json({
        mensagem: "Condomínio, apartamento, solicitante e descrição são obrigatórios."
      });
    }

    const unidade = await prisma.unidade.create({
      data: {
        bloco: condominio,
        numero_apartamento: apartamento
      }
    });

    const chamado = await prisma.chamado.create({
      data: {
        id_unidade: unidade.id_unidade,
        id_solicitante: Number(id_solicitante),
        descricao_problema,
        status: "Aberto"
      }
    });

    await prisma.historicoChamado.create({
      data: {
        id_chamado: chamado.id_chamado,
        id_usuario: Number(id_solicitante),
        acao: "Abertura de chamado",
        status_anterior: null,
        status_novo: "Aberto",
        descricao: "Chamado aberto pelo usuário"
      }
    });

    res.json({
      mensagem: "Chamado criado com sucesso",
      chamado
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao criar chamado",
      erro: error.message
    });
  }
});

app.put("/chamados/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, id_usuario } = req.body;

    if (!status) {
      return res.status(400).json({
        mensagem: "Status é obrigatório."
      });
    }

    const chamadoAtual = await prisma.chamado.findUnique({
      where: {
        id_chamado: Number(id)
      }
    });

    if (!chamadoAtual) {
      return res.status(404).json({
        mensagem: "Chamado não encontrado."
      });
    }

    const chamado = await prisma.chamado.update({
      where: {
        id_chamado: Number(id)
      },
      data: {
        status
      }
    });

    await prisma.historicoChamado.create({
      data: {
        id_chamado: Number(id),
        id_usuario: Number(id_usuario || chamadoAtual.id_solicitante),
        acao: "Alteração de status",
        status_anterior: chamadoAtual.status,
        status_novo: status,
        descricao: `Status alterado de ${chamadoAtual.status} para ${status}`
      }
    });

    res.json({
      mensagem: "Status atualizado com sucesso",
      chamado
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao atualizar status",
      erro: error.message
    });
  }
});

app.get("/historico/:id_chamado", async (req, res) => {
  try {
    const { id_chamado } = req.params;

    const historico = await prisma.historicoChamado.findMany({
      where: {
        id_chamado: Number(id_chamado)
      },
      include: {
        usuario: true
      },
      orderBy: {
        data_acao: "desc"
      }
    });

    res.json(historico);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar histórico",
      erro: error.message
    });
  }
});

app.get("/limpar-usuarios-temporario", async (req, res) => {
  try {
    await prisma.historicoChamado.deleteMany();
    await prisma.chamado.deleteMany();
    await prisma.unidade.deleteMany();
    await prisma.usuario.deleteMany();

    res.json({
      mensagem: "Usuários e dados relacionados apagados com sucesso"
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      mensagem: "Erro ao apagar usuários",
      erro: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});