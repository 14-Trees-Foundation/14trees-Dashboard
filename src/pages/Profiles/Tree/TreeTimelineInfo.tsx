import { FC } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TreeTimeline from '../../admin/tree/table/timeline';


const TreeTimelineInfo: FC<{}> = ({ }) => {
    return (
        <Card sx={{ display: 'flex', margin: '0 auto', padding: 2, borderRadius: 4, boxShadow: 3 }}>
            <CardContent sx={{ flex: '1 1 auto' }}>
                <Typography variant="h5" style={{margin: 2}}>
                    <strong>Tree Timeline:</strong>
                </Typography>
                <Typography variant="body1" component="p" style={{ marginBottom: 10 }}>
                    Explore the journey of this tree through the timeline below, showcasing its growth and transformation over time. Each image tells a story of resilience and beauty as the tree matures and contributes to the ecosystem.
                </Typography>
                <TreeTimeline
                    created_at='2024-08-01T00:00:00Z'
                    items={[
                        {
                            image: "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory1.jpg",
                            date: "2024-08-06T00:00:00Z",
                            status: 'healthy'
                        },
                        {
                            image: "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory3.jpg",
                            date: "2024-08-07T00:00:00Z",
                            status: 'diseased'
                        },
                        {
                            image: "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory4.jpg",
                            date: "2024-08-08T00:00:00Z",
                            status: 'healthy'
                        },
                        {
                            image: "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory1.jpg",
                            date: "2024-07-06T00:00:00Z",
                            status: 'healthy'
                        },
                        {
                            image: "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory3.jpg",
                            date: "2024-07-07T00:00:00Z",
                            status: 'diseased'
                        },
                        {
                            image: "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory4.jpg",
                            date: "2024-07-08T00:00:00Z",
                            status: 'healthy'
                        },
                        {
                            image: "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory6.jpg",
                            date: "2024-07-08T00:00:00Z",
                            status: 'healthy'
                        },
                        {
                            image: "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory7.jpg",
                            date: "2024-07-08T00:00:00Z",
                            status: 'healthy'
                        },
                        {
                            image: "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory8.jpg",
                            date: "2024-07-08T00:00:00Z",
                            status: 'healthy'
                        },
                    ]}
                />
            </CardContent>
        </Card>
    );
};

export default TreeTimelineInfo;
