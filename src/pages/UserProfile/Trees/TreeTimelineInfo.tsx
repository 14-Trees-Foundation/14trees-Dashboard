import { FC } from 'react';
import { Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import TreeTimeline from '../../admin/tree/table/timeline';
import { selUsersData } from '../../../store/atoms';
import { useRecoilValue } from 'recoil';


const TreeTimelineInfo: FC<{}> = ({ }) => {

    const selUserInfo: any = useRecoilValue(selUsersData);
    const matches = useMediaQuery("(max-width:481px)");

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
                    items={selUserInfo.tree_audits.map((item: any) => ({ image: item.image, date: item.image_date, status: item.tree_status }))} 
                    created_at={selUserInfo.created_at} 
                    position={matches ? 'right' : 'alternate'}
                />
            </CardContent>
        </Card>
    );
};

export default TreeTimelineInfo;
