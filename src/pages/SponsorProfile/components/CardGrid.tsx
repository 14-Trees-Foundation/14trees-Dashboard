import React from "react";
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
} from "@mui/material";
import { OpenInNew } from "@mui/icons-material";

type CardData = {
    id: number;
    image: string;
    name: string;
    type: string;
    dashboardLink: string;
};

interface CardGridProps {
    cards: CardData[]
}

const CardGrid: React.FC<CardGridProps> = ({ cards }) => {

    return (
        <Grid container spacing={3} padding={3}>
            {cards.map((card) => (
                <Grid item xs={12} sm={6} md={4} key={card.id}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="200"
                            image={card.image}
                            alt={card.name}
                        />
                        <CardContent
                            sx={{
                                backgroundColor: '#b7edc47a',
                                maxHeight: 80, // Limit height
                                overflow: 'hidden', // Prevent overflow
                            }}
                        >
                            <Typography variant="h6" gutterBottom noWrap>
                                {card.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {card.type}
                            </Typography>
                            <Typography
                                component='a'
                                href={card.dashboardLink}
                                target="_blank"
                                sx={{
                                    mt: 1,
                                    color: '#3f5344',
                                    textTransform: 'none',
                                    fontSize: '0.875rem', // Smaller button text
                                    display: 'inline-flex', // Align text and icon
                                    alignItems: 'center', // Center text and icon vertically
                                    textDecoration: 'none', // Remove underline
                                }}
                            >
                                Go to Dashboard <OpenInNew sx={{ ml: 1 }} fontSize='inherit'/>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default CardGrid;
