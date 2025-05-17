import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import Toast from 'react-native-toast-message';
import { formatLocalDate, getCurrentWeekDates } from '../utils/dateUtils';

interface MealTracking {
  id: string;
  user_id: string;
  meal_plan_id: string;
  tracking_date: string;
  completed: boolean;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface DailyTrackingState {
  trackedMeals: MealTracking[];
  weeklyTracking: MealTracking[];
  loading: boolean;
  getTodayTracking: (userId: string | null) => Promise<void>;
  getWeeklyTracking: (userId: string | null) => Promise<void>;
  toggleMealCompletion: (userId: string, mealPlanId: string, mealData: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }, completed: boolean) => Promise<void>;
}

export const useDailyTrackingStore = create<DailyTrackingState>((set, get) => ({
  trackedMeals: [],
  weeklyTracking: [],
  loading: false,

  getTodayTracking: async (userId: string | null) => {
    try {
      set({ loading: true });
      
      if (!userId) {
        set({ trackedMeals: [] });
        return;
      }

      const today = formatLocalDate(new Date());

      const { data, error } = await supabase
        .from('daily_meal_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('tracking_date', today);

      if (error) throw error;

      set({ trackedMeals: data || [] });
    } catch (error: any) {
      console.error('Error fetching daily tracking:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al cargar el seguimiento diario',
      });
      set({ trackedMeals: [] });
    } finally {
      set({ loading: false });
    }
  },

  getWeeklyTracking: async (userId: string | null) => {
    try {
      set({ loading: true });
      
      if (!userId) {
        set({ weeklyTracking: [] });
        return;
      }

      const weekDates = getCurrentWeekDates();

      const { data, error } = await supabase
        .from('daily_meal_tracking')
        .select('*')
        .eq('user_id', userId)
        .in('tracking_date', weekDates);

      if (error) throw error;

      set({ weeklyTracking: data || [] });
    } catch (error: any) {
      console.error('Error fetching weekly tracking:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al cargar el seguimiento semanal',
      });
      set({ weeklyTracking: [] });
    } finally {
      set({ loading: false });
    }
  },

  toggleMealCompletion: async (userId: string, mealPlanId: string, mealData: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }, completed: boolean) => {
    try {
      set({ loading: true });
      const today = formatLocalDate(new Date());

      // Buscar registro existente
      const { data: existingData, error: fetchError } = await supabase
        .from('daily_meal_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('meal_plan_id', mealPlanId)
        .eq('tracking_date', today)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let result;

      if (existingData) {
        // Actualizar registro existente
        result = await supabase
          .from('daily_meal_tracking')
          .update({ completed })
          .eq('id', existingData.id)
          .select()
          .single();
      } else {
        // Crear nuevo registro
        result = await supabase
          .from('daily_meal_tracking')
          .insert([{
            user_id: userId,
            meal_plan_id: mealPlanId,
            tracking_date: today,
            completed,
            ...mealData
          }])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Actualizar estado local
      await get().getTodayTracking(userId);
      await get().getWeeklyTracking(userId);
      
      Toast.show({
        type: 'success',
        text1: completed ? 'Comida completada' : 'Comida desmarcada',
      });
    } catch (error: any) {
      console.error('Error updating meal completion:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al actualizar el estado de la comida',
      });
    } finally {
      set({ loading: false });
    }
  }
}));