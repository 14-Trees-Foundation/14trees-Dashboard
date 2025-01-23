import DrawerTemplate from "../../../components/DrawerTemplate";
import CSRInventory from "./CSRInventory";
import logo from "../../../assets/logo_white_small.png";

const CSRPage: React.FC = () => {

    const pages = [
        {
            page: CSRInventory,
            displayName: "Dashboard",
            logo: logo,
        },
    ]

    return (<DrawerTemplate
        pages={pages}
        style={{
            backgroundColor: "#B1BFB5",
        }}
    />)
}

export default CSRPage;