import React, { useEffect } from 'react';
import { MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
// import { useWorkoutGoalsStore } from '../../stores/workoutGoalsStore';
// import { useUserProfileStore } from '../../stores/userProfileStore';
// import { useAuthStore } from '../../stores/authStore';
import { calculateWorkoutGoals } from '../../../utils/workoutCalculator';

const WorkoutGoalsForm: React.FC = () => {
  //   const { user } = useAuthStore();
  //   const { goals, updateGoals } = useWorkoutGoalsStore();
  //   const { profile } = useUserProfileStore();

  const user = { id: '123' }; // Mock user data
  const goals = {
    workouts_per_week: 4,
    minutes_per_workout: 60,
    calories_per_week: 2000,
  };
  const updateGoals = async (userId: string, newGoals: any) => {
    // Simulate updating goals
    console.log(`Updating goals for user ${userId}:`, newGoals);
  };
  interface UserProfile {
    id: string;
    user_id: string;
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female';
    activity_level: string;
    goal: 'maintain' | 'weight-loss' | 'muscle';
  }
  const profile: UserProfile = {
    id: '1',
    user_id: '123',
    weight: 70,
    height: 175,
    age: 30,
    gender: 'male',
    activity_level: 'intermediate',
    goal: 'weight-loss',
  };

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
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center">
          <MaterialCommunityIcons
            name="target"
            size={24}
            color="#3B82F6"
            style={{ marginRight: 8 }}
          />
          <h2 className="text-xl font-semibold">Objetivos de Entrenamiento</h2>
        </div>
        <p className="text-center text-gray-500">Cargando objetivos...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center">
        <MaterialCommunityIcons
          name="target"
          size={24}
          color="#3B82F6"
          style={{ marginRight: 8 }}
        />
        <h2 className="text-xl font-semibold">Objetivos de Entrenamiento</h2>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="mb-2 flex items-center">
            <Feather name="activity" size={20} color="#3B82F6" style={{ marginRight: 8 }} />
            <h3 className="font-medium text-blue-800">Frecuencia Semanal</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">{goals.workouts_per_week}</p>
          <p className="text-sm text-blue-600">entrenamientos por semana</p>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <div className="mb-2 flex items-center">
            <Feather name="clock" size={20} color="#22C55E" style={{ marginRight: 8 }} />
            <h3 className="font-medium text-green-800">Duración</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">{goals.minutes_per_workout}</p>
          <p className="text-sm text-green-600">minutos por sesión</p>
        </div>

        <div className="rounded-lg bg-red-50 p-4">
          <div className="mb-2 flex items-center">
            <FontAwesome5 name="fire" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <h3 className="font-medium text-red-800">Gasto Calórico</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">{goals.calories_per_week}</p>
          <p className="text-sm text-red-600">calorías por semana</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-2 font-medium">Recomendaciones</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Mantén al menos un día de descanso entre entrenamientos</li>
            <li>• Incluye ejercicios de calentamiento y estiramiento</li>
            <li>• Aumenta gradualmente la intensidad</li>
            <li>• Mantén una buena hidratación</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkoutGoalsForm;
