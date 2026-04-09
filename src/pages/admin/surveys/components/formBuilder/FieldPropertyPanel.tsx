import React, { useState } from 'react';
import {
	Box,
	Typography,
	TextField,
	FormControlLabel,
	Checkbox,
	Divider,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	IconButton,
	Tooltip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import TuneIcon from '@mui/icons-material/Tune';
import ListIcon from '@mui/icons-material/List';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	SurveyField,
	SurveySection,
	normalizeLabel,
	getChoices,
	FormStructure,
} from './formBuilderTypes';
import ConditionalEditor from './ConditionalEditor';
import ValidationEditor from './ValidationEditor';
import ChoiceListEditor from './ChoiceListEditor';

interface FieldPropertyPanelProps {
	field: SurveyField;
	formStructure: FormStructure;
	onFieldChange: (updated: SurveyField) => void;
	onDeleteField: () => void;
	onChoicesChange: (listName: string, items: any[]) => void;
}

const FIELD_TYPES = [
	'text',
	'number',
	'decimal',
	'select_one',
	'select_many',
	'geopoint',
	'image',
	'date',
];

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
	'& .MuiInputLabel-root.Mui-focused': { color: '#9bc53d' },
};

const selectSx = {
	bgcolor: '#0d1017',
	color: '#e8eaf0',
	fontSize: '0.82rem',
	'& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a3832' },
	'&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9bc53d' },
	'&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#9bc53d' },
	'& .MuiSvgIcon-root': { color: '#9ba39d' },
};

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
	<Typography
		sx={{
			fontSize: '0.7rem',
			color: '#9ba39d',
			fontWeight: 600,
			textTransform: 'uppercase',
			letterSpacing: '0.06em',
			mb: 0.75,
			mt: 0.5,
		}}
	>
		{label}
	</Typography>
);

const FieldPropertyPanel: React.FC<FieldPropertyPanelProps> = ({
	field,
	formStructure,
	onFieldChange,
	onDeleteField,
	onChoicesChange,
}) => {
	const [conditionalOpen, setConditionalOpen] = useState(false);
	const [validationOpen, setValidationOpen] = useState(false);
	const [choiceListOpen, setChoiceListOpen] = useState(false);

	const sections: SurveySection[] = formStructure.sections || [];
	const choices = getChoices(formStructure);
	const label = normalizeLabel(field.label);
	const hint = normalizeLabel(field.hint);

	const set = (patch: Partial<SurveyField>) =>
		onFieldChange({ ...field, ...patch });
	const setLabel = (lang: 'en' | 'mr', val: string) =>
		set({ label: { ...label, [lang]: val } });
	const setHint = (lang: 'en' | 'mr', val: string) =>
		set({ hint: { ...hint, [lang]: val } });

	const listName = field.parameters?.list_name || '';
	const currentChoices = listName ? choices[listName] || [] : [];

	const isSelect = field.type === 'select_one' || field.type === 'select_many';

	return (
		<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
			{/* Header */}
			<Box
				sx={{
					px: 2,
					py: 1.5,
					borderBottom: '1px solid #2a3832',
					flexShrink: 0,
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<Box sx={{ flex: 1, overflow: 'hidden' }}>
					<Typography
						sx={{
							fontSize: '0.72rem',
							color: '#9ba39d',
							textTransform: 'uppercase',
							letterSpacing: '0.06em',
						}}
					>
						Field
					</Typography>
					<Typography
						sx={{
							fontSize: '0.9rem',
							fontWeight: 600,
							color: '#e8eaf0',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						{field.name}
					</Typography>
				</Box>
				<Tooltip title="Delete field">
					<IconButton
						size="small"
						onClick={onDeleteField}
						sx={{ color: '#6b7a6e', '&:hover': { color: '#ef5350' } }}
					>
						<DeleteIcon sx={{ fontSize: 17 }} />
					</IconButton>
				</Tooltip>
			</Box>

			{/* Scrollable content */}
			<Box
				sx={{
					flex: 1,
					overflowY: 'auto',
					px: 2,
					py: 1.5,
					display: 'flex',
					flexDirection: 'column',
					gap: 1.25,
				}}
			>
				{/* Identity */}
				<SectionLabel label="Identity" />
				<TextField
					label="Field Name"
					size="small"
					fullWidth
					value={field.name}
					onChange={(e) => set({ name: e.target.value })}
					sx={inputSx}
				/>

				<FormControl size="small" fullWidth>
					<InputLabel
						sx={{
							color: '#9ba39d',
							fontSize: '0.82rem',
							'&.Mui-focused': { color: '#9bc53d' },
						}}
					>
						Type
					</InputLabel>
					<Select
						value={field.type}
						label="Type"
						onChange={(e) => set({ type: e.target.value })}
						sx={selectSx}
					>
						{FIELD_TYPES.map((t) => (
							<MenuItem key={t} value={t} sx={{ fontSize: '0.82rem' }}>
								{t}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<Divider sx={{ borderColor: '#2a3832' }} />

				{/* Labels */}
				<SectionLabel label="Labels" />
				<TextField
					label="English"
					size="small"
					fullWidth
					value={label.en}
					onChange={(e) => setLabel('en', e.target.value)}
					sx={inputSx}
				/>
				<TextField
					label="Marathi"
					size="small"
					fullWidth
					value={label.mr}
					onChange={(e) => setLabel('mr', e.target.value)}
					sx={inputSx}
				/>

				<Divider sx={{ borderColor: '#2a3832' }} />

				{/* Hints */}
				<SectionLabel label="Hint (optional)" />
				<TextField
					label="English"
					size="small"
					fullWidth
					multiline
					rows={2}
					value={hint.en}
					onChange={(e) => setHint('en', e.target.value)}
					sx={inputSx}
				/>
				<TextField
					label="Marathi"
					size="small"
					fullWidth
					multiline
					rows={2}
					value={hint.mr}
					onChange={(e) => setHint('mr', e.target.value)}
					sx={inputSx}
				/>

				<Divider sx={{ borderColor: '#2a3832' }} />

				{/* Placement */}
				<SectionLabel label="Placement" />
				{sections.length > 0 && (
					<FormControl size="small" fullWidth>
						<InputLabel
							sx={{
								color: '#9ba39d',
								fontSize: '0.82rem',
								'&.Mui-focused': { color: '#9bc53d' },
							}}
						>
							Section
						</InputLabel>
						<Select
							value={field.section || ''}
							label="Section"
							onChange={(e) => set({ section: e.target.value || undefined })}
							sx={selectSx}
						>
							<MenuItem value="">
								<em style={{ color: '#6b7a6e' }}>None</em>
							</MenuItem>
							{sections.map((s) => (
								<MenuItem key={s.id} value={s.id} sx={{ fontSize: '0.82rem' }}>
									{normalizeLabel(s.title).en || s.id}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
				<Box sx={{ display: 'flex', gap: 1 }}>
					<TextField
						label="Page"
						size="small"
						type="number"
						value={field.page ?? ''}
						onChange={(e) =>
							set({ page: e.target.value ? Number(e.target.value) : undefined })
						}
						sx={{ flex: 1, ...inputSx }}
					/>
					<TextField
						label="Order"
						size="small"
						type="number"
						value={field.order ?? ''}
						onChange={(e) =>
							set({
								order: e.target.value ? Number(e.target.value) : undefined,
							})
						}
						sx={{ flex: 1, ...inputSx }}
					/>
				</Box>

				<Divider sx={{ borderColor: '#2a3832' }} />

				{/* Flags */}
				<FormControlLabel
					control={
						<Checkbox
							checked={!!field.required}
							onChange={(e) => set({ required: e.target.checked })}
							size="small"
							sx={{ color: '#9ba39d', '&.Mui-checked': { color: '#9bc53d' } }}
						/>
					}
					label={
						<Typography sx={{ fontSize: '0.82rem', color: '#e8eaf0' }}>
							Required
						</Typography>
					}
				/>
				<FormControlLabel
					control={
						<Checkbox
							checked={!!field.readOnly}
							onChange={(e) => set({ readOnly: e.target.checked })}
							size="small"
							sx={{ color: '#9ba39d', '&.Mui-checked': { color: '#9bc53d' } }}
						/>
					}
					label={
						<Typography sx={{ fontSize: '0.82rem', color: '#e8eaf0' }}>
							Read Only
						</Typography>
					}
				/>

				{/* Choice list (select fields) */}
				{isSelect && (
					<>
						<Divider sx={{ borderColor: '#2a3832' }} />
						<SectionLabel label="Choice List" />
						<TextField
							label="List Name"
							size="small"
							fullWidth
							value={listName}
							onChange={(e) =>
								set({
									parameters: {
										...field.parameters,
										list_name: e.target.value,
									},
								})
							}
							sx={inputSx}
						/>
						<Button
							startIcon={<ListIcon sx={{ fontSize: 15 }} />}
							onClick={() => setChoiceListOpen(true)}
							disabled={!listName}
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
							Edit Choices ({currentChoices.length})
						</Button>
					</>
				)}

				<Divider sx={{ borderColor: '#2a3832' }} />

				{/* Action buttons */}
				<Button
					startIcon={
						<LockIcon
							sx={{
								fontSize: 15,
								color: field.visibleIf ? '#f0a050' : undefined,
							}}
						/>
					}
					onClick={() => setConditionalOpen(true)}
					size="small"
					sx={{
						textTransform: 'none',
						fontSize: '0.8rem',
						color: field.visibleIf ? '#f0a050' : '#9ba39d',
						justifyContent: 'flex-start',
						px: 0,
					}}
				>
					{field.visibleIf ? 'Conditional Logic (active)' : 'Conditional Logic'}
				</Button>

				<Button
					startIcon={<TuneIcon sx={{ fontSize: 15 }} />}
					onClick={() => setValidationOpen(true)}
					size="small"
					sx={{
						textTransform: 'none',
						fontSize: '0.8rem',
						color: field.validation ? '#9bc53d' : '#9ba39d',
						justifyContent: 'flex-start',
						px: 0,
					}}
				>
					{field.validation ? 'Validation Rules (active)' : 'Validation Rules'}
				</Button>
			</Box>

			{/* Modals */}
			<ConditionalEditor
				open={conditionalOpen}
				onClose={() => setConditionalOpen(false)}
				targetLabel={label.en || field.name}
				rule={field.visibleIf}
				requiredIf={field.requiredIf}
				allFields={formStructure.fields || []}
				onSave={(rule, reqIf) => {
					set({ visibleIf: rule, requiredIf: reqIf });
					setConditionalOpen(false);
				}}
			/>

			<ValidationEditor
				open={validationOpen}
				onClose={() => setValidationOpen(false)}
				field={field}
				onSave={(validation) => {
					set({ validation });
					setValidationOpen(false);
				}}
			/>

			{isSelect && (
				<ChoiceListEditor
					open={choiceListOpen}
					onClose={() => setChoiceListOpen(false)}
					listName={listName}
					choices={currentChoices}
					onSave={(newListName, newChoices) => {
						if (newListName !== listName) {
							set({
								parameters: { ...field.parameters, list_name: newListName },
							});
						}
						onChoicesChange(newListName, newChoices);
						setChoiceListOpen(false);
					}}
				/>
			)}
		</Box>
	);
};

export default FieldPropertyPanel;
