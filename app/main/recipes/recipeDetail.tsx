import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

interface Recipe {
  id: number;
  name: string;
  calories: number;
  time: string;
  image: string;
  ingredients: string[];
  instructions: string[];
}

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onClose }) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Botón de cerrar flotante */}
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
          accessibilityLabel="Cerrar receta">
          <MaterialIcons name="close" size={24} color="#4B5563" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Imagen y título */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: recipe.image }} style={styles.image} />
            <View style={styles.imageOverlay} />
            <Text style={styles.title}>{recipe.name}</Text>
          </View>

          <View style={styles.content}>
            {/* Estadísticas */}
            <View style={styles.statsContainer}>
              <View style={[styles.statBox, styles.greenBox]}>
                <MaterialCommunityIcons name="fire" size={20} color="#16A34A" />
                <Text style={styles.greenText}>{recipe.calories} cal</Text>
              </View>
              <View style={[styles.statBox, styles.blueBox]}>
                <MaterialIcons name="access-time" size={20} color="#3B82F6" />
                <Text style={styles.blueText}>{recipe.time}</Text>
              </View>
              <View style={[styles.statBox, styles.purpleBox]}>
                <FontAwesome5 name="users" size={20} color="#8B5CF6" />
                <Text style={styles.purpleText}>4 porc</Text>
              </View>
            </View>

            {/* Ingredientes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredientes:</Text>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.bullet} />
                  <Text>{ingredient}</Text>
                </View>
              ))}
            </View>

            {/* Instrucciones */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instrucciones:</Text>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>

            {/* Botón de cerrar inferior */}
            <TouchableOpacity onPress={onClose} style={styles.closeButtonBottom}>
              <Text style={styles.closeButtonText}>Cerrar receta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
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
    width: '90%',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  greenBox: {
    backgroundColor: '#ECFDF5',
  },
  blueBox: {
    backgroundColor: '#EFF6FF',
  },
  purpleBox: {
    backgroundColor: '#F5F3FF',
  },
  greenText: {
    color: '#16A34A',
    marginLeft: 5,
  },
  blueText: {
    color: '#3B82F6',
    marginLeft: 5,
  },
  purpleText: {
    color: '#8B5CF6',
    marginLeft: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bullet: {
    width: 8,
    height: 8,
    backgroundColor: '#16A34A',
    borderRadius: 4,
    marginRight: 10,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stepCircle: {
    width: 24,
    height: 24,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepText: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
  },
  closeButtonBottom: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#374151',
  },
});

export default RecipeDetail;
