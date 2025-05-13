// app/index.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold">Pantalla Principal</Text>
      <Link href="/explore" asChild>
        <TouchableOpacity className="mt-4 px-4 py-2 bg-blue-500 rounded">
          <Text className="text-white">Ir a Explorar</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/login" asChild>
        <TouchableOpacity className="mt-4 px-4 py-2 bg-blue-500 rounded">
          <Text className="text-white">Ir al Login</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
