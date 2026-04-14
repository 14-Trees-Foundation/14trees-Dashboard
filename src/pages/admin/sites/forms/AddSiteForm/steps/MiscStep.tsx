import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import StepLayout from '../../shared/StepLayout';
import FormSelect from '../../shared/FormSelect';
import FormField from '../../shared/FormField';
import { CONSENT_LETTER_OPTIONS } from '../../shared/siteFormOptions';
import {
	FORM_COLORS,
	formLabelSx,
	formHelperTextSx,
} from '../../../../shared/adminTheme';
import TagSelector from '../../../../../../components/TagSelector';
import type { SiteFormValues, SiteFormErrors } from '../AddSiteForm';

interface MiscStepProps {
	values: SiteFormValues;
	errors: SiteFormErrors;
	onChange: (field: keyof SiteFormValues, value: unknown) => void;
}

const MiscStep: React.FC<MiscStepProps> = ({ values, errors, onChange }) => {
	const [linkInput, setLinkInput] = useState('');

	const addGoogleEarthLink = () => {
		const trimmed = linkInput.trim();
		if (!trimmed) return;
		onChange('google_earth_link', [...values.google_earth_link, trimmed]);
		setLinkInput('');
	};

	const removeGoogleEarthLink = (index: number) => {
		onChange(
			'google_earth_link',
			values.google_earth_link.filter((_, i) => i !== index),
		);
	};

	return (
		<StepLayout
			title="Documents & Admin"
			subtitle="Consent letter, links, account and tags"
		>
			<FormSelect
				label="Consent Letter Type"
				name="consent_letter"
				value={values.consent_letter}
				onChange={(v) => onChange('consent_letter', v)}
				options={CONSENT_LETTER_OPTIONS}
				placeholder="Select consent letter type"
			/>
			<FormField
				label="Consent Document Link"
				name="consent_document_link"
				value={values.consent_document_link}
				onChange={(v) => onChange('consent_document_link', v)}
				type="url"
				placeholder="https://drive.google.com/..."
			/>

			{/* Google Earth Links — multi-value input */}
			<Box sx={{ mb: 2.5 }}>
				<Typography component="label" sx={formLabelSx}>
					Google Earth Links
				</Typography>
				<TextField
					value={linkInput}
					onChange={(e) => setLinkInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							addGoogleEarthLink();
						}
					}}
					placeholder="Paste a link and press Enter or +"
					fullWidth
					size="small"
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={addGoogleEarthLink}
									size="small"
									disabled={!linkInput.trim()}
									sx={{ color: FORM_COLORS.accent }}
								>
									<AddIcon fontSize="small" />
								</IconButton>
							</InputAdornment>
						),
					}}
					sx={{
						'& .MuiOutlinedInput-root': {
							backgroundColor: FORM_COLORS.fieldBg,
							borderRadius: '8px',
							fontSize: '0.875rem',
							'& fieldset': { borderColor: FORM_COLORS.border },
							'&:hover fieldset': { borderColor: FORM_COLORS.textSecondary },
							'&.Mui-focused fieldset': {
								borderColor: FORM_COLORS.borderFocus,
							},
						},
						'& .MuiInputBase-input': { color: FORM_COLORS.textPrimary },
					}}
				/>
				{values.google_earth_link.length > 0 && (
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
						{values.google_earth_link.map((link, i) => (
							<Chip
								key={i}
								label={link.length > 40 ? `${link.slice(0, 40)}…` : link}
								onDelete={() => removeGoogleEarthLink(i)}
								size="small"
								sx={{
									fontSize: '0.7rem',
									backgroundColor: FORM_COLORS.chipBg,
									border: `1px solid ${FORM_COLORS.chipBorder}`,
									color: FORM_COLORS.accent,
									'& .MuiChip-deleteIcon': { color: FORM_COLORS.textMuted },
								}}
							/>
						))}
					</Box>
				)}
				<Typography sx={formHelperTextSx}>
					Add one or more Google Earth / Maps links for this site
				</Typography>
			</Box>

			<FormField
				label="Account"
				name="account"
				value={values.account}
				onChange={(v) => onChange('account', v)}
				placeholder="e.g. 14trees-khed"
				helperText="Internal account or ledger reference"
			/>

			{/* Tags */}
			<Box sx={{ mb: 1 }}>
				<Typography component="label" sx={formLabelSx}>
					Tags
				</Typography>
				<TagSelector
					value={values.tags}
					handleChange={(newTags: string[]) => onChange('tags', newTags)}
					systemTags={undefined}
					userTags={undefined}
					margin="none"
				/>
			</Box>
		</StepLayout>
	);
};

export default MiscStep;
