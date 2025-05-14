// Utility functions for calculating nutritional needs
export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female'
): number => {
  // Mifflin-St Jeor Equation
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
};

export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const activityMultipliers: any = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise/sports 1-3 days/week
    moderate: 1.55, // Moderate exercise/sports 3-5 days/week
    active: 1.725, // Hard exercise/sports 6-7 days/week
    veryActive: 1.9, // Very hard exercise & physical job or training twice per day
  };
  return Math.round(bmr * activityMultipliers[activityLevel]);
};

export const calculateWaterNeeds = (weight: number, activityLevel: string): number => {
  // Base recommendation: 30-35ml per kg of body weight
  const baseWater = weight * 33;
  
  // Adjust for activity level
  const activityMultipliers: any  = {
    sedentary: 1,
    light: 1.1,
    moderate: 1.2,
    active: 1.3,
    veryActive: 1.4,
  };
  
  return Math.round(baseWater * activityMultipliers[activityLevel]);
};

export const calculateMacros = (calories: number): {
  protein: number;
  carbs: number;
  fats: number;
} => {
  // OMS recommendations:
  // Carbs: 50-55% (using 52.5% as middle point)
  // Fats: 30-35% (using 32.5% as middle point)
  // Protein: 12-15% (using 15% as it's beneficial for most people)
  
  const carbsRatio = 0.525; // 52.5%
  const fatRatio = 0.325;   // 32.5%
  const proteinRatio = 0.15; // 15%

  return {
    carbs: Math.round((calories * carbsRatio) / 4),    // 4 calories per gram of carbs
    fats: Math.round((calories * fatRatio) / 9),       // 9 calories per gram of fat
    protein: Math.round((calories * proteinRatio) / 4), // 4 calories per gram of protein
  };
};