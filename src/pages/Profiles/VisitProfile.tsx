
import { FC } from "react";
import ProfileTemplate from "./ProfileTemplate";
import VisitPage from "./Visit/Visit";

interface VisitProfileProps {}

const VisitProfile: FC<VisitProfileProps> = ({ }) => {

    return (
        <ProfileTemplate 
            title="Visit Profile"
            children={VisitPage}
        />
    );
}

export default VisitProfile;