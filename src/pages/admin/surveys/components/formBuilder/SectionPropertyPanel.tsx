import React, { useState } from 'react';
import {
	Box,
	Typography,
	TextField,
	Divider,
	Button,
	IconButton,
	Tooltip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	SurveySection,
	normalizeLabel,
	FormStructure,
} from './formBuilderTypes';
import ConditionalEditor from './ConditionalEditor';

interface SectionPropertyPanelProps {
	section: SurveySection;
	formStructure: FormStructure;
	onSectionChange: (updated: SurveySection) => void;
	onDeleteSection: () => void;
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
	'& .MuiInputLabel-root.Mui-focused': { color: '#9bc53d' },
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

const SectionPropertyPanel: React.FC<SectionPropertyPanelProps> = ({
	section,
	formStructure,
	onSectionChange,
	onDeleteSection,
}) => {
	const [conditionalOpen, setConditionalOpen] = useState(false);

	const title = normalizeLabel(section.title);
	const description = normalizeLabel(section.description);

	const set = (patch: Partial<SurveySection>) =>
		onSectionChange({ ...section, ...patch });
	const setTitle = (lang: 'en' | 'mr', val: string) =>
		set({ title: { ...title, [lang]: val } });
	const setDescription = (lang: 'en' | 'mr', val: string) =>
		set({ description: { ...description, [lang]: val } });

	const fieldsInSection = (formStructure.fields || []).filter(
		(f) => f.section === section.id,
	);

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
						Section
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
						{title.en || section.id}
					</Typography>
				</Box>
				<Tooltip title="Delete section">
					<IconButton
						size="small"
						onClick={onDeleteSection}
						sx={{ color: '#6b7a6e', '&:hover': { color: '#ef5350' } }}
					>
						<DeleteIcon sx={{ fontSize: 17 }} />
					</IconButton>
				</Tooltip>
			</Box>

			{/* Content */}
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
				<SectionLabel label="Identity" />
				<TextField
					label="Section ID"
					size="small"
					fullWidth
					value={section.id}
					onChange={(e) => set({ id: e.target.value })}
					sx={inputSx}
				/>

				<Divider sx={{ borderColor: '#2a3832' }} />

				<SectionLabel label="Title" />
				<TextField
					label="English"
					size="small"
					fullWidth
					value={title.en}
					onChange={(e) => setTitle('en', e.target.value)}
					sx={inputSx}
				/>
				<TextField
					label="Marathi"
					size="small"
					fullWidth
					value={title.mr}
					onChange={(e) => setTitle('mr', e.target.value)}
					sx={inputSx}
				/>

				<Divider sx={{ borderColor: '#2a3832' }} />

				<SectionLabel label="Description (optional)" />
				<TextField
					label="English"
					size="small"
					fullWidth
					multiline
					rows={2}
					value={description.en}
					onChange={(e) => setDescription('en', e.target.value)}
					sx={inputSx}
				/>
				<TextField
					label="Marathi"
					size="small"
					fullWidth
					multiline
					rows={2}
					value={description.mr}
					onChange={(e) => setDescription('mr', e.target.value)}
					sx={inputSx}
				/>

				<Divider sx={{ borderColor: '#2a3832' }} />

				<SectionLabel label="Layout" />
				<Box sx={{ display: 'flex', gap: 1 }}>
					<TextField
						label="Order"
						size="small"
						type="number"
						value={section.order ?? ''}
						onChange={(e) =>
							set({
								order: e.target.value ? Number(e.target.value) : undefined,
							})
						}
						sx={{ flex: 1, ...inputSx }}
					/>
					<TextField
						label="Fields Per Page"
						size="small"
						type="number"
						value={section.fieldsPerPage ?? ''}
						onChange={(e) =>
							set({
								fieldsPerPage: e.target.value
									? Number(e.target.value)
									: undefined,
							})
						}
						sx={{ flex: 1, ...inputSx }}
					/>
				</Box>

				<Divider sx={{ borderColor: '#2a3832' }} />

				<Button
					startIcon={
						<LockIcon
							sx={{
								fontSize: 15,
								color: section.visibleIf ? '#f0a050' : undefined,
							}}
						/>
					}
					onClick={() => setConditionalOpen(true)}
					size="small"
					sx={{
						textTransform: 'none',
						fontSize: '0.8rem',
						color: section.visibleIf ? '#f0a050' : '#9ba39d',
						justifyContent: 'flex-start',
						px: 0,
					}}
				>
					{section.visibleIf
						? 'Conditional Logic (active)'
						: 'Conditional Logic'}
				</Button>

				<Typography sx={{ fontSize: '0.75rem', color: '#6b7a6e', mt: 1 }}>
					{fieldsInSection.length} field
					{fieldsInSection.length !== 1 ? 's' : ''} in this section
				</Typography>
			</Box>

			<ConditionalEditor
				open={conditionalOpen}
				onClose={() => setConditionalOpen(false)}
				targetLabel={`Section: ${title.en || section.id}`}
				rule={section.visibleIf}
				requiredIf={undefined}
				allFields={formStructure.fields || []}
				onSave={(rule) => {
					set({ visibleIf: rule });
					setConditionalOpen(false);
				}}
			/>
		</Box>
	);
};

export default SectionPropertyPanel;
