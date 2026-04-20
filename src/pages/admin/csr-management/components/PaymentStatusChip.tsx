import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { CsrPaymentStatus } from '../../../../types/csrRequest';

interface Props {
	paymentStatus: CsrPaymentStatus | undefined;
	treesAssigned: number;
}

const PaymentStatusChip: React.FC<Props> = ({
	paymentStatus,
	treesAssigned,
}) => {
	if (
		paymentStatus === 'Linked (Both)' ||
		paymentStatus === 'Linked (Payment)' ||
		paymentStatus === 'Linked (Donation)'
	) {
		return (
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
				<CheckCircleIcon sx={{ fontSize: 16, color: '#22c55e' }} />
				<Typography
					variant="caption"
					sx={{ color: '#22c55e', fontWeight: 600 }}
				>
					{paymentStatus}
				</Typography>
			</Box>
		);
	}

	if (treesAssigned > 0) {
		return (
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
				<AccessTimeIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
				<Typography
					variant="caption"
					sx={{ color: '#f59e0b', fontWeight: 600 }}
				>
					Pending
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
			<RadioButtonUncheckedIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
			<Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600 }}>
				Not Linked
			</Typography>
		</Box>
	);
};

export default PaymentStatusChip;
