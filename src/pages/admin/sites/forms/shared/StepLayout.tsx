import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import {
	FORM_COLORS,
	formSectionTitleSx,
	formSectionSubtitleSx,
} from '../../../shared/adminTheme';

interface StepLayoutProps {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
}

/**
 * Wrapper for each step's content — renders a consistent section header
 * with title + optional subtitle, a thin divider, then the step's fields.
 * Reuse this in any future multi-step form dialogs.
 */
const StepLayout: React.FC<StepLayoutProps> = ({
	title,
	subtitle,
	children,
}) => {
	return (
		<Box>
			<Box sx={{ mb: 2 }}>
				<Typography sx={formSectionTitleSx}>{title}</Typography>
				{subtitle && (
					<Typography sx={formSectionSubtitleSx}>{subtitle}</Typography>
				)}
			</Box>
			<Divider sx={{ mb: 2.5, borderColor: FORM_COLORS.border }} />
			{children}
		</Box>
	);
};

export default StepLayout;
