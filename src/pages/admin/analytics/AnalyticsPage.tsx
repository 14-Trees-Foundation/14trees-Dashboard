import React, { useEffect, useState } from 'react';
import {
	Box,
	Card,
	CardContent,
	Tab,
	Tabs,
	Typography,
	IconButton,
	Tooltip,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import GiftCardAnalysisTab from './GiftCardAnalysisTab';
import { analyticsPageSx } from './analyticsTheme';
import { darkTheme, lightAnalyticsTheme } from '../../../theme';

interface TabPanelProps {
	children: React.ReactNode;
	index: number;
	value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
	if (value !== index) return null;

	return (
		<Box role="tabpanel" sx={{ mt: 1, background: 'transparent', p: 0 }}>
			{children}
		</Box>
	);
};

interface AnalyticsContentProps {
	activeTab: number;
	onTabChange: (value: number) => void;
	themeMode: 'dark' | 'light';
	onToggleTheme: () => void;
}

const AnalyticsContent: React.FC<AnalyticsContentProps> = ({
	activeTab,
	onTabChange,
	themeMode,
	onToggleTheme,
}) => {
	const theme = useTheme();
	const isLightMode = themeMode === 'light';

	return (
		<Box
			id="analytics-page"
			sx={{
				...analyticsPageSx,
				minHeight: '100vh',
				backgroundColor: theme.palette.background.default,
				transition: 'background-color 0.2s ease',
			}}
		>
			<Card
				elevation={0}
				sx={{
					backgroundColor: theme.palette.background.paper,
					border: `1px solid ${theme.palette.divider}`,
					borderRadius: 2,
					boxShadow: isLightMode ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
					px: 3,
					py: 2,
					mb: 3,
				}}
			>
				<CardContent sx={{ px: 0, py: 0 }}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							flexWrap: 'wrap',
							gap: 2,
							mb: 1,
						}}
					>
						<Box>
							<Typography
								variant="h4"
								sx={{ mt: 1, mb: 1, color: 'text.primary', fontWeight: 600 }}
							>
								Analytics
							</Typography>
							<Typography
								variant="body2"
								sx={{ mb: 1, color: 'text.secondary' }}
							>
								Dedicated analytics workspace. Gift card analysis is the default
								tab and more analytics tabs can be added here later.
							</Typography>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<Tooltip
								title={
									themeMode === 'dark'
										? 'Switch to light mode'
										: 'Switch to dark mode'
								}
							>
								<IconButton
									onClick={onToggleTheme}
									size="small"
									sx={{
										width: 34,
										height: 34,
										borderRadius: '8px',
										border:
											themeMode === 'dark'
												? '1px solid rgba(255,255,255,0.15)'
												: '1px solid #dde1e7',
										color:
											themeMode === 'dark'
												? 'rgba(255,255,255,0.6)'
												: '#64748b',
										backgroundColor:
											themeMode === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
										'&:hover': {
											backgroundColor:
												themeMode === 'dark'
													? 'rgba(255,255,255,0.1)'
													: '#f1f5f9',
											color: themeMode === 'dark' ? '#fff' : '#0f172a',
										},
									}}
								>
									{themeMode === 'dark' ? (
										<Brightness7Icon fontSize="small" />
									) : (
										<Brightness4Icon fontSize="small" />
									)}
								</IconButton>
							</Tooltip>
						</Box>
					</Box>

					<Tabs
						value={activeTab}
						onChange={(_, value) => onTabChange(value)}
						variant="scrollable"
						scrollButtons="auto"
						sx={{
							'& .MuiTabs-flexContainer': {
								backgroundColor: theme.palette.background.paper,
								borderRadius: '10px',
							},
							'& .MuiTab-root': {
								color: isLightMode ? '#94a3b8' : 'rgba(255,255,255,0.4)',
								fontSize: '0.72rem',
								letterSpacing: '0.08em',
								fontWeight: 500,
							},
							'& .MuiTab-root.Mui-selected': {
								color: theme.palette.text.primary,
							},
							'& .MuiTabs-indicator': {
								background: isLightMode ? '#0f172a' : 'rgba(255,255,255,0.35)',
							},
						}}
						TabIndicatorProps={{
							sx: {
								background: isLightMode ? '#0f172a' : 'rgba(255,255,255,0.35)',
							},
						}}
					>
						<Tab label="GIFT CARD ANALYSIS" />
					</Tabs>

					<TabPanel value={activeTab} index={0}>
						<GiftCardAnalysisTab
							themeMode={themeMode}
							onToggleTheme={onToggleTheme}
						/>
					</TabPanel>
				</CardContent>
			</Card>
		</Box>
	);
};

const THEME_STORAGE_KEY = 'analytics-theme-preference';

const getStoredThemePreference = () => {
	if (typeof window === 'undefined') {
		return 'dark';
	}
	const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
	return saved === 'light' || saved === 'dark' ? saved : 'dark';
};

const AnalyticsPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() =>
		getStoredThemePreference(),
	);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}
		const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
		if (saved === 'light' || saved === 'dark') {
			setThemeMode(saved);
		}
	}, []);

	const currentTheme = themeMode === 'dark' ? darkTheme : lightAnalyticsTheme;
	const toggleTheme = () => {
		const next = themeMode === 'dark' ? 'light' : 'dark';
		setThemeMode(next);
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(THEME_STORAGE_KEY, next);
		}
	};
	return (
		<ThemeProvider theme={currentTheme}>
			<AnalyticsContent
				activeTab={activeTab}
				onTabChange={setActiveTab}
				themeMode={themeMode}
				onToggleTheme={toggleTheme}
			/>
		</ThemeProvider>
	);
};

export default AnalyticsPage;
