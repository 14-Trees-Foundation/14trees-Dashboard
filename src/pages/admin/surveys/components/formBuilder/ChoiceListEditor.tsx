import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	Typography,
	TextField,
	IconButton,
	Tooltip,
	Divider,
	Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import UploadIcon from '@mui/icons-material/Upload';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
	useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChoiceItem, normalizeLabel } from './formBuilderTypes';

interface ChoiceListEditorProps {
	open: boolean;
	onClose: () => void;
	listName: string;
	choices: ChoiceItem[];
	onSave: (listName: string, choices: ChoiceItem[]) => void;
}

const inputSx = {
	'& .MuiOutlinedInput-root': {
		bgcolor: '#0d1017',
		color: '#e8eaf0',
		fontSize: '0.82rem',
		'& fieldset': { borderColor: '#2a3832' },
		'&:hover fieldset': { borderColor: '#9bc53d' },
		'&.Mui-focused fieldset': { borderColor: '#9bc53d' },
	},
	'& .MuiInputLabel-root': { color: '#9ba39d', fontSize: '0.82rem' },
};

// ── Sortable row ──────────────────────────────────────────────────────────────

interface RowProps {
	item: ChoiceItem;
	onChange: (updated: ChoiceItem) => void;
	onDelete: () => void;
}

const SortableRow: React.FC<RowProps> = ({ item, onChange, onDelete }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: item.name });

	const label = normalizeLabel(item.label);

	return (
		<Box
			ref={setNodeRef}
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1,
				mb: 0.75,
				opacity: isDragging ? 0.5 : 1,
				transform: CSS.Transform.toString(transform),
				transition,
			}}
		>
			<Box
				{...attributes}
				{...listeners}
				sx={{
					cursor: 'grab',
					color: '#4a5a4e',
					display: 'flex',
					alignItems: 'center',
					flexShrink: 0,
				}}
			>
				<DragIndicatorIcon sx={{ fontSize: 18 }} />
			</Box>

			<TextField
				size="small"
				placeholder="name"
				value={item.name}
				onChange={(e) => onChange({ ...item, name: e.target.value })}
				sx={{ width: 130, ...inputSx }}
			/>
			<TextField
				size="small"
				placeholder="Label (EN)"
				value={label.en}
				onChange={(e) =>
					onChange({ ...item, label: { ...label, en: e.target.value } })
				}
				sx={{ flex: 1, ...inputSx }}
			/>
			<TextField
				size="small"
				placeholder="Label (MR)"
				value={label.mr}
				onChange={(e) =>
					onChange({ ...item, label: { ...label, mr: e.target.value } })
				}
				sx={{ flex: 1, ...inputSx }}
			/>

			<IconButton
				size="small"
				onClick={onDelete}
				sx={{
					color: '#6b7a6e',
					'&:hover': { color: '#ef5350' },
					flexShrink: 0,
				}}
			>
				<DeleteIcon sx={{ fontSize: 17 }} />
			</IconButton>
		</Box>
	);
};

// ── Main component ────────────────────────────────────────────────────────────

const ChoiceListEditor: React.FC<ChoiceListEditorProps> = ({
	open,
	onClose,
	listName: initialListName,
	choices: initialChoices,
	onSave,
}) => {
	const [listName, setListName] = useState(initialListName);
	const [items, setItems] = useState<ChoiceItem[]>([]);
	const [bulkText, setBulkText] = useState('');
	const [showBulk, setShowBulk] = useState(false);
	const [bulkError, setBulkError] = useState('');

	useEffect(() => {
		if (!open) return;
		setListName(initialListName);
		setItems(
			initialChoices.map((c) => ({ ...c, label: normalizeLabel(c.label) })),
		);
		setBulkText('');
		setShowBulk(false);
		setBulkError('');
	}, [open, initialListName, initialChoices]);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIdx = items.findIndex((i) => i.name === active.id);
		const newIdx = items.findIndex((i) => i.name === over.id);
		if (oldIdx !== -1 && newIdx !== -1)
			setItems(arrayMove(items, oldIdx, newIdx));
	};

	const addRow = () =>
		setItems((prev) => [
			...prev,
			{ name: `option_${prev.length + 1}`, label: { en: '', mr: '' } },
		]);

	const updateRow = (idx: number, updated: ChoiceItem) =>
		setItems((prev) => prev.map((item, i) => (i === idx ? updated : item)));

	const deleteRow = (idx: number) =>
		setItems((prev) => prev.filter((_, i) => i !== idx));

	const applyBulk = () => {
		setBulkError('');
		const lines = bulkText
			.split('\n')
			.map((l) => l.trim())
			.filter(Boolean);
		if (lines.length === 0) {
			setBulkError('No lines found');
			return;
		}

		const parsed: ChoiceItem[] = lines.map((line) => {
			const parts = line.split(',').map((p) => p.trim());
			const name = parts[0].toLowerCase().replace(/\s+/g, '_');
			const en = parts[1] || parts[0];
			const mr = parts[2] || en;
			return { name, label: { en, mr } };
		});

		setItems(parsed);
		setShowBulk(false);
		setBulkText('');
	};

	const handleSave = () => {
		const deduped = items.filter(
			(item, idx, arr) =>
				item.name && arr.findIndex((i) => i.name === item.name) === idx,
		);
		onSave(listName, deduped);
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: {
					bgcolor: '#1a2820',
					color: '#e8eaf0',
					height: '80vh',
					display: 'flex',
					flexDirection: 'column',
				},
			}}
		>
			<DialogTitle sx={{ borderBottom: '1px solid #2a3832', py: 1.5 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
						Edit Choice List
					</Typography>
					<TextField
						size="small"
						label="List Name"
						value={listName}
						onChange={(e) => setListName(e.target.value)}
						sx={{ width: 220, ...inputSx }}
					/>
					<Box sx={{ flex: 1 }} />
					<Tooltip title="Bulk paste (one per line: name,label_en,label_mr)">
						<Button
							size="small"
							startIcon={<ContentPasteIcon sx={{ fontSize: 15 }} />}
							onClick={() => setShowBulk((v) => !v)}
							sx={{
								color: '#9bc53d',
								textTransform: 'none',
								fontSize: '0.78rem',
								borderColor: '#9bc53d',
								border: '1px solid',
							}}
						>
							Bulk Import
						</Button>
					</Tooltip>
				</Box>
			</DialogTitle>

			<DialogContent sx={{ flex: 1, overflow: 'auto', pt: 2 }}>
				{showBulk && (
					<Box sx={{ mb: 2 }}>
						<Typography
							sx={{ fontSize: '0.78rem', color: '#9ba39d', mb: 0.75 }}
						>
							One option per line. Format: <code>name, Label EN, Label MR</code>{' '}
							(or just names for auto-labels).
						</Typography>
						<TextField
							multiline
							rows={6}
							fullWidth
							value={bulkText}
							onChange={(e) => setBulkText(e.target.value)}
							placeholder={
								'quadrat_1, Quadrat 1, क्वाड्रट 1\nquadrat_2, Quadrat 2, क्वाड्रट 2'
							}
							sx={inputSx}
						/>
						{bulkError && (
							<Alert severity="error" sx={{ mt: 0.75, py: 0 }}>
								{bulkError}
							</Alert>
						)}
						<Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
							<Button
								size="small"
								onClick={applyBulk}
								variant="contained"
								sx={{
									bgcolor: '#9bc53d',
									color: '#0f1912',
									textTransform: 'none',
									fontSize: '0.8rem',
									'&:hover': { bgcolor: '#8ab02d' },
								}}
							>
								Apply
							</Button>
							<Button
								size="small"
								onClick={() => setShowBulk(false)}
								sx={{
									color: '#9ba39d',
									textTransform: 'none',
									fontSize: '0.8rem',
								}}
							>
								Cancel
							</Button>
						</Box>
						<Divider sx={{ borderColor: '#2a3832', mt: 2 }} />
					</Box>
				)}

				{/* Header row */}
				<Box sx={{ display: 'flex', gap: 1, mb: 1, pl: '26px' }}>
					<Typography
						sx={{
							width: 130,
							fontSize: '0.72rem',
							color: '#6b7a6e',
							textTransform: 'uppercase',
							letterSpacing: '0.06em',
						}}
					>
						Name
					</Typography>
					<Typography
						sx={{
							flex: 1,
							fontSize: '0.72rem',
							color: '#6b7a6e',
							textTransform: 'uppercase',
							letterSpacing: '0.06em',
						}}
					>
						Label (EN)
					</Typography>
					<Typography
						sx={{
							flex: 1,
							fontSize: '0.72rem',
							color: '#6b7a6e',
							textTransform: 'uppercase',
							letterSpacing: '0.06em',
						}}
					>
						Label (MR)
					</Typography>
					<Box sx={{ width: 34 }} />
				</Box>

				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={items.map((i) => i.name)}
						strategy={verticalListSortingStrategy}
					>
						{items.map((item, idx) => (
							<SortableRow
								key={`${item.name}-${idx}`}
								item={item}
								onChange={(updated) => updateRow(idx, updated)}
								onDelete={() => deleteRow(idx)}
							/>
						))}
					</SortableContext>
				</DndContext>

				<Button
					startIcon={<AddIcon />}
					onClick={addRow}
					size="small"
					sx={{
						mt: 1,
						color: '#9bc53d',
						textTransform: 'none',
						fontSize: '0.8rem',
						px: 0,
					}}
				>
					Add option
				</Button>
			</DialogContent>

			<DialogActions sx={{ borderTop: '1px solid #2a3832', px: 3, py: 2 }}>
				<Typography sx={{ fontSize: '0.78rem', color: '#6b7a6e', flex: 1 }}>
					{items.length} option{items.length !== 1 ? 's' : ''}
				</Typography>
				<Button
					onClick={onClose}
					sx={{ color: '#9ba39d', textTransform: 'none' }}
				>
					Cancel
				</Button>
				<Button
					onClick={handleSave}
					variant="contained"
					sx={{
						bgcolor: '#9bc53d',
						color: '#0f1912',
						textTransform: 'none',
						'&:hover': { bgcolor: '#8ab02d' },
					}}
				>
					Save Choices
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ChoiceListEditor;
