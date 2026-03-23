import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from '@mui/material';
import { getDialogTitleWithReqId } from '../utils/dialogTitle';

interface GiftCardCreationModalProps {
	open: boolean;
	requestId?: number;
	onClose: () => void;
}

const GiftCardCreationModal: React.FC<GiftCardCreationModalProps> = ({
	open,
	requestId,
	onClose,
}) => {
	return (
		<Dialog open={open} fullWidth maxWidth="md">
			<DialogTitle>
				{getDialogTitleWithReqId('Requested tree cards', requestId)}
			</DialogTitle>
			<DialogContent dividers>
				<Typography variant="body1">
					Generating tree cards may take upto 10 to 15 mins based on requested
					number of tree cards. Please refresh or come back after sometime!
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="error">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default GiftCardCreationModal;
