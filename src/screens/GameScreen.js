import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, Dimensions, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import FaceCard from '../components/FaceCard';
import StarBurst from '../components/StarBurst';
import { generateRound } from '../utils/gameLogic';

const GAP = 8;
const PADDING = 16;
const COLS = 4;

const HEADER_HEIGHT = 56; // paddingVertical 14×2 + ~28px text
const GRID_PADDING_TOP = 8;

export default function GameScreen({ onGoHome }) {
  const { width, height } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const faceSize = Math.floor((width - PADDING * 2 - GAP * (COLS - 1)) / COLS);

  const availableHeight = height - insets.top - insets.bottom - HEADER_HEIGHT - GRID_PADDING_TOP;
  const numRows = Math.max(1, Math.floor(availableHeight / (faceSize + GAP)));
  const totalFaces = numRows * COLS;

  const [round, setRound] = useState(() => generateRound(totalFaces));
  const [roundKey, setRoundKey] = useState(() => Date.now());
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'found' | 'wrong'
  const [wrongIndex, setWrongIndex] = useState(null);
  const [showBurst, setShowBurst] = useState(false);
  const [burstOrigin, setBurstOrigin] = useState({ x: 0, y: 0 });

  const scoreScale = useSharedValue(1);
  const foundBannerY = useSharedValue(60);
  const foundBannerOpacity = useSharedValue(0);

  const handleFacePress = useCallback(
    (index, pageX, pageY) => {
      if (gameState !== 'playing') return;

      if (index === round.targetIndex) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setGameState('found');
        setScore((s) => s + 1);

        // Score bounce
        scoreScale.value = withSequence(
          withSpring(1.55, { damping: 5, stiffness: 200 }),
          withSpring(1, { damping: 8 }),
        );

        // Found banner slides in
        foundBannerY.value = withSpring(0, { damping: 12, stiffness: 180 });
        foundBannerOpacity.value = withTiming(1, { duration: 200 });

        // Star burst
        setBurstOrigin({ x: pageX, y: pageY });
        setShowBurst(true);
        setTimeout(() => setShowBurst(false), 1200);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setWrongIndex(index);
        setGameState('wrong');
        setTimeout(() => {
          setWrongIndex(null);
          setGameState('playing');
        }, 700);
      }
    },
    [gameState, round.targetIndex],
  );

  const handleNextRound = useCallback(() => {
    foundBannerY.value = withTiming(60, { duration: 180 });
    foundBannerOpacity.value = withTiming(0, { duration: 180 });

    setTimeout(() => {
      setLevel((l) => l + 1);
      const next = generateRound(totalFaces);
      setRound(next);
      setRoundKey(Date.now());
      setGameState('playing');
      setWrongIndex(null);
    }, 200);
  }, []);

  const getFaceState = useCallback(
    (i) => {
      if (gameState === 'found') {
        return i === round.targetIndex ? 'won' : 'other-won';
      }
      if (gameState === 'wrong' && i === wrongIndex) return 'wrong';
      return 'idle';
    },
    [gameState, round.targetIndex, wrongIndex],
  );

  const scoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  const foundBannerStyle = useAnimatedStyle(() => ({
    opacity: foundBannerOpacity.value,
    transform: [{ translateY: foundBannerY.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onGoHome} style={styles.homeBtn}>
          <Text style={styles.homeBtnText}>←</Text>
        </Pressable>
        <Text style={styles.levelText}>Level {level}</Text>
        <Animated.View style={[styles.scoreWrapper, scoreStyle]}>
          <Text style={styles.scoreText}>{score}</Text>
          <Text style={styles.scoreLabel}> found</Text>
        </Animated.View>
      </View>

      {/* 4×4 face grid */}
      <View style={styles.grid}>
        {round.faces.map((face, i) => {
          // Calculate approximate screen position of face center for burst origin
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const approxX = PADDING + col * (faceSize + GAP) + faceSize / 2;
          const approxY = 100 + row * (faceSize + GAP) + faceSize / 2; // 100 = header height approx

          return (
            <FaceCard
              key={face.key}
              face={face}
              index={i}
              size={faceSize}
              onPress={() => handleFacePress(i, approxX, approxY)}
              state={getFaceState(i)}
              roundKey={roundKey}
            />
          );
        })}
      </View>

      {/* Found banner */}
      <Animated.View style={[styles.foundBanner, foundBannerStyle]}>
        <Text style={styles.foundEmoji}>🎉</Text>
        <Text style={styles.foundText}>You found it!</Text>
        <Button
          mode="contained"
          onPress={handleNextRound}
          style={styles.nextBtn}
          contentStyle={styles.nextBtnContent}
          labelStyle={styles.nextBtnLabel}
        >
          Next Round →
        </Button>
      </Animated.View>

      {/* Star burst particles (absolute overlay) */}
      {showBurst && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <StarBurst visible originX={burstOrigin.x} originY={burstOrigin.y} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  homeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtnText: {
    fontSize: 26,
    color: 'rgba(255,255,255,0.5)',
  },
  levelText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  scoreWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFD60A',
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    paddingHorizontal: PADDING,
    paddingTop: 8,
    justifyContent: 'center',
  },
  foundBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E2A3A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  foundEmoji: {
    fontSize: 48,
  },
  foundText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  nextBtn: {
    borderRadius: 28,
    backgroundColor: '#FFD60A',
    marginTop: 4,
    shadowColor: '#FFD60A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  nextBtnContent: {
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  nextBtnLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A2E',
  },
});
