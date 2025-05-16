import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { WorkoutRoutine, RoutineExercise } from '../../../types/exercise';
// import { useExerciseStore } from '../../stores/exerciseStore';

interface WorkoutDetailProps {
  routine: WorkoutRoutine;
  onBack: () => void;
  onStartWorkout: () => void;
}

const WorkoutDetail: React.FC<WorkoutDetailProps> = ({ routine, onBack, onStartWorkout }) => {
  //   const { getRoutineExercises, routineExercises } = useExerciseStore();
  const [loading, setLoading] = useState(true);
  const [routineExercises, setRoutineExercises] = useState<{ [key: string]: RoutineExercise[] }>(
    {}
  );

  const getRoutineExercises = async (routineId: string) => {
    // Simulate fetching routine exercises from a store or API
    const fetchedExercises: RoutineExercise[] = [
      {
        id: '1',
        routine_id: routineId,
        exercise_id: '1',
        order_index: 0,
        sets: 3,
        reps: 12,
        rest_time: 60,
        exercise: {
          id: '1',
          name: 'Sentadillas',
          description: 'Ejercicio de piernas',
          category: 'Piernas',
          difficulty: 'principiante',
          muscles_worked: ['cuádriceps', 'glúteos'],
        },
      },
      {
        id: '2',
        routine_id: routineId,
        exercise_id: '2',
        order_index: 1,
        sets: 3,
        reps: 10,
        rest_time: 60,
        exercise: {
          id: '2',
          name: 'Flexiones',
          description: 'Ejercicio de pecho',
          category: 'Pecho',
          difficulty: 'principiante',
          muscles_worked: ['pectorales', 'tríceps'],
        },
      },
    ];
    setRoutineExercises((prev) => ({
      ...prev,
      [routineId]: fetchedExercises,
    }));
  };

  useEffect(() => {
    const loadExercises = async () => {
      try {
        await getRoutineExercises(routine.id);
      } catch (error) {
        console.error('Error loading routine exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [routine.id]);

  const exercises = routineExercises[routine.id] || [];

  if (loading) {
    return (
      <View className="h-64 flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 rounded-lg bg-white p-6 shadow-md">
      <View className="mb-6 flex-row items-center justify-between">
        <TouchableOpacity onPress={onBack} className="flex-row items-center">
          <Feather name="chevron-left" size={20} color="#4b5563" className="mr-1" />
          <Text className="font-medium text-gray-600">Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onStartWorkout}
          className="flex-row items-center rounded-lg bg-green-500 px-4 py-2">
          <Feather name="play" size={20} color="#fff" className="mr-2" />
          <Text className="font-medium text-white">Comenzar</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-6">
        <Text className="mb-2 text-2xl font-bold">{routine.name}</Text>
        <Text className="mb-4 text-gray-600">{routine.description}</Text>
        <View className="flex-row space-x-4">
          <View className="flex-row items-center">
            <Feather name="clock" size={20} color="#4b5563" className="mr-1" />
            <Text className="text-gray-600">{routine.estimated_duration} min</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="fire" size={20} color="#4b5563" className="mr-1" />
            <Text className="text-gray-600">{routine.calories_burned} kcal</Text>
          </View>
        </View>
      </View>

      <View className="space-y-4">
        <Text className="mb-4 text-lg font-semibold">Ejercicios</Text>
        {exercises.map((exercise: RoutineExercise, index: number) => (
          <View key={exercise.id} className="mb-2 flex-row items-start rounded-lg bg-gray-50 p-4">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-lg font-semibold text-blue-600">{index + 1}</Text>
            </View>
            <View className="flex-1">
              <Text className="mb-1 font-medium">{exercise.exercise?.name}</Text>
              <Text className="mb-2 text-sm text-gray-600">{exercise.exercise?.description}</Text>
              <View className="flex-row flex-wrap items-center space-x-4">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={16}
                    color="#4b5563"
                    className="mr-1"
                  />
                  <Text className="text-gray-600">{exercise.sets} series</Text>
                </View>
                {exercise.reps ? (
                  <Text className="text-gray-600">{exercise.reps} repeticiones</Text>
                ) : null}
                {exercise.duration ? (
                  <View className="flex-row items-center">
                    <Feather name="clock" size={16} color="#4b5563" className="mr-1" />
                    <Text className="text-gray-600">{exercise.duration} seg</Text>
                  </View>
                ) : null}
                <Text className="text-gray-600">Descanso: {exercise.rest_time} seg</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default WorkoutDetail;
