import React from "react";
import {
    Box,
    Grid,
    Typography,
} from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import { Card, Empty } from "antd";
import { createStyles, makeStyles } from "@mui/styles";

type CardData = {
    id: number;
    image: string;
    name: string;
    type: string;
    dashboardLink: string;
};

interface CardGridProps {
    loading?: boolean
    cards: CardData[]
}

const CardGrid: React.FC<CardGridProps> = ({ cards, loading }) => {

    const classes = useStyle();

    return !loading && cards.length === 0 ? (
        <Box height='60vh' display="flex" alignItems="center" justifyContent="center">
            <Empty description="Trees not found for the user!" />
        </Box>
    ) : (
        <Grid container spacing={3} padding={3}>
            {cards.map((card) => (
                <Grid item xs={12} sm={6} md={3} key={card.id}>
                    <Card
                        hoverable
                        className={classes.customCard}
                        style={{ 
                            backgroundColor: '#b7edc47a', 
                            border: 'none', 
                            overflow: 'hidden', 
                            borderRadius: '20px',
                            transition: 'background-color 0.3s',
                        }}
                        onClick={() => { window.open(card.dashboardLink) }}
                        cover={<img height={240} alt={card.type} src={card.image} style={{ backgroundColor: 'white', width: '100%', objectFit: 'contain' }} />}
                    >
                        <div style={{ width: "100%", zIndex: 10 }}>
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
                                Go to Dashboard <OpenInNew sx={{ ml: 1 }} fontSize='inherit' />
                            </Typography>
                        </div>
                    </Card>
                </Grid>
            ))}

            {loading && [1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (<Grid item xs={12} sm={6} md={4} key={item}>
                <Card loading style={{ backgroundColor: '#b7edc47a', border: 'none', overflow: 'hidden', borderRadius: '20px' }}></Card>
            </Grid>))}
        </Grid>
    );
};

const useStyle = makeStyles((theme) =>
  createStyles({
    customCard: {
      '&:hover': {
        backgroundColor: '#8fcf9f7a !important', /* New hover color */
        cursor: 'pointer',
        transition: 'background-color 0.3s ease', /* Smooth transition */
      },
    },
  })
);

export default CardGrid;
