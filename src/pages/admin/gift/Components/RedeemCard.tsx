import { FC } from "react";
import logo from "../../../../assets/logo_white_small.png";
import DrawerTemplate from "../../../../components/DrawerTemplate";
import GiftCards from "./Redeem/GiftCards";

const RedeemCard: FC = () => {

    const pages = [
        {
            page: GiftCards,
            displayName: "Tree Card",
            logo: logo,
        },
    ]

    return (
        <div>
            <DrawerTemplate pages={pages} />
        </div>
    )
}

export default RedeemCard;