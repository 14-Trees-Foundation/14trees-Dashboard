export const ANALYTICS_COLORS = {
	accent: '#9BC53D',
	accentDark: '#122018',
	textOnDark: '#f0f4ee',
	textMuted: 'rgba(244, 246, 251, 0.6)',
	pageBg: '#0d0f14',
	cardBg: '#13161e',
	cardBorder: 'rgba(255, 255, 255, 0.08)',
	corporate: '#286cc4',
	personal: '#5fd99a',
	warning: '#f0a050',
	treeBrown: '#a07840',
	website: '#5b9cf0',
	manual: '#5fd99a',
	chartGrid: 'rgba(255, 255, 255, 0.05)',
	chartAxis: 'rgba(255, 255, 255, 0.22)',
	tooltipBg: '#1a1d27',
	tooltipBorder: 'rgba(255, 255, 255, 0.12)',
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
	backgroundColor: ANALYTICS_COLORS.tooltipBg,
	border: `1px solid ${ANALYTICS_COLORS.tooltipBorder}`,
	borderRadius: 8,
	titleColor: 'rgba(255,255,255,0.8)',
	bodyColor: 'rgba(255,255,255,0.45)',
	padding: 10,
};

export const LIGHT_ANALYTICS_COLORS = {
	...ANALYTICS_COLORS,
	textOnDark: '#0f172a',
	textMuted: '#64748b',
	accent: '#4b83d4',
	accentDark: '#2d5fa8',
	cardBg: '#ffffff',
	cardBorder: '#dde1e7',
	pageBg: '#e8ecf0',
	corporate: '#4b83d4',
	personal: '#059669',
	warning: '#d97706',
	website: '#4b83d4',
	manual: '#059669',
	chartGrid: '#f8fafc',
	chartAxis: '#cbd5e1',
	tooltipBg: '#ffffff',
	tooltipBorder: '#e2e8f0',
} as const;

export const LIGHT_CHART_TOOLTIP = {
	...CHART_TOOLTIP,
	backgroundColor: '#ffffff',
	border: '1px solid #e2e8f0',
	borderColor: '#e2e8f0',
	borderWidth: 1,
	borderRadius: 8,
	titleColor: '#0f172a',
	bodyColor: '#64748b',
	padding: 10,
};
