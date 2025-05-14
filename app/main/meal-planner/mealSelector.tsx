import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Meal {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface MealSelectorProps {
    onSelect: (meal: Meal) => void;
    onClose: () => void;
}

const commonMeals: Meal[] = [
    { name: 'Avena con plátano', calories: 350, protein: 12, carbs: 60, fat: 8 },
    { name: 'Huevos revueltos', calories: 280, protein: 18, carbs: 2, fat: 22 },
    { name: 'Ensalada de pollo', calories: 420, protein: 35, carbs: 25, fat: 18 },
    { name: 'Salmón con verduras', calories: 450, protein: 40, carbs: 15, fat: 25 },
    { name: 'Batido de proteínas', calories: 200, protein: 25, carbs: 15, fat: 5 },
    // Add more meals as needed
];

const MealSelector: React.FC<MealSelectorProps> = ({ onSelect, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [customMeal, setCustomMeal] = useState<Partial<Meal>>({});
    const [showCustomForm, setShowCustomForm] = useState(false);

    const filteredMeals = commonMeals.filter(meal =>
        meal.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCustomMealSubmit = () => {
        if (customMeal.name && customMeal.calories) {
            onSelect({
                name: customMeal.name,
                calories: customMeal.calories || 0,
                protein: customMeal.protein || 0,
                carbs: customMeal.carbs || 0,
                fat: customMeal.fat || 0,
            });
            onClose();
        }
    };

    return (
        <Modal transparent={true} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Seleccionar Comida</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#555" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#aaa" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar comidas..."
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />
                    </View>

                    <ScrollView style={styles.mealList}>
                        {filteredMeals.map((meal, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => onSelect(meal)}
                                style={styles.mealItem}
                            >
                                <Text style={styles.mealName}>{meal.name}</Text>
                                <Text style={styles.mealDetails}>
                                    {meal.calories} kcal | P: {meal.protein}g | C: {meal.carbs}g | G: {meal.fat}g
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {!showCustomForm ? (
                        <TouchableOpacity
                            onPress={() => setShowCustomForm(true)}
                            style={styles.addCustomMealButton}
                        >
                            <Ionicons name="add" size={20} color="#007BFF" />
                            <Text style={styles.addCustomMealText}>Crear comida personalizada</Text>
                        </TouchableOpacity>
                    ) : (
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre de la comida"
                                value={customMeal.name || ''}
                                onChangeText={(text) => setCustomMeal({ ...customMeal, name: text })}
                            />
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Calorías"
                                    keyboardType="numeric"
                                    value={customMeal.calories?.toString() || ''}
                                    onChangeText={(text) => setCustomMeal({ ...customMeal, calories: Number(text) })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Proteínas (g)"
                                    keyboardType="numeric"
                                    value={customMeal.protein?.toString() || ''}
                                    onChangeText={(text) => setCustomMeal({ ...customMeal, protein: Number(text) })}
                                />
                            </View>
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Carbohidratos (g)"
                                    keyboardType="numeric"
                                    value={customMeal.carbs?.toString() || ''}
                                    onChangeText={(text) => setCustomMeal({ ...customMeal, carbs: Number(text) })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Grasas (g)"
                                    keyboardType="numeric"
                                    value={customMeal.fat?.toString() || ''}
                                    onChangeText={(text) => setCustomMeal({ ...customMeal, fat: Number(text) })}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={handleCustomMealSubmit}
                                style={styles.submitButton}
                            >
                                <Text style={styles.submitButtonText}>Agregar Comida</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchIcon: {
        position: 'absolute',
        left: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingLeft: 35,
        paddingRight: 10,
    },
    mealList: {
        marginBottom: 10,
    },
    mealItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    mealName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    mealDetails: {
        fontSize: 12,
        color: '#555',
    },
    addCustomMealButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#007BFF',
        borderRadius: 5,
        marginTop: 10,
    },
    addCustomMealText: {
        color: '#007BFF',
        marginLeft: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        flex: 1,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    submitButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default MealSelector;