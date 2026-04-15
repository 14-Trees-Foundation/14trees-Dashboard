import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {
	formLabelSx,
	formHelperTextSx,
	FORM_COLORS,
} from '../../../shared/adminTheme';

interface FormSelectProps {
	label: string;
	name: string;
	value: string;
	onChange: (value: string) => void;
	options: string[];
	placeholder?: string;
	helperText?: string;
	error?: string;
	required?: boolean;
	disabled?: boolean;
}

/**
 * Reusable labeled select (enum/fixed-list) input for admin forms.
 */
const FormSelect: React.FC<FormSelectProps> = ({
	label,
	name,
	value,
	onChange,
	options,
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
			<TextField
				select
				id={name}
				name={name}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				fullWidth
				size="small"
				disabled={disabled}
				error={!!error}
				SelectProps={{ displayEmpty: true }}
				sx={{
					'& .MuiOutlinedInput-root': {
						backgroundColor: FORM_COLORS.fieldBg,
						borderRadius: '8px',
						fontSize: '0.875rem',
						'& fieldset': { borderColor: FORM_COLORS.border },
						'&:hover fieldset': { borderColor: FORM_COLORS.textSecondary },
						'&.Mui-focused fieldset': { borderColor: FORM_COLORS.borderFocus },
					},
					'& .MuiInputBase-input': {
						color: value ? FORM_COLORS.textPrimary : FORM_COLORS.textMuted,
					},
					'& .MuiSelect-select': {
						color: value ? FORM_COLORS.textPrimary : FORM_COLORS.textMuted,
					},
				}}
			>
				{placeholder && (
					<MenuItem value="" disabled>
						<em style={{ color: FORM_COLORS.textMuted }}>{placeholder}</em>
					</MenuItem>
				)}
				{options.map((opt) => (
					<MenuItem key={opt} value={opt}>
						{opt}
					</MenuItem>
				))}
			</TextField>
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

export default FormSelect;
