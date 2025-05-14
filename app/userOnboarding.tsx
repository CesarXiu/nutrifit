import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { MaterialCommunityIcons, FontAwesome, AntDesign, Feather } from '@expo/vector-icons'
import NutritionRecommendations from './nutritionRecommendations'
// import { useUserProfileStore } from '../stores/userProfileStore'
// import { useAuthStore } from '../stores/authStore'
import Toast from 'react-native-toast-message'
// import AsyncStorage from '@react-native-async-storage/async-storage'

interface UserOnboardingProps {
  onComplete: () => void
}

const UserOnboarding: React.FC<UserOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState({
    age: '',
    height: '',
    weight: '',
    gender: '',
    activityLevel: '',
    goal: ''
  })

//   const { user } = useAuthStore()
//   const { saveProfile } = useUserProfileStore()

    const [ user, setUser ] = useState<any>(null) // Simulación de usuario autenticado+
    const saveProfile = async (userId: string, data: any) => {
    }

  const handleInputChange = (name: string, value: string) => {
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleSaveRecommendations = async (recommendations: any) => {
    try {
    //   if (!user) {
    //     throw new Error('No hay usuario autenticado')
    //   }

    //   await saveProfile(user.id, {
    //     weight: Number(userData.weight),
    //     height: Number(userData.height),
    //     age: Number(userData.age),
    //     gender: userData.gender as 'male' | 'female',
    //     activity_level: userData.activityLevel,
    //     goal: userData.goal as 'maintain' | 'weight-loss' | 'muscle',
    //   })

    //   await AsyncStorage.setItem('nutritionRecommendations', JSON.stringify(recommendations))
      
      Toast.show({
        type: 'success',
        text1: 'Perfil guardado',
        text2: 'Tus datos se han guardado exitosamente'
      })
      
      onComplete()
    } catch (error:any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al guardar el perfil: ' + error.message
      })
      console.error('Error al guardar el perfil:', error)
    }
  }

  const isNextDisabled = () => {
    switch(step) {
      case 1: return !userData.age || !userData.gender
      case 2: return !userData.height || !userData.weight
      case 3: return !userData.activityLevel || !userData.goal
      default: return false
    }
  }

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-gradient-to-b from-blue-100 to-green-100"
    >
      <View className="flex-1 justify-center p-6">
        <View className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md self-center">
          {/* Progress Bar */}
          <View className="mb-8">
            <View className="flex flex-row justify-between items-center mb-4">
              {[1, 2, 3, 4].map((num) => (
                <View
                  key={num}
                  className={`w-20 h-2 rounded-full ${
                    num <= step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </View>
            <Text className="text-2xl font-bold text-gray-800">
              {step === 1 && 'Datos Básicos'}
              {step === 2 && 'Medidas Corporales'}
              {step === 3 && 'Nivel de Actividad'}
              {step === 4 && 'Recomendaciones'}
            </Text>
            <Text className="text-gray-600">
              {step === 1 && 'Cuéntanos un poco sobre ti'}
              {step === 2 && 'Información para personalizar tu plan'}
              {step === 3 && '¿Cuál es tu nivel de actividad física?'}
              {step === 4 && 'Revisa tus recomendaciones personalizadas'}
            </Text>
          </View>

          <View className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <View>
                  <Text className="block text-sm font-medium text-gray-700 mb-1">
                    Edad
                  </Text>
                  <View className="relative">
                    <View className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center">
                      <MaterialCommunityIcons name="calendar" size={20} color="#9CA3AF" />
                    </View>
                    <TextInput
                      keyboardType="numeric"
                      value={userData.age}
                      onChangeText={(text) => handleInputChange('age', text)}
                      className="pl-10 block w-full rounded-lg border border-gray-300 p-3"
                      placeholder="Edad"
                    />
                  </View>
                </View>

                <View>
                  <Text className="block text-sm font-medium text-gray-700 mb-1">
                    Género
                  </Text>
                  <View className="flex flex-row gap-4">
                    <TouchableOpacity
                      onPress={() => handleInputChange('gender', 'male')}
                      className={`flex-1 p-3 rounded-lg border ${
                        userData.gender === 'male'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300'
                      }`}
                    >
                      <Text className={`text-center ${
                        userData.gender === 'male' ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        Masculino
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleInputChange('gender', 'female')}
                      className={`flex-1 p-3 rounded-lg border ${
                        userData.gender === 'female'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300'
                      }`}
                    >
                      <Text className={`text-center ${
                        userData.gender === 'female' ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        Femenino
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            {/* Step 2: Body Measurements */}
            {step === 2 && (
              <>
                <View>
                  <Text className="block text-sm font-medium text-gray-700 mb-1">
                    Altura (cm)
                  </Text>
                  <View className="relative">
                    <View className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center">
                      <FontAwesome name="ruble" size={20} color="#9CA3AF" />
                    </View>
                    <TextInput
                      keyboardType="numeric"
                      value={userData.height}
                      onChangeText={(text) => handleInputChange('height', text)}
                      className="pl-10 block w-full rounded-lg border border-gray-300 p-3"
                      placeholder="Altura en centímetros"
                    />
                  </View>
                </View>

                <View>
                  <Text className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (kg)
                  </Text>
                  <View className="relative">
                    <View className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center">
                      <MaterialCommunityIcons name="scale" size={20} color="#9CA3AF" />
                    </View>
                    <TextInput
                      keyboardType="numeric"
                      value={userData.weight}
                      onChangeText={(text) => handleInputChange('weight', text)}
                      className="pl-10 block w-full rounded-lg border border-gray-300 p-3"
                      placeholder="Peso en kilogramos"
                    />
                  </View>
                </View>
              </>
            )}

            {/* Step 3: Activity Level */}
            {step === 3 && (
              <>
                <View>
                  <Text className="block text-sm font-medium text-gray-700 mb-3">
                    Nivel de Actividad Física
                  </Text>
                  <View className="space-y-3">
                    {[
                      { value: 'sedentary', label: 'Sedentario', desc: 'Poco o ningún ejercicio' },
                      { value: 'light', label: 'Ligero', desc: 'Ejercicio 1-3 veces/semana' },
                      { value: 'moderate', label: 'Moderado', desc: 'Ejercicio 3-5 veces/semana' },
                      { value: 'active', label: 'Activo', desc: 'Ejercicio 6-7 veces/semana' },
                      { value: 'veryActive', label: 'Muy Activo', desc: 'Ejercicio intenso diario' }
                    ].map((level) => (
                      <TouchableOpacity
                        key={level.value}
                        onPress={() => handleInputChange('activityLevel', level.value)}
                        className={`w-full flex flex-row items-center p-4 rounded-lg border ${
                          userData.activityLevel === level.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300'
                        }`}
                      >
                        <MaterialCommunityIcons name="run" size={20} 
                          color={userData.activityLevel === level.value ? '#2563EB' : '#6B7280'} 
                          className="mr-3"
                        />
                        <View>
                          <Text className={`font-medium ${
                            userData.activityLevel === level.value ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {level.label}
                          </Text>
                          <Text className={`text-sm ${
                            userData.activityLevel === level.value ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {level.desc}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View>
                  <Text className="block text-sm font-medium text-gray-700 mb-3">
                    Objetivo Principal
                  </Text>
                  <View className="space-y-3">
                    {[
                      { value: 'maintain', label: 'Mantener peso' },
                      { value: 'weight-loss', label: 'Bajar de peso' },
                      { value: 'muscle', label: 'Ganar músculo' }
                    ].map((goal) => (
                      <TouchableOpacity
                        key={goal.value}
                        onPress={() => handleInputChange('goal', goal.value)}
                        className={`w-full flex flex-row items-center p-4 rounded-lg border ${
                          userData.goal === goal.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300'
                        }`}
                      >
                        <Feather name="target" size={20} 
                          color={userData.goal === goal.value ? '#2563EB' : '#6B7280'} 
                          className="mr-3"
                        />
                        <Text className={
                          userData.goal === goal.value ? 'text-blue-700' : 'text-gray-700'
                        }>
                          {goal.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            {/* Step 4: Recommendations */}
            {step === 4 && (
              <NutritionRecommendations
                userData={{
                  weight: Number(userData.weight),
                  height: Number(userData.height),
                  age: Number(userData.age),
                  gender: userData.gender as 'male' | 'female',
                  activityLevel: userData.activityLevel,
                  goal: userData.goal as 'maintain' | 'weight-loss' | 'muscle',
                }}
                onSaveRecommendations={handleSaveRecommendations}
              />
            )}

            {/* Next Button */}
            {step < 4 && (
              <TouchableOpacity
                onPress={handleNext}
                disabled={isNextDisabled()}
                className={`w-full flex flex-row items-center justify-center py-3 px-4 rounded-lg shadow-sm ${
                  isNextDisabled() ? 'bg-blue-300' : 'bg-blue-600'
                }`}
              >
                <Text className="text-white">
                  {step === 3 ? 'Ver Recomendaciones' : 'Siguiente'}
                </Text>
                <AntDesign name="arrowright" size={20} color="white" className="ml-2" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default UserOnboarding