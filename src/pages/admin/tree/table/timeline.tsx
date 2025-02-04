import React from 'react';
import { Card, CardContent, CardMedia, Typography, Container, Box } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
import { Empty } from 'antd';
import ImageGallery from './ImageGallery';
import moment from 'moment';

const useStyles = makeStyles((theme: any) =>
    createStyles({
        card: {
            marginBottom: theme.spacing(4),
            alignItems: 'center',
            width: 300,
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
            alignItems: 'center',
            padding: theme.spacing(2),
        },
    })
);

function formatDateDifference(dateIsoString: string): string {
    const inputDate = new Date(dateIsoString);
    const currentDate = new Date();

    // Calculate the difference in years, months, and days
    let years = currentDate.getFullYear() - inputDate.getFullYear();
    let months = currentDate.getMonth() - inputDate.getMonth();
    let days = currentDate.getDate() - inputDate.getDate();

    // Adjust months and years if necessary
    if (days < 0) {
        months -= 1;
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    // Format the output
    const yearStr = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
    const monthStr = months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '';
    const dayStr = days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '';

    // Build the final string
    let result = '';
    if (years > 0) {
        result = `${yearStr}${monthStr ? ` and ${monthStr}` : ''}`;
    } else if (months > 0) {
        result = `${monthStr}${dayStr ? ` and ${dayStr}` : ''}`;
    } else {
        result = dayStr || '1 day';
    }

    return result;
}

interface TimelineItemProps {
    image: string;
    date: string;
    status: string;
}

interface TimelineProps {
    items: TimelineItemProps[];
    created_at: string;
    position?: 'alternate' | 'left' | 'right'
}

const TimelineComp: React.FC<{ items: TimelineItemProps[] }> = ({ items }) => {
    const classes = useStyles();
    const date = new Date(items[0].date);
    const isValidDate = !isNaN(date.getDate()) && date.getTime() > 0;
    const month = isValidDate ? moment(date).format('MMMM, YYYY') : '';

    return (
        <Card className={classes.card}>
            <ImageGallery images={items} />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p" className={classes.date}>
                    {month}
                </Typography>
            </CardContent>
        </Card>
    );
};


const TreeTimeline: React.FC<TimelineProps> = ({ items, created_at, position = 'alternate' }) => {
    const classes = useStyles();

    const imagesMap: Record<string, TimelineItemProps[]> = {};
    items.forEach((item) => {
        const imageMonth = item.date.slice(0, 7);
        if (!Object.hasOwn(imagesMap, imageMonth)) {
            imagesMap[imageMonth] = [];
        }
        imagesMap[imageMonth].push(item);
    })

    return (
        <Container className={classes.timeline}>
            <Box sx={{ width: '100%' }}>
                {items.length !== 0 &&
                    <Timeline position={position}>
                        {Object.values(imagesMap).map((item, index) => (
                            <TimelineItem>
                                <TimelineSeparator >
                                    <TimelineDot color='success' />
                                    <TimelineConnector sx={{ backgroundColor: 'green' }} />
                                </TimelineSeparator>
                                <TimelineContent><TimelineComp key={index} items={item} /></TimelineContent>
                            </TimelineItem>
                        ))}
                        <TimelineItem>
                            <TimelineSeparator >
                                <TimelineDot color='success' />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography variant='body1'>
                                    The tree is {formatDateDifference(created_at)} old, awaiting new images!
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
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
