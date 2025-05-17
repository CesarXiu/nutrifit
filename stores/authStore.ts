import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import Toast from 'react-native-toast-message';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  signUp: async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile in users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              name,
            },
          ]);

        if (profileError) throw profileError;

        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            name,
          },
        });

        Toast.show({
          type: 'success',
          text1: 'Cuenta creada exitosamente',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (userError) throw userError;

        set({
          user: {
            id: userData.id,
            email: userData.email,
            name: userData.name,
          },
        });

        Toast.show({
          type: 'success',
          text1: 'Inicio de sesión exitoso',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ user: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Si usas AsyncStorage, elimina esta línea:
      // localStorage.removeItem('sb-ohiwnouwumulnjhwjpuj-auth-token');

      Toast.show({
        type: 'success',
        text1: 'Sesión cerrada',
      });
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      set({ user: null });
      Toast.show({
        type: 'error',
        text1: 'Error al cerrar sesión',
        text2: 'Los datos locales han sido limpiados',
      });
    }
  },

  checkAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) throw userError;

        set({
          user: {
            id: userData.id,
            email: userData.email,
            name: userData.name,
          },
        });
      } else {
        set({ user: null });
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },
}));