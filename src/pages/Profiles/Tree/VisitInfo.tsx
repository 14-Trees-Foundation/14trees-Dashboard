import React, { FC } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Tree } from '../../../types/tree';
import { getHumanReadableDate } from '../../../helpers/utils';
import { Visit } from '../../../types/visits';
import ImageSlider from '../ImageSlider';

interface VisitInfoProps {
    visit: Visit
}

const VisitInfo: FC<VisitInfoProps> = ({ visit }) => {
    return (
        <Card sx={{ display: 'flex', margin: '0 auto', padding: 2, borderRadius: 4, boxShadow: 3 }}>
            <CardContent sx={{ flex: '1 1 auto' }}>
                <Typography variant="body1" component="p" style={{ marginBottom: 10 }}>
                    This tree was planted during the {visit.visit_name}, organized by {'Individual'}. The event saw participation from {visit.user_count} individuals who came together to celebrate nature and contribute to a sustainable future. Take a look at some of the wonderful moments captured during the event in the photos below.
                </Typography>
                <ImageSlider
                    images={[
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory1.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory3.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory4.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory5.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory6.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory8.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory9.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory11.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory12.jpg",
                    ]}
                />
            </CardContent>
        </Card>
    );
};

export default VisitInfo;
