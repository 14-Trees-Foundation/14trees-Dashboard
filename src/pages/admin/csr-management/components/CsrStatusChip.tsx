import React from 'react';
import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CsrRequestStatus } from '../../../../types/csrRequest';
import {
	CSR_STATUS_COLORS,
	CSR_STATUS_COLORS_DARK,
} from '../../shared/adminTheme';

const STATUS_LABELS: Record<CsrRequestStatus, string> = {
	pending_plot_selection: 'Pending Plots',
	pending_assignment: 'Pending Assignment',
	partially_assigned: 'Partial',
	completed: 'Completed',
	cancelled: 'Cancelled',
};

interface Props {
	status: CsrRequestStatus;
	size?: 'small' | 'medium';
}

const CsrStatusChip: React.FC<Props> = ({ status, size = 'small' }) => {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';
	const colors = isDark ? CSR_STATUS_COLORS_DARK : CSR_STATUS_COLORS;
	const c = colors[status] ?? colors.cancelled;

	return (
		<Chip
			label={STATUS_LABELS[status] ?? status}
			size={size}
			sx={{
				backgroundColor: c.bg,
				color: c.text,
				border: `1px solid ${c.border}`,
				fontWeight: 600,
				fontSize: '0.7rem',
				letterSpacing: '0.02em',
			}}
		/>
	);
};

export default CsrStatusChip;
