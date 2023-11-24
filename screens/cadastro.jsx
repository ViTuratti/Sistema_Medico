import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toast, { Toaster } from 'react-hot-toast';
import { styles } from '../style';
import { TouchableOpacity } from 'react-native-web';

const CadastroPaciente = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [tipoSanguineo, setTipoSanguineo] = useState('A'); // Valor padrão 'A'

  const tiposSanguineos = ['A', '-A', 'B', '-B', 'AB', '-AB', 'O', '-O'];

  const validarTelefone = (telefone) => {
    const regexTelefone = /^\d{10,11}$/;
    return regexTelefone.test(telefone);
  };

  const validarEmail = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  const validarIdade = (idade) => {
    const regexIdade = /^(?:[1-9][0-9]?|1[01][0-9]|150)$/;
    return regexIdade.test(idade);
  };

  const validarCampos = () => {
    if (!nome || !email || !telefone || !idade || !peso || !altura || !tipoSanguineo) {
      toast.error('Todos os campos são obrigatórios.');
      return false;
    }

    if (!validarTelefone(telefone)) {
      toast.error('Telefone inválido. Insira 10 ou 11 dígitos numéricos.');
      return false;
    }

    if (!validarEmail(email)) {
      toast.error('Email inválido. Insira um email válido.');
      return false;
    }

    if (!validarIdade(idade)) {
      toast.error('Idade inválida. Insira um número válido entre 1 e 150.');
      return false;
    }

    // Adicione mais validações específicas, se necessário

    return true;
  };

  const salvarPaciente = async () => {
    if (!validarCampos()) {
      return;
    }

    try {
      const paciente = { nome, email, telefone, idade, peso, altura, tipoSanguineo };
      const pacientesExist = await AsyncStorage.getItem('pacientes');
      const pacientes = pacientesExist ? JSON.parse(pacientesExist) : [];
      pacientes.push(paciente);
      await AsyncStorage.setItem('pacientes', JSON.stringify(pacientes));

      toast.success('Paciente cadastrado com sucesso!');
      navigation.navigate('Opcoes');
    } catch (error) {
      console.error('Erro ao cadastrar paciente:', error);
      toast.error('Não foi possível cadastrar o paciente. Por favor, tente novamente.');
    }
  };

  return (
    <View style={styles.containerBetween}>
      <Toaster position="top-center" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Cadastro de Pacientes</Text>
        </View>
        <MaterialIcons
          name="exit-to-app"
          size={24}
          color="black"
          onPress={() => navigation.navigate('Opcoes')}
        />
      </View>
      <Text>Nome:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text>Telefone:</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} />

      <Text>Idade:</Text>
      <TextInput style={styles.input} value={idade} onChangeText={setIdade} keyboardType="numeric" />

      <Text>Peso (kg):</Text>
      <TextInput style={styles.input} value={peso} onChangeText={setPeso} keyboardType="numeric" />

      <Text>Altura (m):</Text>
      <TextInput style={styles.input} value={altura} onChangeText={setAltura} keyboardType="numeric" />

      <Text>Tipo Sanguíneo:</Text>
      <Picker
        style={styles.input}
        selectedValue={tipoSanguineo}
        onValueChange={(itemValue) => setTipoSanguineo(itemValue)}
      >
        {tiposSanguineos.map((tipo, index) => (
          <Picker.Item key={index} label={tipo} value={tipo} />
        ))}
      </Picker>
      <TouchableOpacity
          style={styles.button}
          onPress={salvarPaciente}
        >
          <Text style={styles.buttonText}>Cadastrar Paciente</Text>
        </TouchableOpacity>
    </View>
  );
};

export default CadastroPaciente;
