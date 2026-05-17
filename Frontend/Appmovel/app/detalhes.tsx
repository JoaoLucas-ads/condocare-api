import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Detalhes(){
    const {titulo} = useLocalSearchParams();

    return(
        <View style={styles.container}>
            <Text style={styles.titulo}>Detalhes do Chamado</Text>

        <View style={styles.card}>
            <Text style={styles.label}>Problema</Text>
            <Text style={styles.texto}>{titulo}</Text>

            <Text style={styles.label}>Status:</Text>
            <Text style={styles.texto}>Aberto</Text>

            <Text style={styles.label}>Observação:</Text>
            <Text style={styles.texto}>
                Chamado registrado no sistema para manutenção.
            </Text>
            </View>
        </View>
    );
}

const styles =StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'#f2f2f2',
        padding:20,
    },
    titulo:{
        fontSize:24,
        fontWeight:'bold',
        marginBottom:20,
    },
    card:{
        backgroundColor:'#fff',
        padding:16,
        borderRadius:10,
    },
    label:{
        fontSize:16,
        fontWeight:'bold',
        marginTop:10,
    },
    texto:{
        fontSize:16,
        marginTop:5,
        color:'#333',
    },

});