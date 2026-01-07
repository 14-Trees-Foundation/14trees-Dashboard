import React, { useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Dialog,
    DialogContent,
    IconButton,
} from "@mui/material";
import { OpenInNew, Close as CloseIcon } from "@mui/icons-material";
import { Card, Empty } from "antd";
import { createStyles, makeStyles } from "@mui/styles";

type CardData = {
    id: number;
    image: string;
    name: string;
    type: string;
    dashboardLink: string;
};

export type CardGridTheme = {
    coverBackgroundColor?: string;
    contentBackgroundColor?: string;
    nameColor?: string;
    typeColor?: string;
    linkColor?: string;
};

interface CardGridProps {
    loading?: boolean
    cards: CardData[]
    padding?: number | string
    cardTheme?: CardGridTheme
}

const CardGrid: React.FC<CardGridProps> = ({ cards, loading, padding = 3, cardTheme }) => {

    const classes = useStyle();
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>('');

    const {
        coverBackgroundColor,
        contentBackgroundColor,
        nameColor,
        typeColor,
        linkColor,
    } = cardTheme ?? {};

    const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
        e.stopPropagation();
        setSelectedImage(imageUrl);
        setImageModalOpen(true);
    };

    const handleCloseImageModal = () => {
        setImageModalOpen(false);
        setSelectedImage('');
    };

    return !loading && cards.length === 0 ? (
        <Box height='60vh' display="flex" alignItems="center" justifyContent="center">
            <Empty description="Trees not found for the user!" />
        </Box>
    ) : (
        <>
        <Grid container spacing={3} padding={padding}>
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
                        cover={
                            <img
                                height={240}
                                alt={card.type}
                                src={card.image}
                                onClick={(e) => handleImageClick(e, card.image)}
                                style={{
                                    backgroundColor: coverBackgroundColor ?? 'white',
                                    width: '100%',
                                    objectFit: 'contain',
                                    cursor: 'pointer',
                                }}
                            />
                        }
                    >
                        <div
                            style={{
                                width: "100%",
                                zIndex: 10,
                                backgroundColor: contentBackgroundColor,
                            }}
                        >
                            <Typography
                                variant="h6"
                                gutterBottom
                                noWrap
                                sx={nameColor ? { color: nameColor } : undefined}
                            >
                                {card.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                color={typeColor ? undefined : "text.secondary"}
                                noWrap
                                sx={typeColor ? { color: typeColor } : undefined}
                            >
                                {card.type}
                            </Typography>
                            <Typography
                                component='a'
                                href={card.dashboardLink}
                                target="_blank"
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                sx={{
                                    mt: 1,
                                    color: linkColor ?? '#3f5344',
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    }
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

        {/* Image Enlarge Modal */}
        <Dialog
            open={imageModalOpen}
            onClose={handleCloseImageModal}
            maxWidth="lg"
            fullWidth
            onClick={handleCloseImageModal}
            sx={{
                '& .MuiDialog-paper': {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    overflow: 'hidden',
                }
            }}
        >
            <IconButton
                onClick={handleCloseImageModal}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1,
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    }
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent
                sx={{
                    p: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                }}
            >
                <img
                    src={selectedImage}
                    alt="Enlarged view"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '90vh',
                        objectFit: 'contain',
                    }}
                />
            </DialogContent>
        </Dialog>
        </>
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