import { Image, Text, TextInput, TouchableOpacity, View, ViewBase } from 'react-native';
import { styles } from '../style';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login({navigation}) {
    const {login} = useContext(AuthContext)
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")

    async function handleLogin(){
        if (await login({email, senha})){
            navigation.navigate('Opcoes')
        }else{
            setErro("Email ou Senha inválido.")
        }
    }

    return (
        <View style={styles.container}>
            <Image style={styles.imagem} source={require('../assets/remedios.jpg')} />
            <Text>Sistema de</Text>
            <Text style={styles.title}>Medicamentos</Text>
            <TextInput style={styles.input} placeholder='e-mail' value={email} onChangeText={setEmail}/>
            <TextInput style={styles.input} placeholder='senha' value={senha} onChangeText={setSenha} secureTextEntry />
            <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.button}>Entrar</Text>
            </TouchableOpacity>

            <Text style={styles.erro}>{erro}</Text>
            
        </View>
    );
}
