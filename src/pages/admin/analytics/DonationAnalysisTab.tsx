import React, { useState, useMemo } from 'react';
import { Box, Button, IconButton, Typography, Skeleton } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import ForestIcon from '@mui/icons-material/Forest';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LoopIcon from '@mui/icons-material/Loop';
import {
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import {
	useDonationSummary,
	useDonationMonthly,
	useDonationYearly,
	useDonorLeaderboard,
	usePaymentMethods,
	useDonationTypeSplit,
	useDonationFrequency,
	useRepeatDonorStats,
} from './hooks/useDonationAnalytics';
import {
	DonorLeaderboardEntry,
	DonationMonthlyEntry,
	DonationYearlyEntry,
} from '../../../types/analytics';
import { ANALYTICS_COLORS, analyticsSectionTitleSx } from './analyticsTheme';
import DonorProfileDrawer from './components/DonorProfileDrawer';
import {
	arrayToCSV,
	downloadCSV,
	formatFilename,
} from '../../../utils/csvExport';
import ApiClient from '../../../api/apiClient/apiClient';

interface DonationAnalysisTabProps {
	themeMode: 'dark' | 'light';
	onToggleTheme: () => void;
}

interface FilterDropdownProps {
	label: string;
	value: string;
	options: Array<{ value: string; label: string }>;
	onChange: (value: string) => void;
	isDark: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
	label,
	value,
	options,
	onChange,
	isDark,
}) => (
	<Box
		sx={{
			display: 'flex',
			flexDirection: 'column',
			gap: 0.5,
			minWidth: 110,
			flexShrink: 0,
		}}
	>
		<Typography
			sx={{
				fontSize: '10px',
				fontWeight: 600,
				textTransform: 'uppercase',
				letterSpacing: '0.08em',
				color: isDark ? '#9ba39d' : '#6b7280',
			}}
		>
			{label}
		</Typography>
		<Box
			component="select"
			value={value}
			onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
				onChange(e.target.value)
			}
			sx={{
				fontSize: '13px',
				fontWeight: 500,
				color: isDark ? '#e8ebe9' : '#111827',
				background: isDark ? '#152018' : '#f9f7f4',
				border: isDark ? '1px solid #2a3832' : '1px solid #d4cfc8',
				borderRadius: '8px',
				padding: '6px 28px 6px 10px',
				cursor: 'pointer',
				fontFamily: 'inherit',
				appearance: 'none',
				WebkitAppearance: 'none',
				backgroundImage: isDark
					? "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23ffffff' stroke-opacity='0.4' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")"
					: "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'right 8px center',
				outline: 'none',
				width: '100%',
				'&:hover': { borderColor: isDark ? '#3a4a3d' : '#9ca3af' },
				'& option': { color: '#111827', background: '#ffffff' },
			}}
		>
			{options.map((o) => (
				<option key={o.value} value={o.value}>
					{o.label}
				</option>
			))}
		</Box>
	</Box>
);

const FilterDivider: React.FC<{ isDark: boolean }> = ({ isDark }) => (
	<Box
		sx={{
			width: '1px',
			height: '36px',
			background: isDark ? '#2a3832' : '#e5e0d8',
			flexShrink: 0,
			mx: 0.5,
		}}
	/>
);

const formatCurrency = (v: number) =>
	v >= 10000000
		? `₹${(v / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr`
		: v >= 100000
		? `₹${(v / 100000).toFixed(2).replace(/\.?0+$/, '')} L`
		: v >= 1000
		? `₹${(v / 1000).toFixed(1).replace(/\.?0+$/, '')} K`
		: `₹${v.toFixed(0)}`;
const formatNumber = (v: number) =>
	v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v);

interface KPICardProps {
	label: string;
	value: string;
	delta?: number | null;
	icon: React.ReactNode;
	isDark: boolean;
	loading?: boolean;
	subLabel?: string;
}

const KPICard: React.FC<KPICardProps> = ({
	label,
	value,
	delta,
	icon,
	isDark,
	loading,
	subLabel,
}) => (
	<Box
		sx={{
			background: isDark ? '#1a2820' : '#fff',
			border: isDark ? '1px solid #2a3832' : '1px solid #e5e0d8',
			borderRadius: '12px',
			p: 2.5,
			display: 'flex',
			flexDirection: 'column',
			gap: 1,
		}}
	>
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
			<Typography
				sx={{
					fontSize: '11px',
					fontWeight: 600,
					textTransform: 'uppercase',
					letterSpacing: '0.08em',
					color: isDark ? '#9ba39d' : '#6b7280',
				}}
			>
				{label}
			</Typography>
			<Box sx={{ color: ANALYTICS_COLORS.accent, opacity: 0.7 }}>{icon}</Box>
		</Box>
		{loading ? (
			<Skeleton
				variant="text"
				width="60%"
				sx={{ bgcolor: isDark ? '#2a3832' : '#f0ede6' }}
			/>
		) : (
			<Typography
				sx={{
					fontSize: '1.6rem',
					fontWeight: 700,
					color: isDark ? '#e8ebe9' : '#1a1a1a',
					lineHeight: 1,
				}}
			>
				{value}
			</Typography>
		)}
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
			{delta !== null && delta !== undefined && (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
					{delta >= 0 ? (
						<TrendingUpIcon sx={{ fontSize: 14, color: '#4caf6e' }} />
					) : (
						<TrendingDownIcon sx={{ fontSize: 14, color: '#e8a838' }} />
					)}
					<Typography
						sx={{
							fontSize: '11px',
							color: delta >= 0 ? '#4caf6e' : '#e8a838',
							fontWeight: 600,
						}}
					>
						{delta >= 0 ? '+' : ''}
						{delta}% YoY
					</Typography>
				</Box>
			)}
			{subLabel && (
				<Typography
					sx={{ fontSize: '11px', color: isDark ? '#9ba39d' : '#6b7280' }}
				>
					{subLabel}
				</Typography>
			)}
		</Box>
	</Box>
);

const aggregateByQuarter = (monthly: DonationMonthlyEntry[]) => {
	const toNumber = (value: number | string | null | undefined) => {
		if (typeof value === 'number') return value;
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : 0;
	};
	const quarters = [
		{ name: 'Q1', months: [1, 2, 3] },
		{ name: 'Q2', months: [4, 5, 6] },
		{ name: 'Q3', months: [7, 8, 9] },
		{ name: 'Q4', months: [10, 11, 12] },
	];
	return quarters.map((q) => {
		const items = monthly.filter((m) => q.months.includes(m.month));
		return {
			name: q.name,
			amount: items.reduce((s, i) => s + toNumber(i.amount), 0),
			trees: items.reduce((s, i) => s + toNumber(i.trees), 0),
			donation_count: items.reduce((s, i) => s + toNumber(i.donation_count), 0),
		};
	});
};

interface LeaderboardProps {
	title: string;
	entries: DonorLeaderboardEntry[];
	loading: boolean;
	onSelectDonor: (id: number, type: 'user' | 'group') => void;
	onExport: () => void;
	exporting?: boolean;
	isDark: boolean;
	sortBy: string;
}

const LeaderboardPanel: React.FC<LeaderboardProps> = ({
	title,
	entries,
	loading,
	onSelectDonor,
	onExport,
	exporting,
	isDark,
	sortBy,
}) => (
	<Box
		sx={{
			background: isDark ? '#1a2820' : '#fff',
			border: isDark ? '1px solid #2a3832' : '1px solid #e5e0d8',
			borderRadius: '12px',
			p: 2.5,
			height: '100%',
		}}
	>
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				mb: 2,
			}}
		>
			<Typography
				sx={{
					fontSize: '13px',
					fontWeight: 600,
					color: isDark ? '#e8ebe9' : '#1a1a1a',
				}}
			>
				{title}
			</Typography>
			<IconButton
				size="small"
				onClick={onExport}
				disabled={loading || exporting || entries.length === 0}
				sx={{ color: isDark ? '#9ba39d' : '#6b7280' }}
			>
				<FileDownloadOutlinedIcon fontSize="small" />
			</IconButton>
		</Box>
		{loading ? (
			Array.from({ length: 5 }).map((_, i) => (
				<Skeleton
					key={i}
					variant="rectangular"
					height={44}
					sx={{
						mb: 0.5,
						borderRadius: 1,
						bgcolor: isDark ? '#2a3832' : '#f0ede6',
					}}
				/>
			))
		) : entries.length === 0 ? (
			<Typography
				sx={{ color: isDark ? '#9ba39d' : '#6b7280', fontSize: '13px' }}
			>
				No data
			</Typography>
		) : (
			entries.map((entry, idx) => (
				<Box
					key={entry.user_id ?? entry.group_id ?? idx}
					onClick={() => {
						const id =
							entry.donor_type === 'personal' ? entry.user_id : entry.group_id;
						if (id !== null && id !== undefined)
							onSelectDonor(
								id,
								entry.donor_type === 'personal' ? 'user' : 'group',
							);
					}}
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1.5,
						p: 1.5,
						borderRadius: '8px',
						mb: 0.5,
						cursor: 'pointer',
						'&:hover': { background: isDark ? '#223028' : '#f5f3ee' },
						transition: 'background 0.15s',
					}}
				>
					<Typography
						sx={{
							fontSize: '12px',
							fontWeight: 700,
							color: isDark ? '#4a5a4d' : '#9ca3af',
							minWidth: 20,
						}}
					>
						{idx + 1}
					</Typography>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography
							sx={{
								fontSize: '13px',
								fontWeight: 600,
								color: isDark ? '#e8ebe9' : '#1a1a1a',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{entry.donor_name ?? entry.group_name ?? 'Unknown'}
						</Typography>
						<Typography
							sx={{ fontSize: '11px', color: isDark ? '#9ba39d' : '#6b7280' }}
						>
							{entry.total_donations} donations · {entry.total_trees} trees
						</Typography>
					</Box>
					<Typography
						sx={{
							fontSize: '13px',
							fontWeight: 700,
							color: ANALYTICS_COLORS.accent,
						}}
					>
						{sortBy === 'trees'
							? `${formatNumber(entry.total_trees)} 🌳`
							: formatCurrency(entry.total_amount)}
					</Typography>
				</Box>
			))
		)}
	</Box>
);

const CUSTOM_COLORS = [
	ANALYTICS_COLORS.accent,
	'#4caf6e',
	'#e8a838',
	'#2d8a4e',
	'#9ba39d',
];
const CUSTOM_COLORS_DARK = [
	'#72f0b2',
	'#74d2ff',
	'#f7c46c',
	'#ff9b8c',
	'#d3f0ff',
];

const DonationAnalysisTab: React.FC<DonationAnalysisTabProps> = ({
	themeMode,
}) => {
	const isDark = themeMode === 'dark';
	const [selectedYear, setSelectedYear] = useState<number>(2026);
	const [granularity, setGranularity] = useState<
		'monthly' | 'quarterly' | 'yearly'
	>('monthly');
	const [typeFilter, setTypeFilter] = useState<
		'all' | 'personal' | 'corporate'
	>('all');
	const [sourceFilter, setSourceFilter] = useState<
		'all' | 'website' | 'manual'
	>('all');
	const [leaderboardSort, setLeaderboardSort] = useState<
		'amount' | 'trees' | 'frequency'
	>('amount');
	const [selectedDonorId, setSelectedDonorId] = useState<number | null>(null);
	const [selectedProfileType, setSelectedProfileType] = useState<
		'user' | 'group'
	>('user');
	const [exportingLeaderboard, setExportingLeaderboard] = useState<
		'personal' | 'corporate' | null
	>(null);

	const yearParam = selectedYear === 0 ? undefined : selectedYear;
	const typeParam: 'all' | 'personal' | 'corporate' = typeFilter;
	const sourceParam: 'all' | 'website' | 'manual' = sourceFilter;

	const { data: summary, loading: summaryLoading } = useDonationSummary(
		yearParam,
		typeParam,
		sourceParam,
	);
	const { data: monthly, loading: monthlyLoading } = useDonationMonthly(
		yearParam,
		typeParam,
		sourceParam,
	);
	const { data: yearly, loading: yearlyLoading } = useDonationYearly(
		typeParam,
		sourceParam,
	);
	const { data: leaderboard, loading: leaderboardLoading } =
		useDonorLeaderboard(leaderboardSort, 10, yearParam, typeParam, sourceParam);
	const { data: paymentMethods, loading: pmLoading } = usePaymentMethods(
		yearParam,
		typeParam,
	);
	const { data: typeSplit, loading: typeSplitLoading } = useDonationTypeSplit(
		yearParam,
		typeParam,
		sourceParam,
	);
	const { data: frequency, loading: freqLoading } = useDonationFrequency(
		yearParam,
		typeParam,
	);
	const { data: repeatStats, loading: repeatLoading } = useRepeatDonorStats(
		yearParam,
		typeParam,
	);

	const chartData = (() => {
		if (granularity === 'yearly') {
			return (yearly ?? []).map((y: DonationYearlyEntry) => ({
				name: String(y.year),
				amount: y.amount,
				trees: y.trees,
				count: y.donation_count,
			}));
		}
		if (!monthly) return [];
		if (granularity === 'quarterly') {
			return aggregateByQuarter(monthly).map((q) => ({
				name: q.name,
				amount: q.amount,
				trees: q.trees,
				count: q.donation_count,
			}));
		}
		return monthly.map((m: DonationMonthlyEntry) => ({
			name: m.month_name,
			amount: m.amount,
			trees: m.trees,
			count: m.donation_count,
		}));
	})();

	const pieColors = isDark ? CUSTOM_COLORS_DARK : CUSTOM_COLORS;
	const legendTextColor = isDark ? '#e4efe7' : '#6b7280';

	const [amountDomain, treesDomain] = useMemo(() => {
		if (!chartData.length) {
			return [
				[0, 1],
				[0, 1],
			] as const;
		}
		const calcDomain = (values: number[]) => {
			const max = Math.max(...values, 0);
			const min = Math.min(...values, 0);
			const spread = Math.max(max - min, max || 1);
			const padding = spread * 0.1;
			return [Math.max(0, min - padding), max + padding] as [number, number];
		};
		const amountValues = chartData.map((d) => d.amount ?? 0);
		const treeValues = chartData.map((d) => d.trees ?? 0);
		return [calcDomain(amountValues), calcDomain(treeValues)] as const;
	}, [chartData]);

	const typeSplitData = typeSplit
		? [
				{
					name: 'Trees + Money',
					value: typeSplit.both_count,
					pct: typeSplit.both_pct,
				},
				{
					name: 'Trees Only',
					value: typeSplit.trees_only_count,
					pct: typeSplit.trees_only_pct,
				},
				{
					name: 'Money Only',
					value: typeSplit.money_only_count,
					pct: typeSplit.money_only_pct,
				},
		  ].filter((d) => d.value > 0)
		: [];

	const pmData = (paymentMethods ?? []).map((m) => ({
		name:
			m.method === 'trees'
				? 'Tree Sponsorship'
				: m.method === 'amount'
				? 'Monetary'
				: m.method,
		value: m.count,
		pct: m.pct,
	}));

	const freqData = frequency
		? [
				{ name: '1 donation', value: frequency.once },
				{ name: '2–3', value: frequency.two_to_three },
				{ name: '4–6', value: frequency.four_to_six },
				{ name: '7+', value: frequency.seven_plus },
		  ]
		: [];

	const sectionLabelSx = {
		fontSize: '10px',
		fontWeight: 600,
		textTransform: 'uppercase' as const,
		letterSpacing: '0.08em',
		color: isDark ? '#4a5a4d' : '#6b7280',
		mb: 1.5,
		mt: 2.5,
		display: 'flex',
		alignItems: 'center',
		gap: 1,
		'&::after': {
			content: '""',
			flex: 1,
			height: '1px',
			background: isDark ? '#2a3832' : '#eeebe4',
		},
	};

	const cardSx = {
		background: isDark ? '#1a2820' : '#fff',
		border: isDark ? '1px solid #2a3832' : '1px solid #e5e0d8',
		borderRadius: '12px',
	};

	const tooltipStyle = {
		backgroundColor: isDark ? '#1a2820' : '#fff',
		border: `1px solid ${isDark ? '#2a3832' : '#e5e0d8'}`,
		borderRadius: 8,
		color: isDark ? '#e8ebe9' : '#1a1a1a',
		padding: '10px 14px',
	};
	const tooltipLabelStyle = {
		color: isDark ? '#e8ebe9' : '#1a1a1a',
		fontWeight: 600,
	};
	const tooltipItemStyle = {
		color: isDark ? '#d7e5dc' : '#1a1a1a',
	};

	const handleSelectDonor = (id: number, type: 'user' | 'group') => {
		setSelectedDonorId(id);
		setSelectedProfileType(type);
	};

	const filters = {
		year: selectedYear || undefined,
		type: typeFilter,
		source: sourceFilter,
	};

	const handleExportTrend = () => {
		if (!chartData.length) return;
		const headers = ['Period', 'Amount (₹)', 'Trees', 'Donations'];
		const rows = chartData.map((d) => [d.name, d.amount, d.trees, d.count]);
		downloadCSV(
			arrayToCSV(headers, rows),
			formatFilename('donation-trends', filters),
		);
	};

	const handleExportPersonal = async () => {
		setExportingLeaderboard('personal');
		try {
			const apiClient = new ApiClient();
			const all = await apiClient.getDonorLeaderboard(
				leaderboardSort,
				10000,
				yearParam,
				typeParam,
				sourceParam,
			);
			const headers = [
				'Rank',
				'Name',
				'Donations',
				'Amount (₹)',
				'Trees',
				'Avg Donation (₹)',
				'First',
				'Last',
			];
			const rows = all.personal.map((e, i) => [
				i + 1,
				e.donor_name ?? '',
				e.total_donations,
				e.total_amount,
				e.total_trees,
				e.avg_donation,
				e.first_donation_at,
				e.last_donation_at,
			]);
			downloadCSV(
				arrayToCSV(headers, rows),
				formatFilename('donors-personal', filters),
			);
		} finally {
			setExportingLeaderboard(null);
		}
	};

	const handleExportCorporate = async () => {
		setExportingLeaderboard('corporate');
		try {
			const apiClient = new ApiClient();
			const all = await apiClient.getDonorLeaderboard(
				leaderboardSort,
				10000,
				yearParam,
				typeParam,
				sourceParam,
			);
			const headers = [
				'Rank',
				'Organization',
				'Type',
				'Donations',
				'Amount (₹)',
				'Trees',
				'Avg Donation (₹)',
				'First',
				'Last',
			];
			const rows = all.corporate.map((e, i) => [
				i + 1,
				e.group_name ?? '',
				e.group_type ?? '',
				e.total_donations,
				e.total_amount,
				e.total_trees,
				e.avg_donation,
				e.first_donation_at,
				e.last_donation_at,
			]);
			downloadCSV(
				arrayToCSV(headers, rows),
				formatFilename('donors-corporate', filters),
			);
		} finally {
			setExportingLeaderboard(null);
		}
	};

	const handleExportPaymentMethods = () => {
		if (!paymentMethods?.length) return;
		const headers = ['Method', 'Count', 'Total Amount (₹)', '%'];
		const rows = paymentMethods.map((m) => [
			m.method,
			m.count,
			m.total_amount,
			m.pct,
		]);
		downloadCSV(
			arrayToCSV(headers, rows),
			formatFilename('payment-methods', filters),
		);
	};

	const handleExportTypeSplit = () => {
		if (!typeSplit) return;
		const headers = ['Type', 'Count', '%'];
		const rows = [
			['Trees + Money', typeSplit.both_count, typeSplit.both_pct],
			['Trees Only', typeSplit.trees_only_count, typeSplit.trees_only_pct],
			['Money Only', typeSplit.money_only_count, typeSplit.money_only_pct],
		];
		downloadCSV(
			arrayToCSV(headers, rows),
			formatFilename('donation-type-split', filters),
		);
	};

	const handleExportEngagement = () => {
		if (!repeatStats && !frequency) return;
		const headers = ['Metric', 'Value'];
		const rows: (string | number)[][] = [
			['Repeat donors', repeatStats?.repeat_donors ?? 0],
			['Total donors', repeatStats?.total_donors ?? 0],
			['Repeat donor rate (%)', repeatStats?.repeat_rate ?? 0],
			['Avg lifetime value (₹)', repeatStats?.avg_lifetime_value ?? 0],
			['Avg donations per donor', repeatStats?.avg_lifetime_donations ?? 0],
			['1 donation', frequency?.once ?? 0],
			['2–3 donations', frequency?.two_to_three ?? 0],
			['4–6 donations', frequency?.four_to_six ?? 0],
			['7+ donations', frequency?.seven_plus ?? 0],
		];
		downloadCSV(
			arrayToCSV(headers, rows),
			formatFilename('donor-engagement', filters),
		);
	};

	const isFiltered =
		selectedYear !== 2026 ||
		granularity !== 'monthly' ||
		typeFilter !== 'all' ||
		sourceFilter !== 'all';

	return (
		<Box
			id="donation-analysis"
			sx={{ mt: 2, color: ANALYTICS_COLORS.textOnDark }}
		>
			<Typography
				variant="h5"
				sx={{
					...analyticsSectionTitleSx,
					color: isDark ? 'rgba(255,255,255,0.85)' : '#1f2937',
					mb: 1,
				}}
			>
				Donation Analytics
			</Typography>
			<Typography
				variant="body2"
				sx={{ mb: 2, color: isDark ? 'rgba(255,255,255,0.45)' : '#4b5563' }}
			>
				Unified view of monetary donations and gift card purchases — trends,
				donors, and payment breakdowns.
			</Typography>

			<Box
				sx={{
					display: 'flex',
					alignItems: 'flex-start',
					gap: 1.5,
					mb: 3,
					px: 2,
					py: 1.5,
					borderRadius: '10px',
					background: isDark ? 'rgba(234,179,8,0.08)' : 'rgba(234,179,8,0.1)',
					border: isDark
						? '1px solid rgba(234,179,8,0.25)'
						: '1px solid rgba(234,179,8,0.35)',
				}}
			>
				<Typography sx={{ fontSize: '15px', lineHeight: 1, mt: '1px' }}>
					⚠️
				</Typography>
				<Typography
					sx={{
						fontSize: '12px',
						color: isDark ? 'rgba(234,179,8,0.9)' : '#92400e',
						lineHeight: 1.5,
					}}
				>
					<strong>Data under reconciliation.</strong> The figures shown here are
					being verified and may not match official records. Cross-check with
					source documents before relying on this data.
				</Typography>
			</Box>

			{/* Filter bar */}
			<Box
				sx={{
					position: 'sticky',
					top: 0,
					zIndex: 100,
					background: isDark ? '#1a2820' : '#ffffff',
					border: isDark ? '1px solid #2a3832' : '1px solid #d4cfc8',
					borderRadius: '12px',
					px: 2.5,
					py: 1.5,
					mb: 2.5,
					display: 'flex',
					alignItems: 'center',
					gap: 1.5,
					flexWrap: { xs: 'wrap', md: 'nowrap' },
					boxShadow: isDark
						? '0 2px 12px rgba(0,0,0,0.4)'
						: '0 2px 8px rgba(0,0,0,0.07)',
				}}
			>
				<FilterDropdown
					label="Year"
					value={selectedYear === 0 ? 'all' : String(selectedYear)}
					isDark={isDark}
					options={[
						{ value: '2026', label: '2026' },
						{ value: '2025', label: '2025' },
						{ value: '2024', label: '2024' },
						{ value: '2023', label: '2023' },
						{ value: 'all', label: 'All time' },
					]}
					onChange={(v) => setSelectedYear(v === 'all' ? 0 : parseInt(v, 10))}
				/>
				<FilterDivider isDark={isDark} />
				<FilterDropdown
					label="View by"
					value={granularity}
					isDark={isDark}
					options={[
						{ value: 'monthly', label: 'Monthly' },
						{ value: 'quarterly', label: 'Quarterly' },
						{ value: 'yearly', label: 'Yearly' },
					]}
					onChange={(v) =>
						setGranularity(v as 'monthly' | 'quarterly' | 'yearly')
					}
				/>
				<FilterDivider isDark={isDark} />
				<FilterDropdown
					label="Donor type"
					value={typeFilter}
					isDark={isDark}
					options={[
						{ value: 'all', label: 'All types' },
						{ value: 'personal', label: 'Personal' },
						{ value: 'corporate', label: 'Corporate' },
					]}
					onChange={(v) => setTypeFilter(v as 'all' | 'personal' | 'corporate')}
				/>
				<FilterDivider isDark={isDark} />
				<FilterDropdown
					label="Source"
					value={sourceFilter}
					isDark={isDark}
					options={[
						{ value: 'all', label: 'All sources' },
						{ value: 'website', label: 'Website' },
						{ value: 'manual', label: 'Manual' },
					]}
					onChange={(v) => setSourceFilter(v as 'all' | 'website' | 'manual')}
				/>
				<FilterDivider isDark={isDark} />
				<FilterDropdown
					label="Sort by"
					value={leaderboardSort}
					isDark={isDark}
					options={[
						{ value: 'amount', label: 'Amount' },
						{ value: 'trees', label: 'Trees' },
						{ value: 'frequency', label: 'Frequency' },
					]}
					onChange={(v) =>
						setLeaderboardSort(v as 'amount' | 'trees' | 'frequency')
					}
				/>
				{isFiltered && (
					<Box sx={{ ml: 'auto', flexShrink: 0 }}>
						<Button
							size="small"
							variant="outlined"
							onClick={() => {
								setSelectedYear(2026);
								setGranularity('monthly');
								setTypeFilter('all');
								setSourceFilter('all');
								setLeaderboardSort('amount');
							}}
							sx={{
								fontSize: '12px',
								borderRadius: '8px',
								textTransform: 'none',
								borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#e5e0d8',
								color: isDark ? 'rgba(255,255,255,0.4)' : '#9ca3af',
							}}
						>
							Reset
						</Button>
					</Box>
				)}
			</Box>

			{/* KPI Cards */}
			<Typography sx={sectionLabelSx}>Key metrics</Typography>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: {
						xs: '1fr 1fr',
						md: 'repeat(3, 1fr)',
						lg: 'repeat(6, 1fr)',
					},
					gap: 1.5,
				}}
			>
				<KPICard
					label="Total Donations"
					value={
						summaryLoading ? '—' : formatNumber(summary?.total_donations ?? 0)
					}
					delta={summary?.total_donations_delta}
					icon={<LoopIcon fontSize="small" />}
					isDark={isDark}
					loading={summaryLoading}
				/>
				<KPICard
					label="Total Amount"
					value={
						summaryLoading ? '—' : formatCurrency(summary?.total_amount ?? 0)
					}
					delta={summary?.total_amount_delta}
					icon={<AttachMoneyIcon fontSize="small" />}
					isDark={isDark}
					loading={summaryLoading}
				/>
				<KPICard
					label="Trees Sponsored"
					value={summaryLoading ? '—' : formatNumber(summary?.total_trees ?? 0)}
					delta={summary?.total_trees_delta}
					icon={<ForestIcon fontSize="small" />}
					isDark={isDark}
					loading={summaryLoading}
				/>
				<KPICard
					label="Active Donors"
					value={
						summaryLoading ? '—' : formatNumber(summary?.active_donors ?? 0)
					}
					delta={summary?.active_donors_delta}
					icon={<PeopleIcon fontSize="small" />}
					isDark={isDark}
					loading={summaryLoading}
				/>
				<KPICard
					label="Avg Donation"
					value={
						summaryLoading ? '—' : formatCurrency(summary?.avg_donation ?? 0)
					}
					icon={<TrendingUpIcon fontSize="small" />}
					isDark={isDark}
					loading={summaryLoading}
				/>
				<KPICard
					label="Tree Fulfillment"
					value={
						summaryLoading ? '—' : `${summary?.tree_fulfillment_rate ?? 0}%`
					}
					icon={<ForestIcon fontSize="small" />}
					isDark={isDark}
					loading={summaryLoading}
					subLabel="have trees"
				/>
			</Box>

			{/* Trend Chart */}
			<Typography sx={sectionLabelSx}>Donation trends</Typography>
			<Box sx={{ ...cardSx, p: 2.5 }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						mb: 2,
					}}
				>
					<Typography
						sx={{
							fontSize: '13px',
							fontWeight: 600,
							color: isDark ? '#e8ebe9' : '#1a1a1a',
						}}
					>
						Amount & Trees over time
					</Typography>
					<IconButton
						size="small"
						onClick={handleExportTrend}
						disabled={!chartData.length}
						sx={{ color: isDark ? '#9ba39d' : '#6b7280' }}
					>
						<FileDownloadOutlinedIcon fontSize="small" />
					</IconButton>
				</Box>
				{monthlyLoading || yearlyLoading ? (
					<Skeleton
						variant="rectangular"
						height={280}
						sx={{ borderRadius: 1, bgcolor: isDark ? '#2a3832' : '#f0ede6' }}
					/>
				) : (
					<ResponsiveContainer width="100%" height={280}>
						{/* Force remount when switching granularity so axes recompute scale */}
						<LineChart
							key={granularity}
							data={chartData}
							margin={{ top: 5, right: 50, left: 10, bottom: 5 }}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke={isDark ? '#1f2f24' : '#f0ede6'}
							/>
							<XAxis
								dataKey="name"
								tick={{ fill: isDark ? '#4a5a4d' : '#9ca3af', fontSize: 11 }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								yAxisId="amount"
								domain={amountDomain}
								tick={{ fill: isDark ? '#4a5a4d' : '#9ca3af', fontSize: 11 }}
								axisLine={false}
								tickLine={false}
								tickFormatter={(v) => formatCurrency(v)}
							/>
							<YAxis
								yAxisId="trees"
								domain={treesDomain}
								orientation="right"
								tick={{ fill: isDark ? '#4a5a4d' : '#9ca3af', fontSize: 11 }}
								axisLine={false}
								tickLine={false}
							/>
							<Tooltip
								contentStyle={tooltipStyle}
								labelStyle={tooltipLabelStyle}
								itemStyle={tooltipItemStyle}
								formatter={(value: any, name: string) => [
									name === 'Amount' ? formatCurrency(Number(value)) : value,
									name,
								]}
							/>
							<Legend wrapperStyle={{ fontSize: 12, color: legendTextColor }} />
							<Line
								yAxisId="amount"
								type="monotone"
								dataKey="amount"
								name="Amount"
								stroke={ANALYTICS_COLORS.accent}
								strokeWidth={2.5}
								dot={{
									r: 3,
									strokeWidth: 1,
									fill: isDark ? '#1a2820' : '#fff',
								}}
								activeDot={{ r: 5 }}
							/>
							<Line
								yAxisId="trees"
								type="monotone"
								dataKey="trees"
								name="Trees"
								stroke="#4caf6e"
								strokeWidth={2.5}
								dot={false}
								strokeDasharray="4 3"
							/>
						</LineChart>
					</ResponsiveContainer>
				)}
			</Box>

			{/* Leaderboards */}
			<Typography sx={sectionLabelSx}>Top donors</Typography>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
					gap: 2,
				}}
			>
				<LeaderboardPanel
					title="Personal Donors"
					entries={leaderboard?.personal ?? []}
					loading={leaderboardLoading}
					onSelectDonor={handleSelectDonor}
					onExport={handleExportPersonal}
					exporting={exportingLeaderboard === 'personal'}
					isDark={isDark}
					sortBy={leaderboardSort}
				/>
				<LeaderboardPanel
					title="Organizations"
					entries={leaderboard?.corporate ?? []}
					loading={leaderboardLoading}
					onSelectDonor={handleSelectDonor}
					onExport={handleExportCorporate}
					exporting={exportingLeaderboard === 'corporate'}
					isDark={isDark}
					sortBy={leaderboardSort}
				/>
			</Box>

			{/* Bottom 3-col grid */}
			<Box
				sx={{
					mt: 5,
					mb: 2,
					display: 'flex',
					alignItems: 'center',
					gap: 1,
					fontSize: '10px',
					fontWeight: 600,
					textTransform: 'uppercase',
					letterSpacing: '0.08em',
					color: isDark ? '#4a5a4d' : '#6b7280',
				}}
			>
				<Typography
					sx={{
						fontSize: '10px',
						fontWeight: 600,
						textTransform: 'uppercase',
						letterSpacing: '0.08em',
						color: 'inherit',
						flexShrink: 0,
						mt: 2,
					}}
				>
					Breakdown
				</Typography>
				<Box
					sx={{
						flex: 1,
						height: '1px',
						background: isDark ? '#2a3832' : '#eeebe4',
					}}
				/>
			</Box>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
					gap: 2,
				}}
			>
				{/* Payment methods */}
				<Box sx={{ ...cardSx, p: 2.5 }}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							mb: 0.5,
						}}
					>
						<Typography
							sx={{
								fontSize: '13px',
								fontWeight: 600,
								color: isDark ? '#e8ebe9' : '#1a1a1a',
							}}
						>
							Contribution Mode
						</Typography>
						<IconButton
							size="small"
							onClick={handleExportPaymentMethods}
							disabled={pmLoading || !paymentMethods?.length}
							sx={{ color: isDark ? '#9ba39d' : '#6b7280' }}
						>
							<FileDownloadOutlinedIcon fontSize="small" />
						</IconButton>
					</Box>
					<Typography
						sx={{
							fontSize: '11px',
							color: isDark ? '#6b7a6e' : '#9ca3af',
							mb: 2,
							lineHeight: 1.4,
						}}
					>
						How donations are split by contribution mode — tree sponsorship vs.
						monetary donations, by number of transactions.
					</Typography>
					{pmLoading ? (
						<Skeleton
							variant="rectangular"
							height={180}
							sx={{ borderRadius: 1, bgcolor: isDark ? '#2a3832' : '#f0ede6' }}
						/>
					) : (
						<ResponsiveContainer width="100%" height={180}>
							<PieChart>
								<Pie
									data={pmData}
									cx="50%"
									cy="50%"
									innerRadius={45}
									outerRadius={70}
									dataKey="value"
									paddingAngle={2}
								>
									{pmData.map((_, i) => (
										<Cell key={i} fill={pieColors[i % pieColors.length]} />
									))}
								</Pie>
								<Tooltip
									contentStyle={tooltipStyle}
									labelStyle={tooltipLabelStyle}
									itemStyle={tooltipItemStyle}
									formatter={(v: any, _: any, entry: any) => [
										`${v} (${entry.payload.pct}%)`,
										entry.name,
									]}
								/>
								<Legend
									wrapperStyle={{ fontSize: 11, color: legendTextColor }}
								/>
							</PieChart>
						</ResponsiveContainer>
					)}
				</Box>

				{/* Donation type split */}
				<Box sx={{ ...cardSx, p: 2.5 }}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							mb: 0.5,
						}}
					>
						<Typography
							sx={{
								fontSize: '13px',
								fontWeight: 600,
								color: isDark ? '#e8ebe9' : '#1a1a1a',
							}}
						>
							Donation Type Split
						</Typography>
						<IconButton
							size="small"
							onClick={handleExportTypeSplit}
							disabled={typeSplitLoading || !typeSplit}
							sx={{ color: isDark ? '#9ba39d' : '#6b7280' }}
						>
							<FileDownloadOutlinedIcon fontSize="small" />
						</IconButton>
					</Box>
					<Typography
						sx={{
							fontSize: '11px',
							color: isDark ? '#6b7a6e' : '#9ca3af',
							mb: 2,
							lineHeight: 1.4,
						}}
					>
						Breakdown of donations by what was given — trees only, money only,
						or both trees and money in the same donation.
					</Typography>
					{typeSplitLoading ? (
						<Skeleton
							variant="rectangular"
							height={180}
							sx={{ borderRadius: 1, bgcolor: isDark ? '#2a3832' : '#f0ede6' }}
						/>
					) : (
						<ResponsiveContainer width="100%" height={180}>
							<PieChart>
								<Pie
									data={typeSplitData}
									cx="50%"
									cy="50%"
									innerRadius={45}
									outerRadius={70}
									dataKey="value"
									paddingAngle={2}
								>
									{typeSplitData.map((_, i) => (
										<Cell key={i} fill={pieColors[i % pieColors.length]} />
									))}
								</Pie>
								<Tooltip
									contentStyle={tooltipStyle}
									labelStyle={tooltipLabelStyle}
									itemStyle={tooltipItemStyle}
									formatter={(v: any, _: any, entry: any) => [
										`${v} (${entry.payload.pct}%)`,
										entry.name,
									]}
								/>
								<Legend
									wrapperStyle={{ fontSize: 11, color: legendTextColor }}
								/>
							</PieChart>
						</ResponsiveContainer>
					)}
				</Box>

				{/* Engagement stats */}
				<Box
					sx={{
						...cardSx,
						p: 2.5,
						display: 'flex',
						flexDirection: 'column',
						gap: 1.5,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							mb: 0.5,
						}}
					>
						<Typography
							sx={{
								fontSize: '13px',
								fontWeight: 600,
								color: isDark ? '#e8ebe9' : '#1a1a1a',
							}}
						>
							Donor Engagement
						</Typography>
						<IconButton
							size="small"
							onClick={handleExportEngagement}
							disabled={repeatLoading || freqLoading}
							sx={{ color: isDark ? '#9ba39d' : '#6b7280' }}
						>
							<FileDownloadOutlinedIcon fontSize="small" />
						</IconButton>
					</Box>
					<Typography
						sx={{
							fontSize: '11px',
							color: isDark ? '#6b7a6e' : '#9ca3af',
							mb: 1.5,
							lineHeight: 1.4,
						}}
					>
						Loyalty and retention signals — repeat donor rate, average lifetime
						contribution, and how often donors give (one-time vs. recurring).
					</Typography>
					{repeatLoading || freqLoading ? (
						Array.from({ length: 4 }).map((_, i) => (
							<Skeleton
								key={i}
								variant="text"
								sx={{ bgcolor: isDark ? '#2a3832' : '#f0ede6' }}
							/>
						))
					) : (
						<>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									p: 1,
									borderRadius: 1,
									background: isDark ? '#152018' : '#f5f3ee',
								}}
							>
								<Typography
									sx={{
										fontSize: '12px',
										color: isDark ? '#9ba39d' : '#6b7280',
									}}
								>
									Repeat donor rate
								</Typography>
								<Typography
									sx={{
										fontSize: '14px',
										fontWeight: 700,
										color: ANALYTICS_COLORS.accent,
									}}
								>
									{repeatStats?.repeat_rate ?? 0}%
								</Typography>
							</Box>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									p: 1,
									borderRadius: 1,
									background: isDark ? '#152018' : '#f5f3ee',
								}}
							>
								<Typography
									sx={{
										fontSize: '12px',
										color: isDark ? '#9ba39d' : '#6b7280',
									}}
								>
									Avg lifetime value
								</Typography>
								<Typography
									sx={{
										fontSize: '14px',
										fontWeight: 700,
										color: ANALYTICS_COLORS.accent,
									}}
								>
									{formatCurrency(repeatStats?.avg_lifetime_value ?? 0)}
								</Typography>
							</Box>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									p: 1,
									borderRadius: 1,
									background: isDark ? '#152018' : '#f5f3ee',
								}}
							>
								<Typography
									sx={{
										fontSize: '12px',
										color: isDark ? '#9ba39d' : '#6b7280',
									}}
								>
									Avg donations/donor
								</Typography>
								<Typography
									sx={{ fontSize: '14px', fontWeight: 700, color: '#4caf6e' }}
								>
									{repeatStats?.avg_lifetime_donations ?? 0}x
								</Typography>
							</Box>
							<Typography
								sx={{
									fontSize: '11px',
									fontWeight: 600,
									textTransform: 'uppercase',
									letterSpacing: '0.06em',
									color: isDark ? '#4a5a4d' : '#9ca3af',
									mt: 0.5,
								}}
							>
								Frequency buckets
							</Typography>
							{freqData.map((f) => (
								<Box
									key={f.name}
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<Typography
										sx={{
											fontSize: '12px',
											color: isDark ? '#9ba39d' : '#6b7280',
										}}
									>
										{f.name}
									</Typography>
									<Typography
										sx={{
											fontSize: '13px',
											fontWeight: 600,
											color: isDark ? '#e8ebe9' : '#1a1a1a',
										}}
									>
										{f.value}
									</Typography>
								</Box>
							))}
						</>
					)}
				</Box>
			</Box>

			<DonorProfileDrawer
				donorId={selectedDonorId}
				profileType={selectedProfileType}
				themeMode={themeMode}
				onClose={() => {
					setSelectedDonorId(null);
					setSelectedProfileType('user');
				}}
			/>
		</Box>
	);
};

export default DonationAnalysisTab;
