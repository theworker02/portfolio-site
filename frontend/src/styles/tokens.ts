export const designTokens = {
  colors: {
    background: '#05070B',
    backgroundSoft: '#0A0D14',
    backgroundElevated: '#10131B',
    primary: '#2997FF',
    accent: '#8B5CF6',
    cyan: '#38BDF8',
    text: '#F5F5F7',
    textMuted: 'rgba(245, 245, 247, 0.72)',
    textSoft: 'rgba(245, 245, 247, 0.46)',
    line: 'rgba(255, 255, 255, 0.1)',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  radius: {
    pill: '999px',
    card: '2rem',
    panel: '2.5rem',
  },
  motion: {
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    page: 0.44,
    reveal: 0.42,
    hover: 0.24,
    fast: 0.18,
    pulse: 1.8,
  },
};

export const motionTokens = designTokens.motion;
