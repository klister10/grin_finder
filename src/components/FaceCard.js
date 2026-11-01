import React, { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Face from './Face';

// State: 'idle' | 'wrong' | 'won' | 'other-won'

export default function FaceCard({ face, index, size, onPress, state, roundKey }) {
  const scale = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  const wrongOverlay = useSharedValue(0);
  const winOverlay = useSharedValue(0);

  // Staggered bounce-in on each new round
  useEffect(() => {
    scale.value = 0;
    opacity.value = 0;
    translateX.value = 0;
    rotate.value = 0;
    wrongOverlay.value = 0;
    winOverlay.value = 0;

    const delay = index * 25;
    opacity.value = withDelay(delay, withTiming(1, { duration: 120 }));
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) }),
    );
  }, [roundKey]);

  // Reactions to game state
  useEffect(() => {
    if (state === 'wrong') {
      translateX.value = withSequence(
        withTiming(-11, { duration: 55 }),
        withTiming(11, { duration: 55 }),
        withTiming(-8, { duration: 55 }),
        withTiming(8, { duration: 55 }),
        withTiming(-5, { duration: 45 }),
        withTiming(0, { duration: 45 }),
      );
      wrongOverlay.value = withSequence(
        withTiming(0.52, { duration: 70 }),
        withTiming(0, { duration: 500 }),
      );
    } else if (state === 'won') {
      scale.value = withSpring(1.38, { damping: 6, stiffness: 155 });
      rotate.value = withSequence(
        withTiming(-16, { duration: 90 }),
        withTiming(16, { duration: 90 }),
        withTiming(-11, { duration: 80 }),
        withTiming(11, { duration: 80 }),
        withSpring(0, { damping: 9 }),
      );
      winOverlay.value = withSequence(
        withTiming(0.45, { duration: 120 }),
        withTiming(0.15, { duration: 600 }),
      );
    } else if (state === 'other-won') {
      scale.value = withTiming(0.72, { duration: 380 });
      opacity.value = withTiming(0.35, { duration: 380 });
    } else if (state === 'idle') {
      // Don't touch scale — the roundKey entry animation owns it.
      // Wrong animation already springs scale back itself.
      // Won/other-won scale is reset by the roundKey effect on next round.
      opacity.value = withTiming(1, { duration: 200 });
      rotate.value = withTiming(0, { duration: 200 });
      translateX.value = withTiming(0, { duration: 100 });
      winOverlay.value = withTiming(0, { duration: 200 });
      wrongOverlay.value = withTiming(0, { duration: 200 });
    }
  }, [state]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const wrongOverlayStyle = useAnimatedStyle(() => ({
    opacity: wrongOverlay.value,
  }));

  const winOverlayStyle = useAnimatedStyle(() => ({
    opacity: winOverlay.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.87, { damping: 12, stiffness: 320 });
  };

  const handlePressOut = () => {
    if (state === 'idle') {
      scale.value = withSpring(1, { damping: 10, stiffness: 220 });
    }
  };

  return (
    <Animated.View style={[styles.card, { width: size, height: size }, cardStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        <Face type={face.type} skinTone={face.skinTone} size={size - 10} />
      </Pressable>

      {/* Wrong flash overlay */}
      <Animated.View
        style={[styles.overlay, { backgroundColor: '#FF3B30' }, wrongOverlayStyle]}
        pointerEvents="none"
      />
      {/* Win glow overlay */}
      <Animated.View
        style={[styles.overlay, { backgroundColor: '#FFD60A' }, winOverlayStyle]}
        pointerEvents="none"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
  },
});
