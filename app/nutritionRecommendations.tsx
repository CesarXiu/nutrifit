import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, FontAwesome, Feather } from '@expo/vector-icons';
// import { useNutritionGoalsStore } from '../stores/nutritionGoalsStore';
// import { useAuthStore } from '../stores/authStore';
import Toast from 'react-native-toast-message';
import {
  calculateBMR,
  calculateTDEE,
  calculateWaterNeeds,
  calculateMacros,
} from '../utils/nutritionCalculator';

interface NutritionRecommendationsProps {
  userData: {
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female';
    activityLevel: string;
    goal: 'maintain' | 'weight-loss' | 'muscle';
  };
  onSaveRecommendations: (recommendations: {
    calories: number;
    water: number;
    protein: number;
    carbs: number;
    fats: number;
  }) => void;
}

const NutritionRecommendations: React.FC<NutritionRecommendationsProps> = ({
  userData,
  onSaveRecommendations,
}) => {
//   const { user } = useAuthStore();
//   const { saveGoals } = useNutritionGoalsStore();
    const [user, setUser] = React.useState<any>(null);
    const saveGoals = async (userId: string, recommendations: any) => {
        // Simulate saving goals to a database
    }

  const bmr = calculateBMR(userData.weight, userData.height, userData.age, userData.gender);
  const tdee = calculateTDEE(bmr, userData.activityLevel);
  
  // Adjust calories based on goal
  let targetCalories = tdee;
  if (userData.goal === 'weight-loss') {
    targetCalories = Math.round(tdee * 0.8); // 20% deficit
  } else if (userData.goal === 'muscle') {
    targetCalories = Math.round(tdee * 1.1); // 10% surplus
  }

  const waterNeeds = calculateWaterNeeds(userData.weight, userData.activityLevel);
  const macros = calculateMacros(targetCalories);

  const recommendations = {
    calories: targetCalories,
    water: waterNeeds,
    protein: macros.protein,
    carbs: macros.carbs,
    fats: macros.fats
  };

  const handleSaveRecommendations = async () => {
    try {
      // if (!user) {
      //   throw new Error('Usuario no autenticado');
      // }

      // Guardar en la base de datos
      // await saveGoals(user.id, recommendations);

      // Notificar al componente padre
      onSaveRecommendations(recommendations);
      
      Toast.show({
        type: 'success',
        text1: 'Recomendaciones guardadas',
        text2: 'Tus recomendaciones se han guardado exitosamente'
      });
    } catch (error) {
      console.error('Error al guardar las recomendaciones:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al guardar las recomendaciones'
      });
    }
  };

  return (
    <ScrollView className="bg-white p-6 rounded-xl shadow-lg">
      <Text className="text-2xl font-bold mb-6">Recomendaciones Nutricionales Personalizadas</Text>
      
      <View className="flex flex-col md:flex-row gap-6 mb-8">
        <View className="bg-blue-50 p-4 rounded-lg flex-1">
          <View className="flex flex-row items-center justify-between mb-2">
            <Text className="text-lg font-semibold text-blue-800">Calorías Diarias</Text>
            <MaterialCommunityIcons name="scale" size={24} color="#3B82F6" />
          </View>
          <Text className="text-3xl font-bold text-blue-600">{targetCalories}</Text>
          <Text className="text-sm text-blue-600 mt-1">kcal/día</Text>
          <View className="mt-2">
            <Text className="text-sm text-blue-600">TMB (Metabolismo Basal): {bmr} kcal</Text>
            <Text className="text-sm text-blue-600">TDEE (Gasto Total): {tdee} kcal</Text>
          </View>
        </View>

        <View className="bg-cyan-50 p-4 rounded-lg flex-1">
          <View className="flex flex-row items-center justify-between mb-2">
            <Text className="text-lg font-semibold text-cyan-800">Agua</Text>
            <MaterialCommunityIcons name="water" size={24} color="#06B6D4" />
          </View>
          <Text className="text-3xl font-bold text-cyan-600">{waterNeeds}</Text>
          <Text className="text-sm text-cyan-600 mt-1">ml/día</Text>
          <Text className="mt-2 text-sm text-cyan-600">
            Aproximadamente {Math.round(waterNeeds / 250)} vasos de agua
          </Text>
        </View>
      </View>

      <View className="bg-green-50 p-6 rounded-lg mb-8">
        <View className="flex flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-green-800">Distribución de Macronutrientes (OMS)</Text>
          <FontAwesome name="apple" size={24} color="#22C55E" />
        </View>
        
        <View className="flex flex-row justify-between gap-4">
          <View className="items-center">
            <Text className="text-sm text-green-600">Carbohidratos</Text>
            <Text className="text-2xl font-bold text-green-700">{macros.carbs}g</Text>
            <Text className="text-xs text-green-600">52.5% de calorías</Text>
          </View>
          <View className="items-center">
            <Text className="text-sm text-green-600">Grasas</Text>
            <Text className="text-2xl font-bold text-green-700">{macros.fats}g</Text>
            <Text className="text-xs text-green-600">32.5% de calorías</Text>
          </View>
          <View className="items-center">
            <Text className="text-sm text-green-600">Proteínas</Text>
            <Text className="text-2xl font-bold text-green-700">{macros.protein}g</Text>
            <Text className="text-xs text-green-600">15% de calorías</Text>
          </View>
        </View>

        <View className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <View className="h-full flex flex-row">
            <View 
              className="bg-blue-500"
              style={{ width: '52.5%' }}
            />
            <View 
              className="bg-yellow-500"
              style={{ width: '32.5%' }}
            />
            <View 
              className="bg-green-500"
              style={{ width: '15%' }}
            />
          </View>
        </View>
      </View>

      <View className="bg-gray-50 p-4 rounded-lg mb-6">
        <Text className="font-semibold mb-2">Recomendaciones Adicionales</Text>
        <View className="space-y-2">
          <View className="flex flex-row items-center">
            <Feather name="chevron-right" size={16} color="#22C55E" className="mr-2" />
            <Text className="text-sm text-gray-600">Distribuye las comidas en 4-6 porciones al día</Text>
          </View>
          <View className="flex flex-row items-center">
            <Feather name="chevron-right" size={16} color="#22C55E" className="mr-2" />
            <Text className="text-sm text-gray-600">Prioriza carbohidratos complejos sobre simples</Text>
          </View>
          <View className="flex flex-row items-center">
            <Feather name="chevron-right" size={16} color="#22C55E" className="mr-2" />
            <Text className="text-sm text-gray-600">Incluye grasas saludables en tu dieta</Text>
          </View>
          <View className="flex flex-row items-center">
            <Feather name="chevron-right" size={16} color="#22C55E" className="mr-2" />
            <Text className="text-sm text-gray-600">Mantén un consumo moderado de proteínas según la OMS</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSaveRecommendations}
        className="w-full bg-blue-500 text-white py-3 rounded-lg"
      >
        <Text className="text-white text-center">Aplicar Recomendaciones</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NutritionRecommendations;