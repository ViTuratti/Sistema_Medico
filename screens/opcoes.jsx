import React, { useContext } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../style.js';
import { AuthContext } from '../context/AuthContext.js';

export default function Comanda({ navigation }) {
  const { username } = useContext(AuthContext);

  return (
    <View style={styles.containerBetween}>
      <View style={styles.header}>
        <View>
          <Text>Olá,</Text>
          <Text style={styles.title}>{username}</Text>
        </View>
        <MaterialIcons
          name="exit-to-app"
          size={24}
          color="black"
          onPress={() => navigation.navigate('Home')}
        />
      </View>

      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.buttonText}>Cadastrar Paciente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Medicamento')}
        >
          <Text style={styles.buttonText}>Cadastrar Medicamento</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Acompanhar')}
        >
          <Text style={styles.buttonText}>Acompanhar</Text>
        </TouchableOpacity>
      </View>

      <Text>Escolha a opção desejada!</Text>
    </View>
  );
}
