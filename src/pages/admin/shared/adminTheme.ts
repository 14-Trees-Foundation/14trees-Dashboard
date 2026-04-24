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

// ─── Form design tokens ───────────────────────────────────────────────────────
// Shared by all admin forms (Add/Edit dialogs). Mirror lightAnalyticsTheme values
// so forms feel visually consistent with the analytics pages.

export const FORM_COLORS = {
	dialogBg: '#ffffff',
	sectionBg: '#fafaf8',
	border: '#e8e4dc',
	borderFocus: '#2d5a2d',
	accent: '#2d5a2d',
	accentLight: '#8bc34a',
	textPrimary: '#1a1a1a',
	textSecondary: '#4b5563',
	textMuted: '#9ca3af',
	stepActive: '#2d5a2d',
	stepCompleted: '#8bc34a',
	stepInactive: '#e5e7eb',
	fieldBg: '#ffffff',
	errorRed: '#dc2626',
	chipBg: '#f0fdf4',
	chipBorder: '#bbf7d0',
} as const;

export const formLabelSx = {
	fontSize: '0.68rem',
	fontWeight: 600,
	textTransform: 'uppercase' as const,
	letterSpacing: '0.07em',
	color: FORM_COLORS.textMuted,
	mb: 0.5,
	display: 'block',
};

export const formSectionTitleSx = {
	fontSize: '0.88rem',
	fontWeight: 600,
	color: FORM_COLORS.textPrimary,
	letterSpacing: '-0.01em',
};

export const formSectionSubtitleSx = {
	fontSize: '0.75rem',
	color: FORM_COLORS.textMuted,
	mt: 0.25,
};

export const formHelperTextSx = {
	fontSize: '0.68rem',
	color: FORM_COLORS.textMuted,
	mt: 0.25,
};

// ─── CSR status color map ─────────────────────────────────────────────────────
export const CSR_STATUS_COLORS: Record<
	string,
	{ bg: string; text: string; border: string }
> = {
	pending_plot_selection: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
	pending_assignment: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
	partially_assigned: { bg: '#fce7f3', text: '#9d174d', border: '#f9a8d4' },
	completed: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
	cancelled: { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' },
};

export const CSR_STATUS_COLORS_DARK: Record<
	string,
	{ bg: string; text: string; border: string }
> = {
	pending_plot_selection: {
		bg: '#451a0320',
		text: '#fcd34d',
		border: '#92400e',
	},
	pending_assignment: { bg: '#1e3a5f20', text: '#93c5fd', border: '#1e40af' },
	partially_assigned: { bg: '#4c051e20', text: '#f9a8d4', border: '#9d174d' },
	completed: { bg: '#06402820', text: '#6ee7b7', border: '#065f46' },
	cancelled: { bg: '#1f1f1f', text: '#9ba39d', border: '#2a3832' },
};

export const CSR_PAYMENT_COLORS = {
	linked: { icon: '#22c55e', text: '#065f46' },
	partial: { icon: '#f59e0b', text: '#92400e' },
	unlinked: { icon: '#9ca3af', text: '#6b7280' },
};

// Stepper sx for the 3-step CSR wizard
export const csrWizardStepSx = {
	'& .MuiStepLabel-label': { fontSize: '0.8rem', fontWeight: 500 },
	'& .MuiStepIcon-root.Mui-active': { color: FORM_COLORS.stepActive },
	'& .MuiStepIcon-root.Mui-completed': { color: FORM_COLORS.stepCompleted },
};
