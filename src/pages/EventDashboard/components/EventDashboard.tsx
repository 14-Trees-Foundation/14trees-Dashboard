import React from "react";
import { Box, Typography, Paper } from "@mui/material";
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
        flex: 1,
        display: 'flex',
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
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
        <Box className={classes.root}>
            {/* Sticky Elevated Header */}
            <Box className={classes.header}>
                <Paper className={classes.headerPaper} elevation={3}>
                    <Typography variant="h4">{event.name}</Typography>
                </Paper>
            </Box>

            {/* Scrollable Content */}
            <Box className={classes.content}>
                <Box style={{ maxWidth: "70vw", }}>

                    {event.message && (
                        <Paper className={classes.messagePaper} elevation={2}>
                            <Typography
                                variant="body1"
                                paragraph
                                style={{ whiteSpace: "pre-wrap" }} // Handle \n as new lines
                            >
                                {event.message}
                            </Typography>
                        </Paper>
                    )}

                    {/* Event Memories */}
                    {event.memories && event.memories.length > 0 && (
                        // <Paper
                        //     elevation={3}
                        //     sx={{
                        //         marginTop: 10,
                        //         borderRadius: "20px",
                        //         padding: "16px",
                        //         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        //         backgroundColor: "white"
                        //     }}
                        // >
                        <Box sx={{ mt: 10 }}>
                            <Typography variant="h6" gutterBottom>
                                Event Memories
                            </Typography>
                            <Box sx={{ overflow: "hidden", height: '400px' }}>
                                <EventMemories imageUrls={event.memories} />
                            </Box>
                        </Box>
                        // </Paper>
                    )}

                    <Box sx={{
                        marginTop: 10
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Event Trees
                        </Typography>
                        <Box sx={{ maxWidth: "100%" }}>
                            <EventTrees eventId={event.id} />
                        </Box>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
};

export default EventDashboard;