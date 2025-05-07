import { FC } from 'react';
import { Card, CardContent, Typography, useMediaQuery } from '@mui/material';
import TreeTimeline from '../../admin/tree/table/timeline';
import { selUsersData } from '../../../store/atoms';
import { useRecoilValue } from 'recoil';

const TreeTimelineInfo: FC<{}> = ({ }) => {
    const selUserInfo: any = useRecoilValue(selUsersData);
    const matches = useMediaQuery("(max-width:1150px)");

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: matches ? 2 : 3,
                borderRadius: 4,
                boxShadow: 3,
                overflow: 'hidden', // Prevent content overflow
                backgroundColor: '#ffffff',
            }}
        >
            <CardContent
                sx={{
                    flex: '1 1 auto',
                    padding: matches ? 2 : 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2, // Add spacing between elements
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        marginBottom: 2,
                        fontWeight: 'bold',
                        textAlign: 'center', // Center-align the heading
                        wordWrap: 'break-word', // Ensure long words wrap
                    }}
                >
                    Your Tree's Journey Has Begun
                </Typography>
                <Typography
                    variant="body1"
                    component="p"
                    sx={{
                        marginTop: 1,
                    }}
                >
                    The sapling you've helped plant is rooted in one of the most challenging landscapes we work in—characterised by harsh sunlight, degraded rocky soil, and scarce water resources. Despite these conditions, your plant has begun its journey toward becoming a resilient part of this fragile ecosystem.
                </Typography>
                <Typography
                    variant="body1"
                    component="p"
                >
                    Over the next three years, it will work hard to establish itself—slowly developing the strength and independence needed to thrive in such a tough environment.
                </Typography>
                <Typography
                    variant="body1"
                    component="p"
                    sx={{
                        marginBottom: 2,
                    }}
                >
                    Thank you for your support and for believing in reforestation where it is needed most.
                </Typography>
                <TreeTimeline
                    items={[
                        { image: selUserInfo.image, date: selUserInfo.created_at, status: 'healthy' },
                        ...selUserInfo.tree_audits.map((item: any) => ({
                            image: item.image,
                            date: item.image_date,
                            status: item.tree_status,
                        })),
                    ]}
                    created_at={selUserInfo.created_at}
                    position={matches ? 'right' : 'alternate'}
                />
            </CardContent>
        </Card>
    );
};

export default TreeTimelineInfo;