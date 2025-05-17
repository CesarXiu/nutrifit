import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { WorkoutRoutine } from '../../../types/exercise';
import { useWorkoutTrackingStore } from '../../../stores/workoutTrackingStore';
import { useAuthStore } from '../../../stores/authStore';

interface WorkoutListProps {
  routines: WorkoutRoutine[];
  onSelectRoutine: (routine: WorkoutRoutine) => void;
}

const getDifficultyStyle = (difficulty: string) => {
  switch (difficulty) {
    case 'principiante':
      return 'bg-green-100 text-green-800';
    case 'intermedio':
      return 'bg-yellow-100 text-yellow-800';
    case 'avanzado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const WorkoutList: React.FC<WorkoutListProps> = ({ routines, onSelectRoutine }) => {
  const { startWorkout } = useWorkoutTrackingStore();
  const { user } = useAuthStore();

    // const user = { id: '123' }; // Mock user data

    // const startWorkout = async (userId: string, routineId: string) => {
    //     // Simulate starting a workout
    //     console.log(`Starting workout for user ${userId} with routine ${routineId}`);
    // }

  const handleStartWorkout = async (routine: WorkoutRoutine) => {
    if (!user) return;
    try {
      await startWorkout(user.id, routine.id);
      onSelectRoutine(routine);
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  return (
    <ScrollView className="space-y-4">
      {routines.map((routine) => (
        <View key={routine.id} className="mb-4 rounded-lg bg-white p-4 shadow-md">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-lg font-semibold">{routine.name}</Text>
                <Text
                  className={`rounded px-2 py-1 text-xs ${getDifficultyStyle(routine.difficulty)}`}>
                  {routine.difficulty}
                </Text>
              </View>
              <Text className="mb-4 text-sm text-gray-600">{routine.description}</Text>
              <View className="flex-row items-center space-x-4 text-sm text-gray-500">
                <View className="mr-4 flex-row items-center">
                  <Feather name="clock" size={16} className="mr-1" />
                  <Text>{routine.estimated_duration} min</Text>
                </View>
                <View className="mr-4 flex-row items-center">
                  <MaterialCommunityIcons name="fire" size={16} className="mr-1" />
                  <Text>{routine.calories_burned} kcal</Text>
                </View>
                <View className="rounded bg-blue-50 px-2 py-1">
                  <Text className="text-blue-600">{routine.category}</Text>
                </View>
              </View>
            </View>
            <View className="ml-4 flex-row items-center space-x-2">
              <TouchableOpacity
                onPress={() => handleStartWorkout(routine)}
                className="rounded-full bg-green-500 p-2"
                accessibilityLabel="Iniciar entrenamiento">
                <Feather name="play" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onSelectRoutine(routine)}
                className="rounded-full bg-gray-100 p-2"
                accessibilityLabel="Ver detalles">
                <Ionicons name="chevron-forward" size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default WorkoutList;
