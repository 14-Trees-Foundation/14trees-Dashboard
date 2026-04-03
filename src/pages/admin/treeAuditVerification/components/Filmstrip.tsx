import React from 'react';
import {
	Box,
	Chip,
	IconButton,
	MenuItem,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import { TreeAuditPhoto } from '../types';

interface FilmstripProps {
	pagePhotos: TreeAuditPhoto[];
	allPhotos: TreeAuditPhoto[];
	currentIndex: number;
	currentPage: number;
	pageSize: 25 | 50 | 100;
	totalPages: number;
	stagedEdits: Map<number, string>;
	onPhotoSelect: (globalIndex: number) => void;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: 25 | 50 | 100) => void;
}

const getOutline = (
	photo: TreeAuditPhoto,
	isSelected: boolean,
	hasStagedEdit: boolean,
	themeMode: 'light' | 'dark',
) => {
	if (isSelected) return '#9bc53d';
	if (hasStagedEdit) return '#e8a838';
	if (photo.verification_status === 'verified') return '#4caf6e';
	if (photo.verification_status === 'rejected') return '#e05252';
	return themeMode === 'dark' ? '#2a3832' : '#d9d5cd';
};

const Filmstrip: React.FC<FilmstripProps> = ({
	pagePhotos,
	allPhotos,
	currentIndex,
	currentPage,
	pageSize,
	totalPages,
	stagedEdits,
	onPhotoSelect,
	onPageChange,
	onPageSizeChange,
}) => {
	const theme = useTheme();
	const pageStart = currentPage * pageSize;

	return (
		<Stack spacing={2}>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				spacing={2}
				useFlexGap
				flexWrap="wrap"
			>
				<Stack direction="row" spacing={1} alignItems="center">
					<Typography variant="overline" sx={{ color: 'text.secondary' }}>
						Page {currentPage + 1} / {Math.max(totalPages, 1)}
					</Typography>
					<Chip
						size="small"
						variant="outlined"
						label={`${stagedEdits.size} unsaved`}
						color={stagedEdits.size > 0 ? 'warning' : 'default'}
					/>
				</Stack>

				<Stack direction="row" spacing={1} alignItems="center">
					<TextField
						select
						size="small"
						label="Page size"
						value={pageSize}
						onChange={(event) =>
							onPageSizeChange(Number(event.target.value) as 25 | 50 | 100)
						}
						sx={{ minWidth: 110 }}
					>
						{[25, 50, 100].map((value) => (
							<MenuItem key={value} value={value}>
								{value}
							</MenuItem>
						))}
					</TextField>
					<IconButton
						onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
						disabled={currentPage === 0}
					>
						<ChevronLeftIcon />
					</IconButton>
					<IconButton
						onClick={() =>
							onPageChange(Math.min(currentPage + 1, totalPages - 1))
						}
						disabled={currentPage >= totalPages - 1}
					>
						<ChevronRightIcon />
					</IconButton>
				</Stack>
			</Stack>

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))',
					gap: 1.25,
				}}
			>
				{pagePhotos.map((photo, pageIndex) => {
					const globalIndex = pageStart + pageIndex;
					const isSelected = globalIndex === currentIndex;
					const hasStagedEdit = stagedEdits.has(photo.id);
					const outline = getOutline(
						photo,
						isSelected,
						hasStagedEdit,
						theme.palette.mode,
					);

					return (
						<Tooltip
							key={photo.id}
							title={`#${globalIndex + 1} ${
								photo.verification_status || 'pending'
							}${hasStagedEdit ? ' • unsaved' : ''}`}
						>
							<Box
								onClick={() => onPhotoSelect(globalIndex)}
								sx={{
									position: 'relative',
									cursor: 'pointer',
									borderRadius: 2,
									overflow: 'hidden',
									border: `2px solid ${outline}`,
									bgcolor:
										theme.palette.mode === 'dark' ? '#101a14' : '#f6f3ed',
									aspectRatio: '1 / 1',
									transition: 'transform 0.12s ease, border-color 0.12s ease',
									'&:hover': {
										transform: 'translateY(-1px)',
									},
								}}
							>
								{photo.image ? (
									<Box
										component="img"
										src={photo.image}
										alt={`Snapshot ${photo.id}`}
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
											color: 'text.secondary',
											fontSize: '0.7rem',
											p: 1,
											textAlign: 'center',
										}}
									>
										No image
									</Box>
								)}
								<Box
									sx={{
										position: 'absolute',
										left: 0,
										right: 0,
										bottom: 0,
										px: 0.75,
										py: 0.25,
										background:
											theme.palette.mode === 'dark'
												? 'rgba(12,20,15,0.9)'
												: 'rgba(255,255,255,0.88)',
										fontSize: '0.68rem',
										fontWeight: 600,
										fontFamily: 'monospace',
									}}
								>
									#{globalIndex + 1}
								</Box>
							</Box>
						</Tooltip>
					);
				})}
			</Box>
		</Stack>
	);
};

export default Filmstrip;
