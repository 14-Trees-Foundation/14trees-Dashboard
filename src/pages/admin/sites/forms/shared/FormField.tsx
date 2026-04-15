import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
	formLabelSx,
	formHelperTextSx,
	FORM_COLORS,
} from '../../../shared/adminTheme';

interface FormFieldProps {
	label: string;
	name: string;
	value: string | number;
	onChange: (value: string) => void;
	type?: 'text' | 'number' | 'url' | 'email';
	placeholder?: string;
	helperText?: string;
	error?: string;
	required?: boolean;
	multiline?: boolean;
	rows?: number;
	disabled?: boolean;
}

/**
 * Reusable labeled text/number input following the admin form design system.
 * Wrap in a grid cell for multi-column layouts.
 */
const FormField: React.FC<FormFieldProps> = ({
	label,
	name,
	value,
	onChange,
	type = 'text',
	placeholder,
	helperText,
	error,
	required,
	multiline,
	rows,
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
				id={name}
				name={name}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				type={type}
				placeholder={placeholder}
				fullWidth
				size="small"
				multiline={multiline}
				rows={rows}
				disabled={disabled}
				error={!!error}
				sx={{
					'& .MuiOutlinedInput-root': {
						backgroundColor: FORM_COLORS.fieldBg,
						borderRadius: '8px',
						fontSize: '0.875rem',
						'& fieldset': { borderColor: FORM_COLORS.border },
						'&:hover fieldset': { borderColor: FORM_COLORS.textSecondary },
						'&.Mui-focused fieldset': { borderColor: FORM_COLORS.borderFocus },
					},
					'& .MuiInputBase-input': { color: FORM_COLORS.textPrimary },
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

export default FormField;
