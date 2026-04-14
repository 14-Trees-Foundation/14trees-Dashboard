import { Box, Typography, Avatar } from '@mui/material';
import { FormatQuote } from '@mui/icons-material';
import { EventLandingMessage } from '../../../types/EventLanding';

type Props = {
	messages: EventLandingMessage[];
};

const EventMessages: React.FC<Props> = ({ messages }) => {
	if (messages.length === 0) return null;

	return (
		<Box
			sx={{ py: { xs: 5, md: 8 }, px: { xs: 3, md: 8 }, bgcolor: '#f5f5f0' }}
		>
			<Typography
				sx={{
					fontFamily: '"Instrument Sans", sans-serif',
					fontWeight: 700,
					fontSize: { xs: '22px', md: '32px' },
					color: '#1a2b1e',
					mb: 4,
				}}
			>
				Messages
			</Typography>

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: {
						xs: '1fr',
						sm: 'repeat(2, 1fr)',
						md: 'repeat(3, 1fr)',
					},
					gap: 3,
				}}
			>
				{messages.map((msg) => (
					<Box
						key={msg.id}
						sx={{
							bgcolor: '#fff',
							borderRadius: '16px',
							p: 3,
							boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
							display: 'flex',
							flexDirection: 'column',
							gap: 2,
						}}
					>
						<FormatQuote
							sx={{
								color: '#c8d8c4',
								fontSize: 32,
								transform: 'scaleX(-1)',
								mb: -1,
							}}
						/>
						<Typography
							sx={{
								fontSize: 15,
								color: '#3a4d3f',
								lineHeight: 1.65,
								flexGrow: 1,
							}}
						>
							{msg.message}
						</Typography>
						{msg.user_name && (
							<Box
								sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}
							>
								<Avatar
									sx={{
										width: 32,
										height: 32,
										bgcolor: '#1f452d',
										fontSize: 14,
										fontWeight: 600,
									}}
								>
									{msg.user_name.charAt(0).toUpperCase()}
								</Avatar>
								<Typography
									sx={{ fontSize: 13, fontWeight: 600, color: '#1f452d' }}
								>
									{msg.user_name}
								</Typography>
							</Box>
						)}
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default EventMessages;
