import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function Index(){
  return(
    <View style={styles.container}>
      <Text style={ styles.titulo}>Sistema de Chamados</Text>
      <Text style={ styles.texto}>Meu projeto em React Native começou a funcionar
</Text>
<TouchableOpacity
style={{
  marginTop:20,
  backgroundColor:'#2563EB',
  padding:10,
  borderRadius:8,
}}
onPress={()=> router.push('/chamados')}
>
  <Text style={{color:'fff'}}>Ir para chamados</Text>
</TouchableOpacity>
  </View>
  );
}
const styles =StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#f2f2f2',
    justifyContent:'center',
    alignItems:'center',
    padding:20,
  },
  titulo:{
    fontSize:28,
    fontWeight:'bold',
    color:'#1d4ed8',
    marginBottom:10,
  },
  texto:{
    fontSize:16,
    color:'#333',
    textAlign:'center',
  },
});
