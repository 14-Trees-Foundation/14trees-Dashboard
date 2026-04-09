import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
	DndContext,
	closestCenter,
	DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable';
import { FIELD_TYPES, generateUniqueFieldName } from './fieldTypes';
import FieldCard from './FieldCard';
import FieldEditorPanel from './FieldEditorPanel';

interface VisualBuilderProps {
	formStructure: any;
	onChange: (updatedStructure: any) => void;
}

const VisualBuilder: React.FC<VisualBuilderProps> = ({
	formStructure,
	onChange,
}) => {
	const [fields, setFields] = useState<any[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	// Sync from parent when formStructure prop changes (e.g. JSON editor tab → visual tab)
	useEffect(() => {
		const incoming = formStructure?.fields || [];
		setFields(incoming);
		// Keep selection valid
		setSelectedId((prev) => {
			if (prev == null) return null;
			return incoming.some((_: any, i: number) => String(i) === prev)
				? prev
				: null;
		});
	}, [formStructure]);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
	);

	const emit = useCallback(
		(updatedFields: any[]) => {
			onChange({ ...formStructure, fields: updatedFields });
		},
		[formStructure, onChange],
	);

	const handleAddField = (fieldType: string) => {
		const template = FIELD_TYPES.find((f) => f.type === fieldType);
		if (!template) return;

		const existingNames = fields.map((f) => f.name);
		const uniqueName = generateUniqueFieldName(fieldType, existingNames);
		const newField = {
			...JSON.parse(JSON.stringify(template.defaultConfig)),
			name: uniqueName,
		};

		const updated = [...fields, newField];
		setFields(updated);
		emit(updated);
		setSelectedId(String(updated.length - 1));
	};

	const handleDeleteField = (index: number) => {
		const updated = fields.filter((_, i) => i !== index);
		setFields(updated);
		emit(updated);
		setSelectedId((prev) => {
			if (prev === String(index)) return null;
			const prevNum = Number(prev);
			if (prevNum > index) return String(prevNum - 1);
			return prev;
		});
	};

	const handleFieldChange = (index: number, updatedField: any) => {
		const updated = [...fields];
		updated[index] = updatedField;
		setFields(updated);
		emit(updated);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = Number(active.id);
		const newIndex = Number(over.id);
		const reordered = arrayMove(fields, oldIndex, newIndex);
		setFields(reordered);
		emit(reordered);
		// Update selection to follow dragged item
		if (selectedId === String(oldIndex)) {
			setSelectedId(String(newIndex));
		}
	};

	const selectedIndex = selectedId != null ? Number(selectedId) : null;
	const selectedField =
		selectedIndex != null ? fields[selectedIndex] ?? null : null;

	return (
		<Box sx={{ display: 'flex', height: '100%', gap: 1.5, minHeight: 0 }}>
			{/* Left: Field Palette */}
			<Paper
				elevation={0}
				sx={{
					width: 190,
					flexShrink: 0,
					p: 1.5,
					bgcolor: '#0d1017',
					border: '1px solid #2a3832',
					borderRadius: 1,
					overflowY: 'auto',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Typography
					sx={{
						fontSize: '0.72rem',
						fontWeight: 600,
						mb: 1.5,
						color: '#9ba39d',
						textTransform: 'uppercase',
						letterSpacing: '0.08em',
					}}
				>
					Field Types
				</Typography>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
					{FIELD_TYPES.map((ft) => (
						<Button
							key={ft.type}
							onClick={() => handleAddField(ft.type)}
							sx={{
								justifyContent: 'flex-start',
								textTransform: 'none',
								color: '#e8eaf0',
								fontSize: '0.78rem',
								py: 0.75,
								px: 1,
								bgcolor: '#1a2820',
								border: '1px solid #2a3832',
								borderRadius: 1,
								gap: 1,
								'&:hover': { bgcolor: '#2a3832', borderColor: '#9bc53d' },
							}}
						>
							<Typography
								component="span"
								sx={{ fontSize: '1rem', lineHeight: 1 }}
							>
								{ft.icon}
							</Typography>
							{ft.label}
						</Button>
					))}
				</Box>
			</Paper>

			{/* Center: Canvas */}
			<Box
				sx={{
					flex: 1,
					p: 1.5,
					bgcolor: '#0d1017',
					border: '1px solid #2a3832',
					borderRadius: 1,
					overflowY: 'auto',
					minWidth: 0,
				}}
			>
				{fields.length === 0 ? (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							height: '100%',
							color: '#4a5a4e',
							gap: 1,
						}}
					>
						<AddIcon sx={{ fontSize: 40 }} />
						<Typography sx={{ fontSize: '0.875rem' }}>
							Click a field type to add it
						</Typography>
					</Box>
				) : (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={fields.map((_, i) => String(i))}
							strategy={verticalListSortingStrategy}
						>
							{fields.map((field, index) => (
								<FieldCard
									key={index}
									id={String(index)}
									field={field}
									isSelected={selectedId === String(index)}
									onClick={() => setSelectedId(String(index))}
									onDelete={() => handleDeleteField(index)}
								/>
							))}
						</SortableContext>
					</DndContext>
				)}
			</Box>

			{/* Right: Field Editor */}
			<Paper
				elevation={0}
				sx={{
					width: 280,
					flexShrink: 0,
					bgcolor: '#0d1017',
					border: '1px solid #2a3832',
					borderRadius: 1,
					overflowY: 'auto',
				}}
			>
				<FieldEditorPanel
					field={selectedField}
					onChange={(updated) => {
						if (selectedIndex != null)
							handleFieldChange(selectedIndex, updated);
					}}
				/>
			</Paper>
		</Box>
	);
};

export default VisualBuilder;
