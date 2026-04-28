import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Divider,
	Drawer,
	IconButton,
	Typography,
} from '@mui/material';
import { Close, Forest, Park, Spa } from '@mui/icons-material';
import ApiClient from '../../api/apiClient/apiClient';
import { NotFound } from '../notfound/NotFound';
import {
	GroupCsrEventCardItem,
	GroupCsrEventCardsData,
} from '../../types/GroupLanding';
import CorpFooter from './components/CorpFooter';

const formattedDate = (dateStr: string | null) => {
	if (!dateStr) return '';
	return new Date(dateStr).toLocaleDateString('en-IN', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
};

const parseTrees = (v: string | number) => Number(v) || 0;

const CsrEventsPage: React.FC = () => {
	const { name_key } = useParams<{ name_key: string }>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<GroupCsrEventCardsData | null>(null);
	const [selected, setSelected] = useState<GroupCsrEventCardItem | null>(null);

	useEffect(() => {
		if (!name_key) {
			setError('Invalid group key');
			setLoading(false);
			return;
		}

		const apiClient = new ApiClient();
		apiClient
			.getGroupCsrEventCardsData(name_key)
			.then((response) => setData(response))
			.catch((err: any) =>
				setError(err?.message ?? 'Failed to load CSR events'),
			)
			.finally(() => setLoading(false));
	}, [name_key]);

	const totalTrees = useMemo(
		() =>
			data?.cards.reduce((sum, c) => sum + parseTrees(c.total_trees), 0) ?? 0,
		[data],
	);

	const totalEvents = data?.cards.length ?? 0;

	const speciesCount = useMemo(() => {
		if (!data) return 0;
		const names = new Set<string>();
		data.cards.forEach((c) =>
			c.tree_species.forEach((s) => names.add(s.tree_type)),
		);
		return names.size;
	}, [data]);

	if (loading) {
		return (
			<Box
				sx={{
					minHeight: '100vh',
					display: 'grid',
					placeItems: 'center',
					bgcolor: '#edf1ed',
				}}
			>
				<CircularProgress sx={{ color: '#21452f' }} />
			</Box>
		);
	}

	if (error || !data) {
		return <NotFound text={error ?? 'CSR events not found'} />;
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: '#dce2dc',
				'&, & *': { fontFamily: '"Instrument Sans", "HelveticaNowDisplay"' },
			}}
		>
			{/* Hero */}
			<Box
				sx={{
					position: 'relative',
					width: '100%',
					minHeight: { xs: '40vh', md: '52vh' },
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					overflow: 'hidden',
					bgcolor: '#0d2016',
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						background:
							'linear-gradient(160deg, #0d2016 0%, #1a3828 60%, #0d2016 100%)',
						zIndex: 0,
					}}
				/>
				<Box
					sx={{
						position: 'relative',
						zIndex: 1,
						textAlign: 'center',
						px: 3,
					}}
				>
					<Box
						sx={{
							width: 64,
							height: 64,
							borderRadius: '50%',
							bgcolor: 'rgba(255,255,255,0.08)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							mx: 'auto',
							mb: 2.5,
						}}
					>
						<Spa sx={{ fontSize: 34, color: '#7ecb9a' }} />
					</Box>
					<Typography
						sx={{
							color: '#fff',
							fontWeight: 700,
							fontSize: { xs: 28, md: 40 },
							lineHeight: 1.2,
							mb: 1.5,
						}}
					>
						CSR Plantations
					</Typography>
					<Typography
						sx={{
							color: 'rgba(255,255,255,0.62)',
							fontSize: { xs: 14, md: 16 },
							maxWidth: 480,
							mx: 'auto',
						}}
					>
						Trees planted as part of our corporate social responsibility
						initiatives.
					</Typography>

					{/* Stats pills */}
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							gap: 2,
							mt: 3.5,
							flexWrap: 'wrap',
						}}
					>
						<StatPill
							icon={<Park sx={{ fontSize: 18, color: '#7ecb9a' }} />}
							label="Trees Planted"
							value={totalTrees}
						/>
						<StatPill
							icon={<Forest sx={{ fontSize: 18, color: '#7ecb9a' }} />}
							label="CSR Events"
							value={totalEvents}
						/>
						<StatPill
							icon={<Spa sx={{ fontSize: 18, color: '#7ecb9a' }} />}
							label="Tree Species"
							value={speciesCount}
						/>
					</Box>
				</Box>
			</Box>

			{/* Cards grid */}
			<Box sx={{ px: { xs: 2, sm: 4 }, py: { xs: 4, md: 6 } }}>
				{data.cards.length === 0 ? (
					<Typography sx={{ color: '#5d6c62', textAlign: 'center', py: 8 }}>
						No CSR events found.
					</Typography>
				) : (
					<Box
						sx={{
							maxWidth: 1208,
							mx: 'auto',
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'center',
							gap: { xs: 2, md: 2.5 },
						}}
					>
						{data.cards.map((card, idx) => (
							<Box
								key={card.sponsored_by_user_id ?? idx}
								sx={{ width: { xs: '100%', sm: '360px', md: '380px' } }}
							>
								<CsrGroupCard card={card} onOpenDrawer={setSelected} />
							</Box>
						))}
					</Box>
				)}
			</Box>

			<CorpFooter />

			{/* Detail Drawer */}
			<Drawer
				anchor="right"
				open={!!selected}
				onClose={() => setSelected(null)}
				PaperProps={{
					sx: {
						width: { xs: '100vw', sm: 420 },
						bgcolor: '#f4f7f4',
						'&, & *': {
							fontFamily: '"Instrument Sans", "HelveticaNowDisplay"',
						},
					},
				}}
			>
				{selected && (
					<Box
						sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
					>
						{/* Drawer header */}
						<Box
							sx={{
								bgcolor: '#1f3625',
								px: 3,
								py: 2.5,
								display: 'flex',
								alignItems: 'flex-start',
								justifyContent: 'space-between',
								gap: 1,
							}}
						>
							<Box sx={{ flex: 1 }}>
								<Typography
									sx={{
										color: '#fff',
										fontWeight: 700,
										fontSize: 18,
										lineHeight: '26px',
									}}
								>
									{selected.event_name ?? 'CSR Plantation'}
								</Typography>
								{selected.gifted_on && (
									<Typography
										sx={{
											color: 'rgba(255,255,255,0.6)',
											fontSize: 13,
											mt: 0.25,
										}}
									>
										{formattedDate(selected.gifted_on)}
									</Typography>
								)}
							</Box>
							<IconButton
								onClick={() => setSelected(null)}
								size="small"
								sx={{ color: '#fff', mt: -0.5 }}
							>
								<Close />
							</IconButton>
						</Box>

						{/* Cover image */}
						{selected.display_image && (
							<Box
								sx={{
									height: 200,
									bgcolor: '#1f3625',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexShrink: 0,
								}}
							>
								<Box
									component="img"
									src={selected.display_image}
									alt={selected.event_name ?? 'CSR Event'}
									sx={{
										width: '75%',
										height: '75%',
										objectFit: 'contain',
										borderRadius: '8px',
									}}
								/>
							</Box>
						)}

						{/* Body */}
						<Box
							sx={{
								flex: 1,
								overflowY: 'auto',
								px: 3,
								py: 3,
								display: 'flex',
								flexDirection: 'column',
								gap: 3,
							}}
						>
							{/* Summary chips */}
							<Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
								<Box
									sx={{
										bgcolor: '#fff',
										border: '1px solid #dfe4df',
										borderRadius: '12px',
										px: 2.5,
										py: 1.5,
										textAlign: 'center',
									}}
								>
									<Typography
										sx={{
											fontSize: 22,
											fontWeight: 700,
											color: '#1f3625',
											lineHeight: 1.1,
										}}
									>
										{parseTrees(selected.total_trees).toLocaleString('en-IN')}
									</Typography>
									<Typography sx={{ fontSize: 11, color: '#8a938d', mt: 0.25 }}>
										Trees Planted
									</Typography>
								</Box>
								<Box
									sx={{
										bgcolor: '#fff',
										border: '1px solid #dfe4df',
										borderRadius: '12px',
										px: 2.5,
										py: 1.5,
										textAlign: 'center',
									}}
								>
									<Typography
										sx={{
											fontSize: 22,
											fontWeight: 700,
											color: '#1f3625',
											lineHeight: 1.1,
										}}
									>
										{selected.tree_species.length}
									</Typography>
									<Typography sx={{ fontSize: 11, color: '#8a938d', mt: 0.25 }}>
										Species
									</Typography>
								</Box>
							</Box>

							{/* Full species list */}
							<Box>
								<Typography
									sx={{
										fontSize: 12,
										fontWeight: 700,
										color: '#7a867d',
										textTransform: 'uppercase',
										letterSpacing: 0.5,
										mb: 1.5,
									}}
								>
									All Tree Species ({selected.tree_species.length})
								</Typography>
								<Box
									sx={{
										bgcolor: '#fff',
										border: '1px solid #dfe4df',
										borderRadius: '12px',
										overflow: 'hidden',
									}}
								>
									{selected.tree_species.map(({ tree_type, count }, idx) => (
										<Box key={tree_type}>
											{idx > 0 && <Divider sx={{ borderColor: '#f0f3f0' }} />}
											<Box
												sx={{
													px: 2,
													py: 1.25,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
													gap: 1,
												}}
											>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														gap: 1.25,
														flex: 1,
														minWidth: 0,
													}}
												>
													<Spa
														sx={{
															fontSize: 16,
															color: '#7ecb9a',
															flexShrink: 0,
														}}
													/>
													<Typography
														sx={{
															fontSize: 14,
															color: '#2f4a38',
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															whiteSpace: 'nowrap',
														}}
													>
														{tree_type}
													</Typography>
												</Box>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														gap: 1,
														flexShrink: 0,
													}}
												>
													<Typography
														sx={{
															fontSize: 14,
															fontWeight: 700,
															color: '#1f3625',
														}}
													>
														{count.toLocaleString('en-IN')}
													</Typography>
													<Chip
														label={`${Math.round(
															(count / parseTrees(selected.total_trees)) * 100,
														)}%`}
														size="small"
														sx={{
															bgcolor: '#dbe4d6',
															color: '#38513f',
															fontWeight: 600,
															fontSize: 10,
															height: 20,
															borderRadius: '5px',
															'& .MuiChip-label': { px: 0.75 },
														}}
													/>
												</Box>
											</Box>
										</Box>
									))}
								</Box>
							</Box>
						</Box>

						{/* Footer action */}
						{selected.sponsored_by_user_id && (
							<Box sx={{ px: 3, py: 2.5, borderTop: '1px solid #e2e7e2' }}>
								<Button
									fullWidth
									onClick={() =>
										window.open(
											`/profile/user/${selected.sponsored_by_user_id}`,
											'_blank',
											'noopener,noreferrer',
										)
									}
									sx={{
										bgcolor: '#1f452d',
										color: '#fff',
										textTransform: 'none',
										fontWeight: 600,
										fontSize: 15,
										height: 48,
										borderRadius: '12px',
										'&:hover': { bgcolor: '#163824' },
									}}
								>
									View Trees
								</Button>
							</Box>
						)}
					</Box>
				)}
			</Drawer>
		</Box>
	);
};

const StatPill: React.FC<{
	icon: React.ReactNode;
	label: string;
	value: number;
}> = ({ icon, label, value }) => (
	<Box
		sx={{
			px: 2.5,
			py: 1.25,
			borderRadius: '999px',
			bgcolor: 'rgba(255,255,255,0.08)',
			border: '1px solid rgba(255,255,255,0.15)',
			display: 'flex',
			alignItems: 'center',
			gap: 1.25,
		}}
	>
		{icon}
		<Box>
			<Typography
				sx={{ color: '#fff', fontWeight: 700, fontSize: 20, lineHeight: 1.1 }}
			>
				{value.toLocaleString('en-IN')}
			</Typography>
			<Typography
				sx={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, mt: 0.1 }}
			>
				{label}
			</Typography>
		</Box>
	</Box>
);

const CsrGroupCard: React.FC<{
	card: GroupCsrEventCardItem;
	onOpenDrawer: (c: GroupCsrEventCardItem) => void;
}> = ({ card, onOpenDrawer }) => {
	const totalTrees = parseTrees(card.total_trees);

	const handleView = () => {
		if (!card.sponsored_by_user_id) return;
		window.open(
			`/profile/user/${card.sponsored_by_user_id}`,
			'_blank',
			'noopener,noreferrer',
		);
	};

	return (
		<Box
			onClick={() => onOpenDrawer(card)}
			sx={{
				borderRadius: '16px',
				overflow: 'hidden',
				bgcolor: '#fff',
				border: '1px solid #dfe4df',
				boxShadow: '0px 4px 17px 0px #1F36251A',
				display: 'flex',
				flexDirection: 'column',
				cursor: 'pointer',
				transition: 'box-shadow 0.2s, transform 0.2s',
				'&:hover': {
					boxShadow: '0 10px 26px rgba(31,54,37,0.16)',
					transform: 'translateY(-2px)',
				},
			}}
		>
			{/* Cover image */}
			<Box
				sx={{
					height: { xs: 160, md: 180 },
					bgcolor: '#1f3625',
					overflow: 'hidden',
					flexShrink: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{card.display_image ? (
					<Box
						component="img"
						src={card.display_image}
						alt={card.event_name ?? 'CSR Event'}
						sx={{
							width: '75%',
							height: '75%',
							objectFit: 'contain',
							display: 'block',
							borderRadius: '8px',
						}}
					/>
				) : (
					<Box
						sx={{
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Box
							component="img"
							src="/dark_logo.png"
							alt="placeholder"
							sx={{ width: 48, opacity: 0.2 }}
						/>
					</Box>
				)}
			</Box>

			{/* Body */}
			<Box
				sx={{
					p: 2.25,
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					gap: 1.5,
				}}
			>
				{/* Header */}
				<Box>
					<Typography
						sx={{
							color: '#1f3625',
							fontWeight: 600,
							fontSize: 16,
							lineHeight: '22px',
							mb: 0.5,
							overflow: 'hidden',
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
						}}
					>
						{card.event_name ?? 'CSR Plantation'}
					</Typography>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							flexWrap: 'wrap',
						}}
					>
						<Chip
							label="CSR"
							size="small"
							sx={{
								bgcolor: '#dbe4d6',
								color: '#38513f',
								fontWeight: 600,
								fontSize: 10,
								height: 22,
								borderRadius: '6px',
								'& .MuiChip-label': { px: 1 },
							}}
						/>
						{/* {card.gifted_on && (
							<Typography sx={{ fontSize: 12, color: '#8a938d' }}>
								{formattedDate(card.gifted_on)}
							</Typography>
						)} */}
					</Box>
				</Box>

				<Divider sx={{ borderColor: '#eff2ef' }} />

				{/* Species breakdown */}
				<Box sx={{ flex: 1 }}>
					<Typography
						sx={{
							fontSize: 11,
							fontWeight: 700,
							color: '#7a867d',
							textTransform: 'uppercase',
							letterSpacing: 0.4,
							mb: 1,
						}}
					>
						Tree Species
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
						{card.tree_species.slice(0, 5).map(({ tree_type, count }) => (
							<Box
								key={tree_type}
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									gap: 1,
								}}
							>
								<Typography
									sx={{
										fontSize: 13,
										color: '#2f4a38',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
										flex: 1,
									}}
								>
									{tree_type}
								</Typography>
								<Typography
									sx={{
										fontSize: 13,
										fontWeight: 600,
										color: '#1f3625',
										flexShrink: 0,
									}}
								>
									× {count.toLocaleString('en-IN')}
								</Typography>
							</Box>
						))}
						{card.tree_species.length > 5 && (
							<Typography
								onClick={(e) => {
									e.stopPropagation();
									onOpenDrawer(card);
								}}
								sx={{
									fontSize: 12,
									color: '#1f452d',
									fontWeight: 600,
									mt: 0.25,
									cursor: 'pointer',
									'&:hover': { textDecoration: 'underline' },
								}}
							>
								+{card.tree_species.length - 5} more species — View all
							</Typography>
						)}
					</Box>
				</Box>

				<Divider sx={{ borderColor: '#eff2ef' }} />

				{/* Footer */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<Box>
						<Typography
							sx={{
								fontSize: 20,
								fontWeight: 700,
								color: '#1f3625',
								lineHeight: 1.1,
							}}
						>
							{totalTrees.toLocaleString('en-IN')}
						</Typography>
						<Typography sx={{ fontSize: 11, color: '#8a938d' }}>
							trees planted
						</Typography>
					</Box>

					{card.sponsored_by_user_id && (
						<Button
							onClick={(e) => {
								e.stopPropagation();
								handleView();
							}}
							sx={{
								bgcolor: '#1f452d',
								color: '#fff',
								textTransform: 'none',
								fontWeight: 500,
								fontSize: 14,
								height: 38,
								px: 2.5,
								borderRadius: '10px',
								'&:hover': { bgcolor: '#163824' },
							}}
						>
							View
						</Button>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default CsrEventsPage;
