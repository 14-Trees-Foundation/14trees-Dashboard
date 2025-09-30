import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, useMediaQuery } from "@mui/material";
import logo from "../../../assets/icon_round.png";
import loriFayzanDashboardImage from "../../../assets/event-dashboard/Lori_Fayzan_Dashboard.jpg";
import { createStyles, makeStyles } from "@mui/styles";
import { Event, EventMessage } from "../../../types/event";
import { EventImage } from "../../../types/eventImage";
import EventMemories from "./EventMemories";
import EventTrees from "./EventTrees";
import EventMessages from "./EventMessages";
import EventImgMsg from "./EventImgMsg";
import ApiClient from "../../../api/apiClient/apiClient";

interface EventDashboardProps {
    event: Event;
    eventMessages: EventMessage[];
}

interface EventDashboardLinkConfig {
    showFeaturedImage?: boolean;
    featuredImageSrc?: string;
    featuredImageAlt?: string;
    featuredImageWrapperSx?: Record<string, any>;
    featuredImageStyles?: React.CSSProperties;
    hideHeader?: boolean;
    memoriesHeadingText?: string;
    memoriesHeadingColor?: string;
    memoriesHeadingAlign?: React.CSSProperties["textAlign"];
    treesHeadingText?: string;
    treesHeadingColor?: string;
}

const EVENT_DASHBOARD_CONFIG_BY_LINK_ID: Record<string, EventDashboardLinkConfig> = {
    "jjaqyf4c": {
        showFeaturedImage: true,
        featuredImageSrc: loriFayzanDashboardImage,
        hideHeader: true,
        memoriesHeadingText: "We’re planting 7 types of native trees",
        memoriesHeadingColor: "#EC7544",
        memoriesHeadingAlign: "center",
        treesHeadingText: "Find your family tree!",
        treesHeadingColor: "#EC7544",
    },
};

const useStyles = makeStyles((theme: any) =>
    createStyles({
        img: {
            width: "50px",
            height: "35px",
            marginRight: "5px",
            [theme.breakpoints.down("480")]: {
                width: "35px",
                height: "35px",
            },
        },
        root: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100vw",
            overflow: "hidden",
            flexWrap: "wrap",
        },
        content: {
            flex: 1,
            padding: "16px",
            overflowY: "auto",
            scrollbarWidth: "thin", // For Firefox
            scrollbarColor: "#c1c1c1 transparent", // For Firefox
            "&::-webkit-scrollbar": {
                width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c1c1c1",
                borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#a1a1a1",
            },
            "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
            },
        },
        messagePaper: {
            padding: "16px",
            marginBottom: "16px",
            borderRadius: "20px !important",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
        },
        featuredImage: {
            width: "100%",
            maxWidth: "960px",
            borderRadius: "24px",
            objectFit: "cover",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
        },
    }))

const EventDashboard: React.FC<EventDashboardProps> = ({ event, eventMessages }) => {
    const classes = useStyles();
    const isMobile = useMediaQuery("(max-width:600px)");
    const [apiEventImages, setApiEventImages] = useState<string[]>([]);
    const [isLoadingImages, setIsLoadingImages] = useState<boolean>(true);
    const [allEventImages, setAllEventImages] = useState<string[]>([]);

    const apiClient = new ApiClient();
    const linkConfig = EVENT_DASHBOARD_CONFIG_BY_LINK_ID[event.link ?? ""] ?? {};
    const shouldRenderFeaturedImage = Boolean(linkConfig.showFeaturedImage && linkConfig.featuredImageSrc);
    const featuredImageWrapperSx = {
        display: "flex",
        justifyContent: "center",
        padding: isMobile ? "8px 8px 0" : "16px 16px 0",
        ...(linkConfig.featuredImageWrapperSx ?? {}),
    };
    const featuredImageAlt = linkConfig.featuredImageAlt ?? `${event.name} featured`;
    const memoriesHeadingText = linkConfig.memoriesHeadingText ?? (event.type === "2" ? "Memories" : "Event Memories");
    const memoriesHeadingColor = linkConfig.memoriesHeadingColor;
    const memoriesHeadingAlign = linkConfig.memoriesHeadingAlign ?? (isMobile ? "center" : "left");
    const treesHeadingText = linkConfig.treesHeadingText ?? (event.type === "2" ? "Memorial Trees" : "Event Trees");
    const treesHeadingColor = linkConfig.treesHeadingColor;
    const shouldHideHeader = linkConfig.hideHeader ?? false;

    useEffect(() => {
        const fetchEventImages = async () => {
            try {
                setIsLoadingImages(true);
                const images: EventImage[] = await apiClient.events.getEventImages(event.id);
                // Sort images by sequence and extract URLs
                const imageUrls = images
                    .sort((a, b) => a.sequence - b.sequence)
                    .map(img => img.image_url);
                setApiEventImages(imageUrls);
            } catch (error) {
                console.error('Failed to fetch event images:', error);
                setApiEventImages([]);
            } finally {
                setIsLoadingImages(false);
            }
        };

        fetchEventImages();
    }, [event.id]);

    // Combine images from both sources when either changes
    useEffect(() => {
        const legacyImages = event.memories || [];
        const combinedImages = [...legacyImages, ...apiEventImages];
        // Remove duplicates in case the same image exists in both sources
        const uniqueImages = Array.from(new Set(combinedImages));
        setAllEventImages(uniqueImages);
    }, [event.memories, apiEventImages]);

    return (
        <Box
            p={isMobile ? 0 : 2}
            sx={isMobile ? {
                width: "100vw",
                overflow: "hidden",
                paddingTop: "16px",
            } : undefined}
        >
            {shouldRenderFeaturedImage && (
                <Box sx={featuredImageWrapperSx}>
                    <img
                        src={linkConfig.featuredImageSrc}
                        alt={featuredImageAlt}
                        className={classes.featuredImage}
                        style={linkConfig.featuredImageStyles}
                    />
                </Box>
            )}
            {!shouldHideHeader && (
                <>
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            padding: isMobile ? "16px 8px 12px" : "10px",
                            display: "flex",
                            justifyContent: isMobile ? "center" : "flex-start",
                        }}
                    >
                        <img src={logo} alt={logo} className={classes.img} />
                        <Typography
                            mb={1}
                            variant={isMobile ? "h5" : "h4"}
                            color={"#323232"}
                            flexWrap={"wrap"}
                            textAlign={isMobile ? "center" : "left"}
                        >
                            {event.name} Dashboard
                        </Typography>
                    </Box>
                    <Divider />
                </>
            )}

            {/* Scrollable Content */}
            <Box className={classes.content}>
                {/* Event Message */}
                {event.message && (
                    <EventImgMsg imageUrls={event.images} message={event.message} />
                )}

                {/* Event Messages */}
                {eventMessages.length > 0 && (
                    <Box sx={{ mt: isMobile ? 3 : 5 }}>
                        <Typography
                            variant={isMobile ? "h6" : "h5"}
                            fontWeight={500}
                            gutterBottom
                            textAlign={isMobile ? "center" : "left"}
                        >
                            {event.type === "2" ? "Messages of Love and Remembrance" : "Event Messages"}
                        </Typography>
                        <Box
                            sx={{
                                overflow: "hidden",
                                height: "220px",
                            }}
                        >
                            <EventMessages messages={eventMessages} />
                        </Box>
                    </Box>
                )}

                {/* Event Memories */}
                {!isLoadingImages && allEventImages.length > 0 && (
                    <>
                        <Box sx={{ mt: isMobile ? 3 : 5 }}>
                            <Typography
                                variant={isMobile ? "h6" : "h5"}
                                fontWeight={500}
                                gutterBottom
                                textAlign={memoriesHeadingAlign}
                                color={memoriesHeadingColor}
                                marginBottom={isMobile ? "1rem" : "2rem"}
                            >
                                {/* {event.type === "2" ? "" : "Event"} Memories */}
                                {memoriesHeadingText}
                            </Typography>
                            <Box
                                sx={{
                                    overflow: "hidden",
                                    height: isMobile ? "250px" : "420px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <EventMemories imageUrls={allEventImages} />
                            </Box>
                        </Box>
                        <Divider sx={{ width: "100%", mt: 2 }} />
                    </>
                )}

                {/* Event Trees */}
                <Box sx={{ marginTop: isMobile ? 3 : 4 }}>
                    <Typography
                        variant={isMobile ? "h6" : "h5"}
                        fontWeight={500}
                        gutterBottom
                        textAlign={isMobile ? "center" : "left"}
                        color={treesHeadingColor}
                    >
                        {/* {event.type === "2" ? "Memorial Trees" : "Event Trees"} */}
                        {treesHeadingText}
                    </Typography>
                    <Box sx={{ maxWidth: "100%" }}>
                        <EventTrees 
                            eventId={event.id} 
                            eventLinkId={event.link}
                            eventType={event.type} 
                            defaultViewMode={event.default_tree_view_mode || 'profile'}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default EventDashboard;