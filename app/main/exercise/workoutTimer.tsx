import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
// import { useWorkoutTrackingStore } from '../../stores/workoutTrackingStore';
// import { useExerciseStore } from '../../stores/exerciseStore';
import Toast from 'react-native-toast-message';
import { Feather, MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { RoutineExercise } from 'types/exercise';

interface WorkoutTimerProps {
  onFinish: () => void;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ onFinish }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [loading, setLoading] = useState(true);
  //   const { currentWorkout, endWorkout, getTodayWorkouts, getWeeklyWorkouts } =
  //     useWorkoutTrackingStore();
  //   const { routineExercises, getRoutineExercises } = useExerciseStore();
  const currentWorkout = {
    id: '1',
    user_id: '123',
    routine_id: 'r1',
    tracking_date: new Date().toISOString().split('T')[0],
    start_time: '08:00',
    end_time: '08:45',
    duration: 45,
    calories_burned: 350,
    completed: true,
    notes: 'Buen entrenamiento',
  }; // Mock current workout data

  const routineExercises: Record<string, RoutineExercise[]> = {
    r1: [
      {
        id: 'e1',
        routine_id: 'r1',
        exercise_id: 'ex1',
        order_index: 0,
        sets: 3,
        reps: 10,
        duration: 45,
        rest_time: 30,
        exercise: {
          id: 'ex1',
          name: 'Push Up',
          description: 'Push up exercise',
          category: 'Strength',
          difficulty: 'principiante',
          muscles_worked: ['Chest', 'Triceps'],
          calories_per_minute: 8,
        },
      },
      {
        id: 'e2',
        routine_id: 'r1',
        exercise_id: 'ex2',
        order_index: 1,
        sets: 3,
        reps: 12,
        duration: 45,
        rest_time: 30,
        exercise: {
          id: 'ex2',
          name: 'Squat',
          description: 'Squat exercise',
          category: 'Strength',
          difficulty: 'principiante',
          muscles_worked: ['Legs', 'Glutes'],
          calories_per_minute: 7,
        },
      },
    ],
    r2: [
      {
        id: 'e3',
        routine_id: 'r2',
        exercise_id: 'ex3',
        order_index: 0,
        sets: 3,
        reps: 10,
        duration: 45,
        rest_time: 30,
        exercise: {
          id: 'ex3',
          name: 'Lunges',
          description: 'Lunges exercise',
          category: 'Strength',
          difficulty: 'intermedio',
          muscles_worked: ['Legs', 'Glutes'],
          calories_per_minute: 7,
        },
      },
      {
        id: 'e4',
        routine_id: 'r2',
        exercise_id: 'ex4',
        order_index: 1,
        sets: 3,
        reps: 30,
        duration: 45,
        rest_time: 30,
        exercise: {
          id: 'ex4',
          name: 'Plank',
          description: 'Plank exercise',
          category: 'Core',
          difficulty: 'principiante',
          muscles_worked: ['Abs', 'Back'],
          calories_per_minute: 6,
        },
      },
    ],
  };

  const exercises = currentWorkout?.routine_id
    ? routineExercises[currentWorkout.routine_id] || []
    : [];

  const getRoutineExercises = async (routineId: string) => {
    // Simulate fetching routine exercises from a store or API
    const fetchedExercises = routineExercises[routineId] || [];
  };

  const endWorkout = async (workoutId: string, minutes: number, calories: number) => {
    // Simulate ending the workout and updating the database
    console.log(
      `Workout ${workoutId} ended. Duration: ${minutes} minutes, Calories burned: ${calories}`
    );
  };
  const getTodayWorkouts = async (userId: string) => {
    // Simulate fetching today's workouts from a store or API
    console.log(`Fetching today's workouts for user ${userId}`);
  };

  const getWeeklyWorkouts = async (userId: string) => {
    // Simulate fetching weekly workouts from a store or API
    console.log(`Fetching weekly workouts for user ${userId}`);
  };

  useEffect(() => {
    const loadExercises = async () => {
      if (currentWorkout?.routine_id) {
        try {
          setLoading(true);
          await getRoutineExercises(currentWorkout.routine_id);
        } catch (error) {
          console.error('Error loading exercises:', error);
          Toast.show({ type: 'error', text1: 'Error al cargar los ejercicios' });
        } finally {
          setLoading(false);
        }
      }
    };

    loadExercises();
  }, [currentWorkout?.routine_id]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          setTotalSeconds((prev) => prev + 1);
          const currentExerciseData = exercises[currentExercise];

          if (!currentExerciseData) return newSeconds;

          const exerciseDuration = currentExerciseData.duration || 45;
          const restTime = isResting
            ? currentSet < currentExerciseData.sets
              ? currentExerciseData.rest_time
              : 60
            : exerciseDuration;

          if (newSeconds >= restTime) {
            if (isResting) {
              if (currentSet < currentExerciseData.sets) {
                setCurrentSet((prev) => prev + 1);
              } else if (currentExercise < exercises.length - 1) {
                setCurrentExercise((prev) => prev + 1);
                setCurrentSet(1);
              } else {
                setIsRunning(false);
                return newSeconds;
              }
            }
            setIsResting(!isResting);
            return 0;
          }
          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, currentExercise, currentSet, isResting, exercises]);

  const toggleTimer = () => {
    if (exercises.length === 0) {
      Toast.show({ type: 'error', text1: 'No hay ejercicios cargados para esta rutina' });
      return;
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
    setCurrentExercise(0);
    setCurrentSet(1);
    setIsResting(false);
  };

  const calculateCaloriesBurned = () => {
    const minutes = totalSeconds / 60;
    let totalCalories = 0;

    exercises.forEach((exercise, index) => {
      if (exercise.exercise?.calories_per_minute) {
        if (index < currentExercise || (index === currentExercise && !isResting)) {
          const exerciseMinutes = ((exercise.duration || 45) * exercise.sets) / 60;
          totalCalories += exercise.exercise.calories_per_minute * exerciseMinutes;
        }
      }
    });

    if (totalCalories === 0) {
      totalCalories = Math.round(minutes * 8);
    }

    return Math.round(totalCalories);
  };

  const handleFinishWorkout = async () => {
    if (!currentWorkout) return;

    try {
      const minutes = totalSeconds / 60;
      const calories = calculateCaloriesBurned();

      await endWorkout(currentWorkout.id, minutes, calories);

      if (currentWorkout.user_id) {
        await getTodayWorkouts(currentWorkout.user_id);
        await getWeeklyWorkouts(currentWorkout.user_id);
      }

      onFinish();
    } catch (error) {
      console.error('Error finishing workout:', error);
      Toast.show({ type: 'error', text1: 'Error al finalizar el entrenamiento' });
    }
  };

  const handleNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise((prev) => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setSeconds(0);
      if (isRunning) {
        Toast.show({ type: 'success', text1: '¡Pasando al siguiente ejercicio!' });
      }
    }
  };

  const handlePreviousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise((prev) => prev - 1);
      setCurrentSet(1);
      setIsResting(false);
      setSeconds(0);
    }
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View className="h-64 flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (exercises.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="mb-4 text-xl font-semibold">No hay ejercicios disponibles</Text>
        <Text className="text-gray-600">Esta rutina no tiene ejercicios asignados.</Text>
      </View>
    );
  }

  const currentExerciseData = exercises[currentExercise];
  const exerciseDuration = currentExerciseData?.duration || 45;
  const restDuration = isResting
    ? currentSet < currentExerciseData?.sets
      ? currentExerciseData?.rest_time
      : 60
    : exerciseDuration;
  const progress = (seconds / restDuration) * 100;

  const totalProgress =
    (currentExercise * 100) / exercises.length +
    ((currentSet - 1) * (100 / exercises.length)) / currentExerciseData?.sets;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="mx-auto max-w-2xl p-4">
        <View className="mb-6 flex-row items-center justify-between">
          <TouchableOpacity onPress={onFinish} className="flex-row items-center">
            <Ionicons name="arrow-back" size={20} color="#4b5563" />
            <Text className="ml-2 font-medium text-gray-600">Volver</Text>
          </TouchableOpacity>
          <Text className="text-m font-semibold">Entrenamiento en Progreso</Text>
        </View>

        <View className="mb-8 rounded-lg bg-gray-100 p-6">
          <View className="mb-4">
            <View className="h-2 w-full rounded-full bg-gray-200">
              <View
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${totalProgress}%` }}
              />
            </View>
            <Text className="mt-1 text-sm text-gray-500">
              Progreso total: {Math.round(totalProgress)}%
            </Text>
          </View>
          <Text className="mb-2 text-gray-600">
            Ejercicio {currentExercise + 1} de {exercises.length} - Set {currentSet} de{' '}
            {currentExerciseData?.sets || 0}
          </Text>
          <Text className="mb-2 text-center text-xl font-semibold">
            {isResting ? 'Descanso' : currentExerciseData?.exercise?.name || 'Preparado'}
          </Text>
            <View className="mb-4 flex items-center justify-center">
            <Text className="text-3xl font-bold text-blue-600">{formatTime(seconds)}</Text>
            <View className="flex-row items-center mt-2">
              <Feather name="clock" size={16} color="#6b7280" />
              <Text className="text-sm text-gray-500 ml-1">{formatTime(restDuration - seconds)} restante</Text>
            </View>
            </View>

          <View className="mb-6 h-3 w-full rounded-full bg-gray-200">
            <View
              className={`h-3 rounded-full ${isResting ? 'bg-yellow-500' : 'bg-blue-600'}`}
              style={{ width: `${progress}%` }}
            />
          </View>

            <View className="space-y-3">
            {/* Primera fila: Flecha izquierda, Play/Pause, Flecha derecha */}
            <View className="flex-row items-center justify-center">
              <TouchableOpacity
              onPress={handlePreviousExercise}
              disabled={currentExercise === 0}
              className={`rounded-full p-4 mx-6 ${currentExercise === 0 ? 'bg-gray-300' : 'bg-gray-500'} ${currentExercise === 0 ? '' : 'active:bg-gray-600'}`}>
              <Feather name="chevron-left" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
              onPress={toggleTimer}
              className={`rounded-full p-4 mx-6 ${isRunning ? 'bg-red-500' : 'bg-green-500'} active:bg-opacity-80`}>
              {isRunning ? (
                <Feather name="pause" size={24} color="#fff" />
              ) : (
                <Feather name="play" size={24} color="#fff" />
              )}
              </TouchableOpacity>

              <TouchableOpacity
              onPress={handleNextExercise}
              disabled={currentExercise === exercises.length - 1}
              className={`rounded-full p-4 mx-6 ${currentExercise === exercises.length - 1 ? 'bg-gray-300' : 'bg-gray-500'} ${currentExercise === exercises.length - 1 ? '' : 'active:bg-gray-600'}`}>
              <Feather name="chevron-right" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            {/* Segunda fila: Reiniciar y Completar */}
            <View className="flex-row items-center justify-center">
              <TouchableOpacity
              onPress={resetTimer}
              className="rounded-full bg-gray-500 p-4 mx-8 active:bg-gray-600"
              >
              <Feather name="rotate-ccw" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
              onPress={handleFinishWorkout}
              className="rounded-full bg-blue-500 p-4 mx-8 active:bg-blue-600"
              >
              <Feather name="check-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            </View>
        </View>

        <View className="space-y-4">
          <Text className="mb-2 font-semibold">Siguientes Ejercicios:</Text>
          {exercises.slice(currentExercise + 1, currentExercise + 4).map((exercise, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
              <View className="flex-row items-center">
                <View className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Text className="text-center">{currentExercise + index + 2}</Text>
                </View>
                <View>
                  <Text className="font-medium">{exercise.exercise?.name}</Text>
                  <Text className="text-sm text-gray-500">
                    {exercise.sets} series × {exercise.reps || `${exercise.duration}s`}
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default WorkoutTimer;
