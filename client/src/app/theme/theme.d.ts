import type { CSSProperties } from 'react'

import type { borderAlpha, chart, colors, fonts, glow, radius, transition } from './tokens'


interface TracelyTokens {
  fonts: typeof fonts
  colors: typeof colors
  radius: typeof radius
  chart: typeof chart
  glow: typeof glow
  transition: typeof transition
  border: {
    (level?: keyof typeof borderAlpha): string
    alpha: typeof borderAlpha
  }
  surfaceTint: (opacity: number) => string
  accentTint: (opacity: number) => string
}

declare module '@mui/material/styles' {
  interface Theme {
    tracely: TracelyTokens
  }

  interface ThemeOptions {
    tracely?: TracelyTokens
  }

  interface TypographyVariants {
    display: CSSProperties
    pageTitle: CSSProperties
    wordmark: CSSProperties
    lead: CSSProperties
    quote: CSSProperties
    sectionTitle: CSSProperties
    label: CSSProperties
    meta: CSSProperties
    eyebrow: CSSProperties
    fine: CSSProperties
  }

  interface TypographyVariantsOptions {
    display?: CSSProperties
    pageTitle?: CSSProperties
    wordmark?: CSSProperties
    lead?: CSSProperties
    quote?: CSSProperties
    sectionTitle?: CSSProperties
    label?: CSSProperties
    meta?: CSSProperties
    eyebrow?: CSSProperties
    fine?: CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display: true
    pageTitle: true
    wordmark: true
    lead: true
    quote: true
    sectionTitle: true
    label: true
    meta: true
    eyebrow: true
    fine: true
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    outline: true
    solid: true
  }
}
