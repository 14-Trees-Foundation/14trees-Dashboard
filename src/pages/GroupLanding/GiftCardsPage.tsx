import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Chip,
	CircularProgress,
	IconButton,
	InputBase,
	Typography,
} from '@mui/material';
import {
	ArrowBack,
	ExpandMore,
	OpenInNew,
	People,
	Search,
	ViewModule,
	KeyboardArrowDown,
} from '@mui/icons-material';
import ApiClient from '../../api/apiClient/apiClient';
import { NotFound } from '../notfound/NotFound';
import {
	GroupGiftCardItem,
	GroupGiftCardsData,
} from '../../types/GroupLanding';
import CorpFooter from './components/CorpFooter';
import corporateGiftsImg from '../../assets/gift-hero.jpeg';

type RequestGroup = {
	gift_card_request_id: number;
	event_name: string | null;
	gifted_on: string | null;
	request_id: string | null;
	event_type: string | null;
	status: string | null;
	cards: GroupGiftCardItem[];
};

const resolveCardImage = (card: GroupGiftCardItem): string | null => {
	if (card.card_image_url) return card.card_image_url;
	if (card.info_card_s3_path) return card.info_card_s3_path;
	if (card.illustration_s3_path) return card.illustration_s3_path;
	return null;
};

const formattedDate = (dateStr: string | null) => {
	if (!dateStr) return '';
	return new Date(dateStr).toLocaleDateString('en-IN', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
};

const hasRecipientName = (card: GroupGiftCardItem) =>
	Boolean(card.assigned_to_name?.trim() || card.recipient_name?.trim());

type ViewMode = 'people' | 'cards';

const GiftCardsPage: React.FC = () => {
	const handleScrollDown = () => {
		window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
	};
	const { name_key } = useParams<{ name_key: string }>();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<GroupGiftCardsData | null>(null);
	const [search, setSearch] = useState('');
	const [viewMode, setViewMode] = useState<ViewMode>('people');

	useEffect(() => {
		if (!name_key) {
			setError('Invalid group key');
			setLoading(false);
			return;
		}

		const apiClient = new ApiClient();
		apiClient
			.getGroupGiftCardsData(name_key)
			.then((response) => setData(response))
			.catch((err: any) =>
				setError(err?.message ?? 'Failed to load gift cards'),
			)
			.finally(() => setLoading(false));
	}, [name_key]);

	const totalOccasions = useMemo(() => {
		if (!data) return 0;
		return new Set(data.cards.map((c) => c.gift_card_request_id)).size;
	}, [data]);

	const filteredCards = useMemo(() => {
		if (!data) return [];
		if (!search.trim()) return data.cards;
		const q = search.trim().toLowerCase();
		return data.cards.filter(
			(card) =>
				(card.assigned_to_name ?? '').toLowerCase().includes(q) ||
				(card.recipient_name ?? '').toLowerCase().includes(q),
		);
	}, [data, search]);

	const groupedRequests = useMemo<RequestGroup[]>(() => {
		const map = new Map<number, RequestGroup>();
		for (const card of filteredCards) {
			if (!map.has(card.gift_card_request_id)) {
				map.set(card.gift_card_request_id, {
					gift_card_request_id: card.gift_card_request_id,
					event_name: card.event_name,
					gifted_on: card.gifted_on,
					request_id: card.request_id,
					event_type: card.event_type,
					status: card.status,
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
		return <NotFound text={error ?? 'Gift cards not found'} />;
	}

	const heroCard = data.cards.find((card) => resolveCardImage(card));
	const heroCardImage = heroCard ? resolveCardImage(heroCard) : null;

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: '#dce2dc',
				'&, & *': { fontFamily: '"Instrument Sans", "HelveticaNowDisplay"' },
			}}
		>
			<Box
				sx={{
					position: 'relative',
					width: '100%',
					minHeight: { xs: '82vh', md: '100vh' },
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					overflow: 'hidden',
					bgcolor: '#0d2016',
					backgroundImage: `linear-gradient(180deg, rgba(10,20,12,0.22) 0%, rgba(10,20,12,0.62) 100%), url(${corporateGiftsImg})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						background:
							'linear-gradient(0deg, rgba(5, 8, 6, 0.8) 8.21%, rgba(31, 54, 37, 0) 68.61%)',
						zIndex: 1,
					}}
				/>
				<Box
					onClick={handleScrollDown}
					sx={{
						position: 'absolute',
						bottom: { xs: 22, md: 32 },
						left: '50%',
						transform: 'translateX(-50%)',
						zIndex: 2,
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
			</Box>

			<Box sx={{ px: { xs: 2, sm: 4 }, pt: { xs: 3, sm: 4 }, pb: 1.5 }}>
				<Box sx={{ maxWidth: 1208, mx: 'auto' }}>
					<Typography
						sx={{
							fontSize: { xs: 24, md: 30 },
							fontWeight: 600,
							color: '#1d3122',
						}}
					>
						Our Journey of Green Gifting
					</Typography>
					<Typography sx={{ mt: 0.75, fontSize: 14, color: '#5f6d63' }}>
						Each gift you have created continues to grow, shaping ecosystems and
						futures.
					</Typography>
				</Box>
			</Box>

			<Box sx={{ px: { xs: 2, sm: 4 }, py: { xs: 1.5, sm: 2.5 } }}>
				<Box
					sx={{
						maxWidth: 1208,
						mx: 'auto',
						display: 'grid',
						gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
						gap: 2,
						p: { xs: 1.25, sm: 1.8 },
						borderRadius: '12px',
						bgcolor: '#eef2ee',
						border: '1px solid #d6ddd6',
					}}
				>
					<Box
						sx={{
							minWidth: 0,
							height: 44,
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							px: 1.5,
							borderRadius: '9px',
							bgcolor: '#fff',
							border: '1px solid #cdd5cc',
						}}
					>
						<Search sx={{ fontSize: 18, color: '#718272' }} />
						<InputBase
							fullWidth
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by recipient name..."
							sx={{
								fontSize: 13,
								color: '#4b5a4e',
								'& input::placeholder': { color: '#6f7b73', opacity: 1 },
							}}
						/>
					</Box>
					<Box sx={{ display: 'flex', gap: 1 }}>
						<ToggleButton
							selected={viewMode === 'people'}
							icon={<People />}
							label="People view"
							onClick={() => setViewMode('people')}
						/>
						<ToggleButton
							selected={viewMode === 'cards'}
							icon={<ViewModule />}
							label="Card view"
							onClick={() => setViewMode('cards')}
						/>
					</Box>
				</Box>
			</Box>

			<Box sx={{ px: { xs: 2, sm: 4 }, pt: 1.5, pb: { xs: 5, md: 8 } }}>
				<Box sx={{ maxWidth: 1208, mx: 'auto' }}>
					{groupedRequests.length === 0 ? (
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
								No gift cards found for the current search.
							</Typography>
						</Box>
					) : viewMode === 'people' ? (
						<PeopleView
							groups={groupedRequests}
							onOpenProfile={openProfilePage}
						/>
					) : (
						<CardsView
							groups={groupedRequests}
							onOpenProfile={openProfilePage}
						/>
					)}
				</Box>
			</Box>

			<CorpFooter />
		</Box>
	);
};

const ToggleButton: React.FC<{
	selected: boolean;
	icon: React.ReactNode;
	label: string;
	onClick: () => void;
}> = ({ selected, icon, label, onClick }) => (
	<Button
		startIcon={icon}
		onClick={onClick}
		variant={selected ? 'contained' : 'outlined'}
		sx={{
			textTransform: 'none',
			fontSize: 12,
			fontWeight: 500,
			height: 40,
			px: 2,
			borderRadius: '8px',
			...(selected
				? {
						bgcolor: '#244733',
						color: '#fff',
						boxShadow: 'none',
						'&:hover': { bgcolor: '#1b3628' },
				  }
				: {
						borderColor: '#c2cbc2',
						color: '#284233',
						bgcolor: '#fff',
						'&:hover': { borderColor: '#a6b0a6', bgcolor: '#f4f6f4' },
				  }),
		}}
	>
		{label}
	</Button>
);

const RequestHeader: React.FC<{ group: RequestGroup }> = ({ group }) => (
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
			{group.event_name ?? 'Gift Occasion'}
		</Typography>
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
			<Chip
				label={`${group.cards.length} gift${
					group.cards.length !== 1 ? 's' : ''
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
			{group.gifted_on ? (
				<Typography sx={{ color: '#6b7a70', fontSize: 11, fontWeight: 500 }}>
					{formattedDate(group.gifted_on)}
				</Typography>
			) : null}
		</Box>
	</Box>
);

const IndividualCard: React.FC<{
	card: GroupGiftCardItem;
	showLink?: boolean;
	onOpenProfile: (saplingId: string | null) => void;
}> = ({ card, showLink = true, onOpenProfile }) => {
	const image = resolveCardImage(card);
	return (
		<Box
			sx={{
				position: 'relative',
				borderRadius: '8px',
				overflow: 'hidden',
				bgcolor: '#fff',
				border: '1px solid #dce2dc',
				boxShadow: '0 1px 2px rgba(28,46,33,0.08)',
				transition: 'box-shadow .2s, transform .2s',
				'& .card-link': {
					opacity: { xs: 1, md: 0 },
					transform: 'translateY(-2px)',
					transition: 'opacity .2s, transform .2s',
				},
				'&:hover .card-link': { opacity: 1, transform: 'translateY(0)' },
				'&:hover': {
					boxShadow: '0 8px 20px rgba(31,54,37,.14)',
					transform: 'translateY(-2px)',
				},
			}}
		>
			{showLink && card.sapling_id ? (
				<IconButton
					size="small"
					onClick={() => onOpenProfile(card.sapling_id)}
					className="card-link"
					sx={{
						position: 'absolute',
						top: 6,
						right: 6,
						zIndex: 2,
						bgcolor: 'rgba(255,255,255,.92)',
						color: '#21472f',
						'&:hover': { bgcolor: '#fff' },
					}}
				>
					<OpenInNew sx={{ fontSize: 16 }} />
				</IconButton>
			) : null}
			<Box
				sx={{
					height: { xs: 120, sm: 142, md: 162 },
					bgcolor: '#edf2ed',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					overflow: 'hidden',
				}}
			>
				{image ? (
					<Box
						component="img"
						src={image}
						alt={card.recipient_name ?? 'Gift card'}
						sx={{
							display: 'block',
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
				) : (
					<Box
						component="img"
						src="/dark_logo.png"
						alt="placeholder"
						sx={{ width: 40, opacity: 0.2 }}
					/>
				)}
			</Box>
			<Box sx={{ p: { xs: 1, md: 1.25 } }}>
				<Typography
					sx={{
						color: '#1f3625',
						fontWeight: 500,
						fontSize: { xs: 12, md: 13 },
						lineHeight: '18px',
						overflow: 'hidden',
						display: '-webkit-box',
						WebkitLineClamp: 1,
						WebkitBoxOrient: 'vertical',
						mb: 0.5,
					}}
				>
					{card.assigned_to_name ?? card.recipient_name ?? 'Yet to be assigned'}
				</Typography>
				{card.event_name ? (
					<Typography
						sx={{
							fontSize: { xs: 10, md: 11 },
							color: '#8a938d',
							lineHeight: '14px',
							overflow: 'hidden',
							display: '-webkit-box',
							WebkitLineClamp: 1,
							WebkitBoxOrient: 'vertical',
						}}
					>
						{card.event_name}
					</Typography>
				) : null}
			</Box>
		</Box>
	);
};

const accordionSx = {
	borderRadius: '10px',
	border: '1px solid #d6ddd6',
	overflow: 'hidden',
	bgcolor: '#f4f7f4',
	'&:before': { display: 'none' },
};

const accordionSummarySx = {
	px: { xs: 1.5, sm: 2 },
	py: 0.75,
	'& .MuiAccordionSummary-content': { my: 0.75 },
};

const CardsView: React.FC<{
	groups: RequestGroup[];
	onOpenProfile: (saplingId: string | null) => void;
}> = ({ groups, onOpenProfile }) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
			{groups.map((group) => {
				if (!group.cards.length) return null;
				return (
					<Accordion
						key={group.gift_card_request_id}
						disableGutters
						elevation={0}
						sx={accordionSx}
					>
						<AccordionSummary
							expandIcon={<ExpandMore sx={{ color: '#2a4937' }} />}
							sx={accordionSummarySx}
						>
							<Box sx={{ flex: 1 }}>
								<RequestHeader group={group} />
							</Box>
						</AccordionSummary>
						<AccordionDetails sx={{ p: { xs: 1.5, sm: 2 }, pt: 0.5 }}>
							<Box
								sx={{
									display: 'grid',
									gridTemplateColumns: {
										xs: 'repeat(2,minmax(0,1fr))',
										sm: 'repeat(3,minmax(0,1fr))',
										md: 'repeat(4,minmax(0,1fr))',
									},
									gap: { xs: 1, sm: 1.5 },
								}}
							>
								{group.cards.map((card) => (
									<IndividualCard
										key={card.id}
										card={card}
										onOpenProfile={onOpenProfile}
									/>
								))}
							</Box>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</Box>
	);
};

const PeopleView: React.FC<{
	groups: RequestGroup[];
	onOpenProfile: (saplingId: string | null) => void;
}> = ({ groups, onOpenProfile }) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
			{groups.map((group) => {
				if (!group.cards.length) return null;
				return (
					<Accordion
						key={group.gift_card_request_id}
						disableGutters
						elevation={0}
						sx={accordionSx}
					>
						<AccordionSummary
							expandIcon={<ExpandMore sx={{ color: '#2a4937' }} />}
							sx={accordionSummarySx}
						>
							<Box sx={{ flex: 1 }}>
								<RequestHeader group={group} />
							</Box>
						</AccordionSummary>
						<AccordionDetails sx={{ p: { xs: 1.5, sm: 2 }, pt: 0.5 }}>
							<Box
								sx={{
									borderRadius: '8px',
									overflow: 'hidden',
									border: '1px solid #e0e6df',
									bgcolor: '#fff',
								}}
							>
								<Box
									sx={{
										display: 'grid',
										gridTemplateColumns: {
											xs: '1.6fr .9fr .7fr auto',
											md: '1.9fr 1fr .75fr auto',
										},
										columnGap: 1,
										px: 1.5,
										py: 1,
										bgcolor: '#f8faf8',
										borderBottom: '1px solid #e8ece8',
									}}
								>
									<Typography
										sx={{
											fontSize: 10,
											fontWeight: 700,
											color: '#7a867d',
											textTransform: 'uppercase',
										}}
									>
										Name
									</Typography>
									<Typography
										sx={{
											fontSize: 10,
											fontWeight: 700,
											color: '#7a867d',
											textTransform: 'uppercase',
										}}
									>
										Tree Type
									</Typography>
									<Typography
										sx={{
											fontSize: 10,
											fontWeight: 700,
											color: '#7a867d',
											textTransform: 'uppercase',
										}}
									>
										Sapling ID
									</Typography>
									<Typography
										sx={{
											fontSize: 10,
											fontWeight: 700,
											color: '#7a867d',
											textTransform: 'uppercase',
											textAlign: 'right',
										}}
									>
										Link to Dashboard
									</Typography>
								</Box>
								{group.cards.map((card) => (
									<Box
										key={card.id}
										sx={{
											display: 'grid',
											gridTemplateColumns: {
												xs: '1.6fr .9fr .7fr auto',
												md: '1.9fr 1fr .75fr auto',
											},
											columnGap: 1,
											alignItems: 'center',
											px: 1.5,
											py: 0.85,
											borderBottom: '1px solid #eff2ef',
											'&:last-child': { borderBottom: 'none' },
											'& .profile-link': {
												opacity: { xs: 1, md: 0 },
												transform: 'translateX(4px)',
												transition: 'opacity 0.2s, transform 0.2s',
											},
											'&:hover .profile-link': {
												opacity: 1,
												transform: 'translateX(0)',
											},
										}}
									>
										<Typography
											sx={{
												fontSize: { xs: 12, md: 13 },
												color: hasRecipientName(card) ? '#213826' : '#9aaa9e',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
												fontStyle: hasRecipientName(card) ? 'normal' : 'italic',
											}}
										>
											{hasRecipientName(card)
												? card.assigned_to_name ?? card.recipient_name
												: 'Yet to be assigned'}
										</Typography>
										<Typography
											sx={{
												fontSize: { xs: 12, md: 13 },
												color: '#3f5545',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
											}}
										>
											{card.tree_type ?? '-'}
										</Typography>
										<Typography
											sx={{ fontSize: { xs: 11, md: 12 }, color: '#4f5d52' }}
										>
											{card.sapling_id ?? '-'}
										</Typography>
										<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
											{card.sapling_id ? (
												<IconButton
													size="small"
													onClick={() => onOpenProfile(card.sapling_id)}
													className="profile-link"
													sx={{
														color: '#21472f',
														'&:hover': { bgcolor: '#e6ede6' },
													}}
												>
													<OpenInNew sx={{ fontSize: 18 }} />
												</IconButton>
											) : (
												<Box sx={{ width: 28 }} />
											)}
										</Box>
									</Box>
								))}
							</Box>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</Box>
	);
};

export default GiftCardsPage;
