// Tipos básicos
export type Difficulty = 'principiante' | 'intermedio' | 'avanzado';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  muscles_worked: string[];
  equipment?: string[];
  instructions?: string[];
  video_url?: string;
  image_url?: string;
  calories_per_minute?: number;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  estimated_duration: number;
  calories_burned: number;
  category: string;
}

export interface RoutineExercise {
  id: string;
  routine_id: string;
  exercise_id: string;
  order_index: number;
  sets: number;
  reps?: number;
  duration?: number;
  rest_time: number;
  exercise?: Exercise;
}

export interface UserRoutine {
  id: string;
  user_id: string;
  name: string;
  description: string;
  is_favorite: boolean;
}

export interface WorkoutTracking {
  id: string;
  user_id: string;
  routine_id?: string;
  user_routine_id?: string;
  tracking_date: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  calories_burned?: number;
  completed: boolean;
  notes?: string;
}

export interface ExerciseTracking {
  id: string;
  workout_tracking_id: string;
  exercise_id: string;
  sets_completed: number;
  reps_completed?: number[];
  duration_completed?: number;
  weight_used?: number[];
  notes?: string;
}

export interface WorkoutGoals {
  id: string;
  user_id: string;
  workouts_per_week: number;
  minutes_per_workout: number;
  calories_per_week: number;
  target_date?: string;
}