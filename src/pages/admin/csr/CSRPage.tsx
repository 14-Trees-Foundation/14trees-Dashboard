import DrawerTemplate from "../../../components/DrawerTemplate";
import CSRInventory from "./CSRInventory";
import logo from "../../../assets/logo_white_small.png";
import { SinglePageDrawer } from "./SinglePageDrawer";
import { Dashboard, CardGiftcard, Landscape, Forest, GrassTwoTone, Map } from "@mui/icons-material";
import { createStyles, makeStyles } from "@mui/styles";
import { Box } from "@mui/material";

const CSRPage: React.FC = () => {

    const classes = useStyles();

    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const rect = element.getBoundingClientRect();
            const offset = window.scrollY + rect.top - parseFloat(getComputedStyle(element).marginTop);
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    // const pages = [
    //     {
    //         page: CSRInventory,
    //         displayName: "Dashboard",
    //         logo: logo,
    //     },
    // ]

    // return (<DrawerTemplate
    //     pages={pages}
    //     style={{
    //         backgroundColor: "#B1BFB5",
    //     }}
    // />)

    const items = [
        {
            displayName: 'Dashboard',
            logo: Dashboard,
            key: 0,
            display: true,
            onClick: () => { handleScroll('corporate-impact-overview') }
        },
        {
            displayName: 'Reforestation Sites',
            logo: Map,
            key: 1,
            display: true,
            onClick: () => { handleScroll('reforestation-sites') }
        },
        {
            displayName: 'Plantation Plots',
            logo: Landscape,
            key: 2,
            display: true,
            onClick: () => { handleScroll('plantation-plots') }
        },
        {
            displayName: 'Biodiversity Supported',
            logo: GrassTwoTone,
            key: 3,
            display: true,
            onClick: () => { handleScroll('biodiversity-supported') }
        },
        {
            displayName: 'Tree Sponsorship Details',
            logo: Forest,
            key: 4,
            display: true,
            onClick: () => { handleScroll('tree-sponsorship-details') }
        },
        {
            displayName: 'Green Gift Contributions',
            logo: CardGiftcard,
            key: 5,
            display: true,
            onClick: () => { handleScroll('green-gift-contributions') }
        },
    ]

    return (
        <div className={classes.box}>
            <Box
                sx={{
                    display: "flex",
                }}
            >
                <SinglePageDrawer pages={items} />
                <Box
                    component="main"
                    sx={{ minWidth: "1080px", p: 2, width: "100%" }}
                >
                    <CSRInventory />
                </Box>
            </Box>
        </div>
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

export default CSRPage;