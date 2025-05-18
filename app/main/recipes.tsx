import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import RecipeDetail from './recipes/recipeDetail';

interface Recipe {
  id: number;
  name: string;
  calories: number;
  time: string;
  image: string;
  ingredients: string[];
  instructions: string[];
}

const initialRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Ensalada de quinoa',
    calories: 300,
    time: '20 min',
    image:
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    ingredients: [
      '1 taza de quinoa',
      '2 tazas de agua',
      '1 pepino',
      '1 tomate',
      '1/4 de cebolla roja',
      'Jugo de 1 limón',
      '2 cucharadas de aceite de oliva',
      'Sal y pimienta al gusto',
    ],
    instructions: [
      'Enjuaga la quinoa y cocínala en agua hirviendo durante 15-20 minutos.',
      'Mientras tanto, corta el pepino, el tomate y la cebolla en cubos pequeños.',
      'En un tazón grande, mezcla la quinoa cocida con las verduras.',
      'Agrega el jugo de limón, el aceite de oliva, sal y pimienta. Mezcla bien.',
      'Sirve frío o a temperatura ambiente.',
    ],
  },
  {
    id: 2,
    name: 'Pollo al horno con verduras',
    calories: 450,
    time: '45 min',
    image:
      'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    ingredients: [
      '4 pechugas de pollo',
      '2 zanahorias',
      '1 calabacín',
      '1 cebolla',
      '2 dientes de ajo',
      '2 cucharadas de aceite de oliva',
      'Sal, pimienta y hierbas al gusto',
    ],
    instructions: [
      'Precalienta el horno a 200°C.',
      'Corta las verduras en trozos medianos y colócalas en una bandeja para horno.',
      'Coloca las pechugas de pollo sobre las verduras.',
      'Mezcla el aceite con las hierbas, sal y pimienta, y vierte sobre el pollo y las verduras.',
      'Hornea durante 30-35 minutos o hasta que el pollo esté cocido.',
    ],
  },
  {
    id: 3,
    name: 'Batido de proteínas',
    calories: 200,
    time: '5 min',
    image:
      'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    ingredients: [
      '1 scoop de proteína en polvo',
      '1 plátano',
      '1 taza de leche (o alternativa vegetal)',
      '1 cucharada de mantequilla de maní',
      'Hielo al gusto',
    ],
    instructions: [
      'Añade todos los ingredientes en una licuadora.',
      'Licúa hasta obtener una consistencia suave.',
      'Sirve inmediatamente y disfruta.',
    ],
  },
  {
    id: 4,
    name: 'Salmón a la parrilla',
    calories: 350,
    time: '30 min',
    image:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    ingredients: [
      '4 filetes de salmón',
      'Jugo de 1 limón',
      '2 cucharadas de aceite de oliva',
      '2 dientes de ajo picados',
      'Sal y pimienta al gusto',
      'Hierbas frescas (eneldo o perejil)',
    ],
    instructions: [
      'Mezcla el jugo de limón, aceite, ajo picado, sal y pimienta en un tazón pequeño.',
      'Coloca los filetes de salmón en una bandeja y cúbrelos con la mezcla. Deja marinar por 15 minutos.',
      'Precalienta la parrilla a fuego medio-alto.',
      'Cocina el salmón en la parrilla durante 4-5 minutos por cada lado.',
      'Sirve caliente, decorado con hierbas frescas.',
    ],
  },
];

const Recipes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState(initialRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleSearch = (text: string) => {
    const term = text.toLowerCase();
    setSearchTerm(term);
    const filteredRecipes = initialRecipes.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(term) ||
        recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(term))
    );
    setRecipes(filteredRecipes);
  };

  const handleViewRecipe = (recipe: Recipe) => {
    console.log('Ver receta:', recipe);
    setSelectedRecipe(recipe);
  };

  const handleCloseRecipe = () => {
    setSelectedRecipe(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Recetas Saludables</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar recetas..."
              value={searchTerm}
              onChangeText={handleSearch}
            />
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>{item.name}</Text>
              <Text style={styles.recipeDetails}>
                {item.calories} cal • {item.time}
              </Text>
              <TouchableOpacity style={styles.viewButton} onPress={() => handleViewRecipe(item)}>
                <Text style={styles.viewButtonText}>Ver Receta</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {selectedRecipe && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseRecipe}>
          <RecipeDetail recipe={selectedRecipe} onClose={handleCloseRecipe} />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
  },
  recipeImage: {
    width: '100%',
    height: 150,
  },
  recipeInfo: {
    padding: 16,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recipeDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  viewButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // 👈 clave para que se superponga bien
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    elevation: 10, // Android
    zIndex: 10, // iOS y web
  },
});

export default Recipes;
