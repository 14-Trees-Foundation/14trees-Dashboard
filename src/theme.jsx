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
			default: '#0d0f14',
			paper: '#13161e',
		},
		primary: {
			main: '#7eb3f5',
			light: '#7fb3f5',
			dark: '#3a7ad4',
			contrastText: '#fff',
		},
		secondary: {
			main: '#5fd99a',
			light: '#85e3b2',
			dark: '#3db876',
			contrastText: '#0d0f14',
		},
		success: {
			main: '#5fd99a',
			light: '#85e3b2',
			dark: '#3db876',
		},
		warning: {
			main: '#f0a050',
			light: '#f5bb7a',
			dark: '#d4822a',
		},
		error: {
			main: '#f06060',
			light: '#f58585',
			dark: '#d43a3a',
		},
		text: {
			primary: '#f0f4ee',
			secondary: 'rgba(255,255,255,0.45)',
			disabled: 'rgba(255,255,255,0.2)',
		},
		divider: 'rgba(255,255,255,0.06)',
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
					border: '1px solid rgba(255,255,255,0.06)',
					borderRadius: '10px',
					transition: 'border-color 0.2s ease',
					'&:hover': {
						borderColor: 'rgba(255,255,255,0.12)',
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
					border: '1px solid rgba(255,255,255,0.06)',
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: { borderColor: 'rgba(255,255,255,0.06)' },
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					fontSize: '0.7rem',
					height: '22px',
					fontWeight: 500,
				},
			},
		},
		MuiToggleButton: {
			styleOverrides: {
				root: {
					border: 'none',
					borderRadius: '5px !important',
					padding: '4px 12px',
					fontSize: '0.7rem',
					color: 'rgba(255,255,255,0.3)',
					'&.Mui-selected': {
						backgroundColor: 'rgba(255,255,255,0.1)',
						color: '#fff',
						fontWeight: 500,
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
					backgroundColor: 'rgba(255,255,255,0.06)',
					borderRadius: '7px',
					padding: '2px',
					gap: '1px',
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				head: {
					color: 'rgba(255,255,255,0.25)',
					fontSize: '0.68rem',
					textTransform: 'uppercase',
					letterSpacing: '0.08em',
					fontWeight: 500,
					borderBottom: '1px solid rgba(255,255,255,0.06)',
				},
				body: {
					color: 'rgba(255,255,255,0.75)',
					borderBottom: '1px solid rgba(255,255,255,0.04)',
					fontSize: '0.8rem',
				},
			},
		},
		MuiTableRow: {
			styleOverrides: {
				root: {
					'&:hover': {
						backgroundColor: 'rgba(255,255,255,0.03)',
					},
					'&:last-child td': { borderBottom: 'none' },
				},
			},
		},
		MuiLinearProgress: {
			styleOverrides: {
				root: {
					backgroundColor: 'rgba(255,255,255,0.06)',
					borderRadius: '2px',
					height: '3px',
				},
			},
		},
		MuiDrawer: {
			styleOverrides: {
				paper: {
					backgroundImage: 'none',
					backgroundColor: '#0d0f14',
					borderLeft: '1px solid rgba(255,255,255,0.08)',
				},
			},
		},
		MuiSkeleton: {
			styleOverrides: {
				root: {
					backgroundColor: 'rgba(255,255,255,0.06)',
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
			default: '#e8ecf0',
			paper: '#ffffff',
		},
		primary: {
			main: '#4b83d4',
			light: '#7eb3f5',
			dark: '#2d5fa8',
			contrastText: '#fff',
		},
		secondary: {
			main: '#059669',
			light: '#34d399',
			dark: '#047857',
			contrastText: '#fff',
		},
		success: {
			main: '#059669',
			light: '#34d399',
			dark: '#047857',
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
			primary: '#0f172a',
			secondary: '#64748b',
			disabled: '#94a3b8',
		},
		divider: '#dde1e7',
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
	shape: { borderRadius: 10 },
	shadows: lightAnalyticsShadows,
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					border: '1px solid #dde1e7',
					boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
					transition: 'box-shadow 0.2s ease',
					'&:hover': {
						boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
				root: { borderColor: '#dde1e7' },
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					fontSize: '0.68rem',
					height: '22px',
					fontWeight: 500,
				},
			},
		},
		MuiToggleButton: {
			styleOverrides: {
				root: {
					border: 'none',
					borderRadius: '5px !important',
					padding: '4px 12px',
					fontSize: '0.7rem',
					color: '#94a3b8',
					'&.Mui-selected': {
						backgroundColor: '#ffffff',
						color: '#0f172a',
						fontWeight: 500,
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
						'&:hover': {
							backgroundColor: '#ffffff',
						},
					},
					'&:hover': {
						backgroundColor: 'rgba(0,0,0,0.03)',
						color: '#0f172a',
					},
				},
			},
		},
		MuiToggleButtonGroup: {
			styleOverrides: {
				root: {
					backgroundColor: '#f1f5f9',
					borderRadius: '7px',
					padding: '2px',
					gap: '1px',
					border: '1px solid #e2e8f0',
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				head: {
					color: '#94a3b8',
					fontSize: '0.68rem',
					textTransform: 'uppercase',
					letterSpacing: '0.08em',
					fontWeight: 500,
					borderBottom: '1px solid #dde1e7',
					backgroundColor: '#ffffff',
				},
				body: {
					color: '#334155',
					borderBottom: '1px solid #f1f5f9',
					fontSize: '0.8rem',
				},
			},
		},
		MuiTableRow: {
			styleOverrides: {
				root: {
					'&:hover': {
						backgroundColor: '#f8fafc',
					},
					'&:last-child td': { borderBottom: 'none' },
				},
			},
		},
		MuiLinearProgress: {
			styleOverrides: {
				root: {
					backgroundColor: '#f1f5f9',
					borderRadius: '2px',
					height: '3px',
				},
			},
		},
		MuiDrawer: {
			styleOverrides: {
				paper: {
					backgroundImage: 'none',
					backgroundColor: '#ffffff',
					borderLeft: '1px solid #dde1e7',
					boxShadow: '-4px 0 16px rgba(0,0,0,0.08)',
				},
			},
		},
		MuiSkeleton: {
			styleOverrides: {
				root: {
					backgroundColor: '#f1f5f9',
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
