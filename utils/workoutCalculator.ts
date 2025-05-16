// Función para calcular los objetivos de entrenamiento basados en el perfil del usuario
export const calculateWorkoutGoals = (
  activityLevel: string,
  goal: 'maintain' | 'weight-loss' | 'muscle'
) => {
  // Entrenamientos por semana basados en nivel de actividad y objetivo
  let workoutsPerWeek = 3; // Base recomendada por OMS
  if (activityLevel === 'active' || activityLevel === 'veryActive') {
    workoutsPerWeek = 5;
  } else if (activityLevel === 'moderate') {
    workoutsPerWeek = 4;
  }

  // Ajustar según el objetivo
  if (goal === 'muscle') {
    workoutsPerWeek = Math.min(workoutsPerWeek + 1, 6);
  }

  // Minutos por entrenamiento
  let minutesPerWorkout = 45; // Base recomendada
  if (activityLevel === 'sedentary') {
    minutesPerWorkout = 30;
  } else if (activityLevel === 'veryActive') {
    minutesPerWorkout = 60;
  }

  // Calorías por semana (estimación base)
  const baseCaloriesPerWorkout = 400;
  let caloriesMultiplier = 1;
  
  if (goal === 'weight-loss') {
    caloriesMultiplier = 1.2;
  } else if (goal === 'muscle') {
    caloriesMultiplier = 0.8;
  }

  const caloriesPerWeek = Math.round(
    baseCaloriesPerWorkout * workoutsPerWeek * caloriesMultiplier
  );

  return {
    workouts_per_week: workoutsPerWeek,
    minutes_per_workout: minutesPerWorkout,
    calories_per_week: caloriesPerWeek
  };
};