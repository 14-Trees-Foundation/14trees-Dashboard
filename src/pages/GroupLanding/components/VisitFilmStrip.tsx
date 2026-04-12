import { useState, useMemo } from 'react';
import {
	Box,
	Typography,
	Grid,
	InputBase,
	Button,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
} from '@mui/material';
import {
	Close,
	CalendarToday,
	People,
	Sort,
	KeyboardArrowDown,
} from '@mui/icons-material';
import {
	GroupLandingEvent,
	GroupLandingGiftCard,
} from '../../../types/GroupLanding';
import VisitCard from './VisitCard';
import GiftCard from './GiftCard';

type Props = {
	visits: GroupLandingEvent[];
	giftCards: GroupLandingGiftCard[];
};

const FILTERS = [
	{ label: 'All', value: 'all' },
	{ label: 'Events', value: 'events' },
	{ label: 'Site visit', value: 'site visit' },
	{ label: 'Gifts', value: 'gifts' },
];

const getEventCategory = (event: GroupLandingEvent) => {
	const eventName = event.name.toLowerCase();
	if (eventName.includes('visit')) return 'site visit';
	if (eventName.includes('gift')) return 'gifts';
	return 'events';
};

const SECTION_GAP = { xs: 3, md: 5 };

const VisitFilmStrip: React.FC<Props> = ({ visits, giftCards }) => {
	const [search, setSearch] = useState('');
	const [activeFilter, setActiveFilter] = useState('all');
	const [selected, setSelected] = useState<GroupLandingEvent | null>(null);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [sortDialogOpen, setSortDialogOpen] = useState(false);

	const filteredEvents = useMemo(() => {
		if (activeFilter === 'gifts') return [];
		let result = visits.filter((v) => {
			const matchesSearch =
				!search ||
				v.name.toLowerCase().includes(search.toLowerCase()) ||
				(v.site_name ?? '').toLowerCase().includes(search.toLowerCase());
			const matchesFilter =
				activeFilter === 'all' || getEventCategory(v) === activeFilter;
			return matchesSearch && matchesFilter;
		});
		result.sort((a, b) => {
			const nameA = a.name.toLowerCase();
			const nameB = b.name.toLowerCase();
			return sortOrder === 'asc'
				? nameA.localeCompare(nameB)
				: nameB.localeCompare(nameA);
		});
		return result;
	}, [visits, search, activeFilter, sortOrder]);

	const filteredGiftCards = useMemo(() => {
		if (activeFilter !== 'all' && activeFilter !== 'gifts') return [];
		return giftCards
			.filter((gc) => {
				const name = (gc.event_name ?? '').toLowerCase();
				return !search || name.includes(search.toLowerCase());
			})
			.sort((a, b) => {
				const nameA = (a.event_name ?? '').toLowerCase();
				const nameB = (b.event_name ?? '').toLowerCase();
				return sortOrder === 'asc'
					? nameA.localeCompare(nameB)
					: nameB.localeCompare(nameA);
			});
	}, [giftCards, search, activeFilter, sortOrder]);

	const totalCount = filteredEvents.length + filteredGiftCards.length;

	const cardsMaxWidth =
		totalCount >= 3
			? '1208.666748046875px'
			: totalCount === 2
			? '808px'
			: '404px';

	const formattedDate = (dateStr: string) =>
		new Date(dateStr).toLocaleDateString('en-IN', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		});

	return (
		<Box sx={{ bgcolor: '#f5f5f0', pt: SECTION_GAP, pb: 6 }}>
			{/* Search + filter bar */}
			<Box sx={{ px: { xs: 2, sm: 3 } }}>
				<Box
					sx={{
						width: '100%',
						maxWidth: '800px',
						ml: 'auto',
						mr: 'auto',
						bgcolor: '#fff',
						border: '1px solid #e6e8e6',
						borderRadius: '28px',
						boxShadow: '0px 4px 17px 0px #1F36251A',
						px: { xs: 2, md: 3 },
						py: { xs: 2, md: 2 },
						display: 'flex',
						flexDirection: 'column',
						gap: '40px',
					}}
				>
					{/* Search input */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							bgcolor: '#fff',
							border: '1px solid #d0d5d0',
							borderRadius: '12px',
							pl: 2,
							pr: 0.5,
							py: 0.35,
							maxWidth: '100%',
							minHeight: 48,
						}}
					>
						<InputBase
							fullWidth
							placeholder="Search by Name..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							sx={{
								fontSize: 16,
								color: '#6f7b73',
								'& input::placeholder': {
									color: '#6f7b73',
									opacity: 1,
								},
							}}
						/>
						<Button
							variant="contained"
							sx={{
								bgcolor: '#1f452d',
								textTransform: 'none',
								borderRadius: '12px',
								minWidth: 116,
								height: 40,
								px: 1,
								fontWeight: 500,
								fontSize: '18px',
								lineHeight: '24px',
								'&:hover': { bgcolor: '#163824' },
							}}
						>
							Search
						</Button>
					</Box>

					{/* Filter chips */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 1.5,
							flexWrap: 'wrap',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
								flexWrap: 'wrap',
							}}
						>
							<Typography
								sx={{
									mr: 0.75,
									color: '#6f7b73',
									fontSize: '16px',
									lineHeight: '24px',
								}}
							>
								Filter by
							</Typography>
							{FILTERS.map((filter) => (
								<Chip
									key={filter.value}
									label={filter.value === 'all' ? '• All' : filter.label}
									onClick={() => setActiveFilter(filter.value)}
									sx={{
										height: 44,
										borderRadius: '12px',
										border:
											activeFilter === filter.value
												? 'none'
												: '1px solid #d4d8d4',
										bgcolor: activeFilter === filter.value ? '#1f452d' : '#fff',
										color: activeFilter === filter.value ? '#fff' : '#1f241f',
										fontWeight: 500,
										fontSize: '16px',
										'& .MuiChip-label': { px: 2 },
										'&:hover': {
											bgcolor:
												activeFilter === filter.value ? '#163824' : '#f5f5f5',
										},
									}}
								/>
							))}
						</Box>

						<Box
							onClick={() => setSortDialogOpen(true)}
							sx={{
								height: 40,
								borderRadius: '12px',
								border: '1px solid #d4d8d4',
								px: 2,
								display: 'flex',
								alignItems: 'center',
								gap: 1.25,
								color: '#2b4533',
								minWidth: 180,
								cursor: 'pointer',
								'&:hover': { bgcolor: '#f9f9f9' },
							}}
						>
							<Sort sx={{ fontSize: 24 }} />
							<Typography
								sx={{ fontSize: '16px', lineHeight: '24px', fontWeight: 500 }}
							>
								{sortOrder === 'asc' ? 'A-z order' : 'Z-a order'}
							</Typography>
							<KeyboardArrowDown sx={{ fontSize: 24, ml: 'auto' }} />
						</Box>
					</Box>
				</Box>
			</Box>

			{/* Cards grid */}
			<Box sx={{ px: { xs: 2, sm: 3 }, mt: SECTION_GAP }}>
				{totalCount === 0 ? (
					<Typography color="text.secondary" textAlign="center" py={4}>
						No items found.
					</Typography>
				) : (
					<Box
						sx={{
							width: '100%',
							maxWidth: { xs: '100%', md: cardsMaxWidth },
							mx: 'auto',
							display: 'grid',
							gridTemplateColumns: {
								xs: 'minmax(0, 1fr)',
								sm:
									totalCount === 1
										? 'minmax(0, 1fr)'
										: 'repeat(2, minmax(0, 1fr))',
								md:
									totalCount >= 3
										? 'repeat(3, minmax(0, 1fr))'
										: totalCount === 2
										? 'repeat(2, minmax(0, 1fr))'
										: 'minmax(0, 1fr)',
							},
							gap: { xs: 2, md: 2.5 },
							justifyContent: 'center',
						}}
					>
						{filteredEvents.map((event) => (
							<Box
								key={`event-${event.id}`}
								sx={{ display: 'flex', justifyContent: 'center' }}
							>
								<VisitCard event={event} onClick={setSelected} />
							</Box>
						))}
						{filteredGiftCards.map((gc) => (
							<Box
								key={`gc-${gc.id}`}
								sx={{ display: 'flex', justifyContent: 'center' }}
							>
								<GiftCard card={gc} />
							</Box>
						))}
					</Box>
				)}

				{/* <Box sx={{ textAlign: 'center', mt: 4.5 }}>
                    <Button
                        variant="contained"
                        endIcon={<Add sx={{ fontSize: 20 }} />}
                        sx={{
                            bgcolor: '#1f452d',
                            color: '#fff',
                            textTransform: 'none',
                            px: 3,
                            height: 44,
                            borderRadius: '10px',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '24px',
                            '&:hover': { bgcolor: '#163824' },
                        }}
                    >
                        View &lt;10&gt; more
                    </Button>
                </Box> */}
			</Box>

			{/* Sort dialog */}
			<Dialog
				open={sortDialogOpen}
				onClose={() => setSortDialogOpen(false)}
				maxWidth="xs"
				fullWidth
			>
				<DialogTitle sx={{ fontWeight: 700, color: '#1a1a1a' }}>
					Sort by
				</DialogTitle>
				<DialogContent sx={{ pt: 2 }}>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
						<Button
							fullWidth
							onClick={() => {
								setSortOrder('asc');
								setSortDialogOpen(false);
							}}
							sx={{
								justifyContent: 'flex-start',
								textTransform: 'none',
								color: sortOrder === 'asc' ? '#1f452d' : '#6f7b73',
								bgcolor: sortOrder === 'asc' ? '#eff2ee' : '#fff',
								border: '1px solid #d4d8d4',
								py: 1.5,
								px: 2,
								fontWeight: sortOrder === 'asc' ? 600 : 400,
								'&:hover': {
									bgcolor: sortOrder === 'asc' ? '#e8eddf' : '#f9f9f9',
								},
							}}
						>
							A → Z (Ascending)
						</Button>
						<Button
							fullWidth
							onClick={() => {
								setSortOrder('desc');
								setSortDialogOpen(false);
							}}
							sx={{
								justifyContent: 'flex-start',
								textTransform: 'none',
								color: sortOrder === 'desc' ? '#1f452d' : '#6f7b73',
								bgcolor: sortOrder === 'desc' ? '#eff2ee' : '#fff',
								border: '1px solid #d4d8d4',
								py: 1.5,
								px: 2,
								fontWeight: sortOrder === 'desc' ? 600 : 400,
								'&:hover': {
									bgcolor: sortOrder === 'desc' ? '#e8eddf' : '#f9f9f9',
								},
							}}
						>
							Z → A (Descending)
						</Button>
					</Box>
				</DialogContent>
			</Dialog>

			{/* Detail dialog */}
			<Dialog
				open={!!selected}
				onClose={() => setSelected(null)}
				maxWidth="md"
				fullWidth
			>
				{selected && (
					<>
						<DialogTitle
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'flex-start',
								fontWeight: 700,
								color: '#1a1a1a',
								pb: 0,
							}}
						>
							<Box>
								{selected.name}
								<Box
									sx={{ display: 'flex', gap: 1.5, mt: 0.5, flexWrap: 'wrap' }}
								>
									{selected.site_name && (
										<Typography variant="caption" sx={{ color: '#2e7d32' }}>
											@ {selected.site_name}
										</Typography>
									)}
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
										<CalendarToday
											sx={{ fontSize: 12, color: 'text.secondary' }}
										/>
										<Typography variant="caption" color="text.secondary">
											{formattedDate(selected.event_date)}
										</Typography>
									</Box>
									{false && (
										<Box
											sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
										>
											<People sx={{ fontSize: 12, color: 'text.secondary' }} />
											<Typography variant="caption" color="text.secondary">
												{selected.user_count} participants
											</Typography>
										</Box>
									)}
								</Box>
							</Box>
							<IconButton
								onClick={() => setSelected(null)}
								size="small"
								sx={{ mt: -0.5 }}
							>
								<Close />
							</IconButton>
						</DialogTitle>

						<DialogContent sx={{ pt: 2 }}>
							{selected.event_images.length > 0 ? (
								<Grid container spacing={1}>
									{selected.event_images.map((url, i) => (
										<Grid item xs={6} sm={4} key={i}>
											<Box
												component="img"
												src={url}
												alt={`Photo ${i + 1}`}
												sx={{
													width: '100%',
													height: 180,
													objectFit: 'cover',
													borderRadius: 1,
													display: 'block',
												}}
											/>
										</Grid>
									))}
								</Grid>
							) : (
								<Typography color="text.secondary">
									No photos available for this event.
								</Typography>
							)}
						</DialogContent>
					</>
				)}
			</Dialog>
		</Box>
	);
};

export default VisitFilmStrip;
