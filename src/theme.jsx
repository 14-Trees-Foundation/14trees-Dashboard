import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	custom: {
		color: {
			secondary: {
				purple: '#6166B8',
				red: '#C72542',
				orange: '#F94F25',
				pink: '#FEC8FE',
			},
			primary: {
				lightgreen: '#9BC53D',
				brown: '#573D1C',
				green: '#1F3625',
				blue: '#3C79BC',
			},
		},
	},
	palette: {
		primary: {
			light: '#9BC53D',
			main: '#3f50b5',
			dark: '#1F3625',
			contrastText: '#fff',
		},
	},
	typography: {
		fontFamily: 'Helvetica, Arial, Sans-Serif',
	},
	components: {
		MuiButton: {
			variants: [
				{
					props: { color: 'primary', variant: 'contained' },
					style: {
						backgroundColor: '#9BC53D',
						fontcolor: '#ffffff',
						fontSize: 18,
						minWidth: '100px',
						textTransform: 'none',
						borderRadius: '7px',
						'&:hover': {
							backgroundColor: '#1F3625',
							color: '#ffffff',
						},
					},
				},
				{
					props: { color: 'secondary', variant: 'contained' },
					style: {
						minWidth: '200px',
						borderRadius: '7px',
						backgroundColor: '#1F3625',
						color: '#9BC53D',
						border: '1px solid #dcdcdc',
						boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset',
						textTransform: 'none',
						'&:hover': {
							backgroundColor: '#9BC53D',
							color: '#ffffff',
						},
					},
				},
			],
		},
		MuiToggleButton: {
			styleOverrides: {
				root: {
					'&.Mui-selected': {
						backgroundColor: '#2e7d32d9',
						color: 'white',
						'&:hover': {
							backgroundColor: '#2e7d32',
						},
					},
				},
			},
		},
	},
});

export default theme;

export const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		background: {
			default: '#0f1912',
			paper: '#1a2820',
		},
		primary: {
			main: '#9bc53d',
			light: '#b8d96a',
			dark: '#7a9e2e',
			contrastText: '#fff',
		},
		secondary: {
			main: '#4caf6e',
			light: '#85e3b2',
			dark: '#3db876',
			contrastText: '#0f1912',
		},
		success: {
			main: '#4caf6e',
			light: '#85e3b2',
			dark: '#3db876',
		},
		warning: {
			main: '#e8a838',
			light: '#f5bb7a',
			dark: '#d4822a',
		},
		error: {
			main: '#e05252',
			light: '#f58585',
			dark: '#d43a3a',
		},
		text: {
			primary: '#e8ebe9',
			secondary: '#9ba39d',
			disabled: '#6b7a6e',
		},
		divider: '#2a3832',
	},
	typography: {
		fontFamily: 'Helvetica, Arial, Sans-Serif',
		h1: { fontWeight: 600, letterSpacing: '-0.02em' },
		h2: { fontWeight: 600, letterSpacing: '-0.02em' },
		h3: { fontWeight: 500, letterSpacing: '-0.01em' },
		h4: { fontWeight: 300, letterSpacing: '-0.02em' },
		h5: { fontWeight: 300, letterSpacing: '-0.02em' },
		h6: { fontWeight: 500, letterSpacing: '-0.01em', fontSize: '0.9rem' },
		body1: { fontSize: '0.875rem' },
		body2: { fontSize: '0.8rem' },
		caption: {
			fontSize: '0.7rem',
			letterSpacing: '0.06em',
			textTransform: 'uppercase',
		},
	},
	shape: {
		borderRadius: 10,
	},
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					background: '#1a2820',
					border: '1px solid #2a3832',
					boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
					borderRadius: '14px',
					transition: 'box-shadow 0.2s ease',
					'&:hover': {
						boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
					},
				},
			},
		},
		MuiCardContent: {
			styleOverrides: {
				root: {
					padding: '20px 22px',
					'&:last-child': { paddingBottom: '20px' },
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					background: '#1a2820',
					border: '1px solid #2a3832',
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: { borderColor: '#2a3832' },
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					fontSize: '0.7rem',
					height: '22px',
					fontWeight: 500,
					borderRadius: '6px',
				},
			},
		},
		MuiToggleButton: {
			styleOverrides: {
				root: {
					border: '1px solid #2a3832',
					borderRadius: '5px !important',
					padding: '4px 12px',
					fontSize: '0.7rem',
					color: '#9ba39d',
					'&.Mui-selected': {
						backgroundColor: '#2a3832',
						color: '#e8ebe9',
						fontWeight: 500,
						border: '1px solid #3a4a3d',
						'&:hover': {
							backgroundColor: 'rgba(255,255,255,0.14)',
						},
					},
					'&:hover': {
						backgroundColor: 'rgba(255,255,255,0.05)',
						color: 'rgba(255,255,255,0.7)',
					},
				},
			},
		},
		MuiToggleButtonGroup: {
			styleOverrides: {
				root: {
					backgroundColor: '#1f2f24',
					borderRadius: '7px',
					padding: '2px',
					gap: '1px',
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				head: {
					backgroundColor: 'transparent',
					color: '#6b7a6e',
					fontSize: '0.68rem',
					textTransform: 'uppercase',
					letterSpacing: '0.08em',
					fontWeight: 500,
					borderBottom: '1px solid #2a3832',
				},
				body: {
					color: '#e8ebe9',
					borderBottom: '1px solid #1f2f24',
					fontSize: '0.8rem',
				},
			},
		},
		MuiTableRow: {
			styleOverrides: {
				root: {
					'&:hover': {
						backgroundColor: '#1f2f24',
					},
					'&:last-child td': { borderBottom: 'none' },
				},
			},
		},
		MuiLinearProgress: {
			styleOverrides: {
				root: {
					backgroundColor: '#2a3832',
					borderRadius: '2px',
					height: '3px',
				},
			},
		},
		MuiDrawer: {
			styleOverrides: {
				paper: {
					backgroundImage: 'none',
					backgroundColor: '#1a2820',
					borderLeft: '1px solid #2a3832',
				},
			},
		},
		MuiSkeleton: {
			styleOverrides: {
				root: {
					backgroundColor: '#1f2f24',
					'&::after': {
						background:
							'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
					},
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					fontSize: '0.8rem',
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				notchedOutline: {
					borderColor: 'rgba(255,255,255,0.12)',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				outlined: {
					borderColor: 'rgba(255,255,255,0.15)',
					color: 'rgba(255,255,255,0.7)',
					'&:hover': {
						borderColor: 'rgba(255,255,255,0.3)',
						backgroundColor: 'rgba(255,255,255,0.05)',
					},
				},
			},
		},
	},
});

const lightAnalyticsShadows = [
	'none',
	'0 1px 4px rgba(0,0,0,0.06)',
	'0 2px 8px rgba(0,0,0,0.08)',
	'0 4px 12px rgba(0,0,0,0.1)',
	...Array(21).fill('none'),
];

export const lightAnalyticsTheme = createTheme({
	palette: {
		mode: 'light',
		background: {
			default: '#f5f3ee',
			paper: '#ffffff',
		},
		primary: {
			main: '#2d5a2d',
			light: '#8bc34a',
			dark: '#1c3a1c',
			contrastText: '#fff',
		},
		secondary: {
			main: '#8bc34a',
			light: '#c5e0a0',
			dark: '#5a8a3a',
			contrastText: '#fff',
		},
		success: {
			main: '#16a34a',
			light: '#4ade80',
			dark: '#15803d',
		},
		warning: {
			main: '#d97706',
			light: '#fbbf24',
			dark: '#b45309',
		},
		error: {
			main: '#dc2626',
			light: '#f87171',
			dark: '#b91c1c',
		},
		text: {
			primary: '#1a1a1a',
			secondary: '#6b7280',
			disabled: '#9ca3af',
		},
		divider: '#eeebe4',
	},
	typography: {
		fontFamily: 'Helvetica, Arial, Sans-Serif',
		h4: { fontWeight: 300, letterSpacing: '-0.02em' },
		h5: { fontWeight: 300, letterSpacing: '-0.02em' },
		h6: { fontWeight: 600, letterSpacing: '-0.01em', fontSize: '0.85rem' },
		body1: { fontSize: '0.875rem' },
		body2: { fontSize: '0.8rem' },
		caption: {
			fontSize: '0.68rem',
			letterSpacing: '0.06em',
			textTransform: 'uppercase',
		},
	},
	shape: { borderRadius: 16 },
	shadows: lightAnalyticsShadows,
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					border: '1px solid #eeebe4',
					boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
					borderRadius: '16px',
					transition: 'box-shadow 0.2s ease',
					'&:hover': {
						boxShadow: '0 4px 20px rgba(0,0,0,0.09)',
					},
				},
			},
		},
		MuiCardContent: {
			styleOverrides: {
				root: {
					padding: '20px 22px',
					'&:last-child': { paddingBottom: '20px' },
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: { borderColor: '#eeebe4' },
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					fontSize: '0.68rem',
					height: '22px',
					fontWeight: 500,
					borderRadius: '6px',
				},
			},
		},
		MuiToggleButton: {
			styleOverrides: {
				root: {
					border: '1px solid #d4d0c8',
					borderRadius: '20px !important',
					padding: '5px 16px',
					fontSize: '0.7rem',
					color: '#6b7280',
					backgroundColor: 'transparent',
					'&.Mui-selected': {
						backgroundColor: '#ffffff',
						color: '#1a1a1a',
						fontWeight: 500,
						border: '1px solid #1a1a1a',
						boxShadow: 'none',
						'&:hover': {
							backgroundColor: '#ffffff',
						},
					},
					'&:hover': {
						backgroundColor: 'rgba(26,26,26,0.04)',
						color: '#1a1a1a',
					},
				},
			},
		},
		MuiToggleButtonGroup: {
			styleOverrides: {
				root: {
					backgroundColor: 'transparent',
					borderRadius: '7px',
					padding: '0',
					gap: '4px',
					border: 'none',
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				head: {
					color: '#9ca3af',
					fontSize: '0.68rem',
					textTransform: 'uppercase',
					letterSpacing: '0.08em',
					fontWeight: 500,
					backgroundColor: 'transparent',
					borderBottom: '1px solid #eeebe4',
				},
				body: {
					color: '#1a1a1a',
					borderBottom: '1px solid #f5f3ee',
					fontSize: '0.8rem',
				},
			},
		},
		MuiTableRow: {
			styleOverrides: {
				root: {
					'&:hover': {
						backgroundColor: '#faf9f6',
					},
					'&:last-child td': { borderBottom: 'none' },
				},
			},
		},
		MuiLinearProgress: {
			styleOverrides: {
				root: {
					backgroundColor: '#f0ede6',
					borderRadius: '2px',
					height: '4px',
				},
			},
		},
		MuiDrawer: {
			styleOverrides: {
				paper: {
					backgroundImage: 'none',
					backgroundColor: '#ffffff',
					borderLeft: '1px solid #eeebe4',
					boxShadow: '-4px 0 16px rgba(0,0,0,0.08)',
				},
			},
		},
		MuiSkeleton: {
			styleOverrides: {
				root: {
					backgroundColor: '#f0ede6',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				outlined: {
					borderColor: '#dde1e7',
					color: '#64748b',
					'&:hover': {
						borderColor: '#94a3b8',
						backgroundColor: '#f8fafc',
					},
				},
			},
		},
	},
});

const eventFormComponentOverrides = {
	components: {
		MuiDialog: {
			styleOverrides: {
				paper: ({ theme }) => ({
					backgroundImage: 'none',
					backgroundColor: theme.palette.background.paper,
					border: `1px solid ${theme.palette.divider}`,
					borderRadius: '20px',
					boxShadow: '0 20px 60px rgba(0,0,0,0.16)',
				}),
			},
		},
		MuiDialogTitle: {
			styleOverrides: {
				root: ({ theme }) => ({
					paddingBottom: theme.spacing(1.5),
					color: theme.palette.text.primary,
					fontWeight: 700,
					letterSpacing: '-0.02em',
				}),
			},
		},
		MuiDialogContent: {
			styleOverrides: {
				root: ({ theme }) => ({
					paddingTop: theme.spacing(2),
					paddingBottom: theme.spacing(2),
				}),
			},
		},
		MuiDialogActions: {
			styleOverrides: {
				root: ({ theme }) => ({
					padding: theme.spacing(2),
					paddingTop: 0,
				}),
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: ({ theme }) => ({
					backgroundImage: 'none',
					backgroundColor: theme.palette.background.paper,
					border: `1px solid ${theme.palette.divider}`,
				}),
			},
		},
		MuiCard: {
			styleOverrides: {
				root: ({ theme }) => ({
					backgroundImage: 'none',
					backgroundColor: theme.palette.background.paper,
					border: `1px solid ${theme.palette.divider}`,
					borderRadius: '18px',
					boxShadow: 'none',
				}),
			},
		},
		MuiCardContent: {
			styleOverrides: {
				root: ({ theme }) => ({
					padding: theme.spacing(2),
					'&:last-child': { paddingBottom: theme.spacing(2) },
				}),
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderColor: theme.palette.divider,
				}),
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: ({ theme }) => ({
					backgroundColor: theme.palette.background.paper,
					borderRadius: '14px',
					'& fieldset': { borderColor: theme.palette.divider },
					'&:hover fieldset': { borderColor: theme.palette.text.secondary },
					'&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
				}),
				input: ({ theme }) => ({
					color: theme.palette.text.primary,
					fontSize: '0.9rem',
				}),
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: ({ theme }) => ({
					color: theme.palette.text.secondary,
					fontSize: '0.85rem',
				}),
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: ({ theme }) => ({
					marginLeft: 0,
					color: theme.palette.text.secondary,
					fontSize: '0.72rem',
				}),
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					borderRadius: '12px',
					fontWeight: 600,
				},
				contained: ({ theme }) => ({
					backgroundColor: theme.palette.primary.main,
					color: theme.palette.primary.contrastText,
					boxShadow: 'none',
					'&:hover': {
						backgroundColor: theme.palette.primary.dark,
						boxShadow: 'none',
					},
				}),
				outlined: ({ theme }) => ({
					borderColor: theme.palette.divider,
					color: theme.palette.text.secondary,
					'&:hover': {
						borderColor: theme.palette.primary.main,
						backgroundColor: theme.palette.action.hover,
					},
				}),
			},
		},
		MuiChip: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: '999px',
					fontSize: '0.68rem',
					height: '24px',
					fontWeight: 600,
					backgroundColor: theme.palette.action.hover,
				}),
			},
		},
		MuiSelect: {
			styleOverrides: {
				select: {
					fontSize: '0.9rem',
				},
			},
		},
	},
};

export const buildEventFormTheme = (mode = 'light') =>
	createTheme(
		mode === 'dark' ? darkTheme : lightAnalyticsTheme,
		eventFormComponentOverrides,
	);
