import React from 'react';
import { Box, Typography } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface SortColumnHeaderProps {
	label: string;
	columnKey: string;
	currentSortBy: string | null;
	currentSortOrder: 'asc' | 'desc';
	onSort: (columnKey: string) => void;
	isDark: boolean;
}

export const SortColumnHeader: React.FC<SortColumnHeaderProps> = ({
	label,
	columnKey,
	currentSortBy,
	currentSortOrder,
	onSort,
	isDark,
}) => {
	const isActive = currentSortBy === columnKey;
	const icon = isActive ? (
		currentSortOrder === 'asc' ? (
			<ArrowUpwardIcon sx={{ fontSize: '14px' }} />
		) : (
			<ArrowDownwardIcon sx={{ fontSize: '14px' }} />
		)
	) : (
		<UnfoldMoreIcon sx={{ fontSize: '14px', opacity: 0.4 }} />
	);

	return (
		<Box
			onClick={() => onSort(columnKey)}
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-end',
				gap: 0.5,
				cursor: 'pointer',
				userSelect: 'none',
				width: '100%',
				'&:hover': {
					opacity: 0.8,
				},
			}}
		>
			<Typography
				sx={{
					fontSize: '13px',
					fontWeight: 600,
					color: isDark ? '#9ba39d' : '#6b7280',
				}}
			>
				{label}
			</Typography>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					color: isActive
						? isDark
							? '#e8ebe9'
							: '#111827'
						: isDark
						? '#5a6a5d'
						: '#d1d5db',
					transition: 'color 0.2s',
				}}
			>
				{icon}
			</Box>
		</Box>
	);
};
