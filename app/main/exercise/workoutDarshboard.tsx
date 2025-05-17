import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons, Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useWorkoutTrackingStore } from '../../../stores/workoutTrackingStore';
import { useWorkoutGoalsStore } from '../../../stores/workoutGoalsStore';
import { useAuthStore } from '../../../stores/authStore';

const WorkoutDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { todayWorkouts, weeklyWorkouts, getTodayWorkouts, getWeeklyWorkouts } =
      useWorkoutTrackingStore();
  const { goals, fetchGoals } = useWorkoutGoalsStore();

  // const user = { id: '123' }; // Mock user data
  // const todayWorkouts = [
  //   {
  //     id: '1',
  //     user_id: '123',
  //     routine_id: 'r1',
  //     tracking_date: new Date().toISOString().split('T')[0],
  //     start_time: '08:00',
  //     end_time: '08:45',
  //     duration: 45,
  //     calories_burned: 350,
  //     completed: true,
  //     notes: 'Buen entrenamiento',
  //   },
  //   {
  //     id: '2',
  //     user_id: '123',
  //     routine_id: 'r2',
  //     tracking_date: new Date().toISOString().split('T')[0],
  //     start_time: '18:00',
  //     end_time: '18:30',
  //     duration: 30,
  //     calories_burned: 200,
  //     completed: false,
  //     notes: 'No terminé',
  //   },
  // ];

  // const weeklyWorkouts = [
  //   {
  //     id: '1',
  //     user_id: '123',
  //     routine_id: 'r1',
  //     tracking_date: '2024-06-10',
  //     start_time: '08:00',
  //     end_time: '08:45',
  //     duration: 45,
  //     calories_burned: 350,
  //     completed: true,
  //     notes: 'Buen entrenamiento',
  //   },
  //   {
  //     id: '2',
  //     user_id: '123',
  //     routine_id: 'r2',
  //     tracking_date: '2024-06-11',
  //     start_time: '18:00',
  //     end_time: '18:30',
  //     duration: 30,
  //     calories_burned: 200,
  //     completed: true,
  //     notes: 'Entrenamiento rápido',
  //   },
  //   {
  //     id: '3',
  //     user_id: '123',
  //     routine_id: 'r3',
  //     tracking_date: '2024-06-12',
  //     start_time: '07:30',
  //     end_time: '08:00',
  //     duration: 30,
  //     calories_burned: 180,
  //     completed: false,
  //     notes: 'No terminé',
  //   },
  //   {
  //     id: '4',
  //     user_id: '123',
  //     routine_id: 'r4',
  //     tracking_date: '2024-06-13',
  //     start_time: '19:00',
  //     end_time: '19:40',
  //     duration: 40,
  //     calories_burned: 300,
  //     completed: true,
  //     notes: '',
  //   },
  //   {
  //     id: '5',
  //     user_id: '123',
  //     routine_id: 'r5',
  //     tracking_date: '2024-06-14',
  //     start_time: '06:30',
  //     end_time: '07:00',
  //     duration: 30,
  //     calories_burned: 220,
  //     completed: true,
  //     notes: 'Mañana productiva',
  //   },
  // ];
  // const goals = {
  //   workouts_per_week: 5,
  //   minutes_per_workout: 30,
  //   calories_per_week: 2000,
  // }; // Mock data}
  // const getTodayWorkouts = (userId: string) => {
  //   // Mock function to fetch today's workouts
  // };
  // const getWeeklyWorkouts = (userId: string) => {
  //   // Mock function to fetch weekly workouts
  // };
  // const fetchGoals = (userId: string) => {
  //   // Mock function to fetch goals
  // };

  useEffect(() => {
    if (user) {
      getTodayWorkouts(user.id);
      getWeeklyWorkouts(user.id);
      fetchGoals(user.id);
    }
  }, [user]);

  const calculateProgress = () => {
    if (!goals)
      return {
        workoutsProgress: 0,
        minutesProgress: 0,
        caloriesProgress: 0,
      };

    const completedWorkouts = weeklyWorkouts.filter((w) => w.completed);
    const totalWorkouts = completedWorkouts.length;
    const totalMinutes = completedWorkouts.reduce(
      (sum, workout) => sum + (workout.duration || 0),
      0
    );
    const totalCalories = completedWorkouts.reduce(
      (sum, workout) => sum + (workout.calories_burned || 0),
      0
    );

    return {
      workoutsProgress: (totalWorkouts / goals.workouts_per_week) * 100,
      minutesProgress: (totalMinutes / (goals.minutes_per_workout * goals.workouts_per_week)) * 100,
      caloriesProgress: (totalCalories / goals.calories_per_week) * 100,
    };
  };

  const progress = calculateProgress();

  const completedWorkouts = weeklyWorkouts.filter((w) => w.completed);
  const totalMinutes = completedWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
  const totalCalories = completedWorkouts.reduce(
    (sum, workout) => sum + (workout.calories_burned || 0),
    0
  );

  // Barra de progreso simple
  const ProgressBar = ({ progress, color }: { progress: number; color: string }) => (
    <View className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
      <View
        className={`h-full rounded-full ${color}`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </View>
  );

  return (
    <View className="flex-row flex-wrap -mx-2">
      <View className="w-1/2 px-2 mb-4">
        <View className="min-w-[150px] flex-1 rounded-lg bg-white p-6 shadow">
          <View className="mb-4 flex-row items-center justify-between">
            <Feather name="activity" size={32} color="#3B82F6" />
            <Text className="text-sm font-medium text-blue-500">Esta semana</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800">
            {completedWorkouts.length}/{goals?.workouts_per_week || 0}
          </Text>
          <Text className="text-gray-600">Entrenamientos</Text>
          <ProgressBar progress={progress.workoutsProgress} color="bg-blue-500" />
        </View>
      </View>
      <View className="w-1/2 px-2 mb-4">
        <View className="min-w-[150px] flex-1 rounded-lg bg-white p-6 shadow">
          <View className="mb-4 flex-row items-center justify-between">
            <MaterialCommunityIcons name="calendar-month-outline" size={32} color="#22C55E" />
            <Text className="text-sm font-medium text-green-500">Tiempo total</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800">{Math.round(totalMinutes)} min</Text>
          <Text className="text-gray-600">
            De {goals?.minutes_per_workout * goals?.workouts_per_week || 0} min/semana
          </Text>
          <ProgressBar progress={progress.minutesProgress} color="bg-green-500" />
        </View>
      </View>
      <View className="w-1/2 px-2 mb-4">
        <View className="min-w-[150px] flex-1 rounded-lg bg-white p-6 shadow">
          <View className="mb-4 flex-row items-center justify-between">
            <FontAwesome5 name="fire" size={32} color="#A21CAF" />
            <Text className="text-sm font-medium text-purple-500">Calorías</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800">{Math.round(totalCalories)}</Text>
          <Text className="text-gray-600">De {goals?.calories_per_week || 0} kcal/semana</Text>
          <ProgressBar progress={progress.caloriesProgress} color="bg-purple-500" />
        </View>
      </View>
      <View className="w-1/2 px-2 mb-4">
        <View className="min-w-[150px] flex-1 rounded-lg bg-white p-6 shadow">
          <View className="mb-4 flex-row items-center justify-between">
            <FontAwesome5 name="bullseye" size={32} color="#EF4444" />
            <Text className="text-sm font-medium text-red-500">Objetivos</Text>
          </View>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">Entrenamientos</Text>
              <Text className="text-sm font-medium">{Math.round(progress.workoutsProgress)}%</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">Tiempo</Text>
              <Text className="text-sm font-medium">{Math.round(progress.minutesProgress)}%</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-600">Calorías</Text>
              <Text className="text-sm font-medium">{Math.round(progress.caloriesProgress)}%</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WorkoutDashboard;
