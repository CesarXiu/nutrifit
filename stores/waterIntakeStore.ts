import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import Toast from 'react-native-toast-message';
import { formatLocalDate, getCurrentWeekDates } from '../utils/dateUtils';

interface WaterIntake {
  id: string;
  user_id: string;
  amount: number;
  tracking_date: string;
}

interface WaterIntakeState {
  todayIntake: WaterIntake | null;
  weeklyWaterIntake: WaterIntake[];
  loading: boolean;
  updateWaterIntake: (userId: string, amount: number) => Promise<void>;
  getTodayIntake: (userId: string | null) => Promise<void>;
  getWeeklyWaterIntake: (userId: string) => Promise<void>;
}

export const useWaterIntakeStore = create<WaterIntakeState>((set) => ({
  todayIntake: null,
  weeklyWaterIntake: [],
  loading: false,

  updateWaterIntake: async (userId: string, amount: number) => {
    try {
      set({ loading: true });
      const today = formatLocalDate(new Date());

      // Buscar registro existente
      const { data: existingData, error: fetchError } = await supabase
        .from('water_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('tracking_date', today)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let result;

      if (existingData) {
        // Actualizar registro existente
        result = await supabase
          .from('water_tracking')
          .update({ amount })
          .eq('id', existingData.id)
          .select()
          .single();
      } else {
        // Crear nuevo registro
        result = await supabase
          .from('water_tracking')
          .insert([{
            user_id: userId,
            tracking_date: today,
            amount
          }])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      set({ todayIntake: result.data });
      Toast.show({
        type: 'success',
        text1: 'Registro de agua actualizado',
      });
    } catch (error: any) {
      console.error('Error updating water intake:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al actualizar el registro de agua',
      });
    } finally {
      set({ loading: false });
    }
  },

  getTodayIntake: async (userId: string | null) => {
    try {
      set({ loading: true });

      if (!userId) {
        set({ todayIntake: null });
        return;
      }

      const today = formatLocalDate(new Date());

      const { data, error } = await supabase
        .from('water_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('tracking_date', today)
        .maybeSingle();

      if (error) throw error;

      set({ todayIntake: data });
    } catch (error: any) {
      console.error('Error fetching water intake:', error);
      set({ todayIntake: null });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al cargar el registro de agua',
      });
    } finally {
      set({ loading: false });
    }
  },

  getWeeklyWaterIntake: async (userId: string) => {
    try {
      set({ loading: true });
      const weekDates = getCurrentWeekDates();

      const { data, error } = await supabase
        .from('water_tracking')
        .select('*')
        .eq('user_id', userId)
        .in('tracking_date', weekDates);

      if (error) throw error;

      set({ weeklyWaterIntake: data || [] });
    } catch (error: any) {
      console.error('Error fetching weekly water intake:', error);
      set({ weeklyWaterIntake: [] });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al cargar el registro semanal de agua',
      });
    } finally {
      set({ loading: false });
    }
  },
}));