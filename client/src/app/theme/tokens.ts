export const fonts = {
  sans: "'IBM Plex Sans', system-ui, -apple-system, sans-serif",
  serif: "'Newsreader', Georgia, 'Times New Roman', serif",
  mono: "'JetBrains Mono', ui-monospace, 'Source Code Pro', monospace",
} as const


export const colors = {
  canvas: '#0d0c0b',
  surface: '#141210',
  surfaceRaised: '#2a2622',

  inkStrong: '#F4F2EC',
  ink: '#ECEAE3',
  inkProse: '#d3cabf',
  inkQuiet: '#c4bcb1',
  inkSoft: '#b5ada3',
  inkMuted: '#a89f95',
  inkDim: '#8f8880',
  inkFaint: '#7a736a',
  inkFainter: '#6b655d',
  inkFaintest: '#5f594f',

  accent: '#d6a35a',
  accentBright: '#e6bd82',
  accentPale: '#c9b48c',
  accentDim: '#a4813f',

  success: '#7db07d',
  danger: '#c98b5a',
} as const


export const borderAlpha = {
  hairline: 0.07,
  faint: 0.08,
  subtle: 0.09,
  soft: 0.1,
  default: 0.12,
  medium: 0.13,
  strong: 0.16,
  stronger: 0.18,
} as const


export const radius = {
  sm: 6,
  input: 8,
  button: 9,
  panel: 11,
  card: 13,
  cardLarge: 14,
  pill: 20,
} as const


export const glow = {
  accentStrong: '0 0 16px rgba(214, 163, 90, 0.7)',
  accent: '0 0 14px rgba(214, 163, 90, 0.7)',
  accentSoft: '0 0 10px rgba(214, 163, 90, 0.7)',
} as const


export const transition = {
  fast: 'all .15s',
} as const
