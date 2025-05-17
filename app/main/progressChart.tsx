import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useDailyTrackingStore } from '../../stores/dailyTrackingStore';
import { useNutritionGoalsStore } from '../../stores/nutritionGoalsStore';
import { useWaterIntakeStore } from '../../stores/waterIntakeStore';
import { useAuthStore } from '../../stores/authStore';
import { getCurrentWeekDates, getWeekdayName } from '../../utils/dateUtils';

const screenWidth = Dimensions.get('window').width;
const chartWidth = 800; // Ancho fijo para permitir scroll horizontal

const legends = {
  calories: [
    { color: 'rgb(75, 192, 192)', label: 'Calorías Consumidas' },
    { color: 'rgba(75, 192, 192, 0.3)', label: 'Meta de Calorías', dashed: true }
  ],
  macros: [
    { color: 'rgb(54, 162, 235)', label: 'Proteínas' },
    { color: 'rgb(255, 159, 64)', label: 'Carbohidratos' },
    { color: 'rgb(255, 99, 132)', label: 'Grasas' },
    { color: 'rgba(54, 162, 235, 0.3)', label: 'Meta Proteínas', dashed: true },
    { color: 'rgba(255, 159, 64, 0.3)', label: 'Meta Carbohidratos', dashed: true },
    { color: 'rgba(255, 99, 132, 0.3)', label: 'Meta Grasas', dashed: true }
  ],
  water: [
    { color: 'rgb(59, 130, 246)', label: 'Agua Consumida (ml)' },
    { color: 'rgba(59, 130, 246, 0.3)', label: 'Meta de Agua', dashed: true }
  ]
};

const Legend = ({ items }: { items: { color: string; label: string; dashed?: boolean }[] }) => (
  <View style={styles.legendContainer}>
    {items.map((item, idx) => (
      <View key={item.label} style={styles.legendItem}>
        <View
          style={[
            styles.legendColor,
            { backgroundColor: item.color, borderColor: item.color },
            item.dashed && styles.legendDashed
          ]}
        />
        <Text style={styles.legendLabel}>{item.label}</Text>
      </View>
    ))}
  </View>
);

const ProgressChart: React.FC = () => {
  const { weeklyTracking, getWeeklyTracking } = useDailyTrackingStore();
  const { goals } = useNutritionGoalsStore();
  const { getWeeklyWaterIntake, weeklyWaterIntake } = useWaterIntakeStore();
  const { user } = useAuthStore();

  const caloriesScrollRef = useRef<ScrollView>(null);
  const macrosScrollRef = useRef<ScrollView>(null);
  const waterScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (user) {
      getWeeklyTracking(user.id);
      getWeeklyWaterIntake(user.id);
    }
  }, [user]);

  const weekDates = getCurrentWeekDates();

  const dailyData = weekDates.reduce((acc, date) => {
    const dayMeals = weeklyTracking.filter(
      meal => meal.tracking_date === date && meal.completed
    );
    acc[date] = dayMeals.reduce((totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fats: totals.fats + meal.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
    return acc;
  }, {} as Record<string, { calories: number; protein: number; carbs: number; fats: number; }>);

  const labels = weekDates.map(getWeekdayName);
  const caloriesValues = weekDates.map(date => dailyData[date]?.calories || 0);
  const proteinValues = weekDates.map(date => dailyData[date]?.protein || 0);
  const carbsValues = weekDates.map(date => dailyData[date]?.carbs || 0);
  const fatsValues = weekDates.map(date => dailyData[date]?.fats || 0);
  const waterValues = weekDates.map(date => {
    const dayIntake = weeklyWaterIntake.find(w => w.tracking_date === date);
    return dayIntake?.amount || 0;
  });

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  // Calcular el índice del día actual (0 = lunes, 6 = domingo)
  const today = new Date();
  let todayIndex = today.getDay() - 1; // getDay(): 0=domingo, 1=lunes...
  if (todayIndex < 0) todayIndex = 6; // Si es domingo, poner al final

  // Calcular el scroll inicial para que el día actual esté visible
  const scrollToDay = (scrollRef: React.RefObject<ScrollView>) => {
    const dayWidth = chartWidth / 7;
    const offset = Math.max(0, dayWidth * todayIndex - screenWidth / 2 + dayWidth / 2);
    scrollRef.current?.scrollTo({ x: offset, animated: false });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToDay(caloriesScrollRef);
      scrollToDay(macrosScrollRef);
      scrollToDay(waterScrollRef);
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Calorías Diarias</Text>
        <Legend items={legends.calories} />
        <ScrollView
          horizontal
          ref={caloriesScrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ minWidth: chartWidth }}
        >
          <LineChart
            data={{
              labels,
              datasets: [
                {
                  data: caloriesValues,
                  color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                },
                {
                  data: Array(7).fill(goals?.calories || 0),
                  color: (opacity = 1) => `rgba(75, 192, 192, 0.3)`,
                  strokeDashArray: [5, 5],
                },
              ],
            }}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
          />
        </ScrollView>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.title}>Macronutrientes</Text>
        <Legend items={legends.macros} />
        <ScrollView
          horizontal
          ref={macrosScrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ minWidth: chartWidth }}
        >
          <LineChart
            data={{
              labels,
              datasets: [
                {
                  data: proteinValues,
                  color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
                },
                {
                  data: carbsValues,
                  color: (opacity = 1) => `rgba(255, 159, 64, ${opacity})`,
                },
                {
                  data: fatsValues,
                  color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                },
                {
                  data: Array(7).fill(goals?.protein || 0),
                  color: (opacity = 1) => `rgba(54, 162, 235, 0.3)`,
                  strokeDashArray: [5, 5],
                },
                {
                  data: Array(7).fill(goals?.carbs || 0),
                  color: (opacity = 1) => `rgba(255, 159, 64, 0.3)`,
                  strokeDashArray: [5, 5],
                },
                {
                  data: Array(7).fill(goals?.fats || 0),
                  color: (opacity = 1) => `rgba(255, 99, 132, 0.3)`,
                  strokeDashArray: [5, 5],
                },
              ],
            }}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
          />
        </ScrollView>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.title}>Consumo de Agua</Text>
        <Legend items={legends.water} />
        <ScrollView
          horizontal
          ref={waterScrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ minWidth: chartWidth }}
        >
          <LineChart
            data={{
              labels,
              datasets: [
                {
                  data: waterValues,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                },
                {
                  data: Array(7).fill(goals?.water || 0),
                  color: (opacity = 1) => `rgba(59, 130, 246, 0.3)`,
                  strokeDashArray: [5, 5],
                },
              ],
            }}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
          />
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  legendColor: {
    width: 16,
    height: 4,
    borderRadius: 2,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  legendDashed: {
    borderStyle: 'dashed',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  legendLabel: {
    fontSize: 13,
    color: '#333',
  },
});

export default ProgressChart;
