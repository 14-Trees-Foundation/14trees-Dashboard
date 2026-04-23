import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
	AccountCircle,
	FilterList,
	KeyboardArrowDown,
	Park,
	Spa,
} from '@mui/icons-material';
import {
	EventLandingParticipant,
	EventLandingTree,
} from '../../../types/EventLanding';
import TreeProfileCard from '../../../components/treeCards/TreeProfileCard';
import { parsePlantName } from '../../../components/treeCards/treeCardUtils';
import TreeCardsSummarySearchPanel from '../../../components/treeCards/TreeCardsSummarySearchPanel';

type Donor = {
	donationId: number;
	donationReceiptNumber: string | null;
	name: string | null;
	amount: number | null;
};

type Props = {
	participants: EventLandingParticipant[];
	trees: EventLandingTree[];
	isBirthday?: boolean;
	donors?: Donor[];
};

const EventParticipants: React.FC<Props> = ({
	participants,
	trees,
	isBirthday = false,
	donors = [],
}) => {
	const [searchInput, setSearchInput] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [viewMode, setViewMode] = useState<'people' | 'tree' | 'contributors'>(
		isBirthday ? 'tree' : 'people',
	);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [visibleCount, setVisibleCount] = useState(10);

	useEffect(() => {
		setVisibleCount(10);
	}, [viewMode, searchQuery]);

	useEffect(() => {
		if (searchInput.trim() === '') {
			setSearchQuery('');
		}
	}, [searchInput]);

	if (participants.length === 0 && trees.length === 0) return null;

	const nativeSpeciesCount = useMemo(() => {
		const uniqueSpecies = new Set(
			trees
				.map((t) => t.plant_type_english_name ?? t.plant_type_name)
				.filter(Boolean),
		);
		return uniqueSpecies.size;
	}, [trees]);

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
	}, [participants, searchQuery, sortOrder]);

	const filteredUnassignedTrees = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		return trees
			.filter((t) => t.assigned_to === null)
			.filter((t) => {
				if (!q) return true;
				const species = (
					t.plant_type_english_name ??
					t.plant_type_name ??
					''
				).toLowerCase();
				return species.includes(q);
			});
	}, [trees, searchQuery]);

	// Tree view shows every tree individually (not de-duped by user)
	const filteredTrees = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		let result = trees.filter((t) => {
			if (!q) return true;
			const name = (t.user_name ?? '').toLowerCase();
			const species = (
				t.plant_type_english_name ??
				t.plant_type_name ??
				''
			).toLowerCase();
			return name.includes(q) || species.includes(q);
		});
		result.sort((a, b) => {
			const aLabel = (
				a.plant_type_english_name ??
				a.plant_type_name ??
				''
			).toLowerCase();
			const bLabel = (
				b.plant_type_english_name ??
				b.plant_type_name ??
				''
			).toLowerCase();
			return sortOrder === 'asc'
				? aLabel.localeCompare(bLabel)
				: bLabel.localeCompare(aLabel);
		});
		return result;
	}, [trees, searchQuery, sortOrder]);

	const onSearch = () => setSearchQuery(searchInput);

	// For birthday: only show the contributors toggle when there are donors
	const showContributorsTab = isBirthday && donors.length > 0;

	const viewToggle = (
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
						viewMode === 'tree' ? '0px 1px 2px rgba(31, 54, 37, 0.12)' : 'none',
					'&:hover': {
						bgcolor: viewMode === 'tree' ? '#ffffff' : 'rgba(255,255,255,0.32)',
					},
				}}
			>
				Tree View
			</Button>
			{showContributorsTab && (
				<Button
					onClick={() => setViewMode('contributors')}
					sx={{
						minWidth: { xs: 132, sm: 140 },
						height: 42,
						borderRadius: '10px',
						textTransform: 'none',
						fontSize: { xs: 14, md: 16 },
						fontWeight: 500,
						color: '#1f3625',
						bgcolor: viewMode === 'contributors' ? '#ffffff' : 'transparent',
						boxShadow:
							viewMode === 'contributors'
								? '0px 1px 2px rgba(31, 54, 37, 0.12)'
								: 'none',
						'&:hover': {
							bgcolor:
								viewMode === 'contributors'
									? '#ffffff'
									: 'rgba(255,255,255,0.32)',
						},
					}}
				>
					Contributors
				</Button>
			)}
		</Box>
	);

	const nonBirthdayToggle = (
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
							viewMode === 'people' ? '#ffffff' : 'rgba(255,255,255,0.32)',
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
						viewMode === 'tree' ? '0px 1px 2px rgba(31, 54, 37, 0.12)' : 'none',
					'&:hover': {
						bgcolor: viewMode === 'tree' ? '#ffffff' : 'rgba(255,255,255,0.32)',
					},
				}}
			>
				Tree view
			</Button>
		</Box>
	);

	return (
		<Box
			id="event-trees-section"
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
						{trees.length} Trees Planted in this grove, {nativeSpeciesCount}{' '}
						Tree Species native to the region
					</Typography>
				</Box>
				<TreeCardsSummarySearchPanel
					metrics={[
						{
							label: 'Trees Planted',
							value: `${trees.length}+`,
							icon: <Park sx={{ color: '#31503d', fontSize: 23 }} />,
						},
						{
							label: 'Acres restored',
							value: '00 Acres',
							icon: <Spa sx={{ color: '#31503d', fontSize: 23 }} />,
						},
						{
							label: 'Native species',
							value: String(nativeSpeciesCount),
							icon: <Spa sx={{ color: '#31503d', fontSize: 23 }} />,
							accent: true,
						},
					]}
					searchValue={searchInput}
					onSearchValueChange={setSearchInput}
					onSearch={onSearch}
					searchPlaceholder="Search by Name..."
					extraControls={
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								gap: 1,
								flexWrap: 'wrap',
							}}
						>
							{isBirthday ? viewToggle : nonBirthdayToggle}

							{viewMode !== 'contributors' && (
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
							)}
						</Box>
					}
				/>
			</Box>

			{/* Contributors view (birthday only) */}
			{viewMode === 'contributors' && (
				<Box sx={{ maxWidth: '1360px', mx: 'auto', textAlign: 'center' }}>
					<Typography
						sx={{
							fontSize: { xs: 28, md: 40 },
							fontWeight: 500,
							color: '#1f3625',
							mb: 1,
						}}
					>
						With gratitude to our contributors
					</Typography>
					<Typography
						sx={{ fontSize: { xs: 16, md: 20 }, color: '#2f4a38', mb: 5 }}
					>
						Celebrating those who made this green tribute possible.
					</Typography>
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: 2,
							justifyContent: 'center',
						}}
					>
						{donors.map((donor) => (
							<Box
								key={donor.donationId}
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 1.5,
									bgcolor: '#fff',
									border: '1.5px solid #b8cdb8',
									borderRadius: '32px',
									px: 2.5,
									py: 1.25,
									boxShadow: '0 2px 8px rgba(31,54,37,0.08)',
								}}
							>
								<AccountCircle sx={{ fontSize: 26, color: '#3a6647' }} />
								<Typography
									sx={{ fontSize: 17, color: '#1a2e1f', fontWeight: 500 }}
								>
									{donor.name ?? 'Anonymous'}
								</Typography>
							</Box>
						))}
					</Box>
				</Box>
			)}

			{/* Tree / People cards */}
			{viewMode !== 'contributors' && (
				<>
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
						{viewMode === 'tree'
							? filteredTrees.slice(0, visibleCount).map((t) => {
									const { primaryPlantName, englishTreeType, localPlantName } =
										parsePlantName(
											t.plant_type_name,
											t.plant_type_english_name,
										);
									const cardImage = t.tree_image ?? t.image_url;
									const plantIllustration = (
										t.plant_type_illustration ?? ''
									).trim();
									return (
										<TreeProfileCard
											key={t.id}
											heading={t.assigned_to ? 'Planted for' : 'Planted at'}
											title={t.user_name ?? 'Yet to be assigned'}
											hideTitle={isBirthday}
											titleMuted={!t.user_name}
											primaryPlantName={primaryPlantName}
											englishTreeType={englishTreeType}
											localPlantName={localPlantName}
											cardImage={cardImage}
											plantIllustration={plantIllustration}
											fallbackType="tree"
											imageAlt={primaryPlantName}
											onView={
												t.sapling_id
													? () =>
															window.open(
																`/profile/${encodeURIComponent(t.sapling_id!)}`,
																'_blank',
																'noopener,noreferrer',
															)
													: undefined
											}
										/>
									);
							  })
							: filteredParticipants.slice(0, visibleCount).map((p) => {
									const { primaryPlantName, englishTreeType, localPlantName } =
										parsePlantName(
											p.plant_type_name,
											p.plant_type_english_name,
										);
									const cardImage = p.image_url;
									const plantIllustration = (
										p.plant_type_illustration ?? ''
									).trim();
									return (
										<TreeProfileCard
											key={p.user_id}
											heading={cardImage ? 'Planted for' : 'Planted by'}
											title={p.name}
											primaryPlantName={primaryPlantName}
											englishTreeType={englishTreeType}
											localPlantName={localPlantName}
											cardImage={cardImage}
											plantIllustration={plantIllustration}
											fallbackType="person"
											imageAlt={p.name}
											onView={() =>
												window.open(
													`/profile/user/${p.user_id}`,
													'_blank',
													'noopener,noreferrer',
												)
											}
										/>
									);
							  })}
					</Box>

					{/* View more button */}
					{viewMode === 'tree' && filteredTrees.length > visibleCount && (
						<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
							<Button
								onClick={() => setVisibleCount((c) => c + 10)}
								sx={{
									border: '1.5px solid #b8cdb8',
									borderRadius: '12px',
									px: 4,
									py: 1.25,
									textTransform: 'none',
									fontSize: { xs: 14, md: 16 },
									fontWeight: 500,
									color: '#1f3625',
									bgcolor: '#fff',
									'&:hover': { bgcolor: '#f0f7f0' },
								}}
							>
								View {Math.min(10, filteredTrees.length - visibleCount)} more
								trees
							</Button>
						</Box>
					)}
					{viewMode === 'people' &&
						filteredParticipants.length > visibleCount && (
							<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
								<Button
									onClick={() => setVisibleCount((c) => c + 10)}
									sx={{
										border: '1.5px solid #b8cdb8',
										borderRadius: '12px',
										px: 4,
										py: 1.25,
										textTransform: 'none',
										fontSize: { xs: 14, md: 16 },
										fontWeight: 500,
										color: '#1f3625',
										bgcolor: '#fff',
										'&:hover': { bgcolor: '#f0f7f0' },
									}}
								>
									View{' '}
									{Math.min(10, filteredParticipants.length - visibleCount)}{' '}
									more people
								</Button>
							</Box>
						)}

					{viewMode === 'tree'
						? filteredTrees.length === 0 && (
								<Typography
									sx={{
										color: '#6f7b73',
										fontSize: 16,
										textAlign: 'center',
										py: 2,
									}}
								>
									No trees found for your search.
								</Typography>
						  )
						: filteredParticipants.length === 0 && (
								<Typography
									sx={{
										color: '#6f7b73',
										fontSize: 16,
										textAlign: 'center',
										py: 2,
									}}
								>
									No participants found for your search.
								</Typography>
						  )}
				</>
			)}
		</Box>
	);
};

export default EventParticipants;
