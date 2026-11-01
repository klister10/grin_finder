import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Face from '../components/Face';

const { width } = Dimensions.get('window');

export default function StartScreen({ onStart }) {
  const titleY = useSharedValue(40);
  const titleOpacity = useSharedValue(0);
  const faceScale = useSharedValue(0);
  const faceRotate = useSharedValue(-8);
  const subtitleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const floatY = useSharedValue(0);

  useEffect(() => {
    // Title slides in
    titleOpacity.value = withDelay(100, withTiming(1, { duration: 500 }));
    titleY.value = withDelay(100, withSpring(0, { damping: 14, stiffness: 120 }));

    // Face bounces in
    faceScale.value = withDelay(350, withSpring(1, { damping: 9, stiffness: 160 }));
    faceRotate.value = withDelay(350, withSpring(0, { damping: 8, stiffness: 120 }));

    // Subtitle + button fade in
    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    buttonOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));

    // Gentle float loop
    floatY.value = withDelay(
      900,
      withRepeat(
        withSequence(
          withTiming(-10, { duration: 1600 }),
          withTiming(0, { duration: 1600 }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const faceStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: faceScale.value },
      { rotate: `${faceRotate.value}deg` },
      { translateY: floatY.value },
    ],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonOpacity.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Text style={[styles.title, titleStyle]}>Find the{'\n'}Smile</Animated.Text>

      <Animated.View style={[styles.faceWrapper, faceStyle]}>
        <Face type="happy" skinTone="#FFCB8E" size={160} />
      </Animated.View>

      <Animated.Text style={[styles.subtitle, subtitleStyle]}>
        One face is smiling.{'\n'}Can you spot it?
      </Animated.Text>

      <Animated.View style={buttonStyle}>
        <Button
          mode="contained"
          onPress={onStart}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Let's go!
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFD60A',
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 58,
  },
  faceWrapper: {
    shadowColor: '#FFD60A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: '500',
  },
  button: {
    borderRadius: 32,
    backgroundColor: '#FFD60A',
    shadowColor: '#FFD60A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 8,
  },
  buttonContent: {
    paddingHorizontal: 28,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: 0.5,
  },
});
