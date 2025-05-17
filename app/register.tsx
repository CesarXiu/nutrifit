import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../stores/authStore'
import Toast from 'react-native-toast-message'

interface RegisterProps {
  onRegister: (email: string) => void
  onSwitchToLogin: () => void
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const signUp = useAuthStore(state => state.signUp)

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error de contraseña',
        text2: 'Las contraseñas no coinciden'
      })
      return
    }

    try {
      setLoading(true)
      await signUp(email, password, name)
      onRegister(email)
    } catch (error) {
      console.error('Error en el registro:', error)
      Toast.show({
        type: 'error',
        text1: 'Error de registro',
        text2: 'Ocurrió un error al crear la cuenta'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      className="bg-gradient-to-b from-blue-100 to-green-100"
    >
      <View className="flex-1 justify-center p-6">
        <View className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md self-center">
          <Text className="text-3xl font-bold mb-6 text-center text-gray-800">Únete a NutriFit</Text>
          <Text className="text-center text-gray-600 mb-8">Comienza tu viaje hacia una vida más saludable</Text>

          <View className="space-y-6">
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </Text>
              <View className="relative">
                <View className="absolute left-3 top-1/2 -translate-y-1/2">
                  <MaterialIcons name="person" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  id="name"
                  value={name}
                  onChangeText={setName}
                  className="pl-10 block w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500"
                  placeholder="Juan Pérez"
                  editable={!loading}
                />
              </View>
            </View>

            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </Text>
              <View className="relative">
                <View className="absolute left-3 top-1/2 -translate-y-1/2">
                  <MaterialIcons name="email" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  id="email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  className="pl-10 block w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500"
                  placeholder="tu@ejemplo.com"
                  editable={!loading}
                />
              </View>
            </View>

            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="pl-10 block w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500"
                  placeholder="••••••••"
                  editable={!loading}
                />
              </View>
            </View>

            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </Text>
              <View className="relative">
                <View className="absolute left-3 top-1/2 -translate-y-1/2">
                  <MaterialIcons name="lock" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  id="confirm-password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  className="pl-10 block w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500"
                  placeholder="••••••••"
                  editable={!loading}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className="w-full flex flex-row items-center justify-center py-3 px-4 rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <View className="flex flex-row items-center">
                  <ActivityIndicator className="mr-3" color="white" />
                  <Text className="text-white">Creando cuenta...</Text>
                </View>
              ) : (
                <>
                  <Text className="text-white">Crear cuenta</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-6">
            <View className="relative">
              <View className="absolute inset-0 flex items-center">
                <View className="w-full border-t border-gray-300"></View>
              </View>
              <View className="relative flex justify-center">
                <Text className="px-2 bg-white text-gray-500 text-sm">¿Ya tienes una cuenta?</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onSwitchToLogin}
              disabled={loading}
              className="mt-4 w-full py-3 px-4 border border-blue-600 rounded-lg shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Text className="text-center text-blue-600">Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Register