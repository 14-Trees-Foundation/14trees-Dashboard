import DrawerTemplate from "../../../components/DrawerTemplate";
import CSRInventory from "./CSRInventory";
import logo from "../../../assets/logo_white_small.png";
import { useAuth } from "../auth/auth";
import { useEffect } from "react";

const CSRPage: React.FC = () => {

    let auth = useAuth();
    useEffect(() => {
    auth.signin("User", 0, ["all"], ["super-admin"], "", () => { })
    }, [])

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