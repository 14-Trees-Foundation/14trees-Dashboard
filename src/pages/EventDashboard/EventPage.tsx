import { createStyles, makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner";
import { Event, EventMessage } from "../../types/event";
import { NotFound } from "../notfound/NotFound";
import { Box, Divider, Drawer, useMediaQuery } from "@mui/material";
import logo from "../../assets/logo_white_small.png";
import { useParams } from "react-router-dom";
import ApiClient from "../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import EventDashboard from "./components/EventDashboard";
import { navIndex } from "../../store/atoms";
import { useRecoilState } from "recoil";

async function getEventDetails(linkId: string) {
    try {
        const apiClient = new ApiClient();

        const eventMessages = await apiClient.getEventMessages(linkId);

        const resp = await apiClient.getEvents(0, 1, [
            { columnField: 'link', operatorValue: 'equals', value: linkId },
        ])

        const event = resp.results.length === 1
            ? resp.results[0]
            : null

        return {
            event,
            eventMessages,
        }
    } catch (error: any) {
        toast.error(error.message);
        return {
            event: null,
            eventMessages: []
        };
    }
}

const EventPage: React.FC = () => {

    const { linkId } = useParams();
    const classes = useStyles();
    const isMobile = useMediaQuery("(max-width:600px)");
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<Event | null>(null);
    const [eventMessages, setEventMessages] = useState<EventMessage[]>([]);
    const [index, setIndex] = useRecoilState(navIndex);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (!linkId) return;

            setLoading(true);
            const { event, eventMessages } = await getEventDetails(linkId);
            setEvent(event);
            setEventMessages(eventMessages);
            setLoading(false);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [linkId])

    const onClickNav = (value: any) => {
        setIndex(value);
    };

    const pages = [
        {
            page: EventDashboard,
            displayName: "Profile",
            logo: logo,
        },
    ];

    const menuitem = () => {
        return (
            <div className={classes.itemlist}>
                {pages.map((item, i) => {
                    return (
                        <div className={classes.item} onClick={() => onClickNav(i)} key={i}>
                            <div className={index === i ? classes.selected : classes.itembtn}>
                                <img
                                    className={classes.itemlogo}
                                    alt={"items"}
                                    src={item.logo}
                                />
                                <div className={classes.itemtext}>{item.displayName}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const mainBox = () => {
        const Page = pages[index].page;
        return (
            <div>
                {event && <Page event={event} eventMessages={eventMessages} />}
            </div>
        );
    };

    return loading
        ? <Spinner text={''} />
        : event === null
            ? <NotFound />
            : (
                <Box style={{ display: "flex", backgroundColor: 'rgb(114 143 121 / 48%)' }} >
                    {!isMobile && <Drawer
                        className={classes.mdrawer}
                        variant="persistent"
                        anchor="left"
                        open={true}
                    >
                        <Divider />
                        <img className={classes.logo} alt={"logo"} src={logo} />
                        {menuitem()}
                    </Drawer>}
                    <Box style={{ padding: isMobile ? 0 : 10, flexGrow: 1 }}>
                        {mainBox()}
                    </Box>
                    {/* <RightDrawer showWhatsNew={true}/> */}
                </Box>
            );
}

const useStyles = makeStyles((theme: any) =>
    createStyles({
        mdrawer: {
            width: "15%",
            "& .MuiPaper-root": {
                width: "15%",
                backgroundColor: "#3F5344",
                borderTopRightRadius: "10px",
            },
        },
        itemlist: {
            width: "100%",
            color: "#ffffff",
        },
        item: {
            cursor: "pointer",
            color: "#ffffff",
            width: "80%",
            margin: "0 auto 20px auto",
        },
        itembtn: {
            borderRadius: "20px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#3F5344",
            "&:hover": {
                backgroundColor: "#9BC53D",
            },
        },
        selected: {
            borderRadius: "20px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#9BC53D",
        },
        logo: {
            width: "80px",
            height: "100px",
            margin: "12px auto 30px auto",
            paddingTop: "25px",
            [theme.breakpoints.down("md")]: {
                width: "60px",
                height: "80px",
            },
            [theme.breakpoints.down("sm")]: {
                width: "40px",
                height: "55px",
            },
        },
        itemlogo: {
            width: "18px",
            height: "20px",
        },
        itemtext: {
            margin: "5px",
            fontWeight: 450,
            fontSize: 16,
            [theme.breakpoints.down("md")]: {
                display: "none",
            },
        },
    })
);

export default EventPage;