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

type CsrGroup = {
	gift_card_request_id: number;
	event_name: string | null;
	gifted_on: string | null;
	request_id: string | null;
	display_image: string | null;
	total_trees: number;
	first_sapling_id: string | null;
	species: { name: string; count: number }[];
};

const formattedDate = (dateStr: string | null) => {
	if (!dateStr) return '';
	return new Date(dateStr).toLocaleDateString('en-IN', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
};

const CsrEventsPage: React.FC = () => {
	const { name_key } = useParams<{ name_key: string }>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<GroupCsrEventCardsData | null>(null);
	const [selectedGroup, setSelectedGroup] = useState<CsrGroup | null>(null);

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

	const groups = useMemo<CsrGroup[]>(() => {
		if (!data) return [];

		const map = new Map<
			number,
			{
				meta: GroupCsrEventCardItem;
				speciesMap: Map<string, number>;
				firstSaplingId: string | null;
				count: number;
			}
		>();

		for (const card of data.cards) {
			const rid = card.gift_card_request_id;
			if (!map.has(rid)) {
				map.set(rid, {
					meta: card,
					speciesMap: new Map(),
					firstSaplingId: card.sapling_id ?? null,
					count: 0,
				});
			}
			const entry = map.get(rid)!;
			entry.count += 1;
			if (card.tree_type) {
				entry.speciesMap.set(
					card.tree_type,
					(entry.speciesMap.get(card.tree_type) ?? 0) + 1,
				);
			}
			if (!entry.firstSaplingId && card.sapling_id) {
				entry.firstSaplingId = card.sapling_id;
			}
		}

		return Array.from(map.values()).map(
			({ meta, speciesMap, firstSaplingId, count }) => ({
				gift_card_request_id: meta.gift_card_request_id,
				event_name: meta.event_name,
				gifted_on: meta.gifted_on,
				request_id: meta.request_id,
				display_image: meta.display_image,
				total_trees: count,
				first_sapling_id: firstSaplingId,
				species: Array.from(speciesMap.entries())
					.sort((a, b) => b[1] - a[1])
					.map(([name, count]) => ({ name, count })),
			}),
		);
	}, [data]);

	const totalTrees = data?.cards.length ?? 0;
	const totalEvents = groups.length;
	const speciesCount = useMemo(() => {
		if (!data) return 0;
		return new Set(data.cards.map((c) => c.tree_type).filter(Boolean)).size;
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
				{groups.length === 0 ? (
					<Typography sx={{ color: '#5d6c62', textAlign: 'center', py: 8 }}>
						No CSR events found.
					</Typography>
				) : (
					<Box
						sx={{
							maxWidth: 1208,
							mx: 'auto',
							display: 'grid',
							gridTemplateColumns: {
								xs: '1fr',
								sm: 'repeat(2, minmax(0,1fr))',
								md: 'repeat(3, minmax(0,1fr))',
							},
							gap: { xs: 2, md: 2.5 },
						}}
					>
						{groups.map((group) => (
							<CsrGroupCard
								key={group.gift_card_request_id}
								group={group}
								onOpenDrawer={setSelectedGroup}
							/>
						))}
					</Box>
				)}
			</Box>

			<CorpFooter />

			{/* Detail Drawer */}
			<Drawer
				anchor="right"
				open={!!selectedGroup}
				onClose={() => setSelectedGroup(null)}
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
				{selectedGroup && (
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
									{selectedGroup.event_name ?? 'CSR Plantation'}
								</Typography>
								{selectedGroup.gifted_on && (
									<Typography
										sx={{
											color: 'rgba(255,255,255,0.6)',
											fontSize: 13,
											mt: 0.25,
										}}
									>
										{formattedDate(selectedGroup.gifted_on)}
									</Typography>
								)}
							</Box>
							<IconButton
								onClick={() => setSelectedGroup(null)}
								size="small"
								sx={{ color: '#fff', mt: -0.5 }}
							>
								<Close />
							</IconButton>
						</Box>

						{/* Cover image */}
						{selectedGroup.display_image && (
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
									src={selectedGroup.display_image}
									alt={selectedGroup.event_name ?? 'CSR Event'}
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
										{selectedGroup.total_trees.toLocaleString('en-IN')}
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
										{selectedGroup.species.length}
									</Typography>
									<Typography sx={{ fontSize: 11, color: '#8a938d', mt: 0.25 }}>
										Species
									</Typography>
								</Box>
								{selectedGroup.request_id && (
									<Box
										sx={{
											bgcolor: '#fff',
											border: '1px solid #dfe4df',
											borderRadius: '12px',
											px: 2.5,
											py: 1.5,
										}}
									>
										<Typography
											sx={{
												fontSize: 12,
												fontWeight: 600,
												color: '#1f3625',
												lineHeight: 1.3,
											}}
										>
											{selectedGroup.request_id}
										</Typography>
										<Typography
											sx={{ fontSize: 11, color: '#8a938d', mt: 0.25 }}
										>
											Request ID
										</Typography>
									</Box>
								)}
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
									All Tree Species ({selectedGroup.species.length})
								</Typography>
								<Box
									sx={{
										bgcolor: '#fff',
										border: '1px solid #dfe4df',
										borderRadius: '12px',
										overflow: 'hidden',
									}}
								>
									{selectedGroup.species.map(({ name, count }, idx) => (
										<Box key={name}>
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
														{name}
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
															(count / selectedGroup.total_trees) * 100,
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
						{selectedGroup.first_sapling_id && (
							<Box sx={{ px: 3, py: 2.5, borderTop: '1px solid #e2e7e2' }}>
								<Button
									fullWidth
									onClick={() =>
										window.open(
											`/profile/${encodeURIComponent(
												selectedGroup.first_sapling_id!,
											)}`,
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
	group: CsrGroup;
	onOpenDrawer: (g: CsrGroup) => void;
}> = ({ group, onOpenDrawer }) => {
	const handleView = () => {
		if (!group.first_sapling_id) return;
		window.open(
			`/profile/${encodeURIComponent(group.first_sapling_id)}`,
			'_blank',
			'noopener,noreferrer',
		);
	};

	return (
		<Box
			onClick={() => onOpenDrawer(group)}
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
				{group.display_image ? (
					<Box
						component="img"
						src={group.display_image}
						alt={group.event_name ?? 'CSR Event'}
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
						{group.event_name ?? 'CSR Plantation'}
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
						{group.gifted_on && (
							<Typography sx={{ fontSize: 12, color: '#8a938d' }}>
								{formattedDate(group.gifted_on)}
							</Typography>
						)}
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
						{group.species.slice(0, 5).map(({ name, count }) => (
							<Box
								key={name}
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
									{name}
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
						{group.species.length > 5 && (
							<Typography
								onClick={(e) => {
									e.stopPropagation();
									onOpenDrawer(group);
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
								+{group.species.length - 5} more species — View all
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
							{group.total_trees.toLocaleString('en-IN')}
						</Typography>
						<Typography sx={{ fontSize: 11, color: '#8a938d' }}>
							trees planted
						</Typography>
					</Box>

					{group.first_sapling_id && (
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
