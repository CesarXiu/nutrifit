import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { useMealPlanStore } from '../../stores/mealPlanStore';
import { useDailyTrackingStore } from '../../stores/dailyTrackingStore';
import { useAuthStore } from '../../stores/authStore';
import { useNutritionGoalsStore } from '../../stores/nutritionGoalsStore';
import { formatLocalDate } from '../../utils/dateUtils';
import Animated, { 
  FadeIn,
  FadeInDown,
  FadeInUp
} from 'react-native-reanimated';

const DailyMealTracking: React.FC = () => {
  const { user } = useAuthStore();
  const { meals } = useMealPlanStore();
  const { trackedMeals, getTodayTracking, toggleMealCompletion } = useDailyTrackingStore();
  const { goals } = useNutritionGoalsStore();
    // const meals = [
    //     { id: '1', meal_name: 'Desayuno', meal_type: 'breakfast', calories: 300, protein: 20, carbs: 40, fat: 10, day: 'lunes' },
    //     { id: '2', meal_name: 'Almuerzo', meal_type: 'lunch', calories: 500, protein: 30, carbs: 60, fat: 15, day: 'lunes' },
    //     { id: '3', meal_name: 'Cena', meal_type: 'dinner', calories: 400, protein: 25, carbs: 50, fat: 20, day: 'lunes' }
    // ];
    // const trackedMeals = [
    //     { meal_plan_id: '1', tracking_date: '2023-10-01', completed: true, calories: 300, protein: 20, carbs: 40, fats: 10 },
    //     { meal_plan_id: '2', tracking_date: '2023-10-01', completed: false, calories: 500, protein: 30, carbs: 60, fats: 15 },
    //     { meal_plan_id: '3', tracking_date: '2023-10-01', completed: true, calories: 400, protein: 25, carbs: 50, fats: 20 }
    // ];
    // const user = { id: 'user123' };
    // const goals = { calories: 2000, protein: 150, carbs: 250, fats: 70 };

    // const getTodayTracking = async (userId: string) => {
    // }
    // const toggleMealCompletion = async (
    //   userId: string,
    //   mealId: string,
    //   mealData: { calories: number; protein: number; carbs: number; fats: number },
    //   completed: boolean
    // ) => {
    // }

  useEffect(() => {
    if (user) {
      getTodayTracking(user.id);
    }
  }, [user]);

  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
  const capitalizedToday = today.charAt(0).toUpperCase() + today.slice(1);
  const todayMeals = meals.filter(meal => meal.day === capitalizedToday);

  const isMealCompleted = (mealId: string) => {
    return trackedMeals.some(tracked => tracked.meal_plan_id === mealId && tracked.completed);
  };

  const handleToggleMeal = async (meal: any) => {
    if (!user) return;

    const completed = !isMealCompleted(meal.id);
    await toggleMealCompletion(
      user.id,
      meal.id,
      {
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fat
      },
      completed
    );
  };

  const todayDate = formatLocalDate(new Date());
  const todayCompletedMeals = trackedMeals.filter(meal => 
    meal.tracking_date === todayDate && meal.completed
  );

  const dailyTotals = todayCompletedMeals.reduce((totals, meal) => ({
    calories: totals.calories + meal.calories,
    protein: totals.protein + meal.protein,
    carbs: totals.carbs + meal.carbs,
    fats: totals.fats + meal.fats
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const caloriePercentage = goals ? (dailyTotals.calories / goals.calories) * 100 : 0;

  const getMealTypeLabel = (type: string) => {
    switch(type) {
      case 'breakfast': return 'Desayuno';
      case 'lunch': return 'Almuerzo';
      case 'dinner': return 'Cena';
      default: return 'Snack';
    }
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(500)}
      className="bg-white p-4 rounded-lg shadow"
    >
      <Text className="text-lg font-semibold mb-4">Seguimiento de Comidas de Hoy</Text>
      
      {todayMeals.length === 0 ? (
        <Text className="text-gray-500 text-center py-4">
          No hay comidas planificadas para hoy
        </Text>
      ) : (
        <View className="space-y-3">
          {todayMeals.map((meal, index) => (
            <Animated.View
              key={meal.id}
              entering={FadeInDown.delay(index * 100).duration(300)}
              className={`flex-row items-center justify-between p-3 rounded-lg border ${
                isMealCompleted(meal.id)
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="font-medium">{meal.meal_name}</Text>
                  <Text className="ml-2 text-sm text-gray-500">
                    {getMealTypeLabel(meal.meal_type)}
                  </Text>
                </View>
                <Text className="text-sm text-gray-600">
                  {meal.calories} kcal | P: {meal.protein}g | C: {meal.carbs}g | G: {meal.fat}g
                </Text>
              </View>
              
              <TouchableOpacity
                onPress={() => handleToggleMeal(meal)}
                className={`ml-4 p-2 rounded-full ${
                  isMealCompleted(meal.id)
                    ? 'bg-green-500'
                    : 'bg-gray-100'
                }`}
              >
                {isMealCompleted(meal.id) ? (
                  <AntDesign name="check" size={20} color="white" />
                ) : (
                  <AntDesign name="close" size={20} color="#6b7280" />
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}

      <Animated.View 
        entering={FadeInUp.delay(300).duration(500)}
        className="mt-4 pt-4 border-t border-gray-200"
      >
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-medium">Progreso del Día</Text>
          <View className="flex-row items-center text-gray-600">
            <FontAwesome name="bullseye" size={16} color="#6b7280" className="mr-1" />
            <Text>Meta: {goals?.calories || 0} kcal</Text>
          </View>
        </View>

        <View className="h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
          <View
            className={`h-full rounded-full ${
              caloriePercentage > 100 ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
          />
        </View>

        <View className="flex-row flex-wrap justify-between">
          {[
            { label: 'Calorías', value: dailyTotals.calories, color: 'blue' },
            { label: 'Proteínas', value: `${dailyTotals.protein}g`, color: 'green' },
            { label: 'Carbos', value: `${dailyTotals.carbs}g`, color: 'yellow' },
            { label: 'Grasas', value: `${dailyTotals.fats}g`, color: 'red' }
          ].map((item, index) => (
            <Animated.View
              key={item.label}
              entering={FadeInUp.delay(400 + index * 100).duration(300)}
              className={`bg-${item.color}-50 p-2 rounded w-[48%] mb-2`}
            >
              <Text className={`text-sm text-${item.color}-600`}>{item.label}</Text>
              <Text className={`font-bold text-${item.color}-700`}>{item.value}</Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default DailyMealTracking;