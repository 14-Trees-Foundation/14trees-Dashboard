import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, IconButton, Tooltip } from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { darkTheme, lightAnalyticsTheme } from '../../../theme';
import { analyticsPageSx, analyticsSectionTitleSx } from '../shared/adminTheme';
import CorporateListTab from './CorporateListTab';
import CsrRequestListTab from './CsrRequestListTab';

const THEME_KEY = 'csr_management_theme';

const CsrManagementContent: React.FC<{
	themeMode: 'dark' | 'light';
	onToggle: () => void;
}> = ({ themeMode, onToggle }) => {
	const [activeTab, setActiveTab] = useState(0);
	const theme = useTheme();
	const isLight = themeMode === 'light';

	const tabSx = {
		color: theme.palette.text.secondary,
		fontWeight: 500,
		fontSize: '0.85rem',
		minHeight: 40,
		textTransform: 'none' as const,
		'&.Mui-selected': { color: theme.palette.primary.main, fontWeight: 700 },
	};

	return (
		<Box
			sx={{
				...analyticsPageSx,
				m: -2,
				minHeight: '100vh',
				backgroundColor: theme.palette.background.default,
			}}
		>
			{/* Header */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
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
						CSR Management
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: theme.palette.text.secondary, mt: 0.5 }}
					>
						Corporate Social Responsibility commitments and tree planting
					</Typography>
				</Box>
				<Tooltip
					title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
				>
					<IconButton
						onClick={onToggle}
						size="small"
						sx={{ color: theme.palette.text.secondary }}
					>
						{isLight ? <Brightness4Icon /> : <Brightness7Icon />}
					</IconButton>
				</Tooltip>
			</Box>

			{/* Tabs */}
			<Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, mb: 3 }}>
				<Tabs
					value={activeTab}
					onChange={(_, v) => setActiveTab(v)}
					sx={{
						minHeight: 40,
						'& .MuiTabs-indicator': {
							backgroundColor: theme.palette.primary.main,
						},
					}}
				>
					<Tab
						icon={<CorporateFareIcon sx={{ fontSize: 18 }} />}
						iconPosition="start"
						label="Corporates"
						sx={tabSx}
					/>
					<Tab
						icon={<ListAltIcon sx={{ fontSize: 18 }} />}
						iconPosition="start"
						label="All Requests"
						sx={tabSx}
					/>
				</Tabs>
			</Box>

			{activeTab === 0 && <CorporateListTab isDark={!isLight} />}
			{activeTab === 1 && <CsrRequestListTab isDark={!isLight} />}
		</Box>
	);
};

const CsrManagementPage: React.FC = () => {
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
			<CsrManagementContent themeMode={themeMode} onToggle={toggle} />
		</ThemeProvider>
	);
};

export default CsrManagementPage;
