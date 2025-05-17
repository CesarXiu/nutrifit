import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Modal } from 'react-native';
import Toast from 'react-native-toast-message';
import { useExerciseStore } from '../../stores/exerciseStore';
import { useWorkoutTrackingStore } from '../../stores/workoutTrackingStore';
import { WorkoutRoutine } from '../../types/exercise';
import WorkoutDashboard from './exercise/workoutDarshboard';
import WorkoutTimer from './exercise/workoutTimer';
import WorkoutDetail from './exercise/workoutDetail';
import WorkoutList from './exercise/workoutList';
import WorkoutGoalsForm from './exercise/workoutGoalsForm';

const ExerciseTracker: React.FC = () => {
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const { routines, fetchRoutines, error: exerciseError } = useExerciseStore();
  const { currentWorkout, error: trackingError } = useWorkoutTrackingStore();

  useEffect(() => {
    fetchRoutines().catch((err) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.message || 'Error al cargar las rutinas',
      });
    });
  }, []);

  useEffect(() => {
    if (currentWorkout) {
      setIsWorkoutActive(true);
    }
  }, [currentWorkout]);

  useEffect(() => {
    if (exerciseError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: exerciseError,
      });
    }
  }, [exerciseError]);

  useEffect(() => {
    if (trackingError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: trackingError,
      });
    }
  }, [trackingError]);

  const handleSelectRoutine = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine);
  };

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
  };

  const handleFinishWorkout = () => {
    setIsWorkoutActive(false);
    setSelectedRoutine(null);
  };

  const handleBack = () => {
    setSelectedRoutine(null);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 px-4 py-6 space-y-6">
      {/* Dashboard de progreso */}
      <WorkoutDashboard />

      {/* Contenido principal */}
      <View className="flex flex-col space-y-6">
        {/* Rutinas */}
        <View className="w-full">
          {isWorkoutActive ? (
            <Modal
              visible={isWorkoutActive}
              transparent
              animationType="fade"
              onRequestClose={handleFinishWorkout}
            >
              <View className="flex-1 items-center justify-center bg-black/50">
                <WorkoutTimer onFinish={handleFinishWorkout} />
              </View>
            </Modal>
          ) : selectedRoutine ? (
            <Modal
              visible={!!selectedRoutine}
              transparent
              animationType="fade"
              onRequestClose={handleBack}
            >
              <View className="flex-1 items-center justify-center bg-black/50">
                <WorkoutDetail
                  routine={selectedRoutine}
                  onBack={handleBack}
                  onStartWorkout={handleStartWorkout}
                />
              </View>
            </Modal>
          ) : (
            <View className="rounded-2xl bg-white p-4 shadow space-y-4">
              <Text className="text-xl font-semibold text-gray-800">
                Rutinas de Entrenamiento
              </Text>
              <WorkoutList routines={routines} onSelectRoutine={handleSelectRoutine} />
            </View>
          )}
        </View>

        {/* Objetivos */}
        <View className="w-full">
          <View className="rounded-2xl bg-white p-4 shadow">
            <WorkoutGoalsForm />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ExerciseTracker;
