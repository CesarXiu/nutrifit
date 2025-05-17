import 'react-native-url-polyfill/auto';
import { AppState } from 'react-native'
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { supabaseUrl, supabaseKey } = Constants.expoConfig?.extra || {};
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).catch((error) => {
        console.error('Supabase fetch error:', error);
        // Solo mostrar el Toast si es un error de red real
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          Toast.show({
            type: 'error',
            text1: 'Error de conexión',
            text2: 'Por favor, verifica tu conexión a internet.',
          });
        }
        throw error;
      });
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Función para verificar la conexión a Supabase
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('nutrition_goals').select('count').limit(1).single();

    if (error) {
      console.error('Error checking Supabase connection:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    return false;
  }
};

// Función de utilidad para manejar errores de Supabase
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);

  if (error.code === '22P02') {
    Toast.show({
      type: 'error',
      text1: 'Error de formato',
      text2: 'Error de formato en los datos. Por favor, verifica los valores ingresados.',
    });
    return;
  }

  if (error.code === '23505') {
    Toast.show({
      type: 'error',
      text1: 'Registro duplicado',
      text2: 'Ya existe un registro con estos datos.',
    });
    return;
  }

  if (error.message && error.message.includes('Failed to fetch')) {
    Toast.show({
      type: 'error',
      text1: 'Error de conexión',
      text2: 'Por favor, verifica tu conexión a internet.',
    });
    return;
  }

  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: 'Ha ocurrido un error. Por favor, intenta nuevamente.',
  });
};

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export type Tables = {
  users: {
    id: string;
    email: string;
    name: string;
    created_at: string;
  };
  user_profiles: {
    id: string;
    user_id: string;
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female';
    activity_level: string;
    goal: 'maintain' | 'weight-loss' | 'muscle';
    created_at: string;
    updated_at: string;
  };
  meal_plans: {
    id: string;
    user_id: string;
    day: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner';
    meal_name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    created_at: string;
    updated_at: string;
  };
  nutrition_goals: {
    id: string;
    user_id: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    water: number;
    created_at: string;
    updated_at: string;
  };
  daily_meal_tracking: {
    id: string;
    user_id: string;
    meal_plan_id: string;
    tracking_date: string;
    completed: boolean;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    created_at: string;
    updated_at: string;
  };
  water_tracking: {
    id: string;
    user_id: string;
    tracking_date: string;
    amount: number;
    created_at: string;
    updated_at: string;
  };
};
