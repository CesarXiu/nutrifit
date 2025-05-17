import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '../stores/authStore'
import Toast from 'react-native-toast-message';

interface LoginProps {
  onLogin: () => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore(state => state.signIn)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await signIn(email, password)
      onLogin()
    } catch (error) {
      console.error('Error en el inicio de sesión:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }} // Añadido paddingVertical para más espacio
      keyboardShouldPersistTaps="handled"
      className="bg-gradient-to-b from-blue-100 to-green-100">
      <View className="flex-1 justify-center p-6">
        <View className="w-full max-w-md self-center rounded-xl bg-white p-8 shadow-lg">
          <Text className="mb-8 text-center text-3xl font-bold text-gray-800"> {/* Cambiado mb-6 a mb-8 */}
            Bienvenido a NutriFit
          </Text>
          <Text className="mb-10 text-center text-gray-600"> {/* Cambiado mb-8 a mb-10 */}
            Tu compañero en el camino hacia una vida saludable
          </Text>

          <View className="space-y-8"> {/* Cambiado space-y-6 a space-y-8 */}
            <View>
              <Text className="mb-2 block text-sm font-medium text-gray-700"> {/* Cambiado mb-1 a mb-2 */}
                Correo electrónico
              </Text>
              <View className="relative">
                <View className="absolute left-3 top-1/2 -translate-y-1/2">
                  <MaterialIcons name="person" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  id="email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  className="block w-full rounded-lg border border-gray-300 p-3 pl-10 focus:border-blue-500"
                  placeholder="tu@ejemplo.com"
                  editable={!loading}
                />
              </View>
            </View>
            <View>
              <Text className="mb-2 mt-2 block text-sm font-medium text-gray-700"> {/* Cambiado mb-1 a mb-2 */}
                Contraseña
              </Text>
              <View className="relative">
                <View className="absolute left-3 top-1/2 -translate-y-1/2">
                  <MaterialIcons name="lock" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  id="password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  className="block w-full rounded-lg border border-gray-300 p-3 pl-10 focus:border-blue-500"
                  placeholder="••••••••"
                  editable={!loading}
                />
              </View>
            </View>

            <View className="flex flex-row items-center justify-between my-4"> {/* Añadido my-4 para más espaciado */}
              <View className="flex flex-row items-center">
                <TouchableOpacity className="mr-2 h-4 w-4 rounded border border-gray-300 bg-white">
                  {/* Checkbox would need custom implementation */}
                </TouchableOpacity>
                <Text className="text-sm text-gray-700">Recordarme</Text>
              </View>
              <TouchableOpacity>
                <Text className="text-sm text-blue-600">¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className="flex w-full flex-row items-center justify-center rounded-lg bg-blue-600 px-4 py-3 shadow-sm disabled:opacity-50">
              {loading ? (
                <View className="flex flex-row items-center">
                  <ActivityIndicator className="mr-3" color="white" />
                  <Text className="text-white">Iniciando sesión...</Text>
                </View>
              ) : (
                <>
                  <Text className="text-white">Iniciar Sesión</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="white"
                    style={{ marginLeft: 8 }}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-10"> {/* Cambiado mt-6 a mt-10 */}
            <View className="relative">
              <View className="absolute inset-0 flex items-center">
                <View className="w-full border-t border-gray-300"></View>
              </View>
              <View className="relative flex justify-center">
                <Text className="bg-white px-2 text-sm text-gray-500">¿No tienes una cuenta?</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                console.log('Switch to Register pressed');
                onSwitchToRegister();
              }}
              disabled={loading}
              className="mt-6 w-full rounded-lg border border-blue-600 bg-white px-4 py-3 text-blue-600 shadow-sm disabled:opacity-50">
              <Text className="text-center text-blue-600">Registrarse</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;
