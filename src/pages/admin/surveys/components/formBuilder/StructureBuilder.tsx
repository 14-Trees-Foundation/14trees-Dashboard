import React, { useState, useCallback } from 'react';
import {
	Box,
	Paper,
	Button,
	Typography,
	Menu,
	MenuItem,
	Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SectionTree from './SectionTree';
import FieldPropertyPanel from './FieldPropertyPanel';
import SectionPropertyPanel from './SectionPropertyPanel';
import {
	FormStructure,
	SurveyField,
	SurveySection,
	SelectedItem,
	BuilderError,
	getChoices,
	normalizeLabel,
	validateFormStructure,
} from './formBuilderTypes';

interface StructureBuilderProps {
	formStructure: FormStructure;
	onChange: (updated: FormStructure) => void;
}

const FIELD_TYPES = [
	{ value: 'text', label: 'Text' },
	{ value: 'number', label: 'Number' },
	{ value: 'decimal', label: 'Decimal' },
	{ value: 'select_one', label: 'Single Select' },
	{ value: 'select_many', label: 'Multi Select' },
	{ value: 'geopoint', label: 'GPS Location' },
	{ value: 'image', label: 'Photo' },
	{ value: 'date', label: 'Date' },
];

function generateUniqueId(base: string, existing: string[]): string {
	let n = 1;
	let id = `${base}_${n}`;
	while (existing.includes(id)) {
		n++;
		id = `${base}_${n}`;
	}
	return id;
}

const StructureBuilder: React.FC<StructureBuilderProps> = ({
	formStructure,
	onChange,
}) => {
	const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
	const [addFieldAnchor, setAddFieldAnchor] = useState<null | HTMLElement>(
		null,
	);

	const errors: BuilderError[] = validateFormStructure(formStructure);
	const fields = formStructure.fields || [];
	const sections = formStructure.sections || [];
	const choices = getChoices(formStructure);

	// ── Helpers ──────────────────────────────────────────────────────────────

	const emit = useCallback(
		(patch: Partial<FormStructure>) => {
			onChange({ ...formStructure, ...patch });
		},
		[formStructure, onChange],
	);

	// ── Field operations ──────────────────────────────────────────────────────

	const handleAddField = (type: string) => {
		setAddFieldAnchor(null);
		const existingNames = fields.map((f) => f.name);
		const name = generateUniqueId(type, existingNames);
		const sectionId =
			selectedItem?.type === 'section' ? selectedItem.id : undefined;
		const newField: SurveyField = {
			type,
			name,
			label: { en: '', mr: '' },
			required: false,
			readOnly: false,
			...(sectionId
				? {
						section: sectionId,
						page: 1,
						order: fields.filter((f) => f.section === sectionId).length + 1,
				  }
				: {}),
		};
		emit({ fields: [...fields, newField] });
		setSelectedItem({ type: 'field', name });
	};

	const handleFieldChange = useCallback(
		(updated: SurveyField) => {
			const idx = fields.findIndex(
				(f) =>
					f.name === (selectedItem?.type === 'field' ? selectedItem.name : ''),
			);
			if (idx === -1) return;
			const newFields = [...fields];
			newFields[idx] = updated;
			// If name changed, update selectedItem
			if (updated.name !== fields[idx].name) {
				setSelectedItem({ type: 'field', name: updated.name });
			}
			emit({ fields: newFields });
		},
		[fields, selectedItem, emit],
	);

	const handleDeleteField = useCallback(() => {
		if (selectedItem?.type !== 'field') return;
		emit({ fields: fields.filter((f) => f.name !== selectedItem.name) });
		setSelectedItem(null);
	}, [fields, selectedItem, emit]);

	const handleChoicesChange = useCallback(
		(listName: string, items: any[]) => {
			const updated = { ...choices, [listName]: items };
			emit({ choices: updated, choiceLists: undefined });
		},
		[choices, emit],
	);

	// ── Section operations ────────────────────────────────────────────────────

	const handleAddSection = () => {
		const existingIds = sections.map((s) => s.id);
		const id = generateUniqueId('section', existingIds);
		const newSection: SurveySection = {
			id,
			title: { en: 'New Section', mr: 'नवीन विभाग' },
			order: sections.length + 1,
			fieldsPerPage: 3,
		};
		emit({ sections: [...sections, newSection] });
		setSelectedItem({ type: 'section', id });
	};

	const handleSectionChange = useCallback(
		(updated: SurveySection) => {
			const oldId = selectedItem?.type === 'section' ? selectedItem.id : '';
			const newSections = sections.map((s) => (s.id === oldId ? updated : s));
			// If id changed, update field references too
			let newFields = fields;
			if (updated.id !== oldId) {
				newFields = fields.map((f) =>
					f.section === oldId ? { ...f, section: updated.id } : f,
				);
				setSelectedItem({ type: 'section', id: updated.id });
			}
			emit({ sections: newSections, fields: newFields });
		},
		[sections, fields, selectedItem, emit],
	);

	const handleDeleteSection = useCallback(() => {
		if (selectedItem?.type !== 'section') return;
		const id = selectedItem.id;
		emit({
			sections: sections.filter((s) => s.id !== id),
			fields: fields.map((f) =>
				f.section === id ? { ...f, section: undefined } : f,
			),
		});
		setSelectedItem(null);
	}, [sections, fields, selectedItem, emit]);

	// ── Resolve selected items ────────────────────────────────────────────────

	const selectedField =
		selectedItem?.type === 'field'
			? fields.find((f) => f.name === selectedItem.name) ?? null
			: null;

	const selectedSection =
		selectedItem?.type === 'section'
			? sections.find((s) => s.id === selectedItem.id) ?? null
			: null;

	// ── Render ────────────────────────────────────────────────────────────────

	return (
		<Box sx={{ display: 'flex', height: '100%', gap: 1.5, minHeight: 0 }}>
			{/* Left: Tree panel */}
			<Paper
				elevation={0}
				sx={{
					width: 230,
					flexShrink: 0,
					bgcolor: '#0d1017',
					border: '1px solid #2a3832',
					borderRadius: 1,
					display: 'flex',
					flexDirection: 'column',
					minHeight: 0,
				}}
			>
				<SectionTree
					formStructure={formStructure}
					selectedItem={selectedItem}
					errors={errors}
					onSelectItem={setSelectedItem}
				/>
			</Paper>

			{/* Center: action area / empty state */}
			<Box
				sx={{
					flex: 1,
					bgcolor: '#0d1017',
					border: '1px solid #2a3832',
					borderRadius: 1,
					p: 2,
					display: 'flex',
					flexDirection: 'column',
					gap: 1.5,
					minWidth: 0,
					overflowY: 'auto',
				}}
			>
				<Box sx={{ display: 'flex', gap: 1, flexShrink: 0, flexWrap: 'wrap' }}>
					<Button
						startIcon={<AddIcon />}
						onClick={handleAddSection}
						size="small"
						variant="outlined"
						sx={{
							textTransform: 'none',
							fontSize: '0.8rem',
							color: '#9bc53d',
							borderColor: '#9bc53d',
							'&:hover': {
								borderColor: '#8ab02d',
								bgcolor: 'rgba(155,197,61,0.08)',
							},
						}}
					>
						Add Section
					</Button>
					<Button
						startIcon={<AddIcon />}
						onClick={(e) => setAddFieldAnchor(e.currentTarget)}
						size="small"
						variant="outlined"
						sx={{
							textTransform: 'none',
							fontSize: '0.8rem',
							color: '#4caf6e',
							borderColor: '#4caf6e',
							'&:hover': {
								borderColor: '#3d9d5e',
								bgcolor: 'rgba(76,175,110,0.08)',
							},
						}}
					>
						Add Field
					</Button>
					<Menu
						anchorEl={addFieldAnchor}
						open={Boolean(addFieldAnchor)}
						onClose={() => setAddFieldAnchor(null)}
						PaperProps={{
							sx: {
								bgcolor: '#1a2820',
								border: '1px solid #2a3832',
								minWidth: 150,
							},
						}}
					>
						{FIELD_TYPES.map((ft) => (
							<MenuItem
								key={ft.value}
								onClick={() => handleAddField(ft.value)}
								sx={{
									fontSize: '0.82rem',
									color: '#e8eaf0',
									'&:hover': { bgcolor: '#2a3832' },
								}}
							>
								{ft.label}
							</MenuItem>
						))}
					</Menu>
				</Box>

				<Divider sx={{ borderColor: '#2a3832' }} />

				{/* Hint text when nothing selected */}
				{!selectedItem && (
					<Box
						sx={{
							flex: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: '#4a5a4e',
						}}
					>
						<Typography sx={{ fontSize: '0.875rem', textAlign: 'center' }}>
							Select an item in the tree to edit it,
							<br />
							or add sections and fields above.
						</Typography>
					</Box>
				)}

				{/* Summary of selected field / section in center area */}
				{selectedField && (
					<Box
						sx={{
							bgcolor: '#0f1219',
							border: '1px solid #2a3832',
							borderRadius: 1,
							p: 2,
						}}
					>
						<Typography sx={{ fontSize: '0.78rem', color: '#9ba39d', mb: 0.5 }}>
							Selected field
						</Typography>
						<Typography
							sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#e8eaf0' }}
						>
							{selectedField.name}
						</Typography>
						<Typography sx={{ fontSize: '0.8rem', color: '#6b7a6e' }}>
							type: {selectedField.type}
							{selectedField.section && ` · section: ${selectedField.section}`}
							{selectedField.page && ` · page: ${selectedField.page}`}
						</Typography>
						{selectedField.visibleIf && (
							<Typography
								sx={{ fontSize: '0.78rem', color: '#f0a050', mt: 0.5 }}
							>
								🔒 Has conditional logic
							</Typography>
						)}
						{errors
							.filter((e) => e.itemId === selectedField.name)
							.map((e, i) => (
								<Typography
									key={i}
									sx={{ fontSize: '0.78rem', color: '#ef5350', mt: 0.25 }}
								>
									⚠ {e.message}
								</Typography>
							))}
					</Box>
				)}

				{selectedSection && (
					<Box
						sx={{
							bgcolor: '#0f1219',
							border: '1px solid #2a3832',
							borderRadius: 1,
							p: 2,
						}}
					>
						<Typography sx={{ fontSize: '0.78rem', color: '#9ba39d', mb: 0.5 }}>
							Selected section
						</Typography>
						<Typography
							sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#e8eaf0' }}
						>
							{normalizeLabel(selectedSection.title).en || selectedSection.id}
						</Typography>
						<Typography sx={{ fontSize: '0.8rem', color: '#6b7a6e' }}>
							id: {selectedSection.id}
							{selectedSection.order !== undefined &&
								` · order: ${selectedSection.order}`}
						</Typography>
						{selectedSection.visibleIf && (
							<Typography
								sx={{ fontSize: '0.78rem', color: '#f0a050', mt: 0.5 }}
							>
								🔒 Has conditional logic
							</Typography>
						)}
					</Box>
				)}

				{/* Validation summary */}
				{errors.length > 0 && (
					<Box
						sx={{
							bgcolor: 'rgba(239,83,80,0.08)',
							border: '1px solid rgba(239,83,80,0.3)',
							borderRadius: 1,
							p: 1.5,
						}}
					>
						<Typography
							sx={{
								fontSize: '0.78rem',
								color: '#ef5350',
								fontWeight: 600,
								mb: 0.5,
							}}
						>
							{errors.length} validation error{errors.length > 1 ? 's' : ''}
						</Typography>
						{errors.slice(0, 5).map((e, i) => (
							<Typography
								key={i}
								sx={{ fontSize: '0.75rem', color: '#ef9090' }}
							>
								• {e.itemId}: {e.message}
							</Typography>
						))}
						{errors.length > 5 && (
							<Typography sx={{ fontSize: '0.75rem', color: '#9ba39d' }}>
								…and {errors.length - 5} more
							</Typography>
						)}
					</Box>
				)}
			</Box>

			{/* Right: property panel */}
			<Paper
				elevation={0}
				sx={{
					width: 290,
					flexShrink: 0,
					bgcolor: '#0d1017',
					border: '1px solid #2a3832',
					borderRadius: 1,
					display: 'flex',
					flexDirection: 'column',
					minHeight: 0,
				}}
			>
				{selectedField ? (
					<FieldPropertyPanel
						field={selectedField}
						formStructure={formStructure}
						onFieldChange={handleFieldChange}
						onDeleteField={handleDeleteField}
						onChoicesChange={handleChoicesChange}
					/>
				) : selectedSection ? (
					<SectionPropertyPanel
						section={selectedSection}
						formStructure={formStructure}
						onSectionChange={handleSectionChange}
						onDeleteSection={handleDeleteSection}
					/>
				) : (
					<Box
						sx={{
							p: 3,
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: '#4a5a4e',
							textAlign: 'center',
						}}
					>
						<Typography sx={{ fontSize: '0.8rem' }}>
							Select a field or section
							<br />
							to edit its properties
						</Typography>
					</Box>
				)}
			</Paper>
		</Box>
	);
};

export default StructureBuilder;
