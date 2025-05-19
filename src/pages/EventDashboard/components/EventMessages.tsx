import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    IconButton,
    useMediaQuery,
    DialogActions,
    Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { EventMessage } from '../../../types/event';
import { Carousel } from 'antd';
import Slider from 'react-slick';

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
        autoplaySpeed: 3000,
        arrows: false,
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
                <DialogContent dividers>
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
