import { NavigationContainer } from '@react-navigation/native';
import Opcoes from './screens/opcoes';
import Login from './screens/login';
import CadastrarPaciente from './screens/cadastro';
import CadastrarMedicamento from './screens/medicamentos';
import Acompanhar from './screens/acompanhar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './context/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Login} />
          <Stack.Screen name="Opcoes" component={Opcoes} />
          <Stack.Screen name="Cadastro" component={CadastrarPaciente} />
          <Stack.Screen name="Medicamento" component={CadastrarMedicamento} />
          <Stack.Screen name="Acompanhar" component={Acompanhar} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}

