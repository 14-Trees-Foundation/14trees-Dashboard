import React from 'react';
import {
	Avatar,
	Box,
	Button,
	Chip,
	Divider,
	Drawer,
	IconButton,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useDonorProfile } from '../hooks/useDonationAnalytics';
import { ANALYTICS_COLORS, LIGHT_ANALYTICS_COLORS } from '../analyticsTheme';
import { useTheme } from '@mui/material/styles';
import {
	arrayToCSV,
	downloadCSV,
	formatFilename,
} from '../../../../utils/csvExport';

interface DonorProfileDrawerProps {
	donorId: number | null;
	profileType: 'user' | 'group';
	themeMode: 'dark' | 'light';
	onClose: () => void;
}

const getInitials = (name: string): string =>
	name
		.split(' ')
		.filter(Boolean)
		.map((w) => w[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);

const formatCurrency = (v: number) =>
	v >= 10000000
		? `₹${(v / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr`
		: v >= 100000
		? `₹${(v / 100000).toFixed(2).replace(/\.?0+$/, '')} L`
		: v >= 1000
		? `₹${(v / 1000).toFixed(1).replace(/\.?0+$/, '')} K`
		: `₹${v.toFixed(0)}`;
const formatDate = (d: string) =>
	new Date(d).toLocaleDateString('en-IN', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});

const DonorProfileDrawer: React.FC<DonorProfileDrawerProps> = ({
	donorId,
	profileType,
	themeMode,
	onClose,
}) => {
	const theme = useTheme();
	const isDark = themeMode === 'dark';
	const C = isDark ? ANALYTICS_COLORS : LIGHT_ANALYTICS_COLORS;
	const { data, loading } = useDonorProfile(donorId, profileType);

	const handleExport = () => {
		if (!data?.recent_donations?.length) return;
		const headers = ['Date', 'Amount', 'Trees', 'Method', 'Status', 'Type'];
		const rows = data.recent_donations.map(
			(d) =>
				[
					d.donation_date ? formatDate(d.donation_date) : '',
					d.amount_received,
					d.trees_count ?? 'N/A',
					d.donation_method ?? 'N/A',
					d.status,
					d.source_type,
				] as (string | number | null | undefined)[],
		);
		downloadCSV(
			arrayToCSV(headers, rows),
			formatFilename(`donor-${donorId}-donations`, {}),
		);
	};

	const drawerBg = isDark ? '#111a14' : theme.palette.background.paper;
	const borderColor = isDark ? '#2a3832' : theme.palette.divider;
	const textPrimary = isDark ? '#e8ebe9' : theme.palette.text.primary;
	const textMuted = isDark ? '#9ba39d' : theme.palette.text.secondary;
	const cardBg = isDark ? '#1a2820' : '#f5f3ee';

	const stats = data?.stats;

	return (
		<Drawer
			anchor="right"
			open={donorId !== null}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: { xs: '100vw', sm: 480 },
					backgroundColor: drawerBg,
					borderLeft: `1px solid ${borderColor}`,
					overflow: 'hidden',
					display: 'flex',
					flexDirection: 'column',
				},
			}}
		>
			{/* Header */}
			<Box
				sx={{
					px: 3,
					pt: 3,
					pb: 2,
					borderBottom: `1px solid ${borderColor}`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					flexShrink: 0,
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					{loading ? (
						<Skeleton
							variant="circular"
							width={48}
							height={48}
							sx={{ bgcolor: isDark ? '#2a3832' : '#e5e0d8' }}
						/>
					) : (
						<Avatar
							sx={{
								width: 48,
								height: 48,
								bgcolor: C.accent,
								color: '#fff',
								fontWeight: 700,
								fontSize: 18,
							}}
						>
							{getInitials(
								profileType === 'group' ? `Org ${donorId}` : `Donor ${donorId}`,
							)}
						</Avatar>
					)}
					<Box>
						{loading ? (
							<Skeleton
								variant="text"
								width={140}
								sx={{ bgcolor: isDark ? '#2a3832' : '#e5e0d8' }}
							/>
						) : (
							<Typography
								sx={{ fontWeight: 700, fontSize: 16, color: textPrimary }}
							>
								{profileType === 'group' ? 'Organization' : 'Donor'} #{donorId}
							</Typography>
						)}
						<Chip
							label={profileType === 'group' ? 'Corporate' : 'Personal'}
							size="small"
							sx={{
								fontSize: '10px',
								height: 20,
								bgcolor: profileType === 'group' ? C.corporate : C.personal,
								color: '#fff',
								fontWeight: 600,
								mt: 0.25,
							}}
						/>
					</Box>
				</Box>
				<Box sx={{ display: 'flex', gap: 1 }}>
					<Button
						size="small"
						variant="outlined"
						startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
						onClick={handleExport}
						sx={{
							fontSize: '12px',
							borderRadius: '8px',
							textTransform: 'none',
							borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#e5e0d8',
							color: textMuted,
						}}
					>
						CSV
					</Button>
					<IconButton onClick={onClose} size="small" sx={{ color: textMuted }}>
						<CloseIcon fontSize="small" />
					</IconButton>
				</Box>
			</Box>

			{/* Body */}
			<Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2 }}>
				{/* Summary cards */}
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: 1.5,
						mb: 3,
					}}
				>
					{[
						{
							label: 'Total Donated',
							value: stats ? formatCurrency(Number(stats.total_amount)) : '—',
						},
						{
							label: 'Trees Sponsored',
							value: stats ? String(stats.total_trees || 'N/A') : '—',
						},
						{
							label: 'Donations',
							value: stats ? String(stats.total_donations) : '—',
						},
						{
							label: 'Avg Donation',
							value: stats ? formatCurrency(Number(stats.avg_donation)) : '—',
						},
					].map((item) => (
						<Box
							key={item.label}
							sx={{ background: cardBg, borderRadius: '10px', p: 1.5 }}
						>
							{loading ? (
								<Skeleton
									variant="text"
									sx={{ bgcolor: isDark ? '#2a3832' : '#e5e0d8' }}
								/>
							) : (
								<>
									<Typography
										sx={{
											fontSize: '11px',
											color: textMuted,
											textTransform: 'uppercase',
											letterSpacing: '0.07em',
											fontWeight: 500,
										}}
									>
										{item.label}
									</Typography>
									<Typography
										sx={{
											fontSize: '18px',
											fontWeight: 700,
											color: textPrimary,
											mt: 0.25,
										}}
									>
										{item.value}
									</Typography>
								</>
							)}
						</Box>
					))}
				</Box>

				{/* Years active */}
				{stats?.years_active?.length ? (
					<Box sx={{ mb: 3 }}>
						<Typography
							sx={{
								fontSize: '11px',
								fontWeight: 600,
								textTransform: 'uppercase',
								letterSpacing: '0.08em',
								color: textMuted,
								mb: 1,
							}}
						>
							Years Active
						</Typography>
						<Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
							{stats.years_active.map((y) => (
								<Chip
									key={y}
									label={y}
									size="small"
									sx={{
										fontSize: '11px',
										bgcolor: isDark ? '#2a3832' : '#e5e0d8',
										color: textPrimary,
										fontWeight: 600,
									}}
								/>
							))}
						</Box>
					</Box>
				) : null}

				{/* Payment methods */}
				{stats?.payment_methods?.length ? (
					<Box sx={{ mb: 3 }}>
						<Typography
							sx={{
								fontSize: '11px',
								fontWeight: 600,
								textTransform: 'uppercase',
								letterSpacing: '0.08em',
								color: textMuted,
								mb: 1,
							}}
						>
							Payment Preferences
						</Typography>
						<Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
							{stats.payment_methods.map((m) => (
								<Chip
									key={m}
									label={
										m === 'trees'
											? 'Tree Sponsorship'
											: m === 'amount'
											? 'Monetary'
											: m
									}
									size="small"
									sx={{
										fontSize: '11px',
										bgcolor: C.accent + '22',
										color: C.accent,
										fontWeight: 600,
										border: `1px solid ${C.accent}44`,
									}}
								/>
							))}
						</Box>
					</Box>
				) : null}

				<Divider sx={{ borderColor, mb: 2 }} />

				{/* Recent donations */}
				<Typography
					sx={{
						fontSize: '11px',
						fontWeight: 600,
						textTransform: 'uppercase',
						letterSpacing: '0.08em',
						color: textMuted,
						mb: 1.5,
					}}
				>
					Recent Donations
				</Typography>
				{loading ? (
					Array.from({ length: 5 }).map((_, i) => (
						<Skeleton
							key={i}
							variant="rectangular"
							height={40}
							sx={{
								mb: 0.5,
								borderRadius: 1,
								bgcolor: isDark ? '#2a3832' : '#e5e0d8',
							}}
						/>
					))
				) : (
					<Table size="small">
						<TableHead>
							<TableRow>
								{['Date', 'Amount', 'Trees', 'Method'].map((h) => (
									<TableCell
										key={h}
										sx={{
											fontSize: '11px',
											color: textMuted,
											borderColor,
											py: 0.5,
											fontWeight: 600,
										}}
									>
										{h}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{(data?.recent_donations ?? []).map((d, i) => (
								<TableRow key={i}>
									<TableCell
										sx={{
											fontSize: '12px',
											color: textPrimary,
											borderColor,
											py: 0.75,
										}}
									>
										{d.donation_date ? formatDate(d.donation_date) : '—'}
									</TableCell>
									<TableCell
										sx={{
											fontSize: '12px',
											color: C.accent,
											borderColor,
											py: 0.75,
											fontWeight: 600,
										}}
									>
										{formatCurrency(d.amount_received)}
									</TableCell>
									<TableCell
										sx={{
											fontSize: '12px',
											color: textPrimary,
											borderColor,
											py: 0.75,
										}}
									>
										{d.trees_count ?? (
											<span style={{ color: textMuted }}>N/A</span>
										)}
									</TableCell>
									<TableCell
										sx={{
											fontSize: '12px',
											color: textMuted,
											borderColor,
											py: 0.75,
										}}
									>
										{d.donation_method ?? d.source_type}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</Box>
		</Drawer>
	);
};

export default DonorProfileDrawer;
