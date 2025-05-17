import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import Toast from 'react-native-toast-message';
import { WorkoutGoals } from '../types/exercise';

interface WorkoutGoalsState {
  goals: WorkoutGoals | null;
  loading: boolean;
  error: string | null;

  fetchGoals: (userId: string) => Promise<void>;
  updateGoals: (userId: string, goals: Partial<WorkoutGoals>) => Promise<void>;
}

export const useWorkoutGoalsStore = create<WorkoutGoalsState>((set) => ({
  goals: null,
  loading: false,
  error: null,

  fetchGoals: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('workout_goals')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      set({ goals: data });
    } catch (error: any) {
      console.error('Error fetching workout goals:', error);
      set({ error: error.message });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al cargar los objetivos de entrenamiento',
      });
    } finally {
      set({ loading: false });
    }
  },

  updateGoals: async (userId: string, goals: Partial<WorkoutGoals>) => {
    try {
      set({ loading: true, error: null });

      const { data: existingGoals } = await supabase
        .from('workout_goals')
        .select('id')
        .eq('user_id', userId)
        .single();

      let result;

      if (existingGoals) {
        result = await supabase
          .from('workout_goals')
          .update(goals)
          .eq('id', existingGoals.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('workout_goals')
          .insert([{ user_id: userId, ...goals }])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      set({ goals: result.data });
      Toast.show({
        type: 'success',
        text1: 'Objetivos actualizados correctamente',
      });
    } catch (error: any) {
      console.error('Error updating workout goals:', error);
      set({ error: error.message });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al actualizar los objetivos',
      });
    } finally {
      set({ loading: false });
    }
  },
}));