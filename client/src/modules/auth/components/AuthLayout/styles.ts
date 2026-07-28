import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import type { AsElement } from '@/shared/types/styled'


const editorialMeasure = 720

export const Split = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  height: '100vh',
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: '1.1fr 1fr',

  [theme.breakpoints.down('md')]: {
    height: 'auto',
    overflow: 'visible',
    gridTemplateColumns: '1fr',
  },
}))

export const Editorial = styled(Stack)<AsElement>(({ theme }) => ({
  justifyContent: 'space-between',
  gap: theme.spacing(6),
  overflowY: 'auto',
  padding: '56px clamp(48px, 4vw, 72px)',
  borderRight: `1px solid ${theme.tracely.border('hairline')}`,

  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}))

export const Hero = styled(Box)({
  maxWidth: editorialMeasure,
})

export const HeroAccent = styled('em')(({ theme }) => ({
  fontStyle: 'italic',
  color: theme.tracely.colors.accent,
}))

export const HeroSub = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkSoft,
  maxWidth: 560,
  margin: '26px 0 0',
}))

export const Specimen = styled(Box)<AsElement>(({ theme }) => ({
  maxWidth: editorialMeasure,
  border: `1px solid ${theme.tracely.border('faint')}`,
  borderRadius: theme.tracely.radius.cardLarge,
  background: theme.tracely.surfaceTint(0.015),
  padding: '26px 30px 24px',
  margin: 0,
}))

export const SpecimenLabel = styled(Typography)(({ theme }) => ({
  display: 'block',
  color: theme.tracely.colors.accentDim,
}))

export const SpecimenQuote = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(17px, 1.05vw, 19.5px)',
  lineHeight: 1.6,
  color: theme.tracely.colors.inkQuiet,
  margin: '16px 0 0',

  '& + &': {
    color: theme.tracely.colors.inkDim,
    marginTop: 14,
  },
}))

export const SpecimenFooter = styled(Stack)<AsElement>(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 11,
  marginTop: 22,
  paddingTop: 18,
  borderTop: `1px solid ${theme.tracely.border('hairline')}`,
}))

export const SpecimenDot = styled(Box)(({ theme }) => ({
  width: 6,
  height: 6,
  flexShrink: 0,
  borderRadius: '50%',
  background: theme.tracely.colors.accent,
}))

export const SpecimenMeta = styled(Typography)<AsElement>(({ theme }) => ({
  fontStyle: 'normal',
  color: theme.tracely.colors.inkFainter,
}))

export const Panel = styled(Stack)<AsElement>(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  overflowY: 'auto',
  padding: '56px clamp(32px, 3vw, 64px)',

  [theme.breakpoints.down('md')]: {
    overflowY: 'visible',
    minHeight: '100vh',
  },

  [theme.breakpoints.down('sm')]: {
    padding: '40px 24px',
  },
}))

export const PanelInner = styled(Box)({
  width: '100%',
  maxWidth: 440,
})

export const MobileBrand = styled(Box)(({ theme }) => ({
  display: 'none',
  marginBottom: 40,

  [theme.breakpoints.down('md')]: {
    display: 'block',
  },
}))

export const PanelHeader = styled(Box)({
  marginBottom: 34,
})

export const PanelEyebrow = styled(Typography)({
  display: 'block',
  marginBottom: 14,
})

export const PanelTitle = styled(Typography)(({ theme }) => ({
  fontFamily: theme.tracely.fonts.serif,
  fontWeight: 300,
  fontSize: 'clamp(32px, 2.1vw, 38px)',
  lineHeight: 1.1,
  letterSpacing: '-0.015em',
  color: theme.tracely.colors.inkStrong,
  margin: 0,
}))

export const PanelSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(17px, 1.1vw, 19px)',
  color: theme.tracely.colors.inkMuted,
  margin: '12px 0 0',
}))

export const PanelFooter = styled(Box)(({ theme }) => ({
  marginTop: 26,
  paddingTop: 22,
  borderTop: `1px solid ${theme.tracely.border('hairline')}`,
}))

export const Terms = styled(Typography)(({ theme }) => ({
  color: theme.tracely.colors.inkFaintest,
  margin: '22px 0 0',
}))
