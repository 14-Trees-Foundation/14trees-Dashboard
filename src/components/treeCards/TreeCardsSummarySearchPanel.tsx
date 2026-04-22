import { Box, Button, InputBase, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';

type MetricItem = {
	label: string;
	value: string;
	icon: React.ReactNode;
	accent?: boolean;
};

type Props = {
	metrics: MetricItem[];
	searchValue: string;
	onSearchValueChange: (value: string) => void;
	onSearch: () => void;
	searchPlaceholder?: string;
	resultsLabel?: string;
	extraControls?: React.ReactNode;
	maxWidth?: number | string;
};

const TreeCardsSummarySearchPanel: React.FC<Props> = ({
	metrics,
	searchValue,
	onSearchValueChange,
	onSearch,
	searchPlaceholder = 'Search...',
	resultsLabel,
	extraControls,
	maxWidth = 1360,
}) => (
	<Box sx={{ px: { xs: 2, sm: 4 }, py: { xs: 2.5, sm: 3 } }}>
		<Box
			sx={{
				maxWidth,
				mx: 'auto',
				display: 'grid',
				gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
				gap: 2,
			}}
		>
			<Box
				sx={{
					bgcolor: '#fff',
					borderRadius: '22px',
					border: '1px solid #e5e9e5',
					boxShadow: '0px 4px 17px 0px #1F36251A',
					p: 1.5,
					display: 'grid',
					gridTemplateColumns: {
						xs: '1fr',
						sm: `repeat(${Math.max(metrics.length, 1)}, 1fr)`,
					},
					gap: 1.5,
				}}
			>
				{metrics.map((metric) => (
					<MetricTile
						key={metric.label}
						label={metric.label}
						value={metric.value}
						icon={metric.icon}
						accent={metric.accent}
					/>
				))}
			</Box>

			<Box
				sx={{
					bgcolor: '#fff',
					borderRadius: '22px',
					border: '1px solid #e5e9e5',
					boxShadow: '0px 4px 17px 0px #1F36251A',
					p: 2,
					display: 'flex',
					flexDirection: 'column',
					gap: 1.8,
				}}
			>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: 'minmax(0, 1fr) auto',
						alignItems: 'center',
						gap: 1,
						border: '1px solid #d5ddd5',
						borderRadius: '12px',
						pl: 1.5,
						pr: 0.5,
						minHeight: 52,
						width: '100%',
						overflow: 'hidden',
						boxSizing: 'border-box',
					}}
				>
					<Box
						sx={{ display: 'flex', alignItems: 'center', minWidth: 0, gap: 1 }}
					>
						<Search sx={{ fontSize: 18, color: '#718272', flexShrink: 0 }} />
						<InputBase
							fullWidth
							value={searchValue}
							onChange={(e) => onSearchValueChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') onSearch();
							}}
							placeholder={searchPlaceholder}
							sx={{
								minWidth: 0,
								fontSize: { xs: 14, md: 16 },
								color: '#4f6156',
								'& input': { minWidth: 0 },
								'& input::placeholder': { color: '#748479', opacity: 1 },
							}}
						/>
					</Box>
					<Button
						onClick={onSearch}
						sx={{
							bgcolor: '#1f452d',
							color: '#fff',
							borderRadius: '12px',
							textTransform: 'none',
							minWidth: { xs: 96, sm: 110 },
							height: 44,
							fontSize: { xs: 14, md: 18 },
							fontWeight: 500,
							flexShrink: 0,
							'&:hover': { bgcolor: '#163824' },
						}}
					>
						Search
					</Button>
				</Box>
				{extraControls}
				{resultsLabel ? (
					<Typography
						sx={{ color: '#6f7b73', fontSize: 14, alignSelf: 'flex-start' }}
					>
						{resultsLabel}
					</Typography>
				) : null}
			</Box>
		</Box>
	</Box>
);

const MetricTile: React.FC<MetricItem> = ({
	label,
	value,
	icon,
	accent = false,
}) => (
	<Box
		sx={{
			bgcolor: accent ? '#e9f0f9' : '#f2f4f2',
			borderRadius: '14px',
			p: 1.25,
			minHeight: 80,
			display: 'flex',
			alignItems: 'center',
		}}
	>
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
			<Box
				sx={{
					width: 44,
					height: 44,
					borderRadius: '999px',
					bgcolor: '#ffffff',
					border: '1px solid #dce2dc',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexShrink: 0,
				}}
			>
				{icon}
			</Box>
			<Box>
				<Typography sx={{ fontSize: 14, color: '#66756b', lineHeight: 1.2 }}>
					{label}
				</Typography>
				<Typography sx={{ fontSize: 20, color: '#1f3625', lineHeight: 1.05 }}>
					{value}
				</Typography>
			</Box>
		</Box>
	</Box>
);

export default TreeCardsSummarySearchPanel;
