import { NaturePeople } from "@mui/icons-material";
import { createStyles, makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner";
import { Event } from "../../types/event";
import { NotFound } from "../notfound/NotFound";
import { Box } from "@mui/material";
import { SinglePageDrawer } from "../admin/csr/SinglePageDrawer";
import { useParams } from "react-router-dom";
import ApiClient from "../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import EventDashboard from "./components/EventDashboard";

async function getEventDetails(linkId: string): Promise<Event | null> {
    try {
        const apiClient = new ApiClient();
        const resp = await apiClient.getEvents(0, 1, [
            { columnField: 'link', operatorValue: 'equals', value: linkId },
        ])

        return resp.results.length === 1
            ? resp.results[0]
            : null
    } catch (error: any) {
        toast.error(error.message);
        return null;
    }
}

const EventPage: React.FC = () => {

    const { linkId } = useParams();
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<Event | null>(null);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (!linkId) return;

            setLoading(true);
            const event = await getEventDetails(linkId);
            setEvent(event);
            setLoading(false);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [linkId])

    const items = [
        {
            displayName: 'Gift of Trees',
            logo: NaturePeople,
            key: 5,
            display: true,
            onClick: () => { }
        },
    ]

    return (
        loading
            ? <Spinner text={''} />
            : event === null
                ? <NotFound />
                : (<div className={classes.box}>
                    <Box
                        sx={{
                            display: "flex",
                        }}
                    >
                        {/* <SinglePageDrawer pages={items} /> */}
                        <Box
                            component="main"
                        >
                            <EventDashboard event={event}/>
                        </Box>
                    </Box>
                </div>)
    );
}

const useStyles = makeStyles((theme: any) =>
    createStyles({
        box: {
            overflow: "auto",
            width: "100%",
            position: "relative",
            backgroundColor: "#B1BFB5",
            minHeight: "100vh",
            heigth: "100%",
        },
        bg: {
            width: "100%",
            objectFit: "cover",
        },
        outlet: {
            [theme.breakpoints.down("768")]: {
                marginTop: "48px",
            },
        },
    })
);

export default EventPage;