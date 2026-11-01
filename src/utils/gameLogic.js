export const DISTRACTOR_TYPES = ['angry', 'sad', 'disgusted', 'stern', 'contempt'];

export const SKIN_TONES = [
  '#FFCB8E',
  '#F5A57A',
  '#E8976B',
  '#D4875C',
  '#C8735A',
  '#A3562C',
];

export function generateRound(count = 16) {
  const targetIndex = Math.floor(Math.random() * count);
  const stamp = Date.now();
  const faces = Array.from({ length: count }, (_, i) => {
    const skinTone = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)];
    if (i === targetIndex) {
      return { type: 'happy', skinTone, key: `${stamp}-${i}` };
    }
    const type = DISTRACTOR_TYPES[Math.floor(Math.random() * DISTRACTOR_TYPES.length)];
    return { type, skinTone, key: `${stamp}-${i}` };
  });
  return { faces, targetIndex };
}
