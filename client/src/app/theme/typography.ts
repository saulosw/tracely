import type { TypographyVariantsOptions } from '@mui/material/styles'

import { colors, fonts } from './tokens'


export const typography: TypographyVariantsOptions = {
  fontFamily: fonts.sans,
  fontSize: 15,

  display: {
    fontFamily: fonts.serif,
    fontWeight: 300,
    fontSize: 'clamp(38px, 3.2vw, 64px)',
    lineHeight: 1.05,
    letterSpacing: '-0.015em',
    color: colors.inkStrong,
  },
  pageTitle: {
    fontFamily: fonts.serif,
    fontWeight: 300,
    fontSize: 'clamp(32px, 2.4vw, 44px)',
    lineHeight: 1.1,
    letterSpacing: '-0.01em',
    color: colors.inkStrong,
  },
  wordmark: {
    fontFamily: fonts.serif,
    fontWeight: 400,
    letterSpacing: '-0.01em',
    color: colors.inkStrong,
  },
  lead: {
    fontFamily: fonts.serif,
    fontWeight: 300,
    fontSize: 'clamp(17px, 1.15vw, 21px)',
    lineHeight: 1.5,
  },
  quote: {
    fontFamily: fonts.serif,
    fontStyle: 'italic',
    fontWeight: 300,
    fontSize: 'clamp(16px, 0.98vw, 18px)',
    lineHeight: 1.55,
  },
  sectionTitle: {
    fontFamily: fonts.sans,
    fontWeight: 600,
    fontSize: '15px',
    letterSpacing: '0.01em',
  },
  label: {
    fontFamily: fonts.sans,
    fontWeight: 400,
    fontSize: '13px',
    lineHeight: 1.4,
  },
  meta: {
    fontFamily: fonts.mono,
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: 1.4,
  },
  fine: {
    fontFamily: fonts.sans,
    fontWeight: 400,
    fontSize: '12.5px',
    lineHeight: 1.6,
  },

  body1: {
    fontSize: '15px',
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '13.5px',
    lineHeight: 1.5,
  },
}
