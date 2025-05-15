import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
// import { useDailyTrackingStore } from '../stores/dailyTrackingStore';
// import { useNutritionGoalsStore } from '../stores/nutritionGoalsStore';
// import { useWaterIntakeStore } from '../stores/waterIntakeStore';
// import { useAuthStore } from '../stores/authStore';
import { getCurrentWeekDates, getWeekdayName } from '../../utils/dateUtils';

const screenWidth = Dimensions.get('window').width;

const ProgressChart: React.FC = () => {
    // const { weeklyTracking, getWeeklyTracking } = useDailyTrackingStore();
    // const { goals } = useNutritionGoalsStore();
    // const { getWeeklyWaterIntake, weeklyWaterIntake } = useWaterIntakeStore();
    // const { user } = useAuthStore();

    const weeklyTracking = [
        { tracking_date: '2023-10-01', completed: true, calories: 2000, protein: 150, carbs: 250, fats: 70 },
        { tracking_date: '2023-10-02', completed: true, calories: 1800, protein: 140, carbs: 230, fats: 60 },
        { tracking_date: '2023-10-03', completed: true, calories: 2200, protein: 160, carbs: 270, fats: 80 },
        { tracking_date: '2023-10-04', completed: true, calories: 2100, protein: 155, carbs: 260, fats: 75 },
        { tracking_date: '2023-10-05', completed: true, calories: 1900, protein: 145, carbs: 240, fats: 65 },
        { tracking_date: '2023-10-06', completed: true, calories: 2000, protein: 150, carbs: 250, fats: 70 },
        { tracking_date: '2023-10-07', completed: true, calories: 2050, protein: 155, carbs: 255, fats: 72 }
    ];
    const weeklyWaterIntake = [
        { tracking_date: '2023-10-01', amount: 2000 },
        { tracking_date: '2023-10-02', amount: 2500 },
        { tracking_date: '2023-10-03', amount: 2200 },
        { tracking_date: '2023-10-04', amount: 2400 },
        { tracking_date: '2023-10-05', amount: 2300 },
        { tracking_date: '2023-10-06', amount: 2100 },
        { tracking_date: '2023-10-07', amount: 2600 }
    ];
    const user = { id: 'user123' };
    const goals = { calories: 2000, protein: 150, carbs: 250, fats: 70, water: 3000 };

    const getWeeklyTracking = async (userId: string) => {
        // Placeholder for fetching weekly tracking data
        // const data = await fetchWeeklyTracking(userId);
        // setWeeklyTracking(data);
    }
    const getWeeklyWaterIntake = async (userId: string) => {
        // Placeholder for fetching weekly water intake data
        // const data = await fetchWeeklyWaterIntake(userId);
        // setWeeklyWaterIntake(data);
    }

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

    return (
        <ScrollView style={styles.container}>
            <View style={styles.chartContainer}>
                <Text style={styles.title}>Calorías Diarias</Text>
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
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                />
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.title}>Macronutrientes</Text>
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
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                />
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.title}>Consumo de Agua</Text>
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
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                />
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
});

export default ProgressChart;
