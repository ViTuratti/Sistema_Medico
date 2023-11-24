import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Picker } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../style';
import toast, { Toaster } from 'react-hot-toast';

const AcompanharMedicamentos = ({ navigation }) => {
  const [pacientesComMedicamentos, setPacientesComMedicamentos] = useState([]);
  const [visualizacao, setVisualizacao] = useState('pendentes'); // Estado inicial: 'pendentes'

  const obterPacientesComMedicamentos = async () => {
    try {
      const pacientesExist = await AsyncStorage.getItem('pacientes');
      if (pacientesExist) {
        const pacientes = JSON.parse(pacientesExist);
        const pacientesComMedicamentos = pacientes.filter(
          (paciente) => paciente.medicamentos && paciente.medicamentos.length > 0
        );
        setPacientesComMedicamentos(pacientesComMedicamentos);
      }
    } catch (error) {
      console.error('Erro ao obter pacientes com medicamentos:', error);
    }
  };

  useEffect(() => {
    obterPacientesComMedicamentos();
  }, []);

  const registrarTomadaMedicamento = async (paciente, medicamento, tomado) => {
    try {
      // Atualizar o status do medicamento no AsyncStorage
      const pacientesAtualizados = pacientesComMedicamentos.map((p) => {
        if (p.nome === paciente.nome) {
          const medicamentosAtualizados = p.medicamentos.map((m) => {
            if (m.nome === medicamento.nome) {
              m.tomado = tomado;
            }
            return m;
          });
          p.medicamentos = medicamentosAtualizados;
        }
        return p;
      });

      // Salvar pacientes atualizados no AsyncStorage
      await AsyncStorage.setItem('pacientes', JSON.stringify(pacientesAtualizados));

      toast.success(`Status do medicamento de ${paciente.nome} atualizado com sucesso!`);

      // Atualizar a lista de pacientes com medicamentos
      obterPacientesComMedicamentos();
    } catch (error) {
      console.error('Erro ao registrar tomada de medicamento:', error);
      toast.error('Não foi possível registrar a tomada do medicamento. Por favor, tente novamente.');
    }
  };

  // Filtrar medicamentos com base na visualização
  const medicamentosFiltrados =
    visualizacao === 'pendentes'
      ? pacientesComMedicamentos.filter((paciente) => paciente.medicamentos.some((m) => !m.tomado))
      : pacientesComMedicamentos.filter((paciente) => paciente.medicamentos.every((m) => m.tomado));

  return (
    <View style={styles.containerBetween}>
      <Toaster position="top-center" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Acompanhar Pacientes</Text>
        </View>
        <MaterialIcons
          name="exit-to-app"
          size={24}
          color="black"
          onPress={() => navigation.navigate('Opcoes')}
        />
      </View>

      <Picker
        style={styles.input}
        selectedValue={visualizacao}
        onValueChange={(itemValue) => setVisualizacao(itemValue)}
      >
        <Picker.Item label="Pacientes Pendentes" value="pendentes" />
        <Picker.Item label="Pacientes Medicados" value="aplicados" />
      </Picker>

      <ScrollView style={styles.scrollView}>
        {medicamentosFiltrados.map((paciente, index) => (
          <View key={index} style={styles.pacienteCard}>
            <Text>Nome: {paciente.nome}</Text>
            <Text>Email: {paciente.email}</Text>
            <Text>Telefone: {paciente.telefone}</Text>
            <Text>Idade: {paciente.idade}</Text>
            <Text>Tipo Sanguíneo: {paciente.tipoSanguineo}</Text>

            <Text>Medicamentos:</Text>
            {paciente.medicamentos.map((medicamento, i) => (
              <View key={i} style={styles.medicamentoCard}>
                <Text>Nome: {medicamento.nome}</Text>
                <Text>Dosagem: {medicamento.dosagem}</Text>
                <Text>Horário: {medicamento.horario}</Text>
                <Text>Dias: {medicamento.dias}</Text>

                <View style={styles.container}>
                  {visualizacao !== 'aplicados' && (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => registrarTomadaMedicamento(paciente, medicamento, true)}
                      disabled={medicamento.tomado}
                    >
                      <Text style={styles.buttonText}>Aplicar</Text>
                    </TouchableOpacity>
                  )}
                  {visualizacao === 'aplicados' && (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => registrarTomadaMedicamento(paciente, medicamento, false)}
                      disabled={!medicamento.tomado}
                    >
                      <Text style={styles.buttonText}>Remover</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default AcompanharMedicamentos;
