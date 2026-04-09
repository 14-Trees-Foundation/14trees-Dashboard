import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import RefreshIcon from '@mui/icons-material/Refresh';
import ApiClient from '../../../../api/apiClient/apiClient';
import type {
	AISummaryInsight,
	AISummaryInsightType,
} from '../../../../types/analytics';

interface AISummaryPanelProps {
	year: number;
	themeMode: 'dark' | 'light';
}

const PREFIXES: AISummaryInsightType[] = ['TREND', 'HIGHLIGHT', 'ACTION'];

const apiClient = new ApiClient();

function parseInsights(text: string): AISummaryInsight[] {
	const lines = text.split('\n').filter((l) => l.trim().length > 0);
	const insights: AISummaryInsight[] = [];
	for (const line of lines) {
		for (const prefix of PREFIXES) {
			if (line.trimStart().startsWith(`${prefix}:`)) {
				insights.push({
					type: prefix,
					text: line
						.trimStart()
						.slice(prefix.length + 1)
						.trim(),
				});
				break;
			}
		}
	}
	return insights;
}

const ICON_CONFIG: Record<
	AISummaryInsightType,
	{ symbol: string; darkColor: string; lightColor: string }
> = {
	TREND: { symbol: '↑', darkColor: '#9bc53d', lightColor: '#4b83d4' },
	HIGHLIGHT: { symbol: '◆', darkColor: '#4caf6e', lightColor: '#059669' },
	ACTION: { symbol: '!', darkColor: '#e8a838', lightColor: '#d97706' },
};

const AISummaryPanel: React.FC<AISummaryPanelProps> = ({ year, themeMode }) => {
	const isDark = themeMode === 'dark';

	const [streamedText, setStreamedText] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isStreaming, setIsStreaming] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fromCache, setFromCache] = useState(false);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

	const abortRef = useRef(false);

	const fetchSummary = useCallback(
		async (force = false) => {
			abortRef.current = true;
			setStreamedText('');
			setError(null);
			setIsLoading(true);
			setIsStreaming(false);
			setFromCache(false);

			await new Promise((r) => setTimeout(r, 20));
			abortRef.current = false;

			let firstChunk = true;

			await apiClient.streamAISummary(
				year,
				force,
				(chunk) => {
					if (abortRef.current) return;
					if (firstChunk) {
						setIsLoading(false);
						setIsStreaming(true);
						firstChunk = false;
					}
					setStreamedText((prev) => prev + chunk);
				},
				() => {
					if (abortRef.current) return;
					setIsStreaming(false);
					setLastUpdated(new Date());
				},
				(err) => {
					if (abortRef.current) return;
					setIsLoading(false);
					setIsStreaming(false);
					setError(err || 'Failed to generate summary');
				},
			);
		},
		[year],
	);

	useEffect(() => {
		fetchSummary(false);
		return () => {
			abortRef.current = true;
		};
	}, [year]);

	const insights = parseInsights(streamedText);

	const cardSx = isDark
		? {
				background: '#1a2820',
				border: '1px solid #2a3832',
				borderRadius: 2,
				p: 2.5,
				mb: 3,
		  }
		: {
				background: '#fff',
				border: '1px solid #dde1e7',
				boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
				borderRadius: 2,
				p: 2.5,
				mb: 3,
		  };

	const textColor = isDark ? '#e8ebe9' : '#1a202c';
	const mutedColor = isDark ? '#6b7a6e' : '#9ca3af';
	const titleColor = isDark ? '#9ba39d' : '#6b7280';

	return (
		<Box sx={cardSx}>
			{/* Header */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					mb: 1.5,
				}}
			>
				<Typography
					variant="caption"
					sx={{
						color: titleColor,
						fontWeight: 600,
						letterSpacing: '0.08em',
						textTransform: 'uppercase',
						fontSize: 11,
					}}
				>
					AI Insights
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					{fromCache && !isLoading && !isStreaming && (
						<Typography
							variant="caption"
							sx={{ color: mutedColor, fontSize: 10 }}
						>
							cached
						</Typography>
					)}
					<Tooltip title="Regenerate insights">
						<span>
							<IconButton
								size="small"
								onClick={() => fetchSummary(true)}
								disabled={isLoading || isStreaming}
								sx={{ color: mutedColor, '&:hover': { color: textColor } }}
							>
								<RefreshIcon sx={{ fontSize: 16 }} />
							</IconButton>
						</span>
					</Tooltip>
				</Box>
			</Box>

			{/* Loading */}
			{isLoading && (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
					<Skeleton
						variant="text"
						width="90%"
						sx={{ bgcolor: isDark ? '#1f2f24' : '#e5e7eb' }}
					/>
					<Skeleton
						variant="text"
						width="75%"
						sx={{ bgcolor: isDark ? '#1f2f24' : '#e5e7eb' }}
					/>
					<Skeleton
						variant="text"
						width="60%"
						sx={{ bgcolor: isDark ? '#1f2f24' : '#e5e7eb' }}
					/>
				</Box>
			)}

			{/* Error */}
			{!isLoading && error && (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Typography variant="body2" sx={{ color: mutedColor }}>
						{error}
					</Typography>
					<Typography
						variant="body2"
						onClick={() => fetchSummary(false)}
						sx={{
							color: isDark ? '#9bc53d' : '#4b83d4',
							cursor: 'pointer',
							textDecoration: 'underline',
						}}
					>
						Try again
					</Typography>
				</Box>
			)}

			{/* Insights */}
			{!isLoading && !error && (insights.length > 0 || isStreaming) && (
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
					{insights.map((insight, idx) => {
						const cfg = ICON_CONFIG[insight.type];
						const iconColor = isDark ? cfg.darkColor : cfg.lightColor;
						const isLast = idx === insights.length - 1;
						return (
							<Box
								key={idx}
								sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}
							>
								<Typography
									component="span"
									sx={{
										color: iconColor,
										fontWeight: 700,
										fontSize: 14,
										lineHeight: '22px',
										minWidth: 16,
										userSelect: 'none',
									}}
								>
									{cfg.symbol}
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: textColor, lineHeight: 1.6, flex: 1 }}
								>
									{insight.text}
									{isStreaming && isLast && (
										<Box
											component="span"
											sx={{
												display: 'inline-block',
												width: 2,
												height: '1em',
												bgcolor: textColor,
												ml: 0.25,
												verticalAlign: 'text-bottom',
												animation: 'blink 1s step-start infinite',
												'@keyframes blink': {
													'0%,100%': { opacity: 1 },
													'50%': { opacity: 0 },
												},
											}}
										/>
									)}
								</Typography>
							</Box>
						);
					})}

					{isStreaming && insights.length === 0 && (
						<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
							<Typography
								variant="body2"
								sx={{
									color: textColor,
									lineHeight: 1.6,
									whiteSpace: 'pre-wrap',
									flex: 1,
								}}
							>
								{streamedText}
								<Box
									component="span"
									sx={{
										display: 'inline-block',
										width: 2,
										height: '1em',
										bgcolor: textColor,
										ml: 0.25,
										verticalAlign: 'text-bottom',
										animation: 'blink 1s step-start infinite',
										'@keyframes blink': {
											'0%,100%': { opacity: 1 },
											'50%': { opacity: 0 },
										},
									}}
								/>
							</Typography>
						</Box>
					)}
				</Box>
			)}

			{/* Footer */}
			{!isLoading && (
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
					<Typography
						variant="caption"
						sx={{ color: mutedColor, fontSize: 10 }}
					>
						{lastUpdated
							? `Updated ${lastUpdated.toLocaleTimeString([], {
									hour: '2-digit',
									minute: '2-digit',
							  })} · `
							: ''}
						Powered by Claude
					</Typography>
				</Box>
			)}
		</Box>
	);
};

export default AISummaryPanel;
