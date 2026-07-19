import type { Components, Theme } from '@mui/material/styles'


export const components: Components<Omit<Theme, 'components'>> = {
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        display: 'h1',
        pageTitle: 'h1',
        wordmark: 'span',
        lead: 'p',
        quote: 'p',
        sectionTitle: 'h2',
        label: 'span',
        meta: 'span',
        fine: 'p',
      },
    },
  },

  MuiButton: {
    defaultProps: {
      variant: 'outline',
      disableElevation: true,
      disableRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        minWidth: 0,
        padding: '14px 20px',
        borderRadius: theme.tracely.radius.button,
        fontFamily: theme.tracely.fonts.sans,
        fontSize: 15,
        fontWeight: 500,
        lineHeight: 1.2,
        textTransform: 'none',
        transition: theme.tracely.transition.fast,

        '&.Mui-disabled': {
          opacity: 0.5,
        },
      }),
    },
    variants: [
      {
        props: { variant: 'outline' },
        style: ({ theme }) => ({
          background: 'transparent',
          color: theme.tracely.colors.ink,
          border: `1px solid ${theme.tracely.border('stronger')}`,

          '&:hover': {
            background: 'transparent',
            borderColor: theme.tracely.accentTint(0.6),
          },
        }),
      },
      {
        props: { variant: 'solid' },
        style: ({ theme }) => ({
          background: theme.tracely.colors.ink,
          color: theme.tracely.colors.surface,
          border: 'none',

          '&:hover': {
            background: '#fff',
          },
        }),
      },
    ],
  },

  MuiFormControl: {
    defaultProps: {
      fullWidth: true,
    },
  },

  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.label,
        color: theme.tracely.colors.inkDim,

        '&.Mui-focused, &.Mui-error': {
          color: theme.tracely.colors.inkDim,
        },
      }),
    },
  },

  MuiInputBase: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: '100%',
        background: theme.tracely.colors.surface,
        border: `1px solid ${theme.tracely.border('default')}`,
        borderRadius: theme.tracely.radius.input,
        padding: '13px 15px',
        fontFamily: theme.tracely.fonts.sans,
        fontSize: 15,
        lineHeight: 1.4,
        color: theme.tracely.colors.ink,
        transition: theme.tracely.transition.fast,

        '&.Mui-focused': {
          borderColor: theme.tracely.accentTint(0.6),
        },

        '&.Mui-error': {
          borderColor: theme.tracely.colors.danger,
        },
      }),
      input: ({ theme }) => ({
        padding: 0,
        height: 'auto',

        '&::placeholder': {
          color: theme.tracely.colors.inkFaintest,
          opacity: 1,
        },
      }),
    },
  },

  MuiFormHelperText: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...theme.typography.fine,
        color: theme.tracely.colors.inkFaint,
        margin: '7px 0 0',

        '&.Mui-error': {
          color: theme.tracely.colors.danger,
        },
      }),
    },
  },

  MuiLink: {
    defaultProps: {
      underline: 'none',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.tracely.colors.accent,
        transition: theme.tracely.transition.fast,

        '&:hover': {
          color: theme.tracely.colors.accentBright,
        },
      }),
    },
  },
}
