import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../style';
import toast, { Toaster } from 'react-hot-toast';

const CadastroMedicamento = ({ navigation }) => {
  const [nomeMedicamento, setNomeMedicamento] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [horario, setHorario] = useState('');
  const [dias, setDias] = useState('');
  const [pacienteSelecionado, setPacienteSelecionado] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionadoData, setPacienteSelecionadoData] = useState(null);

  const obterPacientes = async () => {
    try {
      const pacientesExist = await AsyncStorage.getItem('pacientes');
      if (pacientesExist) {
        const pacientes = JSON.parse(pacientesExist);
        setPacientes(pacientes);
      }
    } catch (error) {
      console.error('Erro ao obter pacientes:', error);
    }
  };

  useEffect(() => {
    obterPacientes();
  }, []);

  const obterDadosPaciente = (pacienteNome) => {
    const paciente = pacientes.find((p) => p.nome === pacienteNome);
    setPacienteSelecionadoData(paciente);
  };

  const obterMedicamentosPaciente = () => {
    if (pacienteSelecionadoData && pacienteSelecionadoData.medicamentos) {
      return (
        <View>
          <Text>------------------------</Text>
          <Text>Medicamentos Receitados:</Text>
          {pacienteSelecionadoData.medicamentos.map((medicamento, index) => (
            <View key={index}>
              <Text>Medicamento: {medicamento.nome}</Text>
              <Text>Dosagem: {medicamento.dosagem}</Text>
              <Text>Horário: {medicamento.horario}</Text>
              <Text>Dias: {medicamento.dias}</Text>
              <Text>------------------------</Text>
            </View>
          ))}
        </View>
      );
    }
    return null;
  };

  const salvarMedicamento = async () => {
    if (!nomeMedicamento || !dosagem || !horario || !dias || !pacienteSelecionado) {
      toast.error('Todos os campos são obrigatórios.');
      return;
    }

    try {
      // Obter medicamentos existentes do paciente selecionado
      const pacientesAtualizados = pacientes.map((paciente) => {
        if (paciente.nome === pacienteSelecionado) {
          const medicamentos = paciente.medicamentos || [];
          medicamentos.push({ nome: nomeMedicamento, dosagem, horario, dias });
          paciente.medicamentos = medicamentos;
        }
        return paciente;
      });

      // Salvar pacientes atualizados no AsyncStorage
      await AsyncStorage.setItem('pacientes', JSON.stringify(pacientesAtualizados));

      toast.success('Medicamento cadastrado com sucesso!');
      navigation.navigate('Opcoes');
    } catch (error) {
      console.error('Erro ao cadastrar medicamento:', error);
      toast.error('Não foi possível cadastrar o medicamento. Por favor, tente novamente.');
    }
  };

  return (
    <View style={styles.containerBetween}>
      <Toaster position="top-center" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Cadastro de Medicamentos</Text>
        </View>
        <MaterialIcons
          name="exit-to-app"
          size={24}
          color="black"
          onPress={() => navigation.navigate('Opcoes')}
        />
      </View>

      <Text>Selecione o Paciente:</Text>
      <Picker
        style={styles.input}
        selectedValue={pacienteSelecionado}
        onValueChange={(itemValue) => {
          setPacienteSelecionado(itemValue);
          obterDadosPaciente(itemValue);
        }}
      >
        <Picker.Item label="Selecione o Paciente" value="" />
        {pacientes.map((paciente, index) => (
          <Picker.Item key={index} label={paciente.nome} value={paciente.nome} />
        ))}
      </Picker>

      {pacienteSelecionadoData && (
        <View>
          <Text>Dados do Paciente Selecionado:</Text>
          <Text>Nome: {pacienteSelecionadoData.nome}</Text>
          <Text>Email: {pacienteSelecionadoData.email}</Text>
          <Text>Telefone: {pacienteSelecionadoData.telefone}</Text>
          <Text>Idade: {pacienteSelecionadoData.idade}</Text>
          <Text>Peso: {pacienteSelecionadoData.peso}</Text>
          <Text>Altura: {pacienteSelecionadoData.altura}</Text>
          <Text>Tipo Sanguíneo: {pacienteSelecionadoData.tipoSanguineo}</Text>
          {obterMedicamentosPaciente()}
        </View>
      )}

      <Text>Nome do Medicamento:</Text>
      <TextInput style={styles.input} value={nomeMedicamento} onChangeText={setNomeMedicamento} />

      <Text>Dosagem:</Text>
      <TextInput style={styles.input} value={dosagem} onChangeText={setDosagem} />

      <Text>Horário:</Text>
      <TextInput style={styles.input} value={horario} onChangeText={setHorario} />

      <Text>Dias:</Text>
      <TextInput style={styles.input} value={dias} onChangeText={setDias} />

      <TouchableOpacity
          style={styles.button}
          onPress={salvarMedicamento}
        >
          <Text style={styles.buttonText}>Cadastrar Medicamento</Text>
        </TouchableOpacity>
    </View>
  );
};

export default CadastroMedicamento;
