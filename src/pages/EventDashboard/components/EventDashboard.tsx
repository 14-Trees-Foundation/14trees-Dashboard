import React from "react";
import { Box, Typography, Divider, useMediaQuery } from "@mui/material";
import logo from "../../../assets/icon_round.png";
import { createStyles, makeStyles } from "@mui/styles";
import { Event, EventMessage } from "../../../types/event";
import EventMemories from "./EventMemories";
import EventTrees from "./EventTrees";
import EventMessages from "./EventMessages";
import EventImgMsg from "./EventImgMsg";

interface EventDashboardProps {
    event: Event;
    eventMessages: EventMessage[];
}

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
    }))

const EventDashboard: React.FC<EventDashboardProps> = ({ event, eventMessages }) => {
    const classes = useStyles();
    const isMobile = useMediaQuery("(max-width:600px)");

    return (
        <Box
            p={isMobile ? 0 : 2}
            sx={isMobile ? {
                width: "100vw",
                overflow: "hidden",
            } : undefined}
        >
            {/* Header */}
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    padding: isMobile ? "4px" : "10px",
                    display: 'flex',
                    justifyContent: isMobile ? 'center' : 'flex-start'
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
                {event.memories && event.memories.length > 0 && (
                    <>
                        <Box sx={{ mt: isMobile ? 3 : 5 }}>
                            <Typography
                                variant={isMobile ? "h6" : "h5"}
                                fontWeight={500}
                                gutterBottom
                                textAlign={isMobile ? "center" : "left"}
                            >
                                {event.type === "2" ? "" : "Event"} Memories
                            </Typography>
                            <Box
                                sx={{
                                    overflow: "hidden",
                                    height: isMobile ? "250px" : "420px",
                                }}
                            >
                                <EventMemories imageUrls={event.memories} />
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
                    >
                        {event.type === "2" ? "Memorial Trees" : "Event Trees"}
                    </Typography>
                    <Box sx={{ maxWidth: "100%" }}>
                        <EventTrees eventId={event.id} eventType={event.type} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default EventDashboard;