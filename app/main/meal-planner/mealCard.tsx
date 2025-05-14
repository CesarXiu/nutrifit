import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';

interface Meal {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface MealCardProps {
    title: string;
    meal: Meal | null;
    onAddMeal: () => void;
    onRemoveMeal: () => void;
}

const MealCard: React.FC<MealCardProps> = ({
    title,
    meal,
    onAddMeal,
    onRemoveMeal,
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onAddMeal} style={styles.iconButton}>
                    <AntDesign name="plus" size={20} color="#4B5563" />
                </TouchableOpacity>
            </View>

            {meal ? (
                <View style={styles.mealInfo}>
                    <View style={styles.mealDetails}>
                        <Text style={styles.mealName}>{meal.name}</Text>
                        <Text style={styles.mealStats}>
                            {meal.calories} kcal • P: {meal.protein}g • C: {meal.carbs}g • G: {meal.fat}g
                        </Text>
                    </View>
                    <TouchableOpacity onPress={onRemoveMeal} style={styles.iconButton}>
                        <Feather name="trash-2" size={18} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            ) : (
                <Text style={styles.noMealText}>No hay comida asignada</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
    },
    iconButton: {
        padding: 8,
        borderRadius: 16,
    },
    mealInfo: {
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    mealDetails: {
        flex: 1,
    },
    mealName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    mealStats: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    noMealText: {
        textAlign: 'center',
        paddingVertical: 16,
        fontSize: 14,
        color: '#9CA3AF',
    },
});

export default MealCard;