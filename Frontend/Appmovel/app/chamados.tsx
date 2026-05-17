import AsyncStorage from '@react-native-async-storage/async-storage';
import * as CryptoJS from 'crypto-js';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';

type Chamado = {
  id: string;
  titulo: string;
};

const CHAVE_STORAGE = 'chamados';
const SENHA = 'senha-secreta-123';

export default function Chamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);

  useEffect(() => {
    carregarChamados();
  }, []);

  async function carregarChamados() {
    try {
      const dadosSalvos = await AsyncStorage.getItem(CHAVE_STORAGE);

      if (dadosSalvos) {
        const bytes = CryptoJS.AES.decrypt(dadosSalvos, SENHA);
        const textoDescriptografado = bytes.toString(CryptoJS.enc.Utf8);

        if (textoDescriptografado) {
          const lista = JSON.parse(textoDescriptografado) as Chamado[];
          setChamados(lista);
          return;
        }
      }

      const listaInicial: Chamado[] = [
        { id: '1', titulo: 'Sem sinal de TV' },
        { id: '2', titulo: 'Interfone não funciona' },
        { id: '3', titulo: 'Portão com defeito' },
      ];

      setChamados(listaInicial);

      const dadosCriptografados = CryptoJS.AES.encrypt(
        JSON.stringify(listaInicial),
        SENHA
      ).toString();

      await AsyncStorage.setItem(CHAVE_STORAGE, dadosCriptografados);
    } catch (error) {
      console.log('Erro ao carregar chamados:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Chamados</Text>

      <FlatList
        data={chamados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              Vibration.vibrate(200);
              router.push({
                pathname: '/detalhes',
                params: { titulo: item.titulo },
              });
            }}
          >
            <Text style={styles.texto}>{item.titulo}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  texto: {
    fontSize: 16,
  },
});