import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useWorkoutGoalsStore } from '../../../stores/workoutGoalsStore';
import { useUserProfileStore } from '../../../stores/userProfileStore';
import { useAuthStore } from '../../../stores/authStore';
import { calculateWorkoutGoals } from '../../../utils/workoutCalculator';

const WorkoutGoalsForm: React.FC = () => {
    const { user } = useAuthStore();
    const { goals, updateGoals } = useWorkoutGoalsStore();
    const { profile } = useUserProfileStore();

  // const user = { id: '123' }; // Mock user data
  // const goals = {
  //   workouts_per_week: 4,
  //   minutes_per_workout: 60,
  //   calories_per_week: 2000,
  // };
  // const updateGoals = async (userId: string, newGoals: any) => {
  //   // Simulate updating goals
  //   console.log(`Updating goals for user ${userId}:`, newGoals);
  // };
  // interface UserProfile {
  //   id: string;
  //   user_id: string;
  //   weight: number;
  //   height: number;
  //   age: number;
  //   gender: 'male' | 'female';
  //   activity_level: string;
  //   goal: 'maintain' | 'weight-loss' | 'muscle';
  // }
  // const profile: UserProfile = {
  //   id: '1',
  //   user_id: '123',
  //   weight: 70,
  //   height: 175,
  //   age: 30,
  //   gender: 'male',
  //   activity_level: 'intermediate',
  //   goal: 'weight-loss',
  // };

  useEffect(() => {
    const initializeGoals = async () => {
      if (user && profile) {
        const calculatedGoals = calculateWorkoutGoals(profile.activity_level, profile.goal);

        if (
          !goals ||
          goals.workouts_per_week !== calculatedGoals.workouts_per_week ||
          goals.minutes_per_workout !== calculatedGoals.minutes_per_workout ||
          goals.calories_per_week !== calculatedGoals.calories_per_week
        ) {
          try {
            await updateGoals(user.id, calculatedGoals);
          } catch (error) {
            console.error('Error updating workout goals:', error);
          }
        }
      }
    };

    initializeGoals();
  }, [user, profile]);

  if (!goals) {
    return (
      <View className="rounded-lg bg-white p-6 shadow-md">
        <View className="mb-6 flex-row items-center">
          <MaterialCommunityIcons
            name="target"
            size={24}
            color="#3B82F6"
            style={{ marginRight: 8 }}
          />
          <Text className="text-xl font-semibold">Objetivos de Entrenamiento</Text>
        </View>
        <ActivityIndicator size="small" color="#3B82F6" />
        <Text className="mt-2 text-center text-gray-500">Cargando objetivos...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="rounded-lg bg-white p-6 shadow-md">
      <View className="mb-6 flex-row items-center">
        <MaterialCommunityIcons
          name="target"
          size={24}
          color="#3B82F6"
          style={{ marginRight: 8 }}
        />
        <Text className="text-xl font-semibold">Objetivos de Entrenamiento</Text>
      </View>

      <View className="space-y-6">
        <View className="rounded-lg bg-blue-50 p-4">
          <View className="mb-2 flex-row items-center">
            <Feather name="activity" size={20} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text className="font-medium text-blue-800">Frecuencia Semanal</Text>
          </View>
          <Text className="text-2xl font-bold text-blue-600">{goals.workouts_per_week}</Text>
          <Text className="text-sm text-blue-600">entrenamientos por semana</Text>
        </View>

        <View className="rounded-lg bg-green-50 p-4">
          <View className="mb-2 flex-row items-center">
            <Feather name="clock" size={20} color="#22C55E" style={{ marginRight: 8 }} />
            <Text className="font-medium text-green-800">Duración</Text>
          </View>
          <Text className="text-2xl font-bold text-green-600">{goals.minutes_per_workout}</Text>
          <Text className="text-sm text-green-600">minutos por sesión</Text>
        </View>

        <View className="rounded-lg bg-red-50 p-4">
          <View className="mb-2 flex-row items-center">
            <FontAwesome5 name="fire" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <Text className="font-medium text-red-800">Gasto Calórico</Text>
          </View>
          <Text className="text-2xl font-bold text-red-600">{goals.calories_per_week}</Text>
          <Text className="text-sm text-red-600">calorías por semana</Text>
        </View>

        <View className="rounded-lg bg-gray-50 p-4">
          <Text className="mb-2 font-medium">Recomendaciones</Text>
          <View className="space-y-2">
            <Text className="text-sm text-gray-600">
              • Mantén al menos un día de descanso entre entrenamientos
            </Text>
            <Text className="text-sm text-gray-600">
              • Incluye ejercicios de calentamiento y estiramiento
            </Text>
            <Text className="text-sm text-gray-600">• Aumenta gradualmente la intensidad</Text>
            <Text className="text-sm text-gray-600">• Mantén una buena hidratación</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default WorkoutGoalsForm;
