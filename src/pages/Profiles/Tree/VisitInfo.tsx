import React, { FC } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Tree } from '../../../types/tree';
import { getHumanReadableDate } from '../../../helpers/utils';
import { Visit } from '../../../types/visits';
import ImageSlider from '../components/ImageSlider';
import { buildS3Url } from '../../../config/s3';

interface VisitInfoProps {
	visit: Visit;
}

const VisitInfo: FC<VisitInfoProps> = ({ visit }) => {
	return (
		<Card
			sx={{
				display: 'flex',
				margin: '0 auto',
				padding: 2,
				borderRadius: 4,
				boxShadow: 3,
			}}
		>
			<CardContent sx={{ flex: '1 1 auto' }}>
				<Typography variant="h5" style={{ margin: 2 }}>
					<strong>Visit Event:</strong>
				</Typography>
				<Typography variant="body1" component="p" style={{ marginBottom: 10 }}>
					This tree was planted during the {visit.visit_name}, organized by{' '}
					{'Individual'}. The event saw participation from {visit.user_count}{' '}
					individuals who came together to celebrate nature and contribute to a
					sustainable future. Take a look at some of the wonderful moments
					captured during the event in the photos below.
				</Typography>
				<ImageSlider
					images={[
						buildS3Url('memories/memory1.jpg'),
						buildS3Url('memories/memory3.jpg'),
						buildS3Url('memories/memory4.jpg'),
						buildS3Url('memories/memory5.jpg'),
						buildS3Url('memories/memory6.jpg'),
						buildS3Url('memories/memory8.jpg'),
						buildS3Url('memories/memory9.jpg'),
						buildS3Url('memories/memory11.jpg'),
						buildS3Url('memories/memory12.jpg'),
					]}
				/>
			</CardContent>
		</Card>
	);
};

export default VisitInfo;
