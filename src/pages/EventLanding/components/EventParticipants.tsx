import { useMemo, useState } from 'react';
import { Box, Typography, InputBase, Button, Divider } from '@mui/material';
import {
	FilterList,
	KeyboardArrowDown,
	Park,
	Spa,
	AccountCircle,
} from '@mui/icons-material';
import { EventLandingParticipant } from '../../../types/EventLanding';

type Props = {
	participants: EventLandingParticipant[];
};

const EventParticipants: React.FC<Props> = ({ participants }) => {
	const [searchInput, setSearchInput] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [viewMode, setViewMode] = useState<'people' | 'tree'>('people');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	if (participants.length === 0) return null;

	const nativeSpeciesCount = useMemo(() => {
		const uniqueSpecies = new Set(
			participants
				.map((p) => p.plant_type_english_name ?? p.plant_type_name)
				.filter(Boolean),
		);
		return uniqueSpecies.size;
	}, [participants]);

	const filteredParticipants = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		let result = participants.filter((p) => {
			if (!q) return true;

			const name = p.name.toLowerCase();
			const species = (
				p.plant_type_english_name ??
				p.plant_type_name ??
				''
			).toLowerCase();
			return name.includes(q) || species.includes(q);
		});

		result.sort((a, b) => {
			const aLabel = a.name.toLowerCase();
			const bLabel = b.name.toLowerCase();

			return sortOrder === 'asc'
				? aLabel.localeCompare(bLabel)
				: bLabel.localeCompare(aLabel);
		});

		return result;
	}, [participants, searchQuery, viewMode, sortOrder]);

	const onSearch = () => setSearchQuery(searchInput);

	return (
		<Box
			sx={{
				py: { xs: 5, md: 8 },
				px: { xs: 3, md: 8 },
				bgcolor: '#f5f5f0',
			}}
		>
			<Box
				sx={{
					width: '100%',
					maxWidth: '1360px',
					mx: 'auto',
					mb: { xs: 5, md: 7 },
				}}
			>
				<Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
					<Typography
						sx={{
							fontWeight: 400,
							fontSize: { xs: '24px', md: '44px' },
							color: '#1f3625',
							lineHeight: 1.1,
							mb: 1,
						}}
					>
						All trees planted
					</Typography>
					<Typography
						sx={{
							fontSize: { xs: 14, md: 20 },
							color: '#2f4a38',
							lineHeight: 1.5,
						}}
					>
						{participants.length} Trees Planted in this grove,{' '}
						{nativeSpeciesCount} Tree Species native to the region
					</Typography>
				</Box>

				<Box
					sx={{
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
							// px: 2,
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
							gap: 1.5,
							alignContent: 'center',
						}}
					>
						<Box
							sx={{
								bgcolor: '#f2f4f2',
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
									<Park sx={{ color: '#31503d', fontSize: 23 }} />
								</Box>
								<Box>
									<Typography
										sx={{ fontSize: 14, color: '#66756b', lineHeight: 1.2 }}
									>
										Trees Planted
									</Typography>
									<Typography
										sx={{ fontSize: 20, color: '#1f3625', lineHeight: 1.05 }}
									>
										{participants.length}+
									</Typography>
								</Box>
							</Box>
						</Box>

						<Box
							sx={{
								bgcolor: '#f2f4f2',
								borderRadius: '14px',
								p: 1.25,
								height: 80,
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
									<Spa sx={{ color: '#31503d', fontSize: 23 }} />
								</Box>
								<Box>
									<Typography
										sx={{ fontSize: 15, color: '#66756b', lineHeight: 1.2 }}
									>
										Acres restored
									</Typography>
									<Typography
										sx={{ fontSize: 20, color: '#1f3625', lineHeight: 1.05 }}
									>
										00 Acres
									</Typography>
								</Box>
							</Box>
						</Box>

						<Box
							sx={{
								bgcolor: '#e9f0f9',
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
									<Spa sx={{ color: '#31503d', fontSize: 23 }} />
								</Box>
								<Box>
									<Typography
										sx={{ fontSize: 14, color: '#66756b', lineHeight: 1.2 }}
									>
										Native species
									</Typography>
									<Typography
										sx={{ fontSize: 20, color: '#1f3625', lineHeight: 1.05 }}
									>
										{nativeSpeciesCount}
									</Typography>
								</Box>
							</Box>
						</Box>
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
								display: 'flex',
								alignItems: 'center',
								gap: 1,
								border: '1px solid #d5ddd5',
								borderRadius: '12px',
								pl: 2,
								pr: 0.6,
								minHeight: 52,
							}}
						>
							<InputBase
								fullWidth
								placeholder="Search by Name..."
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') onSearch();
								}}
								sx={{
									fontSize: { xs: 14, md: 16 },
									color: '#4f6156',
									'& input::placeholder': { color: '#748479', opacity: 1 },
								}}
							/>
							<Button
								onClick={onSearch}
								sx={{
									bgcolor: '#1f452d',
									color: '#fff',
									borderRadius: '12px',
									textTransform: 'none',
									minWidth: 110,
									height: 44,
									fontSize: { xs: 14, md: 18 },
									fontWeight: 500,
									'&:hover': { bgcolor: '#163824' },
								}}
							>
								Search
							</Button>
						</Box>

						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								gap: 1,
								flexWrap: 'wrap',
							}}
						>
							<Box
								sx={{
									display: 'inline-flex',
									alignItems: 'center',
									p: 0.5,
									borderRadius: '14px',
									bgcolor: '#dce5cd',
									gap: 0.5,
								}}
							>
								<Button
									onClick={() => setViewMode('people')}
									sx={{
										minWidth: { xs: 132, sm: 140 },
										height: 42,
										borderRadius: '10px',
										textTransform: 'none',
										fontSize: { xs: 14, md: 16 },
										fontWeight: 500,
										color: '#1f3625',
										bgcolor: viewMode === 'people' ? '#ffffff' : 'transparent',
										boxShadow:
											viewMode === 'people'
												? '0px 1px 2px rgba(31, 54, 37, 0.12)'
												: 'none',
										'&:hover': {
											bgcolor:
												viewMode === 'people'
													? '#ffffff'
													: 'rgba(255,255,255,0.32)',
										},
									}}
								>
									People view
								</Button>
								<Button
									onClick={() => setViewMode('tree')}
									sx={{
										minWidth: { xs: 120, sm: 130 },
										height: 42,
										borderRadius: '10px',
										textTransform: 'none',
										fontSize: { xs: 14, md: 16 },
										fontWeight: 500,
										color: '#1f3625',
										bgcolor: viewMode === 'tree' ? '#ffffff' : 'transparent',
										boxShadow:
											viewMode === 'tree'
												? '0px 1px 2px rgba(31, 54, 37, 0.12)'
												: 'none',
										'&:hover': {
											bgcolor:
												viewMode === 'tree'
													? '#ffffff'
													: 'rgba(255,255,255,0.32)',
										},
									}}
								>
									Tree view
								</Button>
							</Box>

							<Button
								onClick={() =>
									setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
								}
								sx={{
									border: '1px solid #d5ddd5',
									borderRadius: '12px',
									minHeight: 46,
									px: 2,
									textTransform: 'none',
									color: '#30453a',
									gap: 1,
								}}
							>
								<FilterList sx={{ fontSize: 20 }} />
								<Typography
									sx={{ fontSize: { xs: 14, md: 16 }, fontWeight: 500 }}
								>
									{sortOrder === 'asc' ? 'A-z order' : 'Z-a order'}
								</Typography>
								<KeyboardArrowDown sx={{ fontSize: 22 }} />
							</Button>
						</Box>
					</Box>
				</Box>
			</Box>

			{/* <Typography
                sx={{
                    fontFamily: '"Instrument Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: { xs: '22px', md: '32px' },
                    color: '#1a2b1e',
                    mb: 1,
                }}
            >
                {viewMode === 'tree' ? 'Participants by tree species' : 'Participants'}
            </Typography>
            <Typography sx={{ color: '#6f7b73', fontSize: 15, mb: 4 }}>
                {filteredParticipants.length}{' '}
                {filteredParticipants.length === 1 ? 'person' : 'people'} shown for this event
            </Typography> */}

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: {
						xs: '1fr',
						sm: 'repeat(2, minmax(0, 1fr))',
						md: 'repeat(3, minmax(0, 1fr))',
						lg: 'repeat(5, minmax(0, 1fr))',
					},
					gap: { xs: 2, md: 2.5 },
					width: '100%',
					maxWidth: '1520px',
					mx: 'auto',
				}}
			>
				{filteredParticipants.map((p) => {
					const cleanedPlantName = (p.plant_type_name ?? '')
						.replace(/\s*\(.*\)\s*$/, '')
						.trim();
					const localPlantNameMatch = (p.plant_type_name ?? '').match(
						/\(([^)]+)\)/,
					);
					const localPlantName = localPlantNameMatch
						? localPlantNameMatch[1].trim()
						: '';
					const englishPlantName = (p.plant_type_english_name ?? '').trim();
					const primaryPlantName =
						cleanedPlantName || englishPlantName || 'Tree name unavailable';
					const englishTreeType =
						englishPlantName && englishPlantName !== primaryPlantName
							? englishPlantName
							: '';
					const cardImage = viewMode === 'tree' ? p.tree_image : p.image_url;
					const plantIllustration = (p.plant_type_illustration ?? '').trim();

					return (
						<Box
							key={p.user_id}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								bgcolor: '#fff',
								borderRadius: '18px',
								overflow: 'hidden',
								border: '1px solid #e5e9e5',
								minHeight: 430,
								'& .view-profile-btn': {
									opacity: { xs: 1, md: 0 },
									pointerEvents: { xs: 'auto', md: 'none' },
									transform: { xs: 'none', md: 'translateY(4px)' },
									transition: 'opacity 180ms ease, transform 180ms ease',
								},
								'&:hover .view-profile-btn': {
									opacity: 1,
									pointerEvents: 'auto',
									transform: 'translateY(0)',
								},
								'& .tree-illustration-overlay': {
									opacity: { xs: 1, md: 0 },
									transform: {
										xs: 'translateY(0)',
										md: 'translateY(8px) scale(0.98)',
									},
									transition: 'opacity 220ms ease, transform 220ms ease',
								},
								'&:hover .tree-illustration-overlay': {
									opacity: 1,
									transform: 'translateY(0) scale(1)',
								},
							}}
						>
							<Box
								sx={{
									width: '100%',
									height: { xs: 220, md: 250 },
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									position: 'relative',
									overflow: 'visible',
								}}
							>
								<Box
									sx={{
										position: 'absolute',
										inset: 0,
										bgcolor: '#ecefed',
										overflow: 'hidden',
									}}
								>
									{cardImage ? (
										<Box
											component="img"
											src={cardImage}
											alt={viewMode === 'tree' ? primaryPlantName : p.name}
											sx={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
												display: 'block',
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
											<AccountCircle sx={{ fontSize: 168, color: '#c2c8c2' }} />
										</Box>
									)}
								</Box>

								{plantIllustration && (
									<Box
										className="tree-illustration-overlay"
										sx={{
											position: 'absolute',
											left: { xs: -8, md: -16 },
											bottom: { xs: -16, md: -42 },
											width: { xs: 132, md: 200 },
											height: { xs: 132, md: 200 },
											p: 0,
											borderRadius: 0,
											background: 'transparent',
											border: 'none',
											boxShadow: 'none',
											zIndex: 2,
											pointerEvents: 'none',
											transform: { xs: 'rotate(-4deg)', md: 'rotate(-8deg)' },
										}}
									>
										<Box
											component="img"
											src={plantIllustration}
											alt={`${primaryPlantName} illustration`}
											sx={{
												width: '100%',
												height: '100%',
												display: 'block',
												objectFit: 'contain',
											}}
										/>
									</Box>
								)}
							</Box>

							<Box
								sx={{
									p: 2.5,
									bgcolor: '#fff',
									flex: 1,
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<Typography
									sx={{
										fontSize: 12,
										color: '#7a857d',
										letterSpacing: 0.4,
										textTransform: 'uppercase',
										lineHeight: 1.2,
										mb: 0.75,
									}}
								>
									{cardImage ? 'Planted for' : 'Planted by'}
								</Typography>

								<Typography
									sx={{
										fontSize: 18,
										fontWeight: 500,
										color: '#294032',
										lineHeight: 1.35,
										mb: 2,
										overflow: 'hidden',
										display: '-webkit-box',
										WebkitLineClamp: 2,
										WebkitBoxOrient: 'vertical',
									}}
								>
									{p.name}
								</Typography>
								<Divider sx={{ backgroundColor: '#dde2dc', mb: 2 }} />

								<Box
									sx={{
										minHeight: 52,
										display: 'flex',
										alignItems: 'flex-start',
										justifyContent: 'space-between',
										gap: 1.5,
										mt: 'auto',
									}}
								>
									<Box sx={{ minWidth: 0, flex: 1 }}>
										<Typography
											sx={{
												fontSize: 16,
												fontWeight: 500,
												color: '#294032',
												lineHeight: 1.3,
											}}
										>
											{primaryPlantName}
										</Typography>

										{englishTreeType && (
											<Typography
												sx={{
													fontSize: 14,
													color: '#6f7b73',
													lineHeight: 1.2,
													mt: 0.4,
												}}
											>
												{englishTreeType}
											</Typography>
										)}

										{localPlantName && (
											<Typography
												sx={{
													fontSize: 14,
													color: '#6f7b73',
													lineHeight: 1.2,
													mt: 0.25,
												}}
											>
												({localPlantName})
											</Typography>
										)}
									</Box>

									<Button
										className="view-profile-btn"
										onClick={() =>
											window.open(
												`/profile/user/${p.user_id}`,
												'_blank',
												'noopener,noreferrer',
											)
										}
										sx={{
											bgcolor: '#9bc53d',
											color: '#1f3625',
											textTransform: 'none',
											minWidth: 90,
											height: 40,
											borderRadius: '14px',
											fontSize: 16,
											fontWeight: 500,
											'&:hover': { bgcolor: '#88b332' },
											flexShrink: 0,
											alignSelf: 'center',
										}}
									>
										View
									</Button>
								</Box>
							</Box>
						</Box>
					);
				})}
			</Box>

			{filteredParticipants.length === 0 && (
				<Typography
					sx={{ color: '#6f7b73', fontSize: 16, textAlign: 'center', py: 2 }}
				>
					No participants found for your search.
				</Typography>
			)}
		</Box>
	);
};

export default EventParticipants;
