import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Event } from "../../../types/event";
import EventMemories from "./EventMemories";
import EventTrees from "./EventTrees";

interface EventDashboardProps {
    event: Event;
}

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100vw",
        overflow: "hidden",
        flexWrap: 'wrap'
    },
    header: {
        position: "sticky",
        top: 0,
        zIndex: 10,
    },
    headerPaper: {
        backgroundColor: "#3f51b5",
        color: "white",
        padding: "16px",
        textAlign: "left",
        fontWeight: "bold",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    content: {
        marginTop: 65,
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
});

const EventDashboard: React.FC<EventDashboardProps> = ({ event }) => {
    const classes = useStyles();

    return (
        <Box p={1}>
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        p: -2,
                        width: '100%',
                        position: 'absolute',
                        margin: '0 auto',
                    }}
                >
                    <Typography mb={1} variant="h4" color={"#323232"}>{event.name} Dashboard</Typography>
                    <Divider />
                </Box>
            </Box>

            {/* Scrollable Content */}
            <Box className={classes.content}>

                {event.message && (
                    <>
                        <Typography
                            variant="body1"
                            paragraph
                            style={{ whiteSpace: "pre-wrap" }} // Handle \n as new lines
                        >
                            {event.message}
                        </Typography>
                        <Divider sx={{ width: "100%" }} />
                    </>
                )}
                {/* Event Memories */}
                {event.memories && event.memories.length > 0 && (
                    <>
                        <Box sx={{ mt: 5 }}>
                            <Typography variant="h5" fontWeight={500} gutterBottom>
                                Event Memories
                            </Typography>
                            <Box sx={{ overflow: "hidden", height: '400px' }}>
                                <EventMemories imageUrls={event.memories} />
                            </Box>
                        </Box>
                        <Divider sx={{ width: "100%", mt: 2 }} />
                    </>
                )}

                <Box sx={{
                    marginTop: 4
                }}>
                    <Typography variant="h5" fontWeight={500} gutterBottom>
                        Event Trees
                    </Typography>
                    <Box sx={{ maxWidth: "100%" }}>
                        <EventTrees eventId={event.id} />
                    </Box>
                </Box>

            </Box>
        </Box>
    );
};

export default EventDashboard;