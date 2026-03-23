export const ANALYTICS_COLORS = {
	accent: '#9bc53d',
	accentDark: '#1a2820',
	textOnDark: '#e8ebe9',
	textMuted: '#9ba39d',
	pageBg: '#0f1912',
	cardBg: '#1a2820',
	cardBorder: '#2a3832',
	corporate: '#9bc53d',
	personal: '#4caf6e',
	warning: '#e8a838',
	treeBrown: '#a07840',
	website: '#9bc53d',
	manual: '#4caf6e',
	chartGrid: '#1f2f24',
	chartAxis: '#4a5a4d',
	tooltipBg: '#1a2820',
	tooltipBorder: '#2a3832',
	chartColors: [
		'#9bc53d',
		'#4caf6e',
		'#2d8a4e',
		'#1a5c34',
		'#6b9e2e',
		'#b8d96a',
		'#9ba39d',
	],
} as const;

export const analyticsCardSx = {
	backgroundImage: 'none',
	backgroundColor: ANALYTICS_COLORS.cardBg,
	border: `1px solid ${ANALYTICS_COLORS.cardBorder}`,
	color: ANALYTICS_COLORS.textOnDark,
};

export const analyticsSectionTitleSx = {
	fontWeight: 500,
	letterSpacing: '-0.01em',
};

export const analyticsLabelSx = {
	fontSize: '0.68rem',
	textTransform: 'uppercase' as const,
	letterSpacing: '0.08em',
	fontWeight: 500,
	color: ANALYTICS_COLORS.textMuted,
};

export const analyticsCardLabelSx = {
	...analyticsLabelSx,
};

export const analyticsCardTitleSx = {
	fontWeight: 600,
	letterSpacing: '-0.01em',
	color: ANALYTICS_COLORS.textOnDark,
};

export const analyticsCardValueSx = {
	fontWeight: 700,
	color: ANALYTICS_COLORS.textOnDark,
};

export const analyticsCardSecondaryTextSx = {
	fontSize: '0.8rem',
	color: ANALYTICS_COLORS.textMuted,
};

export const analyticsPageSx = {
	minHeight: '100vh',
	backgroundColor: ANALYTICS_COLORS.pageBg,
	padding: '24px',
	borderRadius: 0,
};

export const CHART_TOOLTIP = {
	backgroundColor: '#1a2820',
	borderColor: '#2a3832',
	borderWidth: 1,
	titleColor: '#e8ebe9',
	bodyColor: '#9ba39d',
	padding: 12,
	cornerRadius: 10,
};

export const LIGHT_ANALYTICS_COLORS = {
	...ANALYTICS_COLORS,
	cardBg: '#ffffff',
	cardBorder: '#eeebe4',
	pageBg: '#f5f3ee',
	textOnDark: '#1a1a1a',
	textMuted: '#6b7280',
	accent: '#8bc34a',
	accentDark: '#2d5a2d',
	corporate: '#2d5a2d',
	personal: '#8bc34a',
	warning: '#d97706',
	website: '#2d5a2d',
	manual: '#8bc34a',
	chartGrid: '#f0ede6',
	chartAxis: '#c5bfb3',
	tooltipBg: '#ffffff',
	tooltipBorder: '#eeebe4',
	chartColors: [
		'#1c3a1c',
		'#2d5a2d',
		'#5a8a3a',
		'#8bc34a',
		'#c5e0a0',
		'#e8f5d0',
		'#6b7280',
	],
} as const;

export const LIGHT_CHART_TOOLTIP = {
	...CHART_TOOLTIP,
	backgroundColor: '#ffffff',
	border: '1px solid #eeebe4',
	borderColor: '#eeebe4',
	borderWidth: 1,
	borderRadius: 10,
	titleColor: '#1a1a1a',
	bodyColor: '#6b7280',
	padding: 12,
	cornerRadius: 10,
};
