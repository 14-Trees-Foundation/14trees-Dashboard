import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Chip,
	CircularProgress,
	Typography,
} from '@mui/material';
import {
	ExpandMore,
	Forest,
	KeyboardArrowDown,
	Park,
	Spa,
} from '@mui/icons-material';
import ApiClient from '../../api/apiClient/apiClient';
import { NotFound } from '../notfound/NotFound';
import {
	GroupVisitCardItem,
	GroupVisitCardsData,
} from '../../types/GroupLanding';
import CorpFooter from './components/CorpFooter';
import TreeProfileCard from '../../components/treeCards/TreeProfileCard';
import { parsePlantName } from '../../components/treeCards/treeCardUtils';
import TreeCardsSummarySearchPanel from '../../components/treeCards/TreeCardsSummarySearchPanel';

type VisitGroup = {
	gift_card_request_id: number;
	event_name: string | null;
	gifted_on: string | null;
	request_id: string | null;
	cards: GroupVisitCardItem[];
};

const formattedDate = (dateStr: string | null) => {
	if (!dateStr) return '';
	return new Date(dateStr).toLocaleDateString('en-IN', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
};

const hasAssigneeName = (card: GroupVisitCardItem) =>
	Boolean(card.assigned_to_name?.trim() || card.recipient_name?.trim());

const getVisitCardImage = (
	card: GroupVisitCardItem,
	viewMode: 'people' | 'tree',
) => {
	if (viewMode === 'tree') {
		if (card.image) return card.image;
		if (card.user_tree_image) return card.user_tree_image;
	} else {
		if (card.user_tree_image) return card.user_tree_image;
		if (card.image) return card.image;
	}
	if (card.card_image_url) return card.card_image_url;
	if (card.info_card_s3_path) return card.info_card_s3_path;
	return null;
};

const SiteVisitsPage: React.FC = () => {
	const { name_key } = useParams<{ name_key: string }>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<GroupVisitCardsData | null>(null);
	const [searchInput, setSearchInput] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [viewMode, setViewMode] = useState<'people' | 'tree'>('people');

	useEffect(() => {
		if (searchInput.trim() === '') {
			setSearchQuery('');
		}
	}, [searchInput]);

	useEffect(() => {
		if (!name_key) {
			setError('Invalid group key');
			setLoading(false);
			return;
		}

		const apiClient = new ApiClient();
		apiClient
			.getGroupVisitCardsData(name_key)
			.then((response) => setData(response))
			.catch((err: any) =>
				setError(err?.message ?? 'Failed to load site visits'),
			)
			.finally(() => setLoading(false));
	}, [name_key]);

	const filteredCards = useMemo(() => {
		if (!data) return [];
		if (!searchQuery.trim()) return data.cards;
		const q = searchQuery.trim().toLowerCase();
		return data.cards.filter(
			(card) =>
				(card.assigned_to_name ?? '').toLowerCase().includes(q) ||
				(card.recipient_name ?? '').toLowerCase().includes(q) ||
				(card.event_name ?? '').toLowerCase().includes(q) ||
				(card.tree_type ?? '').toLowerCase().includes(q) ||
				(card.sapling_id ?? '').toLowerCase().includes(q),
		);
	}, [data, searchQuery]);

	const onSearch = () => setSearchQuery(searchInput);

	const handleScrollDown = () => {
		window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
	};

	const groupedVisits = useMemo<VisitGroup[]>(() => {
		const map = new Map<number, VisitGroup>();
		for (const card of filteredCards) {
			if (!map.has(card.gift_card_request_id)) {
				map.set(card.gift_card_request_id, {
					gift_card_request_id: card.gift_card_request_id,
					event_name: card.event_name,
					gifted_on: card.gifted_on,
					request_id: card.request_id,
					cards: [],
				});
			}
			map.get(card.gift_card_request_id)!.cards.push(card);
		}
		return Array.from(map.values());
	}, [filteredCards]);

	const openProfilePage = (saplingId: string | null) => {
		if (!saplingId) return;
		window.open(
			`${window.location.origin}/profile/${encodeURIComponent(saplingId)}`,
			'_blank',
			'noopener,noreferrer',
		);
	};

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
		return <NotFound text={error ?? 'Site visits not found'} />;
	}

	const totalTrees = data.cards.length;
	const totalVisits = groupedVisits.length;
	const visitHeroImage =
		data.cards.find((card) => (card.visit_hero_image ?? '').trim())
			?.visit_hero_image ?? null;
	const nativeSpeciesCount = new Set(
		data.cards.map((card) => (card.tree_type ?? '').trim()).filter(Boolean),
	).size;

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: '#dce2dc',
				'&, & *': { fontFamily: '"Instrument Sans", "HelveticaNowDisplay"' },
			}}
		>
			{/* Hero section */}
			<Box
				sx={{
					position: 'relative',
					width: '100%',
					minHeight: { xs: '70vh', md: '100vh' },
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					overflow: 'hidden',
					bgcolor: '#0d2016',
				}}
			>
				<Box
					onClick={handleScrollDown}
					sx={{
						position: 'absolute',
						bottom: { xs: 22, md: 32 },
						left: '50%',
						transform: 'translateX(-50%)',
						zIndex: 3,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						cursor: 'pointer',
						gap: 0.5,
						opacity: 0.85,
						'&:hover': { opacity: 1 },
						animation: 'bounce 2s infinite',
						'@keyframes bounce': {
							'0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
							'50%': { transform: 'translateX(-50%) translateY(6px)' },
						},
					}}
				>
					<Typography
						variant="body2"
						sx={{
							color: '#fff',
							letterSpacing: { xs: 2.4, md: 3 },
							textTransform: 'uppercase',
							fontSize: { xs: 11.5, md: 13 },
							fontWeight: 500,
							whiteSpace: 'nowrap',
						}}
					>
						Scroll to Explore
					</Typography>
					<KeyboardArrowDown sx={{ color: '#fff', fontSize: 28 }} />
				</Box>

				{visitHeroImage ? (
					<Box
						sx={{
							position: 'absolute',
							inset: 0,
							backgroundImage: `url(${visitHeroImage})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							zIndex: 0,
						}}
					/>
				) : null}
				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						background:
							'linear-gradient(160deg, #1f3625 0%, #1a3828 60%, #1f3625 100%)',
						opacity: visitHeroImage ? 0.72 : 1,
						zIndex: 1,
					}}
				/>
				<Box
					sx={{ position: 'relative', zIndex: 2, textAlign: 'center', px: 3 }}
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
						<Forest sx={{ fontSize: 34, color: '#7ecb9a' }} />
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
						Site Visits
					</Typography>
					<Typography
						sx={{
							color: 'rgba(255,255,255,0.62)',
							fontSize: { xs: 14, md: 16 },
							maxWidth: 480,
							mx: 'auto',
						}}
					>
						Every visit tells a story of roots growing deeper and futures taking
						shape.
					</Typography>
				</Box>
			</Box>

			<TreeCardsSummarySearchPanel
				metrics={[
					{
						label: 'Trees planted',
						value: `${totalTrees.toLocaleString('en-IN')}+`,
						icon: <Park sx={{ color: '#31503d', fontSize: 23 }} />,
					},
					{
						label: 'Total visits',
						value: totalVisits.toLocaleString('en-IN'),
						icon: <Forest sx={{ color: '#31503d', fontSize: 23 }} />,
					},
					{
						label: 'Native species',
						value: nativeSpeciesCount.toLocaleString('en-IN'),
						icon: <Spa sx={{ color: '#31503d', fontSize: 23 }} />,
						accent: true,
					},
				]}
				searchValue={searchInput}
				onSearchValueChange={setSearchInput}
				onSearch={onSearch}
				searchPlaceholder="Search by name, tree type, sapling or visit..."
				// resultsLabel={`${filteredCards.length} tree${filteredCards.length !== 1 ? 's' : ''} shown`}
				extraControls={
					<Box
						sx={{
							display: 'flex',
							alignSelf: 'flex-start',
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
							User view
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
										viewMode === 'tree' ? '#ffffff' : 'rgba(255,255,255,0.32)',
								},
							}}
						>
							Tree view
						</Button>
					</Box>
				}
			/>

			{/* Visit groups */}
			<Box sx={{ px: { xs: 2, sm: 4 }, pt: 1, pb: { xs: 5, md: 8 } }}>
				<Box sx={{ maxWidth: 1360, mx: 'auto' }}>
					{groupedVisits.length === 0 ? (
						<Box
							sx={{
								borderRadius: '14px',
								border: '1px solid #d6ddd6',
								bgcolor: '#f5f7f5',
								textAlign: 'center',
								py: 8,
							}}
						>
							<Typography sx={{ color: '#5d6c62' }}>
								No trees found for the current search.
							</Typography>
						</Box>
					) : (
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
							{groupedVisits.map((visit) => (
								<Accordion
									key={visit.gift_card_request_id}
									disableGutters
									elevation={0}
									defaultExpanded
									sx={{
										borderRadius: '10px',
										border: '1px solid #d6ddd6',
										overflow: 'hidden',
										bgcolor: '#f4f7f4',
										'&:before': { display: 'none' },
									}}
								>
									<AccordionSummary
										expandIcon={<ExpandMore sx={{ color: '#2a4937' }} />}
										sx={{
											px: { xs: 1.5, sm: 2 },
											py: 0.75,
											'& .MuiAccordionSummary-content': { my: 0.75 },
										}}
									>
										<Box sx={{ flex: 1 }}>
											<VisitHeader visit={visit} />
										</Box>
									</AccordionSummary>
									<AccordionDetails
										sx={{ p: { xs: 1.5, sm: 2 }, pt: 0.5, bgcolor: '#f5f5f0' }}
									>
										<Box
											sx={{
												display: 'grid',
												gridTemplateColumns: {
													xs: '1fr',
													sm: 'repeat(2, minmax(0, 1fr))',
													md: 'repeat(3, minmax(0, 1fr))',
													lg: 'repeat(4, minmax(0, 1fr))',
												},
												gap: { xs: 2, md: 2.5 },
											}}
										>
											{visit.cards.map((card) => {
												const {
													primaryPlantName,
													englishTreeType,
													localPlantName,
												} = parsePlantName(card.tree_type, card.tree_type);
												const assigned = hasAssigneeName(card);

												return (
													<TreeProfileCard
														key={card.id}
														heading={assigned ? 'Planted for' : 'Planted at'}
														title={
															assigned
																? card.assigned_to_name ??
																  card.recipient_name ??
																  'Yet to be assigned'
																: 'Yet to be assigned'
														}
														titleMuted={!assigned}
														primaryPlantName={primaryPlantName}
														englishTreeType={englishTreeType}
														localPlantName={localPlantName}
														cardImage={getVisitCardImage(card, viewMode)}
														plantIllustration={card.illustration_s3_path}
														fallbackType="tree"
														imageAlt={
															assigned
																? card.assigned_to_name ??
																  card.recipient_name ??
																  primaryPlantName
																: primaryPlantName
														}
														onView={
															card.sapling_id
																? () => openProfilePage(card.sapling_id)
																: undefined
														}
													/>
												);
											})}
										</Box>
									</AccordionDetails>
								</Accordion>
							))}
						</Box>
					)}
				</Box>
			</Box>

			<CorpFooter />
		</Box>
	);
};

const VisitHeader: React.FC<{ visit: VisitGroup }> = ({ visit }) => (
	<Box
		sx={{
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: { xs: 'flex-start', sm: 'center' },
			gap: 1,
			flexWrap: 'wrap',
			mb: 1,
		}}
	>
		<Typography sx={{ color: '#1f3625', fontSize: 20, fontWeight: 500 }}>
			{visit.event_name ?? 'Site Visit'}
		</Typography>
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
			<Chip
				label="Site Visit"
				size="small"
				sx={{
					height: 22,
					fontSize: 11,
					fontWeight: 600,
					bgcolor: '#e4ebe3',
					color: '#30503d',
				}}
			/>
			<Chip
				label={`${visit.cards.length} tree${
					visit.cards.length !== 1 ? 's' : ''
				}`}
				size="small"
				sx={{
					height: 22,
					fontSize: 11,
					fontWeight: 600,
					bgcolor: '#e4ebe3',
					color: '#30503d',
				}}
			/>
			{visit.request_id ? (
				<Chip
					label={visit.request_id}
					size="small"
					sx={{
						height: 22,
						fontSize: 11,
						fontWeight: 600,
						bgcolor: '#e4ebe3',
						color: '#30503d',
					}}
				/>
			) : null}
			{visit.gifted_on ? (
				<Typography sx={{ color: '#6b7a70', fontSize: 11, fontWeight: 500 }}>
					{formattedDate(visit.gifted_on)}
				</Typography>
			) : null}
		</Box>
	</Box>
);

export default SiteVisitsPage;
