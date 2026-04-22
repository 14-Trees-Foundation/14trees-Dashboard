import { useEffect, useMemo, useState } from 'react';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Typography,
	Button,
} from '@mui/material';
import {
	ExpandMore,
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

type Props = {
	participants: EventLandingParticipant[];
	trees: EventLandingTree[];
};

const EventParticipants: React.FC<Props> = ({ participants, trees }) => {
	const [searchInput, setSearchInput] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [viewMode, setViewMode] = useState<'people' | 'tree'>('people');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
	}, [participants, searchQuery, viewMode, sortOrder]);

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
					}
				/>
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
					const { primaryPlantName, englishTreeType, localPlantName } =
						parsePlantName(p.plant_type_name, p.plant_type_english_name);
					const cardImage = viewMode === 'tree' ? p.tree_image : p.image_url;
					const plantIllustration = (p.plant_type_illustration ?? '').trim();

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
							imageAlt={viewMode === 'tree' ? primaryPlantName : p.name}
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

			{filteredUnassignedTrees.length > 0 && (
				<Accordion
					disableGutters
					elevation={0}
					sx={{
						width: '100%',
						maxWidth: '1520px',
						mx: 'auto',
						mt: 2,
						bgcolor: 'transparent',
						border: '1px solid #d8e0d8',
						borderRadius: '18px !important',
						'&:before': { display: 'none' },
						overflow: 'hidden',
					}}
				>
					<AccordionSummary
						expandIcon={<ExpandMore sx={{ color: '#2a4937' }} />}
						sx={{
							px: { xs: 2, md: 3 },
							py: 1.5,
							bgcolor: '#eef2ee',
							'& .MuiAccordionSummary-content': { my: 0 },
						}}
					>
						<Box>
							<Typography
								sx={{
									fontSize: { xs: 16, md: 18 },
									fontWeight: 600,
									color: '#1f3625',
								}}
							>
								{filteredUnassignedTrees.length} tree
								{filteredUnassignedTrees.length !== 1 ? 's' : ''} yet to be
								assigned
							</Typography>
							<Typography sx={{ fontSize: 13, color: '#69786e', mt: 0.25 }}>
								These trees have been planted but not yet dedicated to a
								recipient
							</Typography>
						</Box>
					</AccordionSummary>
					<AccordionDetails sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f5f5f0' }}>
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
							}}
						>
							{filteredUnassignedTrees.map((tree) => {
								const { primaryPlantName, englishTreeType, localPlantName } =
									parsePlantName(
										tree.plant_type_name,
										tree.plant_type_english_name,
									);
								const cardImage = tree.image_url ?? tree.tree_image;
								const plantIllustration = (
									tree.plant_type_illustration ?? ''
								).trim();

								return (
									<TreeProfileCard
										key={tree.id}
										heading="Planted at"
										title="Yet to be assigned"
										titleMuted
										primaryPlantName={primaryPlantName}
										englishTreeType={englishTreeType}
										localPlantName={localPlantName}
										cardImage={cardImage}
										plantIllustration={plantIllustration}
										fallbackType="tree"
										imageAlt={primaryPlantName}
										onView={
											tree.sapling_id
												? () =>
														window.open(
															`/profile/${encodeURIComponent(tree.sapling_id)}`,
															'_blank',
															'noopener,noreferrer',
														)
												: undefined
										}
									/>
								);
							})}
						</Box>
					</AccordionDetails>
				</Accordion>
			)}

			{filteredParticipants.length === 0 &&
				filteredUnassignedTrees.length === 0 && (
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
