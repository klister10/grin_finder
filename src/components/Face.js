import React from 'react';
import Svg, { Circle, Path, Ellipse } from 'react-native-svg';

// All coordinates in 0–100 viewBox space.
const EXPRESSIONS = {
  happy: {
    leftBrow: 'M 23,30 Q 33,21 43,27',
    rightBrow: 'M 57,27 Q 67,21 77,30',
    mouth: 'M 27,61 Q 50,84 73,61',
    blush: true,
    squintEyes: true,
  },
  angry: {
    leftBrow: 'M 23,28 L 43,36',
    rightBrow: 'M 57,36 L 77,28',
    mouth: 'M 32,72 Q 50,59 68,72',
    blush: false,
    squintEyes: false,
  },
  sad: {
    leftBrow: 'M 23,36 L 43,28',
    rightBrow: 'M 57,28 L 77,36',
    mouth: 'M 32,70 Q 50,60 68,70',
    blush: false,
    squintEyes: false,
  },
  disgusted: {
    leftBrow: 'M 23,30 L 43,34',
    rightBrow: 'M 57,26 L 77,28',
    mouth: 'M 28,67 Q 40,61 52,64 Q 65,67 72,70',
    blush: false,
    squintEyes: false,
  },
  stern: {
    leftBrow: 'M 23,32 L 43,32',
    rightBrow: 'M 57,32 L 77,32',
    mouth: 'M 33,66 Q 50,63 67,66',
    blush: false,
    squintEyes: false,
  },
  contempt: {
    leftBrow: 'M 23,30 L 43,30',
    rightBrow: 'M 57,27 L 77,25',
    mouth: 'M 28,67 Q 44,67 52,62 Q 62,66 72,67',
    blush: false,
    squintEyes: false,
  },
};

export default function Face({ type = 'happy', skinTone = '#FFD580', size = 80 }) {
  const expr = EXPRESSIONS[type] ?? EXPRESSIONS.happy;
  const isHappy = type === 'happy';
  const browColor = isHappy ? '#8B5E3C' : '#444';
  const mouthColor = isHappy ? '#C04A00' : '#555';

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Drop shadow */}
      <Circle cx="51" cy="53" r="43" fill="rgba(0,0,0,0.09)" />
      {/* Head */}
      <Circle cx="50" cy="50" r="43" fill={skinTone} />

      {/* Blush cheeks */}
      {expr.blush && (
        <>
          <Ellipse cx="22" cy="61" rx="11" ry="7" fill="rgba(255,110,110,0.42)" />
          <Ellipse cx="78" cy="61" rx="11" ry="7" fill="rgba(255,110,110,0.42)" />
        </>
      )}

      {/* Eyes */}
      {expr.squintEyes ? (
        <>
          {/* Happy squinting arc eyes */}
          <Path
            d="M 29,43 Q 34,36 39,43"
            stroke="#333"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M 61,43 Q 66,36 71,43"
            stroke="#333"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <Circle cx="34" cy="42" r="5" fill="#333" />
          <Circle cx="66" cy="42" r="5" fill="#333" />
          {/* Highlights */}
          <Circle cx="36" cy="40" r="1.8" fill="white" />
          <Circle cx="68" cy="40" r="1.8" fill="white" />
        </>
      )}

      {/* Eyebrows */}
      <Path
        d={expr.leftBrow}
        stroke={browColor}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d={expr.rightBrow}
        stroke={browColor}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Mouth */}
      <Path
        d={expr.mouth}
        stroke={mouthColor}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
