import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import Toast from 'react-native-toast-message';

interface UserProfile {
  id: string;
  user_id: string;
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activity_level: string;
  goal: 'maintain' | 'weight-loss' | 'muscle';
}

interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  saveProfile: (userId: string, profileData: Omit<UserProfile, 'id' | 'user_id'>) => Promise<void>;
  getProfile: (userId: string) => Promise<void>;
  updateProfile: (profileId: string, profileData: Partial<UserProfile>) => Promise<void>;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  profile: null,
  loading: false,

  saveProfile: async (userId, profileData) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: userId,
            ...profileData,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      set({ profile: data });
      Toast.show({
        type: 'success',
        text1: 'Perfil guardado exitosamente',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Error al guardar el perfil',
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getProfile: async (userId) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      set({ profile: data });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      set({ profile: null });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Error al cargar el perfil',
      });
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (profileId, profileData) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', profileId)
        .select()
        .single();

      if (error) throw error;

      set({ profile: data });
      Toast.show({
        type: 'success',
        text1: 'Perfil actualizado exitosamente',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Error al actualizar el perfil',
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));