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
	FormControlLabel,
	Checkbox,
	Divider,
} from '@mui/material';
import {
	ValidationRules,
	SurveyField,
	normalizeLabel,
} from './formBuilderTypes';

interface ValidationEditorProps {
	open: boolean;
	onClose: () => void;
	field: SurveyField;
	onSave: (validation: ValidationRules | undefined) => void;
}

const inputSx = {
	'& .MuiOutlinedInput-root': {
		bgcolor: '#0d1017',
		color: '#e8eaf0',
		fontSize: '0.85rem',
		'& fieldset': { borderColor: '#2a3832' },
		'&:hover fieldset': { borderColor: '#9bc53d' },
		'&.Mui-focused fieldset': { borderColor: '#9bc53d' },
	},
	'& .MuiInputLabel-root': { color: '#9ba39d', fontSize: '0.85rem' },
	'& .MuiInputLabel-root.Mui-focused': { color: '#9bc53d' },
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
	title,
	children,
}) => (
	<Box sx={{ mb: 2 }}>
		<Typography
			sx={{
				fontSize: '0.72rem',
				color: '#9ba39d',
				fontWeight: 600,
				textTransform: 'uppercase',
				letterSpacing: '0.06em',
				mb: 1.25,
			}}
		>
			{title}
		</Typography>
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
			{children}
		</Box>
	</Box>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
		{children}
	</Box>
);

const ValidationEditor: React.FC<ValidationEditorProps> = ({
	open,
	onClose,
	field,
	onSave,
}) => {
	const [v, setV] = useState<ValidationRules>({});

	useEffect(() => {
		if (!open) return;
		setV(field.validation ? { ...field.validation } : {});
	}, [open, field]);

	const set = (key: keyof ValidationRules, value: any) =>
		setV((prev) => ({ ...prev, [key]: value === '' ? undefined : value }));

	const numField = (label: string, key: keyof ValidationRules) => (
		<TextField
			label={label}
			size="small"
			type="number"
			value={v[key] ?? ''}
			onChange={(e) =>
				set(key, e.target.value === '' ? undefined : Number(e.target.value))
			}
			sx={{ flex: 1, ...inputSx }}
		/>
	);

	const txtField = (label: string, key: keyof ValidationRules) => (
		<TextField
			label={label}
			size="small"
			value={(v[key] as string) ?? ''}
			onChange={(e) => set(key, e.target.value)}
			sx={{ flex: 1, ...inputSx }}
		/>
	);

	const msgLabel = normalizeLabel(v.message);

	const handleSave = () => {
		const cleaned = Object.fromEntries(
			Object.entries(v).filter(([, val]) => val !== undefined && val !== ''),
		);
		onSave(Object.keys(cleaned).length > 0 ? cleaned : undefined);
	};

	const type = field.type;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{ sx: { bgcolor: '#1a2820', color: '#e8eaf0' } }}
		>
			<DialogTitle
				sx={{ borderBottom: '1px solid #2a3832', py: 1.5, fontSize: '0.95rem' }}
			>
				Validation —{' '}
				<Box component="span" sx={{ color: '#9bc53d' }}>
					{field.name}
				</Box>
			</DialogTitle>

			<DialogContent sx={{ pt: 2.5 }}>
				{type === 'text' && (
					<Section title="Text Constraints">
						<Row>
							{numField('Min Length', 'minLength')}
							{numField('Max Length', 'maxLength')}
						</Row>
						{txtField('Pattern (regex)', 'pattern')}
					</Section>
				)}

				{(type === 'number' || type === 'decimal') && (
					<Section title="Number Constraints">
						<Row>
							{numField('Min', 'min')}
							{numField('Max', 'max')}
						</Row>
						<Row>
							{numField('Decimal Places', 'precision')}
							{txtField('Unit (e.g. cm, m)', 'unit')}
						</Row>
					</Section>
				)}

				{type === 'image' && (
					<Section title="Image Constraints">
						<Row>
							{numField('Max Files', 'maxFiles')}
							{numField('Max Pixels (longest side)', 'maxPixels')}
						</Row>
					</Section>
				)}

				{type === 'geopoint' && (
					<Section title="GPS Constraints">
						<Row>
							{numField('Min Accuracy (metres)', 'minAccuracyMeters')}
							{numField('Timeout (seconds)', 'timeoutSeconds')}
						</Row>
					</Section>
				)}

				{(type === 'select_one' || type === 'select_many') && (
					<Section title="Select Constraints">
						<FormControlLabel
							control={
								<Checkbox
									checked={v.allowEmpty ?? false}
									onChange={(e) => set('allowEmpty', e.target.checked)}
									size="small"
									sx={{
										color: '#9ba39d',
										'&.Mui-checked': { color: '#9bc53d' },
									}}
								/>
							}
							label={
								<Typography sx={{ fontSize: '0.85rem', color: '#e8eaf0' }}>
									Allow empty selection
								</Typography>
							}
						/>
					</Section>
				)}

				<Divider sx={{ borderColor: '#2a3832', my: 1.5 }} />

				<Section title="Custom Error Message (optional)">
					<Row>
						<TextField
							label="English"
							size="small"
							value={msgLabel.en}
							onChange={(e) =>
								setV((p) => ({
									...p,
									message: { ...msgLabel, en: e.target.value },
								}))
							}
							sx={{ flex: 1, ...inputSx }}
						/>
						<TextField
							label="Marathi"
							size="small"
							value={msgLabel.mr}
							onChange={(e) =>
								setV((p) => ({
									...p,
									message: { ...msgLabel, mr: e.target.value },
								}))
							}
							sx={{ flex: 1, ...inputSx }}
						/>
					</Row>
				</Section>
			</DialogContent>

			<DialogActions sx={{ borderTop: '1px solid #2a3832', px: 3, py: 2 }}>
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
					Apply
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ValidationEditor;
