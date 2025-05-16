import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { FontAwesome5, Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const BREATHING_EXERCISES = [
  {
    id: 1,
    name: 'Respiración 4-7-8',
    description: 'Una técnica tranquilizante que ayuda a reducir la ansiedad',
    duration: 300,
    pattern: { inhale: 4, hold: 7, exhale: 8 },
    benefits: 'Ayuda a reducir la ansiedad y mejorar el sueño. Ideal para momentos de estrés.',
    type: 'relaxation',
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    id: 2,
    name: 'Respiración Cuadrada',
    description: 'Equilibra el sistema nervioso y mejora la concentración',
    duration: 240,
    pattern: { inhale: 4, hold: 4, exhale: 4 },
    benefits:
      'Mejora la concentración y equilibra las energías. Perfecta para antes de una tarea importante.',
    type: 'focus',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 3,
    name: 'Respiración Profunda',
    description: 'Oxigena completamente el cuerpo y relaja la mente',
    duration: 180,
    pattern: { inhale: 5, hold: 2, exhale: 5 },
    benefits: 'Aumenta los niveles de oxígeno en sangre y ayuda a relajar el cuerpo y la mente.',
    type: 'energizing',
    gradient: 'from-teal-400 to-cyan-500',
  },
];

const Wellness: React.FC = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingTime, setBreathingTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | null>(null);
  const [selectedExercise, setSelectedExercise] = useState(BREATHING_EXERCISES[0]);
  const [showExerciseInfo, setShowExerciseInfo] = useState<number | null>(null);
  const [playingAmbience, setPlayingAmbience] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathingTime((prev) => {
          const newTime = prev + 1;
          const { inhale, hold, exhale } = selectedExercise.pattern;
          const cycleLength = inhale + hold + exhale;
          const currentCycleTime = newTime % cycleLength;

          if (currentCycleTime < inhale) {
            setCurrentPhase('inhale');
          } else if (currentCycleTime < inhale + hold) {
            setCurrentPhase('hold');
          } else {
            setCurrentPhase('exhale');
          }

          if (newTime >= selectedExercise.duration) {
            setIsBreathing(false);
            setCurrentPhase(null);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      setCurrentPhase(null);
    }
    return () => clearInterval(interval as any);
  }, [isBreathing, selectedExercise]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseMessage = (): string => {
    switch (currentPhase) {
      case 'inhale':
        return 'Inhala';
      case 'hold':
        return 'Mantén';
      case 'exhale':
        return 'Exhala';
      default:
        return 'Prepárate';
    }
  };

  const handleReset = () => {
    setIsBreathing(false);
    setBreathingTime(0);
    setCurrentPhase(null);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 40,
        backgroundColor: '#fff',
        minHeight: '100%',
      }}>
      {/* Header */}
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#a21caf',
            backgroundColor: 'transparent',
          }}>
          Espacio de Bienestar
        </Text>
        <Text style={{ marginTop: 8, color: '#4b5563' }}>
          Toma un momento para respirar y encontrar tu calma interior
        </Text>
      </View>

      {/* Sección Principal de Respiración */}
      <View
        style={{
          backgroundColor: '#f5f3ff',
          borderRadius: 24,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          padding: 32,
          borderWidth: 1,
          borderColor: '#ede9fe',
          marginBottom: 32,
        }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View
            style={{
              padding: 8,
              backgroundColor: '#fff',
              borderRadius: 999,
              shadowOpacity: 0.1,
              marginBottom: 16,
            }}>
            <Feather name="wind" size={28} color="#a78bfa" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#4c1d95' }}>
            {selectedExercise.name}
          </Text>
          <Text style={{ color: '#7c3aed' }}>{selectedExercise.description}</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <View style={{ position: 'relative', marginBottom: 24 }}>
            <View
              style={{
                width: 224,
                height: 224,
                borderRadius: 112,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 4,
                borderColor: isBreathing ? '#a78bfa' : '#d1d5db',
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 8,
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  right: 8,
                  bottom: 8,
                  borderRadius: 104,
                  backgroundColor:
                    currentPhase === 'inhale'
                      ? '#ede9fe'
                      : currentPhase === 'hold'
                        ? '#fce7f3'
                        : currentPhase === 'exhale'
                          ? '#e0e7ff'
                          : '#f9fafb',
                }}
              />
              <View
                style={{
                  zIndex: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#4c1d95' }}>
                  {formatTime(breathingTime)}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: '500', color: '#7c3aed', marginTop: 8 }}>
                  {isBreathing ? getPhaseMessage() : 'Presiona para comenzar'}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <TouchableOpacity
              onPress={() => setIsBreathing(!isBreathing)}
              style={{
                padding: 16,
                borderRadius: 999,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 8,
                backgroundColor: isBreathing ? '#ef4444' : '#a78bfa',
              }}>
              {isBreathing ? (
                <Feather name="pause-circle" size={32} color="#fff" />
              ) : (
                <Feather name="play-circle" size={32} color="#fff" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleReset}
              style={{
                padding: 16,
                borderRadius: 999,
                backgroundColor: '#6b7280',
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 8,
              }}>
              <Feather name="rotate-ccw" size={32} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPlayingAmbience(!playingAmbience)}
              style={{
                padding: 16,
                borderRadius: 999,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 8,
                backgroundColor: playingAmbience ? '#8b5cf6' : '#fff',
              }}>
              {playingAmbience ? (
                <Feather name="volume-2" size={32} color="#fff" />
              ) : (
                <Feather name="volume-x" size={32} color="#a3a3a3" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Ejercicios de Respiración */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {BREATHING_EXERCISES.map((exercise) => (
          <Pressable
            key={exercise.id}
            style={{
              width: '100%',
              marginBottom: 24,
              backgroundColor: '#fff',
              borderRadius: 16,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 8,
              overflow: 'hidden',
              borderWidth: selectedExercise.id === exercise.id ? 2 : 0,
              borderColor: selectedExercise.id === exercise.id ? '#a78bfa' : undefined,
            }}
            onPress={() => {
              setSelectedExercise(exercise);
              setBreathingTime(0);
              setIsBreathing(false);
            }}>
            <View style={{ height: 8, backgroundColor: '#a78bfa' }} />
            <View style={{ padding: 24 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 16,
                }}>
                <View>
                  <Text style={{ fontWeight: '600', fontSize: 18 }}>{exercise.name}</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>
                    {formatTime(exercise.duration)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation?.();
                    setShowExerciseInfo(showExerciseInfo === exercise.id ? null : exercise.id);
                  }}
                  style={{ padding: 4, borderRadius: 999 }}>
                  <Feather name="info" size={20} color="#a78bfa" />
                </TouchableOpacity>
              </View>
              {showExerciseInfo === exercise.id && (
                <View
                  style={{
                    marginTop: 8,
                    padding: 12,
                    backgroundColor: '#f5f3ff',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#ede9fe',
                  }}>
                  <Text style={{ color: '#4c1d95', fontSize: 14 }}>{exercise.benefits}</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </View>

      {/* Footer */}
      <View style={{ alignItems: 'center', paddingTop: 16 }}>
        <View style={{ padding: 12, backgroundColor: '#f3e8ff', borderRadius: 999 }}>
          <Feather name="heart" size={20} color="#a78bfa" />
        </View>
        <Text style={{ marginTop: 8, color: '#4b5563', textAlign: 'center' }}>
          Recuerda que cada respiración es una oportunidad para encontrar paz
        </Text>
      </View>
    </ScrollView>
  );
};

export default Wellness;
