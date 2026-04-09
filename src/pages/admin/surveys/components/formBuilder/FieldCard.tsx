import React from 'react';
import { Box, IconButton, Typography, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getFieldIcon } from './fieldTypes';

interface FieldCardProps {
	field: any;
	id: string;
	isSelected: boolean;
	onClick: () => void;
	onDelete: () => void;
}

const FieldCard: React.FC<FieldCardProps> = ({
	field,
	id,
	isSelected,
	onClick,
	onDelete,
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<Box
			ref={setNodeRef}
			style={style}
			onClick={onClick}
			sx={{
				p: 1.5,
				mb: 1,
				bgcolor: isSelected ? 'rgba(155, 197, 61, 0.1)' : '#1a2820',
				border: isSelected ? '2px solid #9bc53d' : '1px solid #2a3832',
				borderRadius: 1,
				cursor: 'pointer',
				display: 'flex',
				alignItems: 'center',
				gap: 1.5,
				transition: 'border-color 0.15s, background-color 0.15s',
				'&:hover': {
					borderColor: isSelected ? '#9bc53d' : '#4a5a4e',
					bgcolor: isSelected
						? 'rgba(155, 197, 61, 0.1)'
						: 'rgba(255,255,255,0.03)',
				},
			}}
		>
			<Box
				{...attributes}
				{...listeners}
				sx={{
					cursor: 'grab',
					color: '#6b7a6e',
					display: 'flex',
					alignItems: 'center',
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<DragIndicatorIcon fontSize="small" />
			</Box>

			<Typography sx={{ fontSize: '1.1rem', lineHeight: 1 }}>
				{getFieldIcon(field.type)}
			</Typography>

			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Typography
					sx={{
						fontSize: '0.875rem',
						fontWeight: 500,
						color: '#e8eaf0',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
					{field.label?.en || 'Untitled Field'}
				</Typography>
				<Box
					sx={{
						display: 'flex',
						gap: 0.75,
						mt: 0.5,
						alignItems: 'center',
						flexWrap: 'wrap',
					}}
				>
					<Chip
						label={field.type}
						size="small"
						sx={{
							height: 18,
							fontSize: '0.68rem',
							bgcolor: '#2a3832',
							color: '#9ba39d',
						}}
					/>
					<Typography
						sx={{
							fontSize: '0.72rem',
							color: '#6b7a6e',
							fontFamily: 'monospace',
						}}
					>
						{field.name}
					</Typography>
					{field.required && (
						<Chip
							label="Required"
							size="small"
							sx={{
								height: 18,
								fontSize: '0.68rem',
								bgcolor: 'rgba(239,83,80,0.15)',
								color: '#ef5350',
							}}
						/>
					)}
				</Box>
			</Box>

			<IconButton
				size="small"
				onClick={(e) => {
					e.stopPropagation();
					onDelete();
				}}
				sx={{
					color: '#6b7a6e',
					flexShrink: 0,
					'&:hover': { color: '#ef5350' },
				}}
			>
				<DeleteIcon sx={{ fontSize: 16 }} />
			</IconButton>
		</Box>
	);
};

export default FieldCard;
