import React from 'react';
import {
	Box,
	Typography,
	TextField,
	FormControlLabel,
	Checkbox,
	Divider,
	Button,
} from '@mui/material';

interface FieldEditorPanelProps {
	field: any;
	onChange: (updatedField: any) => void;
	onOpenChoiceListEditor?: (listName: string) => void;
}

const textFieldSx = {
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

const FieldEditorPanel: React.FC<FieldEditorPanelProps> = ({
	field,
	onChange,
	onOpenChoiceListEditor,
}) => {
	if (!field) {
		return (
			<Box
				sx={{
					p: 3,
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					color: '#6b7a6e',
					textAlign: 'center',
				}}
			>
				<Typography sx={{ fontSize: '0.875rem' }}>
					Select a field to configure it
				</Typography>
			</Box>
		);
	}

	const handleChange = (path: string, value: any) => {
		const updated = JSON.parse(JSON.stringify(field));
		const keys = path.split('.');
		let current: any = updated;
		for (let i = 0; i < keys.length - 1; i++) {
			if (current[keys[i]] == null) current[keys[i]] = {};
			current = current[keys[i]];
		}
		current[keys[keys.length - 1]] = value;
		onChange(updated);
	};

	return (
		<Box sx={{ p: 2, overflowY: 'auto', height: '100%' }}>
			<Typography
				sx={{ fontSize: '0.875rem', fontWeight: 600, mb: 2, color: '#e8eaf0' }}
			>
				Field Configuration
			</Typography>

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
				<TextField
					label="Field Name (ID)"
					value={field.name || ''}
					onChange={(e) => handleChange('name', e.target.value)}
					size="small"
					fullWidth
					sx={textFieldSx}
				/>

				<TextField
					label="Field Type"
					value={field.type || ''}
					size="small"
					fullWidth
					disabled
					sx={textFieldSx}
				/>

				<Divider sx={{ borderColor: '#2a3832', my: 0.5 }} />

				<Typography
					sx={{
						fontSize: '0.78rem',
						color: '#9ba39d',
						fontWeight: 600,
						textTransform: 'uppercase',
						letterSpacing: '0.06em',
					}}
				>
					Labels
				</Typography>

				<TextField
					label="English Label"
					value={field.label?.en || ''}
					onChange={(e) => handleChange('label.en', e.target.value)}
					size="small"
					fullWidth
					sx={textFieldSx}
				/>

				<TextField
					label="Marathi Label"
					value={field.label?.mr || ''}
					onChange={(e) => handleChange('label.mr', e.target.value)}
					size="small"
					fullWidth
					sx={textFieldSx}
				/>

				<Divider sx={{ borderColor: '#2a3832', my: 0.5 }} />

				<Typography
					sx={{
						fontSize: '0.78rem',
						color: '#9ba39d',
						fontWeight: 600,
						textTransform: 'uppercase',
						letterSpacing: '0.06em',
					}}
				>
					Hints (optional)
				</Typography>

				<TextField
					label="English Hint"
					value={field.hint?.en || ''}
					onChange={(e) => handleChange('hint.en', e.target.value)}
					size="small"
					fullWidth
					multiline
					rows={2}
					sx={textFieldSx}
				/>

				<TextField
					label="Marathi Hint"
					value={field.hint?.mr || ''}
					onChange={(e) => handleChange('hint.mr', e.target.value)}
					size="small"
					fullWidth
					multiline
					rows={2}
					sx={textFieldSx}
				/>

				{['select_one', 'select_many'].includes(field.type) && (
					<>
						<Divider sx={{ borderColor: '#2a3832', my: 0.5 }} />
						<Typography
							sx={{
								fontSize: '0.78rem',
								color: '#9ba39d',
								fontWeight: 600,
								textTransform: 'uppercase',
								letterSpacing: '0.06em',
							}}
						>
							Choice List
						</Typography>
						<TextField
							label="Choice List Name"
							value={field.parameters?.list_name || ''}
							onChange={(e) =>
								handleChange('parameters.list_name', e.target.value)
							}
							size="small"
							fullWidth
							sx={textFieldSx}
						/>
						{onOpenChoiceListEditor && field.parameters?.list_name && (
							<Button
								size="small"
								onClick={() =>
									onOpenChoiceListEditor(field.parameters.list_name)
								}
								sx={{
									color: '#9bc53d',
									textTransform: 'none',
									fontSize: '0.8rem',
									justifyContent: 'flex-start',
									px: 0,
								}}
							>
								Edit Choice List Options →
							</Button>
						)}
					</>
				)}

				<Divider sx={{ borderColor: '#2a3832', my: 0.5 }} />

				<FormControlLabel
					control={
						<Checkbox
							checked={field.required || false}
							onChange={(e) => handleChange('required', e.target.checked)}
							size="small"
							sx={{ color: '#9ba39d', '&.Mui-checked': { color: '#9bc53d' } }}
						/>
					}
					label={
						<Typography sx={{ fontSize: '0.85rem', color: '#e8eaf0' }}>
							Required
						</Typography>
					}
				/>

				<FormControlLabel
					control={
						<Checkbox
							checked={field.readOnly || false}
							onChange={(e) => handleChange('readOnly', e.target.checked)}
							size="small"
							sx={{ color: '#9ba39d', '&.Mui-checked': { color: '#9bc53d' } }}
						/>
					}
					label={
						<Typography sx={{ fontSize: '0.85rem', color: '#e8eaf0' }}>
							Read Only
						</Typography>
					}
				/>
			</Box>
		</Box>
	);
};

export default FieldEditorPanel;
