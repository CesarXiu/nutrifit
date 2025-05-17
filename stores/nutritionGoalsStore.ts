import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import Toast from 'react-native-toast-message';

interface NutritionGoals {
  id: string;
  user_id: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number;
}

interface NutritionGoalsState {
  goals: NutritionGoals | null;
  loading: boolean;
  saveGoals: (userId: string, goalsData: Omit<NutritionGoals, 'id' | 'user_id'>) => Promise<void>;
  getGoals: (userId: string) => Promise<void>;
  updateGoals: (goalsId: string, goalsData: Partial<NutritionGoals>) => Promise<void>;
}

export const useNutritionGoalsStore = create<NutritionGoalsState>((set) => ({
  goals: null,
  loading: false,

  saveGoals: async (userId, goalsData) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('nutrition_goals')
        .insert([
          {
            user_id: userId,
            ...goalsData,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      set({ goals: data });
      Toast.show({
        type: 'success',
        text1: 'Objetivos nutricionales guardados',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Error al guardar los objetivos',
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getGoals: async (userId) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      set({ goals: data });
    } catch (error: any) {
      console.error('Error fetching nutrition goals:', error);
      set({ goals: null });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Error al cargar los objetivos',
      });
    } finally {
      set({ loading: false });
    }
  },

  updateGoals: async (goalsId, goalsData) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('nutrition_goals')
        .update(goalsData)
        .eq('id', goalsId)
        .select()
        .single();

      if (error) throw error;

      set({ goals: data });
      Toast.show({
        type: 'success',
        text1: 'Objetivos nutricionales actualizados',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Error al actualizar los objetivos',
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));