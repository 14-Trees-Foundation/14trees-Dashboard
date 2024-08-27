import React from 'react';
import { Card, CardContent, CardMedia, Typography, Container, Box } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
import { getHumanReadableDate } from '../../../../helpers/utils';
import { Empty } from 'antd';

const useStyles = makeStyles((theme: any) =>
    createStyles({
        card: {
            marginBottom: theme.spacing(4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        media: {
            height: 300,
            width: '100%',
        },
        date: {
            marginTop: theme.spacing(2),
            fontWeight: 'bold',
            color: 'black',
        },
        status: {
            marginTop: theme.spacing(1),
            color: 'black',
        },
        timeline: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: theme.spacing(2),
        },
    })
);

interface TimelineItemProps {
    image: string;
    date: string;
    status: string;
}

const TimelineComp: React.FC<TimelineItemProps> = ({ image, date, status }) => {
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <CardMedia
                className={classes.media}
                image={image}
                title="Timeline Image"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p" className={classes.date}>
                    {getHumanReadableDate(date)}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" className={classes.status}>
                    Status: {status.slice(0,1).toUpperCase() + status.slice(1)}
                </Typography>
            </CardContent>
        </Card>
    );
};

interface TimelineProps {
    items: TimelineItemProps[];
}

const TreeTimeline: React.FC<TimelineProps> = ({ items }) => {
    const classes = useStyles();
    return (
        <Container className={classes.timeline}>
            <Box sx={{ width: '100%' }}>
                {items.length !== 0 && 
                    <Timeline position="alternate">
                        {items.map((item, index) => (
                            <TimelineItem>
                                <TimelineSeparator >
                                    <TimelineDot color='success' />
                                    <TimelineConnector sx={{ backgroundColor: 'green' }} />
                                </TimelineSeparator>
                                <TimelineContent><TimelineComp key={index} {...item} /></TimelineContent>
                            </TimelineItem>
                        ))}
                        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <TimelineDot color='success'/>
                        </Box>
                        <Typography variant='body1' style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                            The tree is 1 year 3 months old, awaiting new images!
                        </Typography>
                    </Timeline>
                }
                {items.length === 0 && 
                    <Empty
                        imageStyle={{ height: 60 }}
                    />
                }
            </Box>
        </Container>
    );
};

export default TreeTimeline;
