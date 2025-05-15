import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
// import { useWaterIntakeStore } from '../stores/waterIntakeStore';
import Toast from 'react-native-toast-message';

interface WaterTrackerProps {
  goal: number;
  userId: string;
}

interface WaterDroplet {
  id: string;
  x: number;
  anim: Animated.Value;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ goal, userId }) => {
  //   const { todayIntake, loading, updateWaterIntake, getTodayIntake, getWeeklyWaterIntake } = useWaterIntakeStore();
  const todayIntake = { amount: 0 }; // Placeholder for todayIntake
  const loading = false; // Placeholder for loading
  const updateWaterIntake = async (userId: string, amount: number) => {
    // Placeholder for updating water intake
  };
  const getTodayIntake = async (userId: string) => {
    // Placeholder for getting today's intake
  };
  const getWeeklyWaterIntake = async (userId: string) => {
    // Placeholder for getting weekly water intake
  };

  const [isLoading, setIsLoading] = useState(loading);

  const [localAmount, setLocalAmount] = useState(0);
  const [droplets, setDroplets] = useState<WaterDroplet[]>([]);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);
  const incrementInterval = useRef<NodeJS.Timeout | null>(null);
  const decrementInterval = useRef<NodeJS.Timeout | null>(null);
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);
  const dropletCounter = useRef(0);

  const INCREMENT_AMOUNT = 10; // ml por incremento
  const UPDATE_INTERVAL = 100; // ms entre actualizaciones
  const UPDATE_DELAY = 500; // ms antes de enviar a la base de datos

  useEffect(() => {
    if (userId) {
      getTodayIntake(userId);
    }
  }, [userId]);

  useEffect(() => {
    setLocalAmount(todayIntake?.amount || 0);
  }, [todayIntake?.amount]);

  const updateDatabaseWithDelay = (newAmount: number) => {
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }

    updateTimeout.current = setTimeout(async () => {
      try {
        await updateWaterIntake(userId, newAmount);
        await getWeeklyWaterIntake(userId);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Error al actualizar el consumo de agua',
        });
      }
    }, UPDATE_DELAY);
  };

  const triggerAnimation = () => {
    const animValue = new Animated.Value(0);
    const newDroplet: WaterDroplet = {
      id: `droplet-${dropletCounter.current++}`,
      x: Math.random() * 80 + 10,
      anim: animValue,
    };

    setDroplets((prev) => [...prev, newDroplet]);

    Animated.timing(animValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setDroplets((prev) => prev.filter((d) => d.id !== newDroplet.id));
    });
  };

  const updateLocalAmount = (newAmount: number) => {
    if (newAmount >= 0) {
      setLocalAmount(newAmount);
      updateDatabaseWithDelay(newAmount);
      triggerAnimation();
    }
  };

  const startIncrementing = () => {
    setIsIncrementing(true);
    updateLocalAmount(localAmount + INCREMENT_AMOUNT);
    incrementInterval.current = setInterval(() => {
      setLocalAmount((prev) => {
        const newAmount = prev + INCREMENT_AMOUNT;
        updateDatabaseWithDelay(newAmount);
        triggerAnimation();
        return newAmount;
      });
    }, UPDATE_INTERVAL);
  };

  const startDecrementing = () => {
    setIsDecrementing(true);
    updateLocalAmount(Math.max(0, localAmount - INCREMENT_AMOUNT));
    decrementInterval.current = setInterval(() => {
      setLocalAmount((prev) => {
        const newAmount = Math.max(0, prev - INCREMENT_AMOUNT);
        updateDatabaseWithDelay(newAmount);
        triggerAnimation();
        return newAmount;
      });
    }, UPDATE_INTERVAL);
  };

  const stopIncrementing = () => {
    setIsIncrementing(false);
    if (incrementInterval.current) {
      clearInterval(incrementInterval.current);
    }
  };

  const stopDecrementing = () => {
    setIsDecrementing(false);
    if (decrementInterval.current) {
      clearInterval(decrementInterval.current);
    }
  };

  const resetWater = () => {
    updateLocalAmount(0);
  };

  const percentage = (localAmount / goal) * 100;

  return (
    <View className="rounded-lg bg-white p-6 shadow-lg">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="flex-row items-center text-lg font-semibold">
          <MaterialCommunityIcons name="water" size={20} color="#3B82F6" className="mr-2" />
          Registro de Agua
        </Text>
        <TouchableOpacity onPress={resetWater} className="text-gray-400">
          <MaterialCommunityIcons name="reload" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View className="relative mb-6 h-64">
        <View className="absolute inset-0 overflow-hidden rounded-lg border-4 border-blue-100">
          <View
            className="absolute bottom-0 left-0 right-0 bg-blue-400"
            style={{
              height: `${percentage > 100 ? 100 : percentage}%`,
              maxHeight: '100%',
            }}>
            <View className="absolute inset-0 bg-blue-300 opacity-30" />
          </View>

          {droplets.map((droplet) => (
            <Animated.View
              key={droplet.id}
              style={{
                position: 'absolute',
                left: `${droplet.x}%`,
                transform: [
                  {
                    translateY: droplet.anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 250],
                    }),
                  },
                ],
                opacity: droplet.anim.interpolate({
                  inputRange: [0, 0.8, 1],
                  outputRange: [1, 0.8, 0],
                }),
              }}>
              <MaterialCommunityIcons name="water" size={16} color="#60A5FA" />
            </Animated.View>
          ))}
        </View>

        <View className="absolute inset-0 flex-col items-center justify-center">
          <Text className="text-4xl font-bold text-blue-600">
            {localAmount}
            <Text className="ml-1 text-2xl">ml</Text>
          </Text>
          <Text className="text-blue-400">de {goal}ml</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPressIn={startDecrementing}
          onPressOut={stopDecrementing}
          className="rounded-full bg-red-100 p-3 active:bg-red-300"
          disabled={localAmount === 0}>
          <FontAwesome name="minus" size={24} color="#EF4444" />
        </TouchableOpacity>

        <View className="items-center">
          <View className="rounded-full bg-blue-500 p-4">
            <MaterialCommunityIcons name="water" size={32} color="white" />
          </View>
          <Text className="mt-2 text-sm text-gray-500">±{INCREMENT_AMOUNT}ml</Text>
        </View>

        <TouchableOpacity
          onPressIn={startIncrementing}
          onPressOut={stopIncrementing}
          className="rounded-full bg-green-100 p-3 active:bg-green-300">
          <FontAwesome name="plus" size={24} color="#10B981" />
        </TouchableOpacity>
      </View>

      {percentage >= 100 && (
        <View className="mt-4 items-center rounded-lg bg-green-50 p-3">
          <Text className="font-medium text-green-600">¡Felicitaciones! 🎉</Text>
          <Text className="text-sm text-green-500">Has alcanzado tu meta diaria de agua</Text>
        </View>
      )}
      {percentage >= 50 && percentage < 100 && (
        <View className="mt-4 items-center rounded-lg bg-blue-50 p-3">
          <Text className="font-medium text-blue-600">¡Vas muy bien! 💪</Text>
          <Text className="text-sm text-blue-500">Ya llevas más de la mitad de tu meta</Text>
        </View>
      )}
    </View>
  );
};

export default WaterTracker;
