import type { Theme } from '@mui/material/styles'


export const globalStyles = (theme: Theme) => ({
  '*, *::before, *::after': {
    boxSizing: 'border-box' as const,
  },
  'html, body, #root': {
    height: '100%',
  },
  body: {
    margin: 0,
    backgroundColor: theme.tracely.colors.canvas,
    color: theme.tracely.colors.ink,
    fontFamily: theme.tracely.fonts.sans,
    WebkitFontSmoothing: 'antialiased',
  },
  a: {
    color: theme.tracely.colors.accent,
    textDecoration: 'none',
    '&:hover': {
      color: theme.tracely.colors.accentBright,
    },
  },
  '::selection': {
    background: theme.tracely.accentTint(0.25),
    color: '#fff',
  },
  '*': {
    scrollbarWidth: 'thin' as const,
    scrollbarColor: `${theme.tracely.accentTint(0.55)} transparent`,
  },
  '::-webkit-scrollbar': {
    width: 10,
    height: 10,
  },
  '::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '::-webkit-scrollbar-thumb': {
    background: theme.tracely.accentTint(0.55),
    borderRadius: 999,
    border: '2px solid transparent',
    backgroundClip: 'content-box',
  },
  '::-webkit-scrollbar-thumb:hover': {
    background: theme.tracely.colors.accent,
    backgroundClip: 'content-box',
    border: '2px solid transparent',
  },
  '::-webkit-scrollbar-corner': {
    background: 'transparent',
  },
  'input, textarea': {
    fontFamily: 'inherit',
  },
})
