import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import Toast from 'react-native-toast-message';
import { Exercise, WorkoutRoutine, RoutineExercise } from '../types/exercise';

interface ExerciseState {
  exercises: Exercise[];
  routines: WorkoutRoutine[];
  routineExercises: Record<string, RoutineExercise[]>;
  loading: boolean;
  error: string | null;
  
  // Acciones para ejercicios
  fetchExercises: () => Promise<void>;
  getExercisesByCategory: (category: string) => Exercise[];
  getExercisesByMuscle: (muscle: string) => Exercise[];
  
  // Acciones para rutinas
  fetchRoutines: () => Promise<void>;
  getRoutineById: (id: string) => Promise<WorkoutRoutine | null>;
  getRoutineExercises: (routineId: string) => Promise<void>;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: [],
  routines: [],
  routineExercises: {},
  loading: false,
  error: null,

  fetchExercises: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');

      if (error) throw error;

      set({ exercises: data || [] });
    } catch (error: any) {
      console.error('Error fetching exercises:', error);
      set({ error: error.message });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al cargar los ejercicios',
      });
    } finally {
      set({ loading: false });
    }
  },

  getExercisesByCategory: (category: string) => {
    return get().exercises.filter(exercise => exercise.category === category);
  },

  getExercisesByMuscle: (muscle: string) => {
    return get().exercises.filter(exercise => 
      exercise.muscles_worked.includes(muscle)
    );
  },

  fetchRoutines: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('workout_routines')
        .select('*')
        .order('name');

      if (error) throw error;

      set({ routines: data || [] });
    } catch (error: any) {
      console.error('Error fetching routines:', error);
      set({ error: error.message });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al cargar las rutinas',
      });
    } finally {
      set({ loading: false });
    }
  },

  getRoutineById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('workout_routines')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error fetching routine:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al cargar la rutina',
      });
      return null;
    }
  },

  getRoutineExercises: async (routineId: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('routine_exercises')
        .select(`
          *,
          exercise:exercises(*)
        `)
        .eq('routine_id', routineId)
        .order('order_index');

      if (error) throw error;

      set(state => ({
        routineExercises: {
          ...state.routineExercises,
          [routineId]: data || []
        }
      }));
    } catch (error: any) {
      console.error('Error fetching routine exercises:', error);
      set({ error: error.message });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al cargar los ejercicios de la rutina',
      });
    } finally {
      set({ loading: false });
    }
  },
}));