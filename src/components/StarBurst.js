import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

const { width: W, height: H } = Dimensions.get('window');
const EMOJIS = ['⭐', '✨', '🌟', '💫', '🎉', '⭐', '✨', '🌟'];

function Star({ emoji, delay, destX, destY, startX, startY }) {
  const x = useSharedValue(startX);
  const y = useSharedValue(startY);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 150 }));
    scale.value = withDelay(delay, withSpring(1.1, { damping: 8, stiffness: 180 }));
    x.value = withDelay(delay, withTiming(destX, { duration: 900, easing: Easing.out(Easing.quad) }));
    y.value = withDelay(delay, withTiming(destY, { duration: 900, easing: Easing.out(Easing.quad) }));

    // Fade out
    opacity.value = withDelay(delay + 500, withTiming(0, { duration: 450 }));
    scale.value = withDelay(delay + 500, withTiming(0.2, { duration: 450 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x.value,
    top: y.value,
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.Text style={[styles.emoji, style]}>{emoji}</Animated.Text>;
}

export default function StarBurst({ visible, originX, originY }) {
  if (!visible) return null;

  const ox = originX ?? W / 2;
  const oy = originY ?? H / 2;

  const stars = EMOJIS.map((emoji, i) => {
    const angle = (i / EMOJIS.length) * 2 * Math.PI;
    const dist = 80 + Math.random() * 100;
    return {
      emoji,
      delay: i * 55,
      startX: ox - 14,
      startY: oy - 14,
      destX: ox - 14 + Math.cos(angle) * dist,
      destY: oy - 14 + Math.sin(angle) * dist,
    };
  });

  return (
    <>
      {stars.map((s, i) => (
        <Star key={i} {...s} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  emoji: {
    fontSize: 26,
    zIndex: 100,
  },
});
