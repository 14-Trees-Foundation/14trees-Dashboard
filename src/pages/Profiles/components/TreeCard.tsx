import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

interface TreeCardProps {
    imageUrl: string;
    title: string;
    subtitle: string;
    date: string;
}

const TreeCard: React.FC<TreeCardProps> = ({ imageUrl, title, subtitle, date }) => {
    return (
        <Card sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', padding: 2, backgroundColor: 'rgba(207, 255, 235, 0.3)', borderRadius: 4 }}>
            <CardMedia
                component="img"
                image={imageUrl}
                alt="Image"
                sx={{ width: 80, height: 80, borderRadius: '8px', marginRight: 2 }}
            />
            <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
                <Typography variant="caption" color="text.secondary">{date}</Typography>
            </CardContent>
        </Card>
    );
};

export default TreeCard;
