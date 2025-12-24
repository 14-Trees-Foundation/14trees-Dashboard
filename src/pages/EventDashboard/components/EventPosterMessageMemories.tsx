import React from 'react';
import { Box, Typography, useMediaQuery } from "@mui/material";
import EventMemories from "./EventMemories";
import background from "../../../assets/background.png";

interface EventPosterMessageMemoriesProps {
    eventPoster?: string;
    eventName: string;
    eventMessage?: string;
    memoryImages: string[];
    isLoadingImages: boolean;
    currentTheme: {
        gradient: string;
        textAreaBg: string;
        textColor: string;
        logoColor: string;
        navColor: string;
    };
    onImageClick: (url: string) => void;
    renderMessageWithLineBreaks: (msg: string) => JSX.Element[];
}

const EventPosterMessageMemories: React.FC<EventPosterMessageMemoriesProps> = ({
    eventPoster,
    eventName,
    eventMessage,
    memoryImages,
    isLoadingImages,
    currentTheme,
    onImageClick,
    renderMessageWithLineBreaks,
}) => {
    const isMobile = useMediaQuery("(max-width:600px)");

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 5,
                alignItems: "stretch",
                padding: isMobile ? "8px 20px" : "40px",
                width: isMobile ? '100%' : '95%',
                margin: "0 auto",
                maxWidth: '100%',
                boxSizing: 'border-box'
            }}
        >
            {/* Image column (40%) - background image with poster positioned at left 40% top 30% */}
            <Box
                sx={{
                    width: isMobile ? "100%" : "38%",
                    maxWidth: '100%',
                    minHeight: isMobile ? 300 : '80vh',
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    boxSizing: 'border-box',
                    position: 'relative',
                }}
            >
                {/* Background area - ensure visible height on mobile */}
                <Box
                    onClick={() => {
                        if (eventPoster) {
                            onImageClick(eventPoster);
                        }
                    }}
                    sx={{
                        width: '100%',
                        height: isMobile ? 'auto' : '100%',
                        borderRadius: 4,
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: eventPoster ? 'pointer' : 'default',
                        transition: 'transform 0.2s ease',
                    }}
                >
                    <Box
                        component="img"
                        src={eventPoster || background}
                        alt={eventName ?? 'event poster'}
                        sx={{
                            width: '100%',
                            height: isMobile ? 'auto' : '100%',
                            display: 'block',
                            objectFit: 'contain',
                            objectPosition: 'center',
                        }}
                        onClick={(e: React.MouseEvent) => {
                            // Prevent duplicate event propagation when clicking the img itself
                            e.stopPropagation();
                            if (eventPoster) onImageClick(eventPoster);
                        }}
                    />
                </Box>
            </Box>

            {/* Message + carousel column (60%) */}
            <Box
                sx={{
                    width: isMobile ? "100%" : "60%",
                    maxWidth: '100%',
                    overflow: 'hidden',
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    boxSizing: 'border-box'
                }}
            >
                {/* Message area takes 50% of column height on desktop */}
                <Box
                    sx={{
                        flex: isMobile ? "none" : "0 0 30%",
                        minHeight: isMobile ? "auto" : "45%",
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: currentTheme.textAreaBg,
                        borderRadius: 3,
                        padding: 2,
                    }}
                >
                    {eventMessage && (
                        <Box sx={{
                            height: "100%",
                            width: '100%',
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                            padding: isMobile ? 2 : '0.5rem 1rem',
                            maxHeight: 260,
                            overflowY: 'auto',
                        }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: currentTheme.textColor,
                                    fontFamily: '"Noto Sans", sans-serif',
                                    fontWeight: 400,
                                    fontStyle: 'normal',
                                    fontSize: { xs: '18px', md: '18px' },
                                    lineHeight: '100%',
                                    letterSpacing: 0,
                                }}
                            >
                                {renderMessageWithLineBreaks(eventMessage)}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Memories carousel under message */}
                <Box
                    sx={{
                        flex: "1 1 auto",
                        minHeight: isMobile ? "200px" : "auto",
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {isLoadingImages ? (
                        <Typography variant="body2" sx={{ color: currentTheme.textColor }}>
                            Loading images...
                        </Typography>
                    ) : (
                        <EventMemories imageUrls={memoryImages} />
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default EventPosterMessageMemories;
