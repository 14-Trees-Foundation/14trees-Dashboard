import React, { useState, useMemo, useEffect } from 'react';
import {
	Box,
	Typography,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Tabs,
	Tab,
	Button,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ForestIcon from '@mui/icons-material/Forest';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import {
	useTreeSummary,
	useTreesByLocation,
	useTreeSpecies,
	useTreeAvailability,
	useTreeAgeDistribution,
	useTreePlantTypesByPlot,
} from './hooks/useTreeAnalytics';
import { ANALYTICS_COLORS, analyticsSectionTitleSx } from './analyticsTheme';
import { SortColumnHeader } from './SortColumnHeader';

interface TreeAnalysisTabProps {
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

const KPICard: React.FC<{
	label: string;
	value: string;
	icon: React.ReactNode;
	isDark: boolean;
	loading?: boolean;
}> = ({ label, value, icon, isDark, loading }) => (
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
	</Box>
);

const TreeAnalysisTab: React.FC<TreeAnalysisTabProps> = ({ themeMode }) => {
	const isDark = themeMode === 'dark';
	const [year, setYear] = useState('');
	const [district, setDistrict] = useState('');
	const [taluka, setTaluka] = useState('');
	const [village, setVillage] = useState('');
	const [locationLevel, setLocationLevel] = useState<
		'district' | 'taluka' | 'village' | 'site' | 'plot'
	>('district');
	const [inventoryCategory, setInventoryCategory] = useState('');
	const [availabilityCategory, setAvailabilityCategory] = useState('');
	const [locationPageNum, setLocationPageNum] = useState(1);
	const [availabilityPageNum, setAvailabilityPageNum] = useState(1);
	const [inventorySearch, setInventorySearch] = useState('');
	const [debouncedInventorySearch, setDebouncedInventorySearch] = useState('');
	const [expandedPlots, setExpandedPlots] = useState<Set<string>>(new Set());
	const [expandAllMode, setExpandAllMode] = useState(false);
	const [locationSortBy, setLocationSortBy] = useState<string>('total');
	const [locationSortOrder, setLocationSortOrder] = useState<'asc' | 'desc'>(
		'desc',
	);
	const [inventorySortBy, setInventorySortBy] = useState<string>('total');
	const [inventorySortOrder, setInventorySortOrder] = useState<'asc' | 'desc'>(
		'desc',
	);
	const [selectedAgeBucket, setSelectedAgeBucket] = useState<string | null>(
		null,
	);
	const [drilldownOpen, setDrilldownOpen] = useState(false);
	const locationPageSize = 10;
	const availabilityPageSize = 10;

	// Debounce inventory search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedInventorySearch(inventorySearch);
			setAvailabilityPageNum(1);
		}, 400);
		return () => clearTimeout(timer);
	}, [inventorySearch]);

	// Parse year filter
	const yearNum = year && year !== '' ? parseInt(year) : undefined;

	// Hooks
	const summary = useTreeSummary(
		yearNum,
		district || undefined,
		taluka || undefined,
		village || undefined,
	);
	const species = useTreeSpecies(
		yearNum,
		district || undefined,
		taluka || undefined,
		village || undefined,
	);
	const byLocation = useTreesByLocation(
		locationLevel,
		yearNum,
		district || undefined,
		taluka || undefined,
		village || undefined,
		undefined,
		locationSortBy,
		locationSortOrder,
	);
	const districtFilterData = useTreesByLocation(
		'district',
		yearNum,
		undefined,
		undefined,
		undefined,
	);
	const talukaFilterData = useTreesByLocation(
		'taluka',
		yearNum,
		district || undefined,
		undefined,
		undefined,
	);
	const villageFilterData = useTreesByLocation(
		'village',
		yearNum,
		district || undefined,
		taluka || undefined,
		undefined,
	);

	const ageDistribution = useTreeAgeDistribution(
		district || undefined,
		taluka || undefined,
		village || undefined,
	);
	const availability = useTreeAvailability(
		district || undefined,
		taluka || undefined,
		village || undefined,
		undefined,
		undefined,
		availabilityCategory
			? (availabilityCategory as 'Foundation' | 'Public' | 'Others')
			: undefined,
		availabilityPageNum,
		availabilityPageSize,
	);
	const plantTypesByPlot = useTreePlantTypesByPlot(
		district || undefined,
		taluka || undefined,
		village || undefined,
		undefined,
		undefined,
		availabilityCategory
			? (availabilityCategory as 'Foundation' | 'Public' | 'Others')
			: undefined,
		availabilityPageNum,
		10, // 10 plots per page; backend paginates by plot not by row
		debouncedInventorySearch || undefined,
		inventorySortBy,
		inventorySortOrder,
	);

	const formatNumber = (n: number | undefined) =>
		n !== undefined ? n.toLocaleString() : '0';

	// Age bucket columns for Trees by Location
	const ageBucketColumns = [
		{ key: 'count_0_1yr', label: '0-1 yr' },
		{ key: 'count_1_3yr', label: '1-3 yr' },
		{ key: 'count_3_5yr', label: '3-5 yr' },
		{ key: 'count_5plus', label: '5+ yr' },
	];

	// Handle sort column click - triggers backend fetch with sort params
	const handleLocationSort = (columnKey: string) => {
		if (locationSortBy === columnKey) {
			// Toggle sort order
			setLocationSortOrder(locationSortOrder === 'asc' ? 'desc' : 'asc');
		} else {
			// New column, sort descending
			setLocationSortBy(columnKey);
			setLocationSortOrder('desc');
		}
	};

	const handleInventorySort = (columnKey: string) => {
		if (inventorySortBy === columnKey) {
			// Toggle sort order
			setInventorySortOrder(inventorySortOrder === 'asc' ? 'desc' : 'asc');
		} else {
			// New column, sort descending
			setInventorySortBy(columnKey);
			setInventorySortOrder('desc');
		}
	};

	const speciesForChart = useMemo(
		() => (species.data ? species.data.slice(0, 10) : []),
		[species.data],
	);

	const districtOptions = useMemo(() => {
		const values = (districtFilterData.data || [])
			.map((r) => r.location)
			.filter((v): v is string => !!v && v.trim().length > 0);
		const unique = Array.from(new Set(values));
		return [
			{ value: '', label: 'All Districts' },
			...unique.map((v) => ({ value: v, label: v })),
		];
	}, [districtFilterData.data]);

	const talukaOptions = useMemo(() => {
		const values = (talukaFilterData.data || [])
			.map((r) => r.location)
			.filter((v): v is string => !!v && v.trim().length > 0);
		const unique = Array.from(new Set(values));
		return [
			{ value: '', label: 'All Talukas' },
			...unique.map((v) => ({ value: v, label: v })),
		];
	}, [talukaFilterData.data]);

	const villageOptions = useMemo(() => {
		const values = (villageFilterData.data || [])
			.map((r) => r.location)
			.filter((v): v is string => !!v && v.trim().length > 0);
		const unique = Array.from(new Set(values));
		return [
			{ value: '', label: 'All Villages' },
			...unique.map((v) => ({ value: v, label: v })),
		];
	}, [villageFilterData.data]);

	// Data is already sorted by backend. Paginate client-side.
	const locationData = byLocation.data || [];
	const totalLocationPages = Math.ceil(locationData.length / locationPageSize);
	const locationStartIdx = (locationPageNum - 1) * locationPageSize;
	const locationEndIdx = locationStartIdx + locationPageSize;
	const paginatedLocationData = locationData.slice(
		locationStartIdx,
		locationEndIdx,
	);

	// Group plant types by plot for hierarchical display
	const groupedByPlot = useMemo(() => {
		const plotMap = new Map<string, any>();
		plantTypesByPlot.data?.forEach((row) => {
			const key = `${row.plot_id}`;
			if (!plotMap.has(key)) {
				plotMap.set(key, {
					plot_id: row.plot_id,
					plot_name: row.plot_name,
					plot_category: row.plot_category,
					site_name: row.site_name,
					site_id: row.site_id,
					site_category: row.site_category,
					district: row.district,
					total: 0,
					available: 0,
					card_available: 0,
					plantTypes: [],
				});
			}
			const plot = plotMap.get(key)!;
			plot.total += row.total || 0;
			plot.available += row.available || 0;
			plot.card_available += row.card_available || 0;
			plot.plantTypes.push({
				species_name: row.species_name,
				scientific_name: row.scientific_name,
				plant_type_id: row.plant_type_id,
				total: row.total,
				available: row.available,
				card_available: row.card_available,
			});
		});
		const result = Array.from(plotMap.values());
		// Data is already sorted by backend, no client-side sorting needed
		return result;
	}, [plantTypesByPlot.data]);

	const handleTogglePlot = (plotId: string) => {
		const newSet = new Set(expandedPlots);
		if (newSet.has(plotId)) {
			newSet.delete(plotId);
		} else {
			newSet.add(plotId);
		}
		setExpandedPlots(newSet);
	};

	const handleExpandAll = () => {
		if (expandAllMode) {
			setExpandedPlots(new Set());
			setExpandAllMode(false);
		} else {
			const newSet = new Set(paginatedGroupedPlots.map((p) => `${p.plot_id}`));
			setExpandedPlots(newSet);
			setExpandAllMode(true);
		}
	};

	// Pagination for grouped plots (client-side grouping, server-side fetch)
	const totalPlotPages = plantTypesByPlot.pagination?.totalPages || 1;
	const paginatedGroupedPlots = groupedByPlot;

	// Pagination for availability table (server-side)
	const availabilityData = availability.data || [];
	const totalAvailabilityPages = availability.pagination?.totalPages || 1;

	// Reset to page 1 when filters change
	useEffect(() => {
		setLocationPageNum(1);
	}, [locationLevel, yearNum, district, taluka, village]);

	useEffect(() => {
		setAvailabilityPageNum(1);
		setInventorySearch('');
		setExpandedPlots(new Set());
		setExpandAllMode(false);
		setInventorySortBy('total');
		setInventorySortOrder('desc');
	}, [district, taluka, village, availabilityCategory]);

	useEffect(() => {
		if (district && !districtOptions.some((o) => o.value === district)) {
			setDistrict('');
		}
	}, [district, districtOptions]);

	useEffect(() => {
		if (taluka && !talukaOptions.some((o) => o.value === taluka)) {
			setTaluka('');
		}
	}, [taluka, talukaOptions]);

	useEffect(() => {
		if (village && !villageOptions.some((o) => o.value === village)) {
			setVillage('');
		}
	}, [village, villageOptions]);

	return (
		<Box sx={{ p: 3 }}>
			{/* ═══════════════════════════════════════════════════════════════════════ */}
			{/* Filter Bar */}
			{/* ═══════════════════════════════════════════════════════════════════════ */}
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					mb: 4,
					p: 2.5,
					background: isDark ? '#1a2820' : '#fff',
					border: isDark ? '1px solid #2a3832' : '1px solid #e5e0d8',
					borderRadius: '12px',
					flexWrap: 'wrap',
					alignItems: 'flex-end',
				}}
			>
				<FilterDropdown
					label="Year"
					value={year}
					options={[
						{ value: '', label: 'All Years' },
						{ value: '2026', label: '2026' },
						{ value: '2025', label: '2025' },
						{ value: '2024', label: '2024' },
						{ value: '2023', label: '2023' },
						{ value: '2022', label: '2022' },
						{ value: '2021', label: '2021' },
					]}
					onChange={setYear}
					isDark={isDark}
				/>
				<FilterDropdown
					label="District"
					value={district}
					options={districtOptions}
					onChange={(value) => {
						setDistrict(value);
						setTaluka('');
						setVillage('');
					}}
					isDark={isDark}
				/>
				<FilterDropdown
					label="Taluka"
					value={taluka}
					options={talukaOptions}
					onChange={(value) => {
						setTaluka(value);
						setVillage('');
					}}
					isDark={isDark}
				/>
				<FilterDropdown
					label="Village"
					value={village}
					options={villageOptions}
					onChange={setVillage}
					isDark={isDark}
				/>
			</Box>

			{/* ═══════════════════════════════════════════════════════════════════════ */}
			{/* KPI Cards */}
			{/* ═══════════════════════════════════════════════════════════════════════ */}
			<Box sx={{ mb: 4 }}>
				<Typography
					sx={{
						...analyticsSectionTitleSx,
						color: isDark ? 'rgba(255,255,255,0.85)' : '#1f2937',
					}}
				>
					Summary
				</Typography>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: {
							xs: '1fr',
							sm: 'repeat(2, 1fr)',
							md: 'repeat(3, 1fr)',
							lg: 'repeat(5, 1fr)',
						},
						gap: 2,
						mt: 2,
					}}
				>
					<KPICard
						label="Total Trees"
						value={formatNumber(summary.data?.total_trees)}
						icon={<ForestIcon />}
						isDark={isDark}
						loading={summary.loading}
					/>
					<KPICard
						label="Available"
						value={formatNumber(summary.data?.available)}
						icon={<CheckCircleIcon />}
						isDark={isDark}
						loading={summary.loading}
					/>
					<KPICard
						label="Assigned"
						value={formatNumber(summary.data?.assigned)}
						icon={<PendingIcon />}
						isDark={isDark}
						loading={summary.loading}
					/>
					<KPICard
						label="Foundation"
						value={formatNumber(summary.data?.foundation_trees)}
						icon={<ForestIcon />}
						isDark={isDark}
						loading={summary.loading}
					/>
					<KPICard
						label="Public"
						value={formatNumber(summary.data?.public_trees)}
						icon={<ForestIcon />}
						isDark={isDark}
						loading={summary.loading}
					/>
				</Box>
			</Box>

			{/* ═══════════════════════════════════════════════════════════════════════ */}
			{/* Charts Grid */}
			{/* ═══════════════════════════════════════════════════════════════════════ */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', lg: '3fr 1fr' },
					gap: 3,
					mb: 4,
				}}
			>
				{/* Species Chart */}
				<Box
					sx={{
						background: isDark ? '#1a2820' : '#fff',
						border: isDark ? '1px solid #2a3832' : '1px solid #e5e0d8',
						borderRadius: '12px',
						p: 2.5,
					}}
				>
					<Typography
						sx={{
							...analyticsSectionTitleSx,
							color: isDark ? 'rgba(255,255,255,0.85)' : '#1f2937',
						}}
					>
						Top Species
					</Typography>
					{species.loading ? (
						<Skeleton variant="rectangular" height={300} />
					) : speciesForChart.length > 0 ? (
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={speciesForChart}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke={isDark ? '#2a3832' : '#e5e0d8'}
								/>
								<XAxis
									dataKey="species_name"
									stroke={isDark ? '#9ba39d' : '#6b7280'}
									interval={0}
									angle={-25}
									textAnchor="end"
									height={70}
								/>
								<YAxis stroke={isDark ? '#9ba39d' : '#6b7280'} />
								<Tooltip
									contentStyle={{
										background: isDark ? '#1a2820' : '#fff',
										border: isDark ? '1px solid #2a3832' : '1px solid #e5e0d8',
										color: isDark ? '#e8ebe9' : '#111827',
									}}
								/>
								<Legend />
								<Bar
									dataKey="count"
									fill={ANALYTICS_COLORS.accent}
									name="Total"
								/>
								<Bar
									dataKey="available"
									fill={ANALYTICS_COLORS.positive}
									name="Available"
								/>
							</BarChart>
						</ResponsiveContainer>
					) : (
						<Typography
							sx={{
								color: isDark ? '#9ba39d' : '#6b7280',
								textAlign: 'center',
								py: 4,
							}}
						>
							No data
						</Typography>
					)}
				</Box>

				{/* Age Distribution Chart */}
				<Box
					sx={{
						background: isDark ? '#1a2820' : '#fff',
						border: isDark ? '1px solid #2a3832' : '1px solid #e5e0d8',
						borderRadius: '12px',
						p: 2.5,
					}}
				>
					<Typography
						sx={{
							...analyticsSectionTitleSx,
							color: isDark ? 'rgba(255,255,255,0.85)' : '#1f2937',
						}}
					>
						Age Distribution
					</Typography>
					{ageDistribution.loading ? (
						<Skeleton variant="rectangular" height={300} />
					) : ageDistribution.data && ageDistribution.data.length > 0 ? (
						<>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={ageDistribution.data}>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke={isDark ? '#2a3832' : '#e5e0d8'}
									/>
									<XAxis
										dataKey="age_bucket"
										stroke={isDark ? '#9ba39d' : '#6b7280'}
									/>
									<YAxis stroke={isDark ? '#9ba39d' : '#6b7280'} />
									<Tooltip
										contentStyle={{
											background: isDark ? '#1a2820' : '#fff',
											border: isDark
												? '1px solid #2a3832'
												: '1px solid #e5e0d8',
											color: isDark ? '#e8ebe9' : '#111827',
										}}
									/>
									<Legend />
									<Bar
										dataKey="count"
										fill={ANALYTICS_COLORS.accent}
										name="Total"
										onClick={(data: any) => {
											setSelectedAgeBucket(data.age_bucket);
											setDrilldownOpen(true);
										}}
										style={{ cursor: 'pointer' }}
									/>
									<Bar
										dataKey="available"
										fill={ANALYTICS_COLORS.positive}
										name="Available"
										onClick={(data: any) => {
											setSelectedAgeBucket(data.age_bucket);
											setDrilldownOpen(true);
										}}
										style={{ cursor: 'pointer' }}
									/>
								</BarChart>
							</ResponsiveContainer>
						</>
					) : (
						<Typography
							sx={{
								color: isDark ? '#9ba39d' : '#6b7280',
								textAlign: 'center',
								py: 4,
							}}
						>
							No data
						</Typography>
					)}
				</Box>
			</Box>

			{/* ═══════════════════════════════════════════════════════════════════════ */}
			{/* Trees by Location Table */}
			{/* ═══════════════════════════════════════════════════════════════════════ */}
			<Box sx={{ mb: 4 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
					<Typography
						sx={{
							...analyticsSectionTitleSx,
							color: isDark ? 'rgba(255,255,255,0.85)' : '#1f2937',
						}}
					>
						Trees by Location
					</Typography>
					<Typography
						sx={{
							fontSize: '13px',
							fontWeight: 500,
							color: isDark ? '#9ba39d' : '#6b7280',
							flexShrink: 0,
						}}
					>
						Level
					</Typography>
					<Box
						component="select"
						value={locationLevel}
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
							setLocationLevel(e.target.value as typeof locationLevel)
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
							'&:hover': { borderColor: isDark ? '#3a4a3d' : '#9ca3af' },
							'& option': { color: '#111827', background: '#ffffff' },
						}}
					>
						<option value="district">District</option>
						<option value="taluka">Taluka</option>
						<option value="village">Village</option>
						<option value="site">Site</option>
						<option value="plot">Plot</option>
					</Box>
				</Box>
				<TableContainer
					component={Paper}
					sx={{
						background: isDark ? '#1a2820' : '#fff',
						border: isDark ? '1px solid #2a3832' : '1px solid #e5e0d8',
						overflowX: 'auto',
					}}
				>
					<Table>
						<TableHead>
							<TableRow
								sx={{
									background: isDark ? '#152018' : '#f9f7f4',
									borderBottom: isDark
										? '1px solid #2a3832'
										: '1px solid #e5e0d8',
								}}
							>
								<TableCell
									sx={{
										color: isDark ? '#9ba39d' : '#6b7280',
										fontWeight: 600,
									}}
								>
									Location
								</TableCell>
								<TableCell align="right" sx={{ minWidth: 80 }}>
									<SortColumnHeader
										label="Total"
										columnKey="total"
										currentSortBy={locationSortBy}
										currentSortOrder={locationSortOrder}
										onSort={handleLocationSort}
										isDark={isDark}
									/>
								</TableCell>
								<TableCell align="right" sx={{ minWidth: 80 }}>
									<SortColumnHeader
										label="Assigned"
										columnKey="assigned"
										currentSortBy={locationSortBy}
										currentSortOrder={locationSortOrder}
										onSort={handleLocationSort}
										isDark={isDark}
									/>
								</TableCell>
								<TableCell align="right" sx={{ minWidth: 80 }}>
									<SortColumnHeader
										label="Available"
										columnKey="available"
										currentSortBy={locationSortBy}
										currentSortOrder={locationSortOrder}
										onSort={handleLocationSort}
										isDark={isDark}
									/>
								</TableCell>
								{/* Age bucket columns */}
								{ageBucketColumns.map((col) => (
									<TableCell key={col.key} align="right" sx={{ minWidth: 80 }}>
										<SortColumnHeader
											label={col.label}
											columnKey={col.key}
											currentSortBy={locationSortBy}
											currentSortOrder={locationSortOrder}
											onSort={handleLocationSort}
											isDark={isDark}
										/>
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{byLocation.loading ? (
								Array.from({ length: 5 }).map((_, i) => (
									<TableRow key={i}>
										<TableCell>
											<Skeleton />
										</TableCell>
										<TableCell>
											<Skeleton />
										</TableCell>
										<TableCell>
											<Skeleton />
										</TableCell>
										<TableCell>
											<Skeleton />
										</TableCell>
										{ageBucketColumns.map((col) => (
											<TableCell key={`skel_${col.key}`}>
												<Skeleton />
											</TableCell>
										))}
									</TableRow>
								))
							) : paginatedLocationData.length > 0 ? (
								paginatedLocationData.map((row, idx) => (
									<TableRow
										key={idx}
										sx={{
											'&:hover': {
												background: isDark ? '#152018' : '#f9f7f4',
											},
										}}
									>
										<TableCell sx={{ color: isDark ? '#e8ebe9' : '#111827' }}>
											{row.location}
										</TableCell>
										<TableCell
											align="right"
											sx={{ color: isDark ? '#e8ebe9' : '#111827' }}
										>
											{row.total}
										</TableCell>
										<TableCell
											align="right"
											sx={{ color: isDark ? '#e8ebe9' : '#111827' }}
										>
											{row.assigned}
										</TableCell>
										<TableCell
											align="right"
											sx={{ color: ANALYTICS_COLORS.positive }}
										>
											{row.available}
										</TableCell>
										{/* Age bucket columns */}
										{ageBucketColumns.map((col) => (
											<TableCell
												key={`${idx}_${col.key}`}
												align="right"
												sx={{ color: isDark ? '#e8ebe9' : '#111827' }}
											>
												{(row as any)[col.key] || 0}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={8}
										sx={{
											textAlign: 'center',
											color: isDark ? '#9ba39d' : '#6b7280',
										}}
									>
										No data
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				{/* Pagination Controls */}
				{locationData.length > 0 && (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							mt: 2,
							p: 2,
							background: isDark ? '#1a2820' : '#fff',
							border: isDark ? '1px solid #2a3832' : '1px solid #e5e0d8',
							borderRadius: '12px',
						}}
					>
						<Typography
							sx={{ fontSize: '13px', color: isDark ? '#9ba39d' : '#6b7280' }}
						>
							Showing {locationStartIdx + 1}–
							{Math.min(locationEndIdx, locationData.length)} of{' '}
							{locationData.length}
						</Typography>
						<Box sx={{ display: 'flex', gap: 1 }}>
							<Button
								size="small"
								disabled={locationPageNum === 1}
								onClick={() => setLocationPageNum(locationPageNum - 1)}
								startIcon={<ChevronLeftIcon />}
								sx={{
									color: isDark ? '#9ba39d' : '#6b7280',
									border: isDark ? '1px solid #2a3832' : '1px solid #e5e0d8',
									'&:hover': {
										background: isDark ? '#152018' : '#f9f7f4',
									},
									'&:disabled': {
										opacity: 0.5,
										cursor: 'not-allowed',
									},
								}}
							>
								Prev
							</Button>
							<Typography
								sx={{
									px: 2,
									display: 'flex',
									alignItems: 'center',
									fontSize: '13px',
									color: isDark ? '#9ba39d' : '#6b7280',
								}}
							>
								{locationPageNum} / {totalLocationPages}
							</Typography>
							<Button
								size="small"
								disabled={locationPageNum === totalLocationPages}
								onClick={() => setLocationPageNum(locationPageNum + 1)}
								endIcon={<ChevronRightIcon />}
								sx={{
									color: isDark ? '#9ba39d' : '#6b7280',
									border: isDark ? '1px solid #2a3832' : '1px solid #e5e0d8',
									'&:hover': {
										background: isDark ? '#152018' : '#f9f7f4',
									},
									'&:disabled': {
										opacity: 0.5,
										cursor: 'not-allowed',
									},
								}}
							>
								Next
							</Button>
						</Box>
					</Box>
				)}
			</Box>

			{/* ═══════════════════════════════════════════════════════════════════════ */}
			{/* Inventory Breakdown - Expandable by Plot */}
			{/* ═══════════════════════════════════════════════════════════════════════ */}
			<Box>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 1,
					}}
				>
					<Typography
						sx={{
							...analyticsSectionTitleSx,
							color: isDark ? 'rgba(255,255,255,0.85)' : '#1f2937',
						}}
					>
						Inventory Breakdown
					</Typography>
					<Button
						size="small"
						onClick={handleExpandAll}
						startIcon={expandAllMode ? <ExpandLessIcon /> : <ExpandMoreIcon />}
						sx={{
							textTransform: 'none',
							fontSize: '12px',
							color: isDark ? '#9ba39d' : '#6b7280',
							border: isDark ? '1px solid #2a3832' : '1px solid #d4cfc8',
							'&:hover': {
								background: isDark ? '#152018' : '#f9f7f4',
							},
						}}
					>
						{expandAllMode ? 'Collapse All' : 'Expand All'}
					</Button>
				</Box>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'flex-end',
						justifyContent: 'space-between',
						mt: 1,
					}}
				>
					<Tabs
						value={availabilityCategory}
						onChange={(e, v) => setAvailabilityCategory(v)}
						sx={{
							borderBottom: isDark ? '1px solid #2a3832' : '1px solid #e5e0d8',
							'& .MuiTab-root': {
								color: isDark ? '#9ba39d' : '#6b7280',
								'&.Mui-selected': {
									color: isDark ? '#e8ebe9' : '#111827',
								},
							},
						}}
					>
						<Tab label="All" value="" />
						<Tab label="Foundation" value="Foundation" />
						<Tab label="Public" value="Public" />
						<Tab label="Others" value="Others" />
					</Tabs>
					<Box
						component="input"
						type="text"
						placeholder="Search site or plot…"
						value={inventorySearch}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setInventorySearch(e.target.value)
						}
						sx={{
							fontSize: '13px',
							color: isDark ? '#e8ebe9' : '#111827',
							background: isDark ? '#152018' : '#f9f7f4',
							border: isDark ? '1px solid #2a3832' : '1px solid #d4cfc8',
							borderBottom: isDark ? '1px solid #2a3832' : '1px solid #e5e0d8',
							borderRadius: '8px 8px 0 0',
							padding: '6px 10px',
							fontFamily: 'inherit',
							outline: 'none',
							width: '200px',
							flexShrink: 0,
							mb: 0,
							'&:hover': { borderColor: isDark ? '#3a4a3d' : '#9ca3af' },
							'&:focus': { borderColor: isDark ? '#4a7a4d' : '#6b7280' },
							'&::placeholder': { color: isDark ? '#5a6a5d' : '#9ca3af' },
						}}
					/>
				</Box>
				<TableContainer
					component={Paper}
					sx={{
						background: isDark ? '#1a2820' : '#fff',
						border: isDark ? '1px solid #2a3832' : '1px solid #e5e0d8',
						mt: 2,
					}}
				>
					<Table>
						<TableHead>
							<TableRow
								sx={{
									background: isDark ? '#152018' : '#f9f7f4',
									borderBottom: isDark
										? '1px solid #2a3832'
										: '1px solid #e5e0d8',
								}}
							>
								<TableCell
									sx={{
										color: isDark ? '#9ba39d' : '#6b7280',
										fontWeight: 600,
										width: '40px',
									}}
								></TableCell>
								<TableCell
									sx={{
										color: isDark ? '#9ba39d' : '#6b7280',
										fontWeight: 600,
									}}
								>
									District
								</TableCell>
								<TableCell
									sx={{
										color: isDark ? '#9ba39d' : '#6b7280',
										fontWeight: 600,
									}}
								>
									Site
								</TableCell>
								<TableCell
									sx={{
										color: isDark ? '#9ba39d' : '#6b7280',
										fontWeight: 600,
									}}
								>
									Plot
								</TableCell>
								<TableCell
									sx={{
										color: isDark ? '#9ba39d' : '#6b7280',
										fontWeight: 600,
									}}
								>
									Category
								</TableCell>
								<TableCell align="right" sx={{ minWidth: 80 }}>
									<SortColumnHeader
										label="Total"
										columnKey="total"
										currentSortBy={inventorySortBy}
										currentSortOrder={inventorySortOrder}
										onSort={handleInventorySort}
										isDark={isDark}
									/>
								</TableCell>
								<TableCell align="right" sx={{ minWidth: 80 }}>
									<SortColumnHeader
										label="Available"
										columnKey="available"
										currentSortBy={inventorySortBy}
										currentSortOrder={inventorySortOrder}
										onSort={handleInventorySort}
										isDark={isDark}
									/>
								</TableCell>
								<TableCell align="right" sx={{ minWidth: 80 }}>
									<SortColumnHeader
										label="Giftable"
										columnKey="card_available"
										currentSortBy={inventorySortBy}
										currentSortOrder={inventorySortOrder}
										onSort={handleInventorySort}
										isDark={isDark}
									/>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{plantTypesByPlot.loading ? (
								Array.from({ length: 5 }).map((_, i) => (
									<TableRow key={i}>
										<TableCell>
											<Skeleton />
										</TableCell>
										<TableCell>
											<Skeleton />
										</TableCell>
										<TableCell>
											<Skeleton />
										</TableCell>
										<TableCell>
											<Skeleton />
										</TableCell>
										<TableCell>
											<Skeleton />
										</TableCell>
										<TableCell>
											<Skeleton />
										</TableCell>
										<TableCell>
											<Skeleton />
										</TableCell>
										<TableCell>
											<Skeleton />
										</TableCell>
									</TableRow>
								))
							) : paginatedGroupedPlots.length > 0 ? (
								paginatedGroupedPlots.map((plot) => {
									const isExpanded = expandedPlots.has(`${plot.plot_id}`);
									return (
										<React.Fragment key={plot.plot_id}>
											{/* Plot Summary Row */}
											<TableRow
												sx={{
													cursor: 'pointer',
													'&:hover': {
														background: isDark ? '#152018' : '#f9f7f4',
													},
													background: isDark ? '#1a2820' : '#fafaf8',
												}}
											>
												<TableCell
													onClick={() => handleTogglePlot(`${plot.plot_id}`)}
													sx={{
														textAlign: 'center',
														color: isDark ? '#9ba39d' : '#6b7280',
													}}
												>
													{isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
												</TableCell>
												<TableCell
													sx={{
														color: isDark ? '#e8ebe9' : '#111827',
														fontWeight: 500,
													}}
												>
													{plot.district}
												</TableCell>
												<TableCell
													sx={{
														color: isDark ? '#e8ebe9' : '#111827',
														fontWeight: 500,
													}}
												>
													{plot.site_name}
												</TableCell>
												<TableCell
													sx={{
														color: isDark ? '#e8ebe9' : '#111827',
														fontWeight: 500,
													}}
												>
													{plot.plot_name}
												</TableCell>
												<TableCell
													sx={{ color: isDark ? '#e8ebe9' : '#111827' }}
												>
													{plot.site_category}
												</TableCell>
												<TableCell
													align="right"
													sx={{
														color: isDark ? '#e8ebe9' : '#111827',
														fontWeight: 600,
													}}
												>
													{plot.total}
												</TableCell>
												<TableCell
													align="right"
													sx={{
														color: isDark ? '#e8ebe9' : '#111827',
														fontWeight: 600,
													}}
												>
													{plot.available}
												</TableCell>
												<TableCell
													align="right"
													sx={{
														color: ANALYTICS_COLORS.positive,
														fontWeight: 700,
													}}
												>
													{plot.card_available}
												</TableCell>
											</TableRow>

											{/* Expanded Plant Types - Scrollable Container */}
											{isExpanded && plot.plantTypes.length > 0 && (
												<TableRow>
													<TableCell colSpan={9} sx={{ padding: 0 }}>
														<Box
															sx={{
																overflowY: 'auto',
																maxHeight: '300px',
																background: isDark ? '#0d1510' : '#f5f3f1',
															}}
														>
															<Table size="small">
																<TableBody>
																	{plot.plantTypes.map((pt, idx) => (
																		<TableRow
																			key={`${plot.plot_id}-${idx}`}
																			sx={{
																				'&:hover': {
																					background: isDark
																						? '#152018'
																						: '#ece6e0',
																				},
																			}}
																		>
																			<TableCell>
																				<Box sx={{ pl: 3 }}>
																					<Typography
																						sx={{
																							fontSize: '13px',
																							color: isDark
																								? '#e8ebe9'
																								: '#111827',
																							fontWeight: 500,
																						}}
																					>
																						{pt.species_name}
																					</Typography>
																					{pt.scientific_name && (
																						<Typography
																							sx={{
																								fontSize: '11px',
																								color: isDark
																									? '#9ba39d'
																									: '#999',
																							}}
																						>
																							{pt.scientific_name}
																						</Typography>
																					)}
																				</Box>
																			</TableCell>
																			<TableCell
																				align="right"
																				sx={{
																					fontSize: '12px',
																					color: isDark ? '#9ba39d' : '#888',
																				}}
																			>
																				{pt.total}
																			</TableCell>
																			<TableCell
																				align="right"
																				sx={{
																					fontSize: '12px',
																					color: isDark ? '#9ba39d' : '#888',
																				}}
																			>
																				{pt.available}
																			</TableCell>
																			<TableCell
																				align="right"
																				sx={{
																					fontSize: '12px',
																					color: ANALYTICS_COLORS.positive,
																					fontWeight: 600,
																				}}
																			>
																				{pt.card_available}
																			</TableCell>
																		</TableRow>
																	))}
																</TableBody>
															</Table>
														</Box>
													</TableCell>
												</TableRow>
											)}
										</React.Fragment>
									);
								})
							) : (
								<TableRow>
									<TableCell
										colSpan={8}
										sx={{
											textAlign: 'center',
											color: isDark ? '#9ba39d' : '#6b7280',
										}}
									>
										No data
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				{groupedByPlot.length > 0 && (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mt: 2,
							px: 2,
						}}
					>
						<Typography
							sx={{ fontSize: '12px', color: isDark ? '#9ba39d' : '#6b7280' }}
						>
							Page {availabilityPageNum} / {totalPlotPages} (
							{groupedByPlot.length} plots total)
						</Typography>
						<Box sx={{ display: 'flex', gap: 1 }}>
							<Button
								size="small"
								onClick={() =>
									setAvailabilityPageNum(Math.max(1, availabilityPageNum - 1))
								}
								disabled={availabilityPageNum === 1}
								sx={{
									textTransform: 'none',
									fontSize: '12px',
									color: isDark ? '#9ba39d' : '#6b7280',
									border: isDark ? '1px solid #2a3832' : '1px solid #d4cfc8',
									'&:hover:not(:disabled)': {
										background: isDark ? '#152018' : '#f9f7f4',
									},
								}}
							>
								<ChevronLeftIcon sx={{ fontSize: 16 }} /> Prev
							</Button>
							<Button
								size="small"
								onClick={() =>
									setAvailabilityPageNum(
										Math.min(totalPlotPages, availabilityPageNum + 1),
									)
								}
								disabled={availabilityPageNum === totalPlotPages}
								sx={{
									textTransform: 'none',
									fontSize: '12px',
									color: isDark ? '#9ba39d' : '#6b7280',
									border: isDark ? '1px solid #2a3832' : '1px solid #d4cfc8',
									'&:hover:not(:disabled)': {
										background: isDark ? '#152018' : '#f9f7f4',
									},
								}}
							>
								Next <ChevronRightIcon sx={{ fontSize: 16 }} />
							</Button>
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default TreeAnalysisTab;
