
import { FC } from "react";
import ProfileTemplate from "./ProfileTemplate";
import OrgPage from "./Org/Org";

interface OrgProfileProps {}

const OrgProfile: FC<OrgProfileProps> = ({ }) => {

    return (
        <ProfileTemplate 
            title="Org Profile"
            children={OrgPage}
        />
    );
}

export default OrgProfile;