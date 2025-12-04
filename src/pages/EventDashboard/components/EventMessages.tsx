import React, { useState } from 'react';
import {
    Box,
    Card,
    Typography,
    Dialog,
    DialogContent,
    DialogContentText,
    useMediaQuery,
    DialogActions,
    Button
} from '@mui/material';
import { EventMessage } from '../../../types/event';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface EventMessagesProps {
    messages: EventMessage[];
};

const EventMessages: React.FC<EventMessagesProps> = ({ messages }) => {

    const isMobile = useMediaQuery("(max-width:600px)");

    const [open, setOpen] = useState(false);
    const [selectedEventMessage, setSelectedEventMessage] = useState<EventMessage | null>(null);

    const handleOpen = (testimonial: EventMessage) => {
        setSelectedEventMessage(testimonial);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedEventMessage(null);
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 30000,
        responsive: [
            {
                breakpoint: 960, // md
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 600, // sm
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };

    return (
        <div
            style={{
                width: "100%",
                maxWidth: isMobile ? "96vw" : "80vw", // Full width for mobile, 80vw for larger screens
                height: "250px",
                overflow: "hidden",
            }}
        >
            <div style={{ padding: "0 25px" }}>
                <Slider {...settings}>
                    {messages.map((t, index) => (
                        <Box key={index}>
                            <Card
                                sx={{
                                    height: 150,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    padding: 2,
                                    marginLeft: 1,
                                    borderRadius: '20px',
                                    overflow: 'auto',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: 'rgba(0,0,0,0.2) transparent',
                                    '&::-webkit-scrollbar': {
                                        width: '1px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        background: 'transparent',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: 'transparent',
                                        borderRadius: '10px',
                                        transition: 'background 0.3s ease',
                                    },
                                    '&:hover::-webkit-scrollbar-thumb': {
                                        background: 'rgba(0,0,0,0.2)',
                                    },
                                    '&::-webkit-scrollbar-thumb:hover': {
                                        background: 'rgba(0,0,0,0.4)',
                                    },
                                }}
                                onClick={() => handleOpen(t)}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 5,
                                        WebkitBoxOrient: 'vertical'
                                    }}
                                >
                                    {t.message}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary" mt={2}>
                                    — {t.user_name}
                                </Typography>
                            </Card>
                        </Box>
                    ))}
                </Slider>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                    },
                }}
            >
                <DialogContent 
                    dividers
                    sx={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(0,0,0,0.2) transparent',
                        '&::-webkit-scrollbar': {
                            width: '1px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'transparent',
                            borderRadius: '10px',
                            transition: 'background 0.3s ease',
                        },
                        '&:hover::-webkit-scrollbar-thumb': {
                            background: 'rgba(0,0,0,0.2)',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: 'rgba(0,0,0,0.4)',
                        },
                    }}
                >
                    <DialogContentText color='black' style={{ whiteSpace: 'pre-wrap' }}>{selectedEventMessage?.message}</DialogContentText>
                    <Box mt={2} textAlign="right">
                        <Typography variant="subtitle2">
                            — {selectedEventMessage?.user_name}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color='error'
                        variant='outlined'
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
};

export default EventMessages;
