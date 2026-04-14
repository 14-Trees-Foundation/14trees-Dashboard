import React from 'react';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
	formLabelSx,
	formHelperTextSx,
	FORM_COLORS,
} from '../../../shared/adminTheme';

interface FormAutocompleteProps {
	label: string;
	name: string;
	value: string | null;
	onChange: (value: string | null) => void;
	options: string[];
	/** Allow entering values not present in the options list. */
	freeSolo?: boolean;
	placeholder?: string;
	helperText?: string;
	error?: string;
	required?: boolean;
	disabled?: boolean;
}

/**
 * Reusable labeled Autocomplete (dropdown + typeahead) for admin forms.
 * Set freeSolo=true for village / any field where custom values are allowed.
 */
const FormAutocomplete: React.FC<FormAutocompleteProps> = ({
	label,
	name,
	value,
	onChange,
	options,
	freeSolo = false,
	placeholder,
	helperText,
	error,
	required,
	disabled,
}) => {
	return (
		<Box sx={{ mb: 2.5 }}>
			<Typography component="label" htmlFor={name} sx={formLabelSx}>
				{label}
				{required && (
					<Box component="span" sx={{ color: FORM_COLORS.errorRed, ml: 0.25 }}>
						*
					</Box>
				)}
			</Typography>
			<Autocomplete
				id={name}
				value={value}
				onChange={(_e, newValue) => onChange(newValue as string | null)}
				onInputChange={
					freeSolo
						? (_e, inputValue) => onChange(inputValue || null)
						: undefined
				}
				options={options}
				freeSolo={freeSolo}
				disabled={disabled}
				size="small"
				renderInput={(params) => (
					<TextField
						{...params}
						placeholder={placeholder}
						error={!!error}
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
				)}
				slotProps={{
					paper: {
						sx: {
							borderRadius: '8px',
							border: `1px solid ${FORM_COLORS.border}`,
							boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
							'& .MuiAutocomplete-option': {
								fontSize: '0.875rem',
								color: FORM_COLORS.textPrimary,
								'&[aria-selected="true"]': {
									backgroundColor: '#f0fdf4',
									color: FORM_COLORS.accent,
								},
								'&:hover': { backgroundColor: '#f9fafb' },
							},
						},
					},
				}}
			/>
			{error ? (
				<Typography sx={{ ...formHelperTextSx, color: FORM_COLORS.errorRed }}>
					{error}
				</Typography>
			) : helperText ? (
				<Typography sx={formHelperTextSx}>{helperText}</Typography>
			) : null}
		</Box>
	);
};

export default FormAutocomplete;
