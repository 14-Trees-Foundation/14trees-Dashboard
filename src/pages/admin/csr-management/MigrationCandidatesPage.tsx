import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Typography,
	Chip,
	Avatar,
	LinearProgress,
	Tooltip,
	Button,
} from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ApiClient from '../../../api/apiClient/apiClient';
import { darkTheme, lightAnalyticsTheme } from '../../../theme';
import {
	analyticsPageSx,
	analyticsSectionTitleSx,
	analyticsCardSx,
	ANALYTICS_COLORS,
	LIGHT_ANALYTICS_COLORS,
} from '../shared/adminTheme';

const THEME_KEY = 'csr_management_theme';

interface MigrationCandidate {
	group_id: number;
	group_name: string;
	logo_url: string | null;
	total_gcrs: number;
	total_trees: number;
	migrated_gcrs: number;
	pending_gcrs: number;
	group_migrated: boolean;
}

interface Props {
	isDark: boolean;
}

const MigrationCandidatesContent: React.FC<Props> = ({ isDark }) => {
	const navigate = useNavigate();
	const theme = useTheme();
	const colors = isDark ? ANALYTICS_COLORS : LIGHT_ANALYTICS_COLORS;
	const [data, setData] = useState<MigrationCandidate[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		const api = new ApiClient();
		api
			.getCsrMigrationCandidates()
			.then((res) => setData(res.candidates ?? []))
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	const columns: ColumnsType<MigrationCandidate> = [
		{
			title: 'Corporate',
			key: 'corporate',
			render: (_, row) => (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					<Avatar
						src={row.logo_url ?? undefined}
						sx={{
							width: 32,
							height: 32,
							fontSize: 14,
							bgcolor: colors.primary,
						}}
					>
						{row.group_name[0]}
					</Avatar>
					<Typography
						variant="body2"
						sx={{
							fontWeight: 600,
							color: theme.palette.text.primary,
							cursor: 'pointer',
							'&:hover': { color: theme.palette.primary.main },
						}}
						onClick={() =>
							navigate(`/admin/csr-management/migrate/${row.group_id}`)
						}
					>
						{row.group_name}
					</Typography>
				</Box>
			),
		},
		{
			title: 'Total GCRs',
			dataIndex: 'total_gcrs',
			align: 'right',
			render: (v) => <Typography variant="body2">{v}</Typography>,
		},
		{
			title: 'Total Trees',
			dataIndex: 'total_trees',
			align: 'right',
			render: (v) => (
				<Typography variant="body2" sx={{ color: colors.green }}>
					{Number(v).toLocaleString()}
				</Typography>
			),
		},
		{
			title: 'Progress',
			key: 'progress',
			width: 200,
			render: (_, row) => {
				const pct =
					row.total_gcrs > 0
						? Math.round((row.migrated_gcrs / row.total_gcrs) * 100)
						: 0;
				return (
					<Box>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								mb: 0.5,
							}}
						>
							<Typography
								variant="caption"
								sx={{ color: theme.palette.text.secondary }}
							>
								{row.migrated_gcrs}/{row.total_gcrs} migrated
							</Typography>
							<Typography variant="caption" sx={{ color: colors.primary }}>
								{pct}%
							</Typography>
						</Box>
						<LinearProgress
							variant="determinate"
							value={pct}
							sx={{
								height: 6,
								borderRadius: 3,
								bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
								'& .MuiLinearProgress-bar': { bgcolor: colors.primary },
							}}
						/>
					</Box>
				);
			},
		},
		{
			title: 'Status',
			key: 'status',
			align: 'center',
			render: (_, row) => {
				if (row.group_migrated) {
					return (
						<Chip
							icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
							label="Migrated"
							size="small"
							sx={{
								bgcolor: isDark ? 'rgba(76,175,80,0.15)' : '#e8f5e9',
								color: '#4caf50',
								fontWeight: 600,
								fontSize: '0.75rem',
							}}
						/>
					);
				}
				if (row.pending_gcrs > 0) {
					return (
						<Chip
							icon={<PendingIcon sx={{ fontSize: 14 }} />}
							label={`${row.pending_gcrs} pending`}
							size="small"
							sx={{
								bgcolor: isDark ? 'rgba(255,152,0,0.15)' : '#fff3e0',
								color: '#ff9800',
								fontWeight: 600,
								fontSize: '0.75rem',
							}}
						/>
					);
				}
				return (
					<Chip
						label="Verify & Archive"
						size="small"
						sx={{
							bgcolor: isDark ? 'rgba(33,150,243,0.15)' : '#e3f2fd',
							color: '#2196f3',
							fontWeight: 600,
							fontSize: '0.75rem',
						}}
					/>
				);
			},
		},
		{
			title: 'Action',
			key: 'action',
			align: 'center',
			render: (_, row) => (
				<Button
					variant="outlined"
					size="small"
					startIcon={<SwapHorizIcon />}
					onClick={() =>
						navigate(`/admin/csr-management/migrate/${row.group_id}`)
					}
					sx={{
						textTransform: 'none',
						fontSize: '0.75rem',
						borderColor: colors.primary,
						color: colors.primary,
						'&:hover': {
							borderColor: colors.primary,
							bgcolor: `${colors.primary}14`,
						},
					}}
				>
					{row.group_migrated ? 'View' : 'Migrate'}
				</Button>
			),
		},
	];

	return (
		<Box
			sx={{
				...analyticsPageSx,
				m: -2,
				minHeight: '100vh',
				backgroundColor: theme.palette.background.default,
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
					mb: 3,
					flexWrap: 'wrap',
					gap: 2,
				}}
			>
				<Box>
					<Typography
						variant="h5"
						sx={{
							...analyticsSectionTitleSx,
							fontWeight: 700,
							color: theme.palette.text.primary,
						}}
					>
						CSR Migration
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: theme.palette.text.secondary, mt: 0.5 }}
					>
						Move corporate gift card records to the CSR flow — one company at a
						time
					</Typography>
				</Box>
				<Button
					variant="outlined"
					size="small"
					onClick={() => navigate('/admin/csr-management')}
					sx={{
						textTransform: 'none',
						fontSize: '0.8rem',
						borderColor: colors.border,
						color: theme.palette.text.secondary,
					}}
				>
					← Back to CSR Management
				</Button>
			</Box>

			<Box
				sx={{
					...(isDark
						? analyticsCardSx
						: {
								backgroundColor: '#fff',
								border: '1px solid #eeebe4',
								borderRadius: 2,
						  }),
					p: 0,
					overflow: 'hidden',
				}}
			>
				<Table
					dataSource={data}
					columns={columns}
					rowKey="group_id"
					loading={loading}
					pagination={false}
					size="small"
					style={{
						background: 'transparent',
						color: theme.palette.text.primary,
					}}
				/>
			</Box>
		</Box>
	);
};

const MigrationCandidatesPage: React.FC = () => {
	const [themeMode, setThemeMode] = useState<'dark' | 'light'>(
		() => (localStorage.getItem(THEME_KEY) as 'dark' | 'light') ?? 'light',
	);
	const toggle = () => {
		const next = themeMode === 'dark' ? 'light' : 'dark';
		setThemeMode(next);
		localStorage.setItem(THEME_KEY, next);
	};

	return (
		<ThemeProvider
			theme={themeMode === 'dark' ? darkTheme : lightAnalyticsTheme}
		>
			<Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 999 }}>
				<Tooltip
					title={
						themeMode === 'light'
							? 'Switch to dark mode'
							: 'Switch to light mode'
					}
				>
					<span
						onClick={toggle}
						style={{
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							color: '#888',
						}}
					>
						{themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
					</span>
				</Tooltip>
			</Box>
			<MigrationCandidatesContent isDark={themeMode === 'dark'} />
		</ThemeProvider>
	);
};

export default MigrationCandidatesPage;
