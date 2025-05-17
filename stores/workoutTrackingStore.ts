import { create } from 'zustand';
import { supabase, handleSupabaseError } from '../lib/supabase';
import Toast from 'react-native-toast-message';
import { WorkoutTracking, ExerciseTracking } from '../types/exercise';
import { formatLocalDate } from '../utils/dateUtils';

interface WorkoutTrackingState {
  currentWorkout: WorkoutTracking | null;
  todayWorkouts: WorkoutTracking[];
  weeklyWorkouts: WorkoutTracking[];
  exerciseTrackings: Record<string, ExerciseTracking[]>;
  loading: boolean;
  error: string | null;

  startWorkout: (userId: string, routineId?: string, userRoutineId?: string) => Promise<void>;
  endWorkout: (workoutId: string, duration: number, caloriesBurned: number) => Promise<void>;
  getTodayWorkouts: (userId: string) => Promise<void>;
  getWeeklyWorkouts: (userId: string) => Promise<void>;
  trackExercise: (workoutId: string, exerciseData: Omit<ExerciseTracking, 'id'>) => Promise<void>;
  getWorkoutExercises: (workoutId: string) => Promise<void>;
  clearCurrentWorkout: () => void; // <-- Agrega esto
}

export const useWorkoutTrackingStore = create<WorkoutTrackingState>((set, get) => ({
  currentWorkout: null,
  todayWorkouts: [],
  weeklyWorkouts: [],
  exerciseTrackings: {},
  loading: false,
  error: null,

  startWorkout: async (userId: string, routineId?: string, userRoutineId?: string) => {
    try {
      set({ loading: true, error: null });

      // Verificar si hay un entrenamiento activo
      const activeWorkout = get().currentWorkout;
      if (activeWorkout) {
        Toast.show({
          type: 'error',
          text1: 'Ya hay un entrenamiento en curso',
        });
        throw new Error('Ya hay un entrenamiento en curso');
      }

      const { data, error } = await supabase
        .from('workout_tracking')
        .insert([
          {
            user_id: userId,
            routine_id: routineId,
            user_routine_id: userRoutineId,
            tracking_date: formatLocalDate(new Date()),
            start_time: new Date().toISOString(),
            completed: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      set({ currentWorkout: data });
      Toast.show({
        type: 'success',
        text1: 'Entrenamiento iniciado',
      });
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  endWorkout: async (workoutId: string, duration: number, caloriesBurned: number) => {
    try {
      set({ loading: true, error: null });

      // Asegurarse de que los valores sean enteros
      const roundedDuration = Math.round(duration);
      const roundedCalories = Math.round(caloriesBurned);

      const { data, error } = await supabase
        .from('workout_tracking')
        .update({
          end_time: new Date().toISOString(),
          duration: roundedDuration,
          calories_burned: roundedCalories,
          completed: true,
        })
        .eq('id', workoutId)
        .select()
        .single();

      if (error) throw error;

      // Actualizar los estados locales
      set((state) => ({
        currentWorkout: null,
        todayWorkouts: state.todayWorkouts.map((w) => (w.id === workoutId ? data : w)),
        weeklyWorkouts: state.weeklyWorkouts.map((w) => (w.id === workoutId ? data : w)),
      }));

      Toast.show({
        type: 'success',
        text1: 'Entrenamiento completado',
      });
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getTodayWorkouts: async (userId: string) => {
    try {
      set({ loading: true, error: null });

      const today = formatLocalDate(new Date());

      const { data, error } = await supabase
        .from('workout_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('tracking_date', today)
        .order('start_time', { ascending: false });

      if (error) throw error;

      set({ todayWorkouts: data || [] });
    } catch (error) {
      handleSupabaseError(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al cargar los entrenamientos de hoy',
      });
    } finally {
      set({ loading: false });
    }
  },

  getWeeklyWorkouts: async (userId: string) => {
    try {
      set({ loading: true, error: null });

      // Obtener fecha de inicio y fin de la semana actual
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lunes
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() - today.getDay() + 7); // Domingo

      const { data, error } = await supabase
        .from('workout_tracking')
        .select('*')
        .eq('user_id', userId)
        .gte('tracking_date', formatLocalDate(startOfWeek))
        .lte('tracking_date', formatLocalDate(endOfWeek))
        .order('tracking_date', { ascending: true });

      if (error) throw error;

      set({ weeklyWorkouts: data || [] });
    } catch (error) {
      handleSupabaseError(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al cargar los entrenamientos de la semana',
      });
    } finally {
      set({ loading: false });
    }
  },

  trackExercise: async (workoutId: string, exerciseData: Omit<ExerciseTracking, 'id'>) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('exercise_tracking')
        .insert([
          {
            workout_tracking_id: workoutId,
            ...exerciseData,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        exerciseTrackings: {
          ...state.exerciseTrackings,
          [workoutId]: [...(state.exerciseTrackings[workoutId] || []), data],
        },
      }));

      Toast.show({
        type: 'success',
        text1: 'Ejercicio registrado',
      });
    } catch (error) {
      handleSupabaseError(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al registrar el ejercicio',
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getWorkoutExercises: async (workoutId: string) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('exercise_tracking')
        .select('*')
        .eq('workout_tracking_id', workoutId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      set((state) => ({
        exerciseTrackings: {
          ...state.exerciseTrackings,
          [workoutId]: data || [],
        },
      }));
    } catch (error) {
      handleSupabaseError(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al cargar los ejercicios del entrenamiento',
      });
    } finally {
      set({ loading: false });
    }
  },
  clearCurrentWorkout: () => set({ currentWorkout: null }),
}));
