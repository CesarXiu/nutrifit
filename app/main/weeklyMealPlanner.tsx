import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useMealPlanStore } from '../../stores/mealPlanStore';
import { useAuthStore } from '../../stores/authStore';
import MealSelector from './meal-planner/mealSelector';
import MealCard from './meal-planner/mealCard';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';
import * as XLSX from 'xlsx';

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DayPlan {
  breakfast: Meal | null;
  lunch: Meal | null;
  dinner: Meal | null;
}

interface WeekPlan {
  [key: string]: DayPlan;
}

interface WeeklyMealPlannerProps {
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

const WeeklyMealPlanner: React.FC<WeeklyMealPlannerProps> = ({ goals }) => {
  const { user } = useAuthStore();
  const { meals, saveMeal, getMeals, deleteMeal } = useMealPlanStore();

  // const [user, setUser] = useState<any>(null);
  // const [meals, setMeals] = useState<Meal[]>([]);

  // const saveMeal = async (userId: string, mealData: any) => {
  //   return ['data' as any, 'error' as any];
  // };
  // const getMeals = async (userId: string) => {};
  // const deleteMeal = async (mealId: string) => {};

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const dayColors = [
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-orange-100',
    'bg-teal-100',
  ];
  const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;
  const mealTypeLabels = {
    breakfast: 'Desayuno',
    lunch: 'Almuerzo',
    dinner: 'Cena',
  };

  const initialDayPlan: DayPlan = {
    breakfast: null,
    lunch: null,
    dinner: null,
  };

  const initialWeekPlan: WeekPlan = daysOfWeek.reduce((acc, day) => {
    acc[day] = { ...initialDayPlan };
    return acc;
  }, {} as WeekPlan);

  const [weekPlan, setWeekPlan] = useState<WeekPlan>(initialWeekPlan);
  const [showMealSelector, setShowMealSelector] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>(
    'breakfast'
  );
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    loadMeals();
  }, [user]);

  const loadMeals = async () => {
    try {
      await getMeals(user!.id);
      const newWeekPlan = { ...initialWeekPlan } as any;

      // Ordenar las comidas por día y tipo
      const mealsByDay = meals.reduce(
        (acc, meal: any) => {
          if (!acc[meal.day]) {
            acc[meal.day] = [];
          }
          acc[meal.day].push(meal);
          return acc;
        },
        {} as { [key: string]: typeof meals }
      );

      // Procesar las comidas ordenadas
      Object.entries(mealsByDay).forEach(([day, dayMeals]) => {
        if (!newWeekPlan[day]) {
          newWeekPlan[day] = { ...initialDayPlan };
        }

        dayMeals.forEach((meal: any) => {
          newWeekPlan[day][meal.meal_type] = {
            name: meal.meal_name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
          };
        });
      });

      setWeekPlan(newWeekPlan);
    } catch (error) {
      console.error('Error loading meals:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al cargar el plan de comidas',
      });
    }
  };

  const handleAddMeal = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setShowMealSelector(true);
  };

  const handleMealSelect = async (meal: Meal) => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error } = await saveMeal(user.id, {
        day: selectedDay,
        meal_type: selectedMealType,
        meal_name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
      });

      if (error) throw error;

      if (data) {
        setWeekPlan((prev) => {
          const newPlan = { ...prev };
          newPlan[selectedDay][selectedMealType] = {
            name: data.meal_name,
            calories: data.calories,
            protein: data.protein,
            carbs: data.carbs,
            fat: data.fat,
          };
          return newPlan;
        });
      }

      setShowMealSelector(false);
    } catch (error) {
      console.error('Error al guardar la comida:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al guardar la comida',
      });
    }
  };

  const handleRemoveMeal = async (day: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const mealToDelete = meals.find((m: any) => m.day === day && m.meal_type === mealType) as any;

      if (mealToDelete) {
        await deleteMeal(mealToDelete.id);
        setWeekPlan((prev) => {
          const newPlan = { ...prev };
          newPlan[day][mealType] = null;
          return newPlan;
        });
      }
    } catch (error) {
      console.error('Error al eliminar la comida:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al eliminar la comida',
      });
    }
  };

    const exportToExcel = async () => {
      try {
        setIsExporting(true);

        const workbook = XLSX.utils.book_new();
        const data: any[] = [];

        daysOfWeek.forEach((day) => {
          data.push([day.toUpperCase()]);
          data.push(['Comida', 'Calorías', 'Proteínas', 'Carbohidratos', 'Grasas']);

          ['breakfast', 'lunch', 'dinner'].forEach((mealType) => {
            const meal = weekPlan[day][mealType as keyof DayPlan] as Meal | null;
            if (meal) {
              data.push([
                `${mealTypeLabels[mealType as keyof typeof mealTypeLabels]}: ${meal.name}`,
                meal.calories,
                meal.protein,
                meal.carbs,
                meal.fat,
              ]);
            }
          });

          const totals = calculateDayTotals(weekPlan[day]);
          data.push(['TOTALES', totals.calories, totals.protein, totals.carbs, totals.fat]);
          data.push([]);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Plan Semanal');

        const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
        const uri = FileSystem.cacheDirectory + 'plan-semanal.xlsx';

        await FileSystem.writeAsStringAsync(uri, wbout, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(uri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Compartir Plan Semanal',
          UTI: 'com.microsoft.excel.xlsx',
        });
      } catch (error) {
        console.error('Error exporting to Excel:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Error al exportar el plan',
        });
      } finally {
        setIsExporting(false);
      }
    };

  const calculateDayTotals = (dayPlan: DayPlan) => {
    const meals = [dayPlan.breakfast, dayPlan.lunch, dayPlan.dinner].filter(Boolean) as Meal[];

    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>(() =>
    Object.fromEntries(daysOfWeek.map((day) => [day, false]))
  );

  const toggleDay = (day: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  return (
    <View className="space-y-6 p-4">
      <Text className="text-xl font-semibold">Planificador Semanal de Comidas</Text>
      <View className="mb-2 mt-2">
        <TouchableOpacity
          onPress={() => exportToExcel()}
          disabled={isExporting}
          className="flex-row items-center rounded-lg bg-green-500 px-4 py-2">
          {isExporting ? (
            <ActivityIndicator color="white" className="mr-2" />
          ) : (
            <MaterialIcons name="file-download" size={20} color="white" className="mr-2" />
          )}
          <Text className="text-white">Exportar Plan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="space-y-6">
        {daysOfWeek.map((day, idx) => {
          const dayTotals = calculateDayTotals(weekPlan[day]);
          const progress = (dayTotals.calories / goals.calories) * 100;
          const isExpanded = expandedDays[day];
          const dayBg = dayColors[idx % dayColors.length];

          return (
            <View key={`day-${day}`} className={`mb-2 rounded-lg p-4 shadow-md ${dayBg}`}>
              {/* Encabezado colapsable */}
              <TouchableOpacity
                className="mb-4 flex-row items-center justify-between"
                onPress={() => toggleDay(day)}
                activeOpacity={0.7}>
                <Text className="text-lg font-semibold">{day}</Text>
                <View className="flex-row items-center">
                  <Text className="mr-2 text-sm text-gray-500">
                    {dayTotals.calories} / {goals.calories} kcal
                  </Text>
                  <MaterialIcons
                    name={isExpanded ? 'expand-less' : 'expand-more'}
                    size={24}
                    color="#888"
                  />
                </View>
              </TouchableOpacity>

              {/* Contenido colapsable */}
              {isExpanded && (
                <>
                  <View className="mb-4 h-2 rounded-full bg-gray-200">
                    <View
                      className={`h-full rounded-full ${
                        progress > 100 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </View>

                  <View className="flex-col gap-4 md:flex-row lg:flex-row">
                    <MealCard
                      title="Desayuno"
                      meal={weekPlan[day].breakfast}
                      onAddMeal={() => handleAddMeal(day, 'breakfast')}
                      onRemoveMeal={() => handleRemoveMeal(day, 'breakfast')}
                    />
                    <MealCard
                      title="Almuerzo"
                      meal={weekPlan[day].lunch}
                      onAddMeal={() => handleAddMeal(day, 'lunch')}
                      onRemoveMeal={() => handleRemoveMeal(day, 'lunch')}
                    />
                    <MealCard
                      title="Cena"
                      meal={weekPlan[day].dinner}
                      onAddMeal={() => handleAddMeal(day, 'dinner')}
                      onRemoveMeal={() => handleRemoveMeal(day, 'dinner')}
                    />
                  </View>

                  <View className="mt-4 flex-row flex-wrap gap-2">
                    <View className="min-w-[120px] flex-1 rounded bg-blue-50 p-2">
                      <Text className="text-blue-700">Proteínas</Text>
                      <Text className="font-medium">{dayTotals.protein}g</Text>
                    </View>
                    <View className="min-w-[120px] flex-1 rounded bg-green-50 p-2">
                      <Text className="text-green-700">Carbohidratos</Text>
                      <Text className="font-medium">{dayTotals.carbs}g</Text>
                    </View>
                    <View className="min-w-[120px] flex-1 rounded bg-yellow-50 p-2">
                      <Text className="text-yellow-700">Grasas</Text>
                      <Text className="font-medium">{dayTotals.fat}g</Text>
                    </View>
                    <View className="min-w-[120px] flex-1 rounded bg-purple-50 p-2">
                      <Text className="text-purple-700">Total</Text>
                      <Text className="font-medium">{dayTotals.calories} kcal</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          );
        })}
      </ScrollView>

      {showMealSelector && (
        <MealSelector onSelect={handleMealSelect} onClose={() => setShowMealSelector(false)} />
      )}
    </View>
  );
};

export default WeeklyMealPlanner;
