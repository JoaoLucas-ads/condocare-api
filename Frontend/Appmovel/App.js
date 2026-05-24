import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { corStatus } from './utils/status.js';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vibration } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
const STORAGE_KEY ='@chamados';

async function salvarChamados(lista){
  await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(lista));
}

async function carregarChamados(){
  const dados =await AsyncStorage.getItem(STORAGE_KEY);
  return dados ? JSON.parse(dados) : [];
}
function criptografar(texto) {
  return texto.split('').reverse().join('');
}

function descriptografar(texto) {
  return texto.split('').reverse().join('');
}
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const chamadosData = [
  {
    id: '1',
    titulo: 'Sem sinal de TV',
    status: 'Aberto',
    condominio: 'Condomínio Azul',
    apartamento: '101',
    observacao: 'Morador informou ausência total de sinal.',
  },
  {
    id: '2',
    titulo: 'Interfone não funciona',
    status: 'Em atendimento',
    condominio: 'Residencial Sol',
    apartamento: '202',
    observacao: 'Sem comunicação com a portaria.',
  },
  {
    id: '3',
    titulo: 'Portão com defeito',
    status: 'Pendente',
    condominio: 'Condomínio Green',
    apartamento: 'Bloco A',
    observacao: 'Portão eletrônico com falha ao abrir.',
  },
];

function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function fazerLogin() {
    if (!email || !senha) {
      Alert.alert("Atenção", "Digite seu e-mail e sua senha.");
      return;
    }

    try {
      const resposta = await fetch("https://condocare-api.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          senha: senha
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        Alert.alert("Erro", dados.mensagem || "E-mail ou senha inválidos.");
        return;
      }

      await AsyncStorage.setItem(
        "usuarioLogado",
        JSON.stringify(dados.usuario)
      );

      Alert.alert("Sucesso", "Login realizado com sucesso.");
      route.params.funcLogar(true);

    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar com o servidor.");
    }
  }

  return (
    <SafeAreaView style={styles.LoginContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <View style={styles.loginTopArea}>
        <Text style={styles.loginBrand}>CONDOCARE</Text>
        <Text style={styles.loginTitle}>Acesse sua conta</Text>
        <Text style={styles.loginSubtitle}>
          Entre para gerenciar chamados e acompanhar atendimentos do condomínio.
        </Text>
      </View>

      <View style={styles.loginCard}>
        <Text style={styles.inputLabel}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#94a3b8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.inputLabel}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={fazerLogin}
        >
          <Text style={styles.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Registrar")}
        >
          <Text style={styles.secondaryButtonText}>Criar conta</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.loginFooter}>
        Sistema de chamados para manutençaõ de condomínios
      </Text>
    </SafeAreaView>
  );
}

function RegistrarScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function cadastrarUsuario() {
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Preencha nome, e-mail e senha.");
      return;
    }

    try {
      const resposta = await fetch("https://condocare-api.onrender.com/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          telefone: "",
          senha: senha,
          tipo_perfil: "Morador",
          subtipo_morador: "Proprietario"
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        Alert.alert("Erro", dados.mensagem || "Erro ao cadastrar usuário.");
        return;
      }

      Alert.alert("Sucesso", "Cadastro realizado com sucesso.");
      navigation.goBack();

    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar com o servidor.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.centerContent}>
        <Text style={styles.mainTitle}>Registrar</Text>

        <Text style={styles.subtitle}>
          Preencha os dados para criar seu acesso
        </Text>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Nome</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#94A3B8"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.inputLabel}>E-mail</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.inputLabel}>Senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Crie uma senha"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={cadastrarUsuario}
          >
            <Text style={styles.primaryButtonText}>
              Finalizar cadastro
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
}

function HomeScreen({ navigation }) {

  const [totalChamados, setTotalChamados] = useState(0);
  const [pendentes, setPendentes] = useState(0);
  const [abertos, setAbertos] = useState(0);
  const [emAtendimento, setEmAtendimento] = useState(0);
  const [reagendados, setReagendados] = useState(0);
  const [finalizados, setFinalizados] = useState(0);

  async function carregarDashboard() {
    try {

      const usuarioSalvo = await AsyncStorage.getItem("usuarioLogado");
      const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

      const resposta = await fetch(
        "https://condocare-api.onrender.com/chamados"
      );

      const dados = await resposta.json();

      let chamadosFiltrados = dados;

      if (usuario?.tipo_perfil === "Morador") {
        chamadosFiltrados = dados.filter(
          item => item.id_solicitante === usuario.id_usuario
        );
      }

      if (usuario?.tipo_perfil === "Tecnico") {
        chamadosFiltrados = dados.filter(
          item => item.id_tecnico_executor === usuario.id_usuario
        );
      }

      setTotalChamados(chamadosFiltrados.length);

      const chamadosAbertos = chamadosFiltrados.filter(
        item => item.status === "Aberto"
      );

      const chamadosEmAtendimento = chamadosFiltrados.filter(
        item => item.status === "EmAtendimento"
      );

      const chamadosReagendados = chamadosFiltrados.filter(
        item => item.status === "Reagendado"
      );

      const chamadosFinalizados = chamadosFiltrados.filter(
        item => item.status === "Finalizado"
      );

      const chamadosPendentes = chamadosFiltrados.filter(
        item =>
          item.status === "Aberto" ||
          item.status === "Reagendado"
      );

      setAbertos(chamadosAbertos.length);
      setEmAtendimento(chamadosEmAtendimento.length);
      setReagendados(chamadosReagendados.length);
      setFinalizados(chamadosFinalizados.length);
      setPendentes(chamadosPendentes.length);

    } catch (error) {
      console.log(error);
    }
  }
  
useEffect(() => {
  const unsubscribe = navigation.addListener("focus", () => {
    carregarDashboard();
  });

  return unsubscribe;
}, [navigation]);

  return(
    <ScrollView contentContainerStyle={styles.homeContainer}>
      <View style={styles.homeHeader}>
        <Text style={styles.homeGreeting}>Bem-Vinda</Text>
        <Text style={styles.homeTitle}>Painel de Controle</Text>
        <Text style={styles.homeSubtitle}>
          Acompanhe os principais dados do sistema de manutenção
        </Text>
      </View>

      <View style={styles.homeHighlightCard}>
        <Text style={styles.homeHighlightTitle}>Visão geral</Text>

        <Text style={styles.homeHighlightText}>
          Gerencie chamados,acompanhe atendimentos e organize a rotina técnica
          fos condomínios de forma prática.
        </Text>
      </View>

      <View style={styles.homeMetricsRow}>
        <View style={styles.homeMetricCard}>
          <Text style={styles.homeMetricNumber}>
            {totalChamados}
          </Text>

          <Text style={styles.homeMetricLabel}>
            Chamados
          </Text>
        </View>

        <View style={styles.homeMetricCard}>
          <Text style={styles.homeMetricNumber}>
            {pendentes}
          </Text>

          <Text style={styles.homeMetricLabel}>
            Pendentes
          </Text>
        </View>
      </View>

      <View style={styles.homeMetricsRow}>
        <View style={styles.homeMetricCard}>
          <Text style={styles.homeMetricNumber}>
            {abertos}
          </Text>

          <Text style={styles.homeMetricLabel}>
            Abertos
          </Text>
        </View>

        <View style={styles.homeMetricCard}>
          <Text style={styles.homeMetricNumber}>
            {emAtendimento}
          </Text>

          <Text style={styles.homeMetricLabel}>
            Em atendimento
          </Text>
        </View>
      </View>

      <View style={styles.homeMetricsRow}>
        <View style={styles.homeMetricCard}>
          <Text style={styles.homeMetricNumber}>
            {reagendados}
          </Text>

          <Text style={styles.homeMetricLabel}>
            Reagendados
          </Text>
        </View>

        <View style={styles.homeMetricCard}>
          <Text style={styles.homeMetricNumber}>
            {finalizados}
          </Text>

          <Text style={styles.homeMetricLabel}>
            Finalizados
          </Text>
        </View>
      </View>

      <View style={styles.homeActionCard}>
        <Text style={styles.homeActionTitle}>
          Acesso rápido
        </Text>

        <TouchableOpacity
          style={styles.homeActionButton}
          onPress={() => navigation.navigate('ChamadosTab')}
        >
          <Text style={styles.homeActionButtonText}>
            Ver chamados
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  )
}

function PerfilScreen() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function carregarUsuario() {
      const usuarioSalvo = await AsyncStorage.getItem("usuarioLogado");

      if (usuarioSalvo) {
        setUsuario(JSON.parse(usuarioSalvo));
      }
    }

    carregarUsuario();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Perfil</Text>
      <View style={styles.card}>
        <Text style={styles.detailLabel}>Nome</Text>
        <Text style={styles.detailValue}>
          {usuario?.nome || "Usuária do Sistema"}
        </Text>

        <Text style={styles.detailLabel}>Tipo de acesso</Text>
        <Text style={styles.detailValue}>
          {usuario?.tipo_perfil || "Administrador"}
        </Text>

        <Text style={styles.detailLabel}>E-mail</Text>
        <Text style={styles.detailValue}>
          {usuario?.email || "usuario@email.com"}
        </Text>
      </View>
    </View>
  );
}

function ChamadosScreen({ navigation }) {
  const [lista, setLista] = useState([]);
  const [listaOriginal, setListaOriginal] = useState([]);
  const [tipoPerfil, setTipoPerfil] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      carregar();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    aplicarFiltros();
  }, [busca, filtroStatus, listaOriginal]);

  async function carregar() {
    try {
      const usuarioSalvo = await AsyncStorage.getItem("usuarioLogado");
      const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

      setTipoPerfil(usuario?.tipo_perfil || "");

      const resposta = await fetch("https://condocare-api.onrender.com/chamados");
      const dados = await resposta.json();

      let chamadosFiltrados = dados;

      if (usuario?.tipo_perfil === "Morador") {
        chamadosFiltrados = dados.filter(
          item => item.id_solicitante === usuario.id_usuario
        );
      }

      if (usuario?.tipo_perfil === "Tecnico") {
        chamadosFiltrados = dados.filter(
          item => item.id_tecnico_executor === usuario.id_usuario
        );
      }

      const chamadosFormatados = chamadosFiltrados.map((item) => ({
        id: item.id_chamado.toString(),
        titulo: item.descricao_problema,
        status: item.status,
        condominio: item.unidade ? `Bloco ${item.unidade.bloco}` : "Não informado",
        apartamento: item.unidade ? item.unidade.numero_apartamento : "Não informado",
        observacao: item.descricao_problema,
        chamadoOriginal: item
      }));

      setListaOriginal(chamadosFormatados);
      setLista(chamadosFormatados);

    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os chamados.");
    }
  }

  function aplicarFiltros() {
    let resultado = listaOriginal;

    if (filtroStatus !== "Todos") {
      resultado = resultado.filter(
        item => item.status === filtroStatus
      );
    }

    if (busca.trim() !== "") {
      const textoBusca = busca.toLowerCase();

      resultado = resultado.filter(
        item =>
          item.titulo.toLowerCase().includes(textoBusca) ||
          item.condominio.toLowerCase().includes(textoBusca) ||
          item.apartamento.toLowerCase().includes(textoBusca) ||
          item.observacao.toLowerCase().includes(textoBusca)
      );
    }

    setLista(resultado);
  }

  return (
    <View style={styles.chamadosContainer}>
      <View style={styles.chamadosHeader}>
        <Text style={styles.chamadosTitle}>
          {tipoPerfil === "Morador"
            ? "Meus Chamados"
            : tipoPerfil === "Tecnico"
              ? "Chamados Atribuídos"
              : "Todos os Chamados"}
        </Text>

        <Text style={styles.chamadosSubtitle}>
          {tipoPerfil === "Morador"
            ? "Acompanhe as ocorrências abertas por você"
            : tipoPerfil === "Tecnico"
              ? "Acompanhe os chamados atribuídos ao seu atendimento"
              : "Acompanhe as ocorrências cadastradas e o andamento dos atendimentos"}
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Buscar por descrição, condomínio ou unidade"
        placeholderTextColor="#94A3B8"
        value={busca}
        onChangeText={setBusca}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 12, marginBottom: 12 }}
      >
        {["Todos", "Aberto", "EmAtendimento", "Reagendado", "Finalizado"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.chamadoBadge,
              {
                marginRight: 8,
                backgroundColor: filtroStatus === status ? "#F97316" : "#DBEAFE"
              }
            ]}
            onPress={() => setFiltroStatus(status)}
          >
            <Text
              style={{
                color: filtroStatus === status ? "#FFFFFF" : "#1D4ED8",
                fontWeight: "700"
              }}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const statusStyle = corStatus(item.status);

          return (
            <TouchableOpacity
              style={styles.chamadoCard}
              onPress={() => navigation.navigate("Detalhes", { chamado: item })}
            >
              <View style={styles.chamadoCardTop}>
                <Text style={styles.chamadoTitulo}>{item.titulo || ""}</Text>

                <Text
                  style={[
                    styles.chamadoBadge,
                    {
                      backgroundColor: statusStyle.fundo,
                      color: statusStyle.texto
                    }
                  ]}
                >
                  {item.status}
                </Text>
              </View>

              <View style={styles.chamadoInfoBox}>
                <Text style={styles.chamadoInfoLabel}>Condomínio</Text>
                <Text style={styles.chamadoInfoText}>{item.condominio || ""}</Text>
              </View>

              <View style={styles.chamadoInfoBox}>
                <Text style={styles.chamadoInfoLabel}>Unidade</Text>
                <Text style={styles.chamadoInfoText}>{item.apartamento || ""}</Text>
              </View>

              <View style={styles.chamadoInfoBox}>
                <Text style={styles.chamadoInfoLabel}>Descrição</Text>
                <Text style={styles.chamadoDescricao}>{item.observacao || ""}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {tipoPerfil !== "Tecnico" && (
        <TouchableOpacity
          style={styles.chamadoBotaoNovo}
          onPress={() => navigation.navigate("NovoChamado")}
        >
          <Text style={styles.chamadoBotaoNovoTexto}>+ Novo chamado</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function DetalhesScreen({ route, navigation }) {
  const { chamado } = route.params;

  const [statusAtual, setStatusAtual] = useState(chamado.status);
  const [historico, setHistorico] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const [tecnicoNome, setTecnicoNome] = useState(
    chamado.chamadoOriginal?.tecnico_executor?.nome ||
    "A definir"
  );

  const statusStyle = corStatus(statusAtual);

  function textoHistorico(status) {
    if (status === "Aberto") return "🟢 Chamado aberto";
    if (status === "EmAtendimento") return "🔵 Atendimento iniciado";
    if (status === "Reagendado") return "🟡 Chamado reagendado";
    if (status === "Finalizado") return "✅ Chamado finalizado";
    if (status === "Cancelado") return "🔴 Chamado cancelado";

    return status;
  }

  async function carregarHistorico() {
    try {
      const resposta = await fetch(
        `https://condocare-api.onrender.com/historico/${chamado.id}`
      );

      const dados = await resposta.json();

      setHistorico(dados);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {

    async function carregarDados() {

      const usuarioSalvo =
      await AsyncStorage.getItem(
        "usuarioLogado"
      );

      if (usuarioSalvo) {

        setUsuarioLogado(
          JSON.parse(usuarioSalvo)
        );
      }

      carregarHistorico();
    }

    carregarDados();

  }, []);

  async function alterarStatus(novoStatus) {

    try {

      const usuarioSalvo =
      await AsyncStorage.getItem(
        "usuarioLogado"
      );

      if (!usuarioSalvo) {

        Alert.alert(
          "Erro",
          "Usuário não encontrado."
        );

        return;
      }

      const usuario =
      JSON.parse(usuarioSalvo);

      const resposta =
      await fetch(
        `https://condocare-api.onrender.com/chamados/${chamado.id}/status`,
        {
          method:"PUT",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({
            status:novoStatus,
            id_usuario:
            usuario.id_usuario
          })
        }
      );

      const dados =
      await resposta.json();

      if(!resposta.ok){

        Alert.alert(
          "Erro",
          dados.mensagem
        );

        return;
      }

      setStatusAtual(
        novoStatus
      );

      await carregarHistorico();

      Alert.alert(
        "Sucesso",
        "Status atualizado"
      );

    } catch(error){

      Alert.alert(
        "Erro",
        "Não foi possível conectar."
      );
    }
  }

  async function atribuirTecnicoJoao() {

    if (!usuarioLogado) {

      Alert.alert(
        "Erro",
        "Usuário não encontrado."
      );

      return;
    }

    try {

      const respostaUsuarios =
      await fetch(
        "https://condocare-api.onrender.com/usuarios"
      );

      const usuarios =
      await respostaUsuarios.json();

      const tecnicoJoao =
      usuarios.find(
        item =>
        item.email==="joao@gmail.com" &&
        item.tipo_perfil==="Tecnico"
      );

      if(!tecnicoJoao){

        Alert.alert(
          "Erro",
          "João não encontrado."
        );

        return;
      }

      const resposta =
      await fetch(
        `https://condocare-api.onrender.com/chamados/${chamado.id}/tecnico`,
        {
          method:"PUT",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({

            id_tecnico_executor:
            tecnicoJoao.id_usuario,

            id_usuario:
            usuarioLogado.id_usuario

          })
        }
      );

      const dados =
      await resposta.json();

      if(!resposta.ok){

        Alert.alert(
          "Erro",
          dados.mensagem
        );

        return;
      }

      await carregarHistorico();

      setTecnicoNome(
        tecnicoJoao.nome
      );

      Alert.alert(
        "Sucesso",
        "João atribuído ao chamado"
      );

    } catch(error){

      Alert.alert(
        "Erro",
        "Falha ao atribuir técnico"
      );
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.detalhesContainer}>

      <View style={styles.detalhesHeader}>
        <Text style={styles.detalhesTitle}>
          Detalhes do Chamado
        </Text>

        <Text style={styles.detalhesSubtitle}>
          Visualize as informações completas da solicitação
        </Text>
      </View>

      <View style={styles.detalhesHeroCard}>
        <Text style={styles.detalhesProblema}>
          {chamado.titulo || "Sem título"}
        </Text>

        <Text
          style={[
            styles.detalhesStatus,
            {
              backgroundColor:
              statusStyle.fundo,

              color:
              statusStyle.texto
            }
          ]}
        >
          {statusAtual}
        </Text>
      </View>

      <View style={styles.detalhesInfoCard}>

        <Text style={styles.detalhesInfoTitulo}>
          Informações do atendimento
        </Text>

        <View style={styles.detalhesLinha}>
          <Text style={styles.detalhesLinhaLabel}>
            Técnico responsável
          </Text>

          <Text style={styles.detalhesLinhaValor}>
            {tecnicoNome}
          </Text>
        </View>

      </View>

      {statusAtual !== "Finalizado" ? (

        <View style={styles.detalhesAcoes}>

          {(usuarioLogado?.tipo_perfil==="Administrador" ||
          usuarioLogado?.tipo_perfil==="Sindico") && (

            <TouchableOpacity
              style={styles.statusButtonBlue}
              onPress={atribuirTecnicoJoao}
            >
              <Text style={styles.statusButtonText}>
                Atribuir João Técnico
              </Text>
            </TouchableOpacity>

          )}

          {usuarioLogado?.tipo_perfil==="Tecnico" && (
            <>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={()=>
                alterarStatus(
                  "EmAtendimento"
                )}
              >
                <Text style={styles.statusButtonText}>
                  Iniciar Atendimento
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statusButtonBlue}
                onPress={()=>
                alterarStatus(
                  "Reagendado"
                )}
              >
                <Text style={styles.statusButtonText}>
                  Reagendar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statusButtonRed}
                onPress={()=>
                alterarStatus(
                  "Finalizado"
                )}
              >
                <Text style={styles.statusButtonText}>
                  Finalizar Chamado
                </Text>
              </TouchableOpacity>
            </>
          )}

        </View>

      ) : (

        <View style={styles.detalhesAcoes}>
          <Text style={styles.historicoDescricao}>
            ✅ Chamado finalizado.
          </Text>
        </View>

      )}

      <View style={styles.historicoBox}>
        <Text style={styles.historicoTitulo}>
          Histórico do Chamado
        </Text>

        {historico.length===0 ? (

          <Text style={styles.historicoVazio}>
            Nenhum histórico registrado ainda.
          </Text>

        ) : (

          historico.map((item)=>(

            <View
              key={item.id_historico}
              style={styles.historicoItem}
            >
              <Text style={styles.historicoUsuario}>
                👤 {item.usuario?.nome || "Usuário"}
              </Text>

              <Text style={styles.historicoTexto}>
                {textoHistorico(
                  item.status_novo
                )}
              </Text>

              <Text style={styles.historicoDescricao}>
                {item.status_anterior
                ? `Status alterado de ${item.status_anterior} para ${item.status_novo}`
                : item.descricao}
              </Text>

              <Text style={styles.historicoData}>
                🕒 {new Date(item.data_acao).toLocaleString()}
              </Text>
            </View>

          ))

        )}

      </View>

    </ScrollView>
  );
}
function NovoChamadoScreen({ navigation }) {
  const [condominio, setCondominio] = useState('');
  const [apartamento, setApartamento] = useState('');
  const [categoria, setCategoria] = useState('');
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvarChamado() {
    if (salvando) return;

    if (!condominio || !apartamento || !categoria || !observacao) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      setSalvando(true);

      const usuarioSalvo = await AsyncStorage.getItem("usuarioLogado");

      if (!usuarioSalvo) {
        Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
        return;
      }

      const usuario = JSON.parse(usuarioSalvo);

      if (usuario.tipo_perfil === "Tecnico") {
        Alert.alert(
          "Acesso negado",
          "Técnicos não podem abrir chamados. Apenas atender chamados atribuídos."
        );
        return;
      }

      const resposta = await fetch(
        "https://condocare-api.onrender.com/chamados",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            condominio: condominio,
            apartamento: apartamento,
            id_solicitante: usuario.id_usuario,
            descricao_problema: categoria + " - " + observacao
          })
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        Alert.alert(
          "Erro",
          dados.mensagem || "Erro ao cadastrar chamado."
        );
        return;
      }

      Vibration.vibrate(200);

      Alert.alert(
        "Sucesso",
        "Chamado cadastrado com sucesso.",
        [
          {
            text: "OK",
            onPress: () => navigation.popToTop()
          }
        ]
      );

    } catch (error) {
      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível conectar com o servidor."
      );

    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.screenTitle}>
        Novo Chamado
      </Text>

      <Text style={styles.screenSubtitle}>
        Registre uma nova ocorrência de manutenção
      </Text>

      <View style={styles.card}>
        <Text style={styles.inputLabel}>
          Condomínio
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o nome do condomínio"
          placeholderTextColor="#94A3B8"
          value={condominio}
          onChangeText={setCondominio}
        />

        <Text style={styles.inputLabel}>
          Apartamento
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: 101"
          placeholderTextColor="#94A3B8"
          value={apartamento}
          onChangeText={setApartamento}
        />

        <Text style={styles.inputLabel}>
          Categoria
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: Interfone"
          placeholderTextColor="#94A3B8"
          value={categoria}
          onChangeText={setCategoria}
        />

        <Text style={styles.inputLabel}>
          Observação
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.textArea
          ]}
          placeholder="Descreva o problema"
          placeholderTextColor="#94A3B8"
          multiline
          value={observacao}
          onChangeText={setObservacao}
        />

        <TouchableOpacity
          style={[
            styles.primaryButton,
            salvando && { opacity: 0.6 }
          ]}
          onPress={salvarChamado}
          disabled={salvando}
        >
          <Text style={styles.primaryButtonText}>
            {salvando ? "Salvando..." : "Salvar chamado"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


function AvisosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Avisos</Text>

      <View style={styles.card}>
        <Text style={styles.noticeTitle}>Manutenção preventiva</Text>
        <Text style={styles.noticeText}>
          Haverá visita técnica programada na quarta-feira às 14h.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.noticeTitle}>Atualização do sistema</Text>
        <Text style={styles.noticeText}>
          Novas categorias de chamados foram adicionadas ao painel.
        </Text>
      </View>
    </View>
  );
}

function ConfigScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Configurações</Text>

      <View style={styles.card}>
        <Text style={styles.detailLabel}>Notificações</Text>
        <Text style={styles.detailValue}>Ativadas</Text>

        <Text style={styles.detailLabel}>Tema</Text>
        <Text style={styles.detailValue}>Claro</Text>

        <Text style={styles.detailLabel}>Idioma</Text>
        <Text style={styles.detailValue}>Português</Text>
      </View>
    </View>
  );
}

function SairScreen({ route }) {

  async function sair() {
    await AsyncStorage.removeItem("usuarioLogado");

    route.params.funcLogout(false);
  }

  useEffect(() => {
    sair();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>
        Saindo...
      </Text>
    </View>
  );
}

function ContatosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Contatos</Text>

      <View style={styles.card}>
        <Text style={styles.detailLabel}>Suporte técnico</Text>
        <Text style={styles.detailValue}>(21) 99999-9999</Text>

        <Text style={styles.detailLabel}>E-mail</Text>
        <Text style={styles.detailValue}>suporte@condocare.com</Text>

        <Text style={styles.detailLabel}>Atendimento</Text>
        <Text style={styles.detailValue}>Segunda a sexta, 08h às 18h</Text>
      </View>
    </View>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0F172A' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="HomePrincipal"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="Detalhes" component={DetalhesScreen} />
      <Stack.Screen
        name="NovoChamado"
        component={NovoChamadoScreen}
        options={{ title: 'Novo Chamado' }}
      />
    </Stack.Navigator>
  );
}

function ChamadosStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0F172A' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="ListaChamados"
        component={ChamadosScreen}
        options={{ title: 'Chamados' }}
      />
      <Stack.Screen name="Detalhes" component={DetalhesScreen} />
      <Stack.Screen
        name="NovoChamado"
        component={NovoChamadoScreen}
        options={{ title: 'Novo Chamado' }}
      />
    </Stack.Navigator>
  );
}

function TabsNavigator() {
  return (
    <Tab.Navigator
    screenOptions={({route}) =>({
      headerShown:false,
      tabBarActiveTintColor:'#f97316',
      tabBarInactiveTintColor:'#1d4ed8',
    
      tabBarStyle:{
        height:72,
        backgroundColor:'#ffffff',
        borderTopWidth: 0,
        marginHorizontal:14,
        marginBottom:14,
        borderRadius:22,
        paddingBottom:10,
        paddingTop:10,

        shadowColor:'#f97316',
        shadowOpacity:0.12,
        shadowRadius:10,
        elevation:8,
      },
      tabBarLabelStyle:{
        fontSize:12,
        fontWeight:'700',
        marginBottom:4,
      },
      tabBarIcon:({ focused,color}) => {
        let iconName = '';

        if(route.name ==='HomeTab') {
          iconName =focused
          ? 'home'
          : 'home-outline';
        }
        if (route.name === 'ChamadosTab') {
          iconName = focused
          ? 'document-text'
          : 'document-text-outline';
        }
        if (route.name === 'Avisos') {
          iconName =focused
          ? 'notifications'
          :'notifications-outline';
        }

        return(
          <Ionicons
          name={iconName}
          size={focused ? 28 :24}
          color={color}
          />
        );
      }
    })}
  >
    <Tab.Screen
    name="HomeTab"
    component={HomeStack}
    options={{title:'Home,'}}
    />
<Tab.Screen
name="ChamadosTab"
component={ChamadosStack}
options={{title:'Chamados,'}}
/>
<Tab.Screen
  name="Avisos"
        component={AvisosScreen}
        options={{title: 'Avisos',}}
/>
  </Tab.Navigator>
  );
}



function DrawerNavigator({ funcLogout }) {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0F172A' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Drawer.Screen
        name="Início"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />

       <Drawer.Screen
        name="Perfil"
        component={PerfilScreen}
      />

      <Drawer.Screen
        name="Configurações"
        component={ConfigScreen}
      />

      <Drawer.Screen
        name="Contatos"
        component={ContatosScreen}
      />

      <Drawer.Screen
        name="Sair"
        component={SairScreen}
        initialParams={{
          funcLogout
        }}
      />

    </Drawer.Navigator>
  );
}

export default function App() {
  const [estaLogado, setLogado] = useState(false);

  return (
    <NavigationContainer>
      {estaLogado ? (
        <DrawerNavigator
          funcLogout={setLogado}
        />
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#0F172A' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            initialParams={{ funcLogar: setLogado }}
          />
          <Stack.Screen
            name="Registrar"
            component={RegistrarScreen}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

 /* LOGIN */
loginContainer:{
  flex:1,
  backgroundColor:'#f97316', // laranja
  paddingHorizontal:24,
  justifyContent:'center',
},
loginTopArea:{
  marginBottom:28,
},
loginBrand:{
  fontSize:13,
  fontWeight:'700',
  color:'#1d4ed8', // azul
  letterSpacing:2,
  textAlign:'center',
  marginBottom:10,
},
loginTitle:{
  fontSize:30,
  fontWeight:'800',
  color:'#ffffff',
  textAlign:'center',
  marginBottom:10,
},
loginSubtitle:{
  fontSize:15,
  color:'#ffffff',
  textAlign:'center',
  lineHeight:22,
},
loginCard:{
  backgroundColor:'#ffffff',
  borderRadius:24,
  padding:22,
  shadowColor:'#1d4ed8',
  shadowOpacity:0.15,
  shadowRadius:10,
  elevation:6,
},
forgotPassword:{
  alignSelf:'flex-end',
  marginTop:10,
  marginBottom:6,
},
forgotPasswordText:{
  fontSize:13,
  fontWeight:'600',
  color:'#1d4ed8',
},
loginFooter:{
  marginTop:20,
  textAlign:'center',
  color:'#1e3a8a',
  fontSize:13,
  lineHeight:18,
},

/* HOME */
homeContainer:{
  flexGrow:1,
  backgroundColor:'#ffffff',
  padding:20,
},
homeHeader:{
  marginBottom:20,
},
homeGreeting:{
  fontSize:14,
  fontWeight:'700',
  color:'#ea580c',
  marginBottom:6,
  letterSpacing:1,
},
homeTitle:{
  fontSize:30,
  fontWeight:'800',
  color:'#1e3a8a',
  marginBottom:8,
},
homeSubtitle:{
  fontSize:15,
  color:'#2563eb',
  lineHeight:22,
},
homeHighlightCard:{
  backgroundColor:'#1d4ed8',
  borderRadius:24,
  padding:22,
  marginBottom:18,
},
homeHeighlightTitle:{
  fontSize:20,
  fontWeight:'700',
  color:'#ffffff',
  marginBottom:10,
},
homeHighlightText:{
  fontSize:15,
  color:'#dbeafe',
  lineHeight:22,
},
homeMetricsRow:{
  flexDirection:'row',
  gap:12,
  marginBottom:18,
},
homeMetricCard:{
  flex:1,
  backgroundColor:'#ffffff',
  borderRadius:20,
  paddingVertical:24,
  paddingHorizontal:16,
  alignItems:'center',
  shadowColor:'#ea580c',
  shadowOpacity:0.08,
  shadowRadius:10,
  elevation:4,
},
homeMetricLabel:{
  fontSize:14,
  fontWeight:'600',
  color:'#1d4ed8',
},
homeActionCard:{
  backgroundColor:'#ffffff',
  borderRadius:22,
  padding:20,
  shadowColor:'#ea580c',
  shadowOpacity:0.06,
  shadowRadius:10,
  elevation:4,
},
homeActionTitle:{
  fontSize:18,
  fontWeight:'700',
  color:'#1e3a8a',
  marginBottom:14,
},
homeActionButton:{
  backgroundColor:'#f97316',
  paddingVertical:15,
  borderRadius:16,
  alignItems:'center',
  marginBottom:12,
},
homeActionButtonText:{
  color:'#ffffff',
  fontSize:15,
  fontWeight:'700',
},
homeSecodaryAction:{
  backgroundColor:'#1d4ed8',
  marginBottom:0,
},
homeSecondaryActionText:{
  color:'#ffffff',
  fontSize:15,
  fontWeight:'700',
},

/* CHAMADOS */
chamadosContainer:{
  flex:1,
  backgroundColor:'#ffffff',
  paddingHorizontal:20,
  paddingTop:20,
},
chamadosHeader:{
  marginBottom:18,
},
chamadosTitle:{
  fontSize:30,
  fontWeight:'800',
  color:'#1e3a8a',
  marginBottom:6,
},
chamadosSubtitle:{
  fontSize:15,
  color:'#2563eb',
  lineHeight:22,
},
chamadosList:{
  paddingBottom:100,
},
chamadoCard:{
  backgroundColor:'#ffffff',
  borderRadius:22,
  padding:18,
  marginBottom:14,
  shadowColor:'#ea580c',
  shadowOpacity:0.08,
  shadowRadius:10,
  elevation:4,
},
chamadoTitulo:{
  fontSize:18,
  fontWeight:'700',
  color:'#1e3a8a',
  marginBottom:10,
  lineHeight:24,
},
chamadoBadge:{
  alignSelf:'flex-start',
  fontSize:12,
  fontWeight:'700',
  paddingHorizontal:10,
  paddingVertical:6,
  borderRadius:999,
  overflow:'hidden',
  backgroundColor:'#dbeafe',
  color:'#1d4ed8',
},
chamadoInfoLabel:{
  fontSize:12,
  fontWeight:'700',
  color:'#ea580c',
  textTransform:'uppercase',
  marginBottom:4,
  letterSpacing:0.4,
},
chamadoInfoText:{
  fontSize:15,
  fontWeight:'600',
  color:'#1e3a8a',
},
chamadoDescricao:{
  fontSize:14,
  color:'#2563eb',
  lineHeight:21,
},
chamadoBotaoNovo:{
  backgroundColor:'#f97316',
  paddingVertical:16,
  borderRadius:18,
  alignItems:'center',
  marginBottom:18,
  elevation:4,
},
chamadoBotaoNovoTexto:{
  color:'#ffffff',
  fontSize:16,
  fontWeight:'700',
},

/* DETALHES */
detalhesContainer:{
  flexGrow:1,
  backgroundColor:'#ffffff',
  padding:20,
},
detalhesTitle:{
  fontSize:30,
  fontWeight:'800',
  color:'#1e3a8a',
  marginBottom:6,
},
detalhesSubtitle:{
  fontSize:15,
  color:'#2563eb',
  lineHeight:22,
},
detalhesHeroCard:{
  backgroundColor:'#ffffff',
  borderRadius:24,
  padding:20,
  marginBottom:16,
  shadowColor:"#ea580c",
  shadowOpacity:0.08,
  shadowRadius:10,
  elevation:4,
},
detalhesProblema:{
  fontSize:22,
  fontWeight:'800',
  color:'#1e3a8a',
  marginBottom:12,
  lineHeight:28,
},
detalhesStatus:{
  alignSelf:'flex-start',
  fontSize:13,
  fontWeight:'700',
  paddingVertical:7,
  borderRadius:999,
  overflow:'hidden',
  backgroundColor:'#dbeafe',
  color:'#1d4ed8',
},
detalhesCard:{
  backgroundColor:'#ffffff',
  borderRadius:24,
  padding:20,
  marginBottom:16,
  shadowColor:'#ea580c',
  shadowOpacity:0.08,
  shadowRadius:10,
  elevation:4,
},
detalhesLabel:{
  fontSize:12,
  fontWeight:'700',
  color:'#ea580c',
  textTransform:'uppercase',
  letterSpacing:0.4,
  marginBottom:6,
},
detalhesValor:{
  fontSize:16,
  fontWeight:'600',
  color:'#1e3a8a',
  lineHeight:22,
},
detalhesDescricao:{
  fontSize:15,
  color:'#2563eb',
  lineHeight:22,
},
detalhesInfoCard:{
  backgroundColor:'#1d4ed8',
  borderRadius:24,
  padding:20,
  marginBottom:18,
},
detalhesInfoTitulo:{
  fontSize:18,
  fontWeight:'700',
  color:'#ffffff',
  marginBottom:14,
},
detalhesLinhaLabel:{
  fontSize:12,
  fontWeight:'700',
  color:'#fdba74',
  textTransform:'uppercase',
  marginBottom:4,
  letterSpacing:0.4,
},
detalhesLinhaValor:{
  fontSize:15,
  fontWeight:'600',
  color:'#ffffff',
},
detalhesBotaoPrincipal:{
  backgroundColor:'#f97316',
  paddingVertical:16,
  borderRadius:18,
  alignItems:'center',
},
detalhesBotaoPrincipalTexto:{
  color:'#ffffff',
  fontSize:16,
  fontWeight:'700',
},
detalhesBotaoSecundario:{
  backgroundColor:'#1d4ed8',
  paddingVertical:16,
  borderRadius:18,
  alignItems:'center',
},
detalhesBotaoSecundarioTexto:{
  color:'#ffffff',
  fontSize:16,
  fontWeight:'700',
},
/* BASE GERAL */

container: {
  flexGrow: 1,
  flex: 1,
  backgroundColor: '#FFFFFF',
  padding: 20,
},

centerContent: {
  flex: 1,
  justifyContent: 'center',
},

brand: {
  fontSize: 12,
  fontWeight: '700',
  color: '#F97316', // laranja
  letterSpacing: 2,
  textAlign: 'center',
  marginBottom: 8,
},

mainTitle: {
  fontSize: 30,
  fontWeight: '800',
  color: '#1D4ED8', // azul
  textAlign: 'center',
  marginBottom: 8,
},

subtitle: {
  fontSize: 15,
  color: '#2563EB',
  textAlign: 'center',
  lineHeight: 22,
  marginBottom: 24,
},

screenTitle: {
  fontSize: 28,
  fontWeight: '800',
  color: '#1E3A8A',
  marginBottom: 6,
},

screenSubtitle: {
  fontSize: 14,
  color: '#2563EB',
  marginBottom: 18,
  lineHeight: 20,
},

card: {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  padding: 20,
  shadowColor: '#F97316',
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 4,
  marginBottom: 16,
},

highlightCard: {
  backgroundColor: '#1D4ED8',
  borderRadius: 22,
  padding: 22,
  marginBottom: 18,
},

highlightTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: '#FFFFFF',
  marginBottom: 10,
},

highlightText: {
  fontSize: 15,
  color: '#DBEAFE',
  lineHeight: 22,
},

dashboardRow: {
  flexDirection: 'row',
  gap: 12,
  marginBottom: 18,
},

metricCard: {
  flex: 1,
  backgroundColor: '#FFFFFF',
  borderRadius: 18,
  padding: 18,
  alignItems: 'center',
  elevation: 3,
  shadowColor: '#F97316',
  shadowOpacity: 0.08,
  shadowRadius: 10,
},

metricNumber: {
  fontSize: 28,
  fontWeight: '800',
  color: '#F97316',
  marginBottom: 4,
},

metricLabel: {
  fontSize: 14,
  color: '#1D4ED8',
  fontWeight: '600',
},

/* INPUTS */

inputLabel: {
  fontSize: 14,
  fontWeight: '700',
  color: '#1E3A8A',
  marginBottom: 8,
  marginTop: 10,
},

input: {
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#93C5FD',
  borderRadius: 14,
  paddingHorizontal: 14,
  paddingVertical: 13,
  fontSize: 15,
  color: '#1E3A8A',
},

textArea: {
  minHeight: 110,
  textAlignVertical: 'top',
},

/* BOTÕES */

primaryButton: {
  marginTop: 18,
  backgroundColor: '#F97316',
  paddingVertical: 16,
  borderRadius: 16,
  alignItems: 'center',
},

primaryButtonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '700',
},

secondaryButton: {
  marginTop: 12,
  backgroundColor: '#1D4ED8',
  paddingVertical: 16,
  borderRadius: 16,
  alignItems: 'center',
},

secondaryButtonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '700',
},

/* TICKETS */

ticketCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  padding: 18,
  marginBottom: 14,
  elevation: 4,
  shadowColor: '#F97316',
  shadowOpacity: 0.08,
  shadowRadius: 10,
},

ticketHeader: {
  marginBottom: 10,
},

ticketTitle: {
  fontSize: 18,
  fontWeight: '700',
  color: '#1E3A8A',
  marginBottom: 8,
},

badge: {
  alignSelf: 'flex-start',
  backgroundColor: '#DBEAFE',
  color: '#1D4ED8',
  fontWeight: '700',
  fontSize: 12,
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 999,
  overflow: 'hidden',
},

ticketInfo: {
  fontSize: 14,
  color: '#2563EB',
  marginBottom: 4,
},

ticketDesc: {
  fontSize: 14,
  color: '#1E3A8A',
  marginTop: 10,
  lineHeight: 20,
},

floatingButton: {
  backgroundColor: '#F97316',
  paddingVertical: 16,
  borderRadius: 16,
  alignItems: 'center',
  marginTop: 8,
},

floatingButtonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '700',
},

/* DETALHES */

detailLabel: {
  fontSize: 13,
  fontWeight: '700',
  color: '#F97316',
  marginTop: 10,
  marginBottom: 6,
  textTransform: 'uppercase',
},

detailValue: {
  fontSize: 17,
  fontWeight: '600',
  color: '#1E3A8A',
  lineHeight: 24,
},

detailStatus: {
  alignSelf: 'flex-start',
  backgroundColor: '#DBEAFE',
  color: '#1D4ED8',
  fontWeight: '700',
  fontSize: 13,
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 999,
  overflow: 'hidden',
},

/* AVISOS */

noticeTitle: {
  fontSize: 17,
  fontWeight: '700',
  color: '#F97316',
  marginBottom: 8,
},

noticeText: {
  fontSize: 14,
  color: '#2563EB',
  lineHeight: 20,
},

detalhesAcoes: {
  gap: 12,
  marginTop: 18,
  marginBottom: 30,
},

statusButton: {
  backgroundColor: '#F97316',
  paddingVertical: 16,
  borderRadius: 16,
  alignItems: 'center',
},

statusButtonBlue: {
  backgroundColor: '#2563EB',
  paddingVertical: 16,
  borderRadius: 16,
  alignItems: 'center',
},

statusButtonRed: {
  backgroundColor: '#F97316',
  paddingVertical: 16,
  borderRadius: 16,
  alignItems: 'center',
},

statusButtonText: {
  color: '#fff',
  fontWeight: '700',
  fontSize: 16,
},

historicoBox: {
  marginTop:20,
  backgroundColor:"#fff",
  borderRadius:25,
  padding:20,
  marginBottom:40,
},

historicoItem:{
  backgroundColor:"#F8FAFC",
  borderRadius:18,
  padding:14,
  marginBottom:12,
  borderLeftWidth:5,
  borderLeftColor:"#F97316",
},

historicoUsuario:{
  fontSize:15,
  fontWeight:"800",
  color:"#F97316",
  marginBottom:6
},

historicoTexto:{
  fontSize:15,
  fontWeight:"700",
  color:"#1E3A8A",
  marginBottom:6
},

historicoDescricao:{
  fontSize:13,
  color:"#475569",
  marginBottom:8
},

historicoData:{
  fontSize:11,
  color:"#94A3B8"
},

historicoTitulo: {
  fontSize: 22,
  fontWeight: '800',
  color: '#1E3A8A',
  marginBottom: 14,
},

});