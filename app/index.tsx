import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import Login from './login'
import Register from './register'
import UserOnboarding from './userOnboarding'
import MainScreen from './main'
import { useAuthStore } from '../stores/authStore'
import Toast from 'react-native-toast-message'

function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'onboarding' | 'main'>('login')
  const { user, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      setCurrentScreen('main')
    }
  }, [user])

  const handleLogin = () => {
    
    setCurrentScreen('main')
  }

  const handleRegister = (email: string) => {
    setCurrentScreen('onboarding')
  }

  const handleOnboardingComplete = () => {
    setCurrentScreen('main')
  }

  const handleLogout = () => {
    setCurrentScreen('login')
  }
  return (
    <View className="flex-1 bg-gradient-to-b from-blue-100 to-green-100">
      {/* Componente Toast para notificaciones */}
      <Toast />
      
      {/* Navegación entre pantallas */}
      {currentScreen === 'login' && (
        <Login 
          onLogin={() => {
            console.log('Login button pressed')
            handleLogin()
          }}
          onSwitchToRegister={() => {
            console.log('Switch to Register button pressed')
            setCurrentScreen('register')
          }}
        />
      )}
      
      {currentScreen === 'register' && (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setCurrentScreen('login')}
        />
      )}
      
      {currentScreen === 'onboarding' && (
        <UserOnboarding onComplete={handleOnboardingComplete} />
      )}
      
      {currentScreen === 'main' && (
        <MainScreen onLogout={handleLogout} />
      )}
    </View>
  )
}

export default App