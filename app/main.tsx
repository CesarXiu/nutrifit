import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
  Ionicons,
  AntDesign,
  MaterialIcons,
} from '@expo/vector-icons';
// import { useAuthStore } from '../stores/authStore';
// import { useNutritionGoalsStore } from '../stores/nutritionGoalsStore';
// import { useMealPlanStore } from '../stores/mealPlanStore';
// import { useWaterIntakeStore } from '../stores/waterIntakeStore';
// import { useDailyTrackingStore } from '../stores/dailyTrackingStore';
// import { checkSupabaseConnection } from '../lib/supabase';
// import WeeklyMealPlanner from './WeeklyMealPlanner';
// import ExerciseTracker from './ExerciseTracker';
// import Wellness from './Wellness';
// import DailyMealTracking from './DailyMealTracking';
// import WaterTracker from './WaterTracker';
// import ProgressChart from './ProgressChart';
// import Recipes from './Recipes';
import Toast from 'react-native-toast-message';
import Animated, { FadeIn, SlideInLeft, Easing } from 'react-native-reanimated';
import WeeklyMealPlanner from './main/weeklyMealPlanner';

interface MainScreenProps {
  onLogout: () => void;
}

const MainScreen: React.FC<MainScreenProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  //   const { user, signOut } = useAuthStore();
  //   const { goals, getGoals } = useNutritionGoalsStore();
  //   const { meals, getMeals } = useMealPlanStore();
  //   const { getTodayIntake } = useWaterIntakeStore();
  //   const { getTodayTracking } = useDailyTrackingStore();

  const [user, setUser] = useState<any>(null);
  const [goals, setGoals] = useState<any>(true);

  const { width } = Dimensions.get('window');
  const isLargeScreen = width >= 1024;

  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        // const isConnected = await checkSupabaseConnection();
        // if (!isConnected) {
        //   Toast.show({
        //     type: 'error',
        //     text1: 'Error de conexión',
        //     text2: 'Por favor, intenta más tarde.',
        //   });
        //   return;
        // }

        try {
          await Promise.all([
            // getGoals(user.id),
            // getMeals(user.id),
            // getTodayIntake(user.id),
            // getTodayTracking(user.id),
          ]);
        } catch (error) {
          console.error('Error loading data:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Error al cargar los datos',
          });
        }
      }
    };

    initializeData();
  }, [user]);

  const handleLogout = async () => {
    try {
    //   await signOut();
      onLogout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const tabs = [
    {
      id: 'resumen',
      name: 'Resumen Diario',
      icon: () => <MaterialCommunityIcons name="view-dashboard" size={24} />,
    },
    {
      id: 'planificador',
      name: 'Planificador',
      icon: () => <MaterialCommunityIcons name="calendar" size={24} />,
    },
    {
      id: 'recetas',
      name: 'Recetas',
      icon: () => <MaterialIcons name="restaurant" size={24} />,
    },
    {
      id: 'ejercicio',
      name: 'Ejercicio',
      icon: () => <MaterialCommunityIcons name="dumbbell" size={24} />,
    },
    {
      id: 'bienestar',
      name: 'Bienestar',
      icon: () => <FontAwesome name="heart" size={24} />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'resumen':
        return (
          <View className="flex-1">
            <Text className="mb-4 text-xl font-semibold">Resumen Diario</Text>
            <View className="mb-6 flex-col gap-4 lg:flex-row">
              <View className="mb-4 lg:mb-0 lg:flex-1">
                {/* <DailyMealTracking /> */}
              </View>
              <View className="lg:flex-1">
                {/* <WaterTracker goal={goals?.water || 2000} userId={user?.id || ''} /> */}
              </View>
            </View>
            <View>
              {/* <ProgressChart /> */}
            </View>
          </View>
        );
      case 'planificador':
        return goals ? <WeeklyMealPlanner goals={goals} />: null; //<WeeklyMealPlanner goals={goals} />
      case 'recetas':
        return <p>WeeklyMealPlanner</p>; //<Recipes />
      case 'ejercicio':
        return <p>ExerciseTracker</p>; //<ExerciseTracker />
      case 'bienestar':
        return <p>Wellness</p>; //<Wellness />
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar backgroundColor="#f3f4f6" barStyle="dark-content" />

      {/* Mobile Menu Button */}
      {!isLargeScreen && (
        <View className="absolute right-4 top-4 z-50">
          <TouchableOpacity
            onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg bg-white p-2 shadow-md">
            {isMobileMenuOpen ? (
              <Feather name="x" size={24} color="#4b5563" />
            ) : (
              <Feather name="menu" size={24} color="#4b5563" />
            )}
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-1 flex-row">
        {/* Sidebar */}
        <Animated.View
          entering={SlideInLeft.duration(300).easing(Easing.out(Easing.ease))}
          className={`absolute z-40 h-full w-64 bg-white shadow-lg lg:relative ${
            isMobileMenuOpen || isLargeScreen ? 'flex' : 'hidden'
          }`}>
          <View className="border-b border-gray-200 p-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-gray-800">NutriFit</Text>
                <Text className="text-sm text-gray-600">Bienvenido, {user?.name}</Text>
              </View>
              <TouchableOpacity onPress={handleLogout} className="p-2" accessibilityLabel="Cerrar sesión">
                <AntDesign name="logout" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="space-y-2">
              {tabs.map((tab, index) => (
                <Animated.View key={tab.id} entering={SlideInLeft.delay(index * 100).duration(300)}>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-row items-center rounded-lg px-4 py-3 ${
                      activeTab === tab.id ? 'bg-blue-500' : 'bg-transparent'
                    }`}>
                    {tab.icon()}
                    <Text
                      className={`ml-3 ${activeTab === tab.id ? 'text-white' : 'text-gray-600'}`}>
                      {tab.name}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Main Content */}
        <View className="flex-1">
          <ScrollView className="flex-1">
            <View className="container mx-auto px-4 py-6">
              <Animated.View entering={FadeIn.duration(300)}>{renderTabContent()}</Animated.View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;
