import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import Toast from 'react-native-toast-message';
import { v4 as uuidv4 } from 'uuid';

interface Meal {
  id: string;
  user_id: string;
  day: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  meal_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at?: string;
}

interface MealPlanState {
  meals: Meal[];
  loading: boolean;
  saveMeal: (userId: string, mealData: Omit<Meal, 'id' | 'user_id'>) => Promise<{ data?: Meal; error?: any }>;
  getMeals: (userId: string | null) => Promise<void>;
  updateMeal: (mealId: string, mealData: Partial<Meal>) => Promise<void>;
  deleteMeal: (mealId: string) => Promise<void>;
}

export const useMealPlanStore = create<MealPlanState>((set, get) => ({
  meals: [],
  loading: false,

  saveMeal: async (userId, mealData) => {
    try {
      set({ loading: true });
      
      // Verificar si ya existe una comida del mismo tipo para el mismo día
      const existingMeal = get().meals.find(
        meal => meal.day === mealData.day && meal.meal_type === mealData.meal_type
      );
      
      if (existingMeal) {
        await supabase
          .from('meal_plans')
          .delete()
          .eq('id', existingMeal.id);
      }

      const newMeal = {
        id: uuidv4(),
        user_id: userId,
        ...mealData,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('meal_plans')
        .insert([newMeal])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        set(state => ({
          meals: [
            ...state.meals.filter(
              meal => !(meal.day === mealData.day && meal.meal_type === mealData.meal_type)
            ),
            data[0]
          ]
        }));
        
        Toast.show({
          type: 'success',
          text1: 'Comida agregada al plan',
        });
        return { data: data[0] };
      }
      
      return { data: undefined };
    } catch (error: any) {
      console.error('Error saving meal:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al guardar la comida',
      });
      return { error };
    } finally {
      set({ loading: false });
    }
  },

  getMeals: async (userId) => {
    try {
      set({ loading: true });
      
      if (!userId) {
        set({ meals: [] });
        return;
      }

      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Asegurarse de que no haya duplicados
      const uniqueMeals = data?.reduce((acc, meal) => {
        const existingMeal = acc.find((m: any) => 
          m.day === meal.day && 
          m.meal_type === meal.meal_type
        );
        
        if (!existingMeal) {
          acc.push(meal);
        }
        return acc;
      }, [] as Meal[]) || [];

      set({ meals: uniqueMeals });
    } catch (error: any) {
      console.error('Error fetching meals:', error);
      set({ meals: [] });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al cargar las comidas',
      });
    } finally {
      set({ loading: false });
    }
  },

  updateMeal: async (mealId, mealData) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('meal_plans')
        .update(mealData)
        .eq('id', mealId)
        .select();

      if (error) throw error;

      const updatedMeals = get().meals.map(meal => 
        meal.id === mealId ? { ...meal, ...data[0] } : meal
      );
      set({ meals: updatedMeals });
      Toast.show({
        type: 'success',
        text1: 'Comida actualizada',
      });
    } catch (error: any) {
      console.error('Error updating meal:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al actualizar la comida',
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteMeal: async (mealId) => {
    try {
      set({ loading: true });
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', mealId);

      if (error) throw error;

      const updatedMeals = get().meals.filter(meal => meal.id !== mealId);
      set({ meals: updatedMeals });
      Toast.show({
        type: 'success',
        text1: 'Comida eliminada del plan',
      });
    } catch (error: any) {
      console.error('Error deleting meal:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al eliminar la comida',
      });
    } finally {
      set({ loading: false });
    }
  },
}));