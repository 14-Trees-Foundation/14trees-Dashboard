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
import { darkTheme, lightAnalyticsTheme } from '../../../theme';
import { analyticsPageSx } from '../analytics/analyticsTheme';
import SurveyForms from './components/SurveyForms';
import SurveyResponses from './components/SurveyResponses';
import SurveyOverview from './components/SurveyOverview';

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

interface SurveysContentProps {
	activeTab: number;
	onTabChange: (value: number) => void;
	themeMode: 'dark' | 'light';
	onToggleTheme: () => void;
}

const SurveysContent: React.FC<SurveysContentProps> = ({
	activeTab,
	onTabChange,
	themeMode,
	onToggleTheme,
}) => {
	const theme = useTheme();
	const isLightMode = themeMode === 'light';

	return (
		<Box
			sx={{
				...analyticsPageSx,
				m: -2,
				minHeight: '100vh',
				backgroundColor: theme.palette.background.default,
				transition: 'background-color 0.2s ease',
			}}
		>
			<Card
				elevation={0}
				sx={{
					backgroundColor: isLightMode
						? 'transparent'
						: theme.palette.background.default,
					border: isLightMode ? 'none' : `1px solid ${theme.palette.divider}`,
					borderBottom: isLightMode ? 'none' : undefined,
					borderRadius: isLightMode ? 0 : 2,
					boxShadow: 'none',
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
						<Typography
							variant="h4"
							sx={{
								mt: 1,
								mb: 1,
								fontWeight: 600,
								color: isLightMode ? '#1a1a1a' : 'text.primary',
							}}
						>
							Surveys
						</Typography>
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
										themeMode === 'dark' ? 'rgba(255,255,255,0.6)' : '#64748b',
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

					<Tabs
						value={activeTab}
						onChange={(_, value) => onTabChange(value)}
						variant="scrollable"
						scrollButtons="auto"
						sx={{
							borderBottom: isLightMode ? '1px solid #eeebe4' : 'none',
							'& .MuiTabs-flexContainer': {
								backgroundColor: isLightMode
									? 'transparent'
									: theme.palette.background.paper,
								borderRadius: isLightMode ? 0 : '10px',
							},
							'& .MuiTab-root': {
								color: isLightMode ? '#9ca3af' : 'rgba(255,255,255,0.4)',
								fontSize: '0.72rem',
								letterSpacing: '0.08em',
								fontWeight: 500,
								borderBottom: isLightMode ? '2px solid transparent' : 'none',
							},
							'& .MuiTab-root.Mui-selected': {
								color: isLightMode ? '#1a1a1a' : theme.palette.text.primary,
								borderBottomColor: isLightMode ? '#1a1a1a' : 'transparent',
							},
							'& .MuiTabs-indicator': {
								background: isLightMode ? '#1a1a1a' : 'rgba(255,255,255,0.35)',
								height: isLightMode ? 0 : 2,
							},
						}}
						TabIndicatorProps={{
							sx: {
								background: isLightMode ? '#1a1a1a' : 'rgba(255,255,255,0.35)',
								height: isLightMode ? 0 : 2,
							},
						}}
					>
						<Tab label="OVERVIEW" />
						<Tab label="FORMS" />
						<Tab label="RESPONSES" />
					</Tabs>

					<TabPanel value={activeTab} index={0}>
						<Box sx={{ pt: 2 }}>
							<SurveyOverview />
						</Box>
					</TabPanel>
					<TabPanel value={activeTab} index={1}>
						<Box sx={{ pt: 2 }}>
							<SurveyForms />
						</Box>
					</TabPanel>
					<TabPanel value={activeTab} index={2}>
						<Box sx={{ pt: 2 }}>
							<SurveyResponses />
						</Box>
					</TabPanel>
				</CardContent>
			</Card>
		</Box>
	);
};

const THEME_KEY = 'surveys-theme-preference';

const SurveysPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
		const saved = window.localStorage.getItem(THEME_KEY);
		return saved === 'light' || saved === 'dark' ? saved : 'dark';
	});

	useEffect(() => {
		const saved = window.localStorage.getItem(THEME_KEY);
		if (saved === 'light' || saved === 'dark') setThemeMode(saved);
	}, []);

	const toggleTheme = () => {
		const next = themeMode === 'dark' ? 'light' : 'dark';
		setThemeMode(next);
		window.localStorage.setItem(THEME_KEY, next);
	};

	return (
		<ThemeProvider
			theme={themeMode === 'dark' ? darkTheme : lightAnalyticsTheme}
		>
			<SurveysContent
				activeTab={activeTab}
				onTabChange={setActiveTab}
				themeMode={themeMode}
				onToggleTheme={toggleTheme}
			/>
		</ThemeProvider>
	);
};

export default SurveysPage;
