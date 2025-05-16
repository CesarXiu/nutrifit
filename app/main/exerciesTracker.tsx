import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
// import { useExerciseStore } from '../stores/exerciseStore';
// import { useWorkoutTrackingStore } from '../stores/workoutTrackingStore';
import { WorkoutRoutine } from '../../types/exercise';
import WorkoutDashboard from './exercise/workoutDarshboard';
import WorkoutTimer from './exercise/workoutTimer';
import WorkoutDetail from './exercise/workoutDetail';
import WorkoutList from './exercise/workoutList';
import WorkoutGoalsForm from './exercise/workoutGoalsForm';
// import WorkoutDashboard from './exercise/WorkoutDashboard';
// import WorkoutList from './exercise/WorkoutList';
// import WorkoutDetail from './exercise/WorkoutDetail';
// import WorkoutTimer from './exercise/WorkoutTimer';
// import WorkoutGoalsForm from './exercise/WorkoutGoalsForm';

const ExerciseTracker: React.FC = () => {
    const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null);
    const [isWorkoutActive, setIsWorkoutActive] = useState(false);
    const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
    // const { routines, fetchRoutines } = useExerciseStore();
    // const { currentWorkout } = useWorkoutTrackingStore();

    const fetchRoutines = async () => {
        // Simulate fetching routines from a store or API
        const fetchedRoutines: WorkoutRoutine[] = [
            {
            id: '1',
            name: 'Rutina Cuerpo Completo',
            description: 'Entrenamiento completo para todo el cuerpo.',
            difficulty: 'intermedio',
            estimated_duration: 60,
            calories_burned: 500,
            category: 'fuerza',
            },
            {
            id: '2',
            name: 'Cardio Explosivo',
            description: 'Rutina de cardio de alta intensidad.',
            difficulty: 'avanzado',
            estimated_duration: 45,
            calories_burned: 400,
            category: 'cardio',
            },
        ];
        setRoutines(fetchedRoutines);
    }
    const [currentWorkout, setCurrentWorkout] = useState<any>(null);

    useEffect(() => {
        fetchRoutines();
    }, []);

    useEffect(() => {
        if (currentWorkout) {
            setIsWorkoutActive(true);
        }
    }, [currentWorkout]);

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
        <ScrollView className="p-4 space-y-6 bg-gray-100 flex-1">
            {/* Dashboard de progreso */}
            <WorkoutDashboard />

            {/* Contenido principal */}
            <View className="flex flex-col lg:flex-row gap-6">
                {/* Lista de rutinas y detalles */}
                <View className="flex-1">
                    {isWorkoutActive ? (
                        <WorkoutTimer onFinish={handleFinishWorkout} />
                    ) : selectedRoutine ? (
                        <WorkoutDetail
                            routine={selectedRoutine}
                            onBack={handleBack}
                            onStartWorkout={handleStartWorkout}
                        />
                    ) : (
                        <View className="bg-white rounded-lg shadow-md p-6">
                            <Text className="text-xl font-semibold mb-6">Rutinas de Entrenamiento</Text>
                            <WorkoutList
                                routines={routines}
                                onSelectRoutine={handleSelectRoutine}
                            />
                        </View>
                    )}
                </View>

                {/* Objetivos y estadísticas */}
                <View className="flex-1 mt-6 lg:mt-0">
                    <WorkoutGoalsForm />
                </View>
            </View>
        </ScrollView>
    );
};

export default ExerciseTracker;