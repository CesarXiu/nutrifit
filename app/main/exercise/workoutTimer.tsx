import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useWorkoutTrackingStore } from '../../../stores/workoutTrackingStore';
import { useExerciseStore } from '../../../stores/exerciseStore';
import Toast from 'react-native-toast-message';
import { Feather, MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';

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
  const { currentWorkout, endWorkout, getTodayWorkouts, getWeeklyWorkouts, clearCurrentWorkout } =
    useWorkoutTrackingStore();
  const { routineExercises, getRoutineExercises } = useExerciseStore();

  const exercises = currentWorkout?.routine_id
    ? routineExercises[currentWorkout.routine_id] || []
    : [];

  // Cargar ejercicios al montar
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

  // Si no hay ejercicios, mostrar Toast y cerrar el modal
  useEffect(() => {
    if (!loading && exercises.length === 0) {
      Toast.show({ type: 'error', text1: 'Esta rutina no tiene ejercicios asignados.' });
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, exercises.length]);

  // Limpiar estado cuando se desmonta o se cierra el timer
  useEffect(() => {
    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Resetea todos los estados relacionados al timer y ejercicio
  const resetAll = () => {
    setIsRunning(false);
    setSeconds(0);
    setCurrentExercise(0);
    setCurrentSet(1);
    setIsResting(false);
    setTotalSeconds(0);
  };

  // Llama a resetAll y luego onFinish para cerrar el modal y limpiar el estado
  const handleClose = () => {
    resetAll();
    onFinish();
    clearCurrentWorkout();
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

      handleClose();
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
    return null;
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
          <TouchableOpacity onPress={handleClose} className="flex-row items-center">
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
            <View className="mt-2 flex-row items-center">
              <Feather name="clock" size={16} color="#6b7280" />
              <Text className="ml-1 text-sm text-gray-500">
                {formatTime(restDuration - seconds)} restante
              </Text>
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
                className={`mx-6 rounded-full p-4 ${currentExercise === 0 ? 'bg-gray-300' : 'bg-gray-500'} ${currentExercise === 0 ? '' : 'active:bg-gray-600'}`}>
                <Feather name="chevron-left" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={toggleTimer}
                className={`mx-6 rounded-full p-4 ${isRunning ? 'bg-red-500' : 'bg-green-500'} active:bg-opacity-80`}>
                {isRunning ? (
                  <Feather name="pause" size={24} color="#fff" />
                ) : (
                  <Feather name="play" size={24} color="#fff" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextExercise}
                disabled={currentExercise === exercises.length - 1}
                className={`mx-6 rounded-full p-4 ${currentExercise === exercises.length - 1 ? 'bg-gray-300' : 'bg-gray-500'} ${currentExercise === exercises.length - 1 ? '' : 'active:bg-gray-600'}`}>
                <Feather name="chevron-right" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            {/* Segunda fila: Reiniciar y Completar */}
            <View className="flex-row items-center justify-center">
              <TouchableOpacity
                onPress={resetAll}
                className="mx-8 rounded-full bg-gray-500 p-4 active:bg-gray-600">
                <Feather name="rotate-ccw" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleFinishWorkout}
                className="mx-8 rounded-full bg-blue-500 p-4 active:bg-blue-600">
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
