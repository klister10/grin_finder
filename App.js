import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import StartScreen from './src/screens/StartScreen';
import GameScreen from './src/screens/GameScreen';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FFD60A',
    background: '#1A1A2E',
    surface: '#1E2A3A',
  },
};

export default function App() {
  const [screen, setScreen] = useState('start');
  const opacity = useSharedValue(1);

  const transition = (nextScreen) => {
    opacity.value = withTiming(0, { duration: 180 }, () => {
      runOnJS(setScreen)(nextScreen);
      opacity.value = withTiming(1, { duration: 220 });
    });
  };

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar style="light" />
          <Animated.View style={[styles.root, containerStyle]}>
            {screen === 'start' ? (
              <StartScreen onStart={() => transition('game')} />
            ) : (
              <GameScreen onGoHome={() => transition('start')} />
            )}
          </Animated.View>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
});
