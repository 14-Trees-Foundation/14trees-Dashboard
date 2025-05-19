import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    useMediaQuery,
    useTheme,
    DialogActions,
    Button,
} from "@mui/material";
import Slider from "react-slick";

// Carousel CSS (include this once globally, e.g., in App.tsx)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Props = {
    imageUrls: string[] | null;
    message: string;
};

const EventImgMsg: React.FC<Props> = ({ imageUrls, message }) => {
    const [open, setOpen] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const [lineClamp, setLineClamp] = useState<number | "unset">("unset");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Dynamically calculate the number of lines that fit within 280px
        if (messageRef.current) {
            const lineHeight = parseFloat(
                window.getComputedStyle(messageRef.current).lineHeight || "20"
            );
            const maxLines = Math.floor(280 / lineHeight); // Calculate max lines based on height
            setLineClamp(maxLines);
            setIsTruncated(messageRef.current.scrollHeight > 280);
        }
    }, [message]);

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 2000,
        fade: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
    };

    return (
        <>
            <Box
                display="flex"
                flexDirection={isMobile ? "column" : "row"}
                alignItems="center"
                justifyContent={"space-between"}
                gap={2}
                sx={{ width: "100%", mx: "auto" }}
            >
                {/* Image Carousel */}
                {imageUrls && imageUrls.length > 0 && <Box
                    sx={{
                        maxWidth: 300,
                        maxHeight: 300,
                        width: "100%",
                        flexShrink: 0,
                        borderRadius: '20px',
                        overflow: "hidden",
                    }}
                >
                    <Slider {...carouselSettings}>
                        {imageUrls.map((url, idx) => (
                            <Box key={idx}>
                                <Box
                                    component="img"
                                    src={url}
                                    alt={`Image ${idx + 1}`}
                                    sx={{
                                        width: "100%",
                                        height: 300,
                                        objectFit: "contain",
                                        borderRadius: '20px',
                                        backgroundColor: 'white',
                                    }}
                                />
                            </Box>
                        ))}
                    </Slider>
                </Box>}

                {/* Message Card */}
                <Card
                    sx={{
                        padding: 1,
                        flex: 1,
                        background: "#f9f9f9",
                        cursor: isTruncated ? "pointer" : "default",
                        maxHeight: 284,
                        borderRadius: '20px',
                    }}
                    onClick={() => isTruncated && setOpen(true)}
                >
                    <CardContent>
                        <Typography
                            ref={messageRef}
                            variant={isMobile ? "body2" : "body1"}
                            paragraph
                            sx={{
                                whiteSpace: "pre-wrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: lineClamp,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {message}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Dialog for full message */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogContent dividers>
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>{message}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpen(false)}
                        color='error'
                        variant='outlined'
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EventImgMsg;