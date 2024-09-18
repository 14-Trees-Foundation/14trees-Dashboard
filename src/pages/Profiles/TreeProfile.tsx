
import { FC } from "react";
import TreePage from "./Tree/Tree";
import ProfileTemplate from "./ProfileTemplate";

interface TreeProfileProps {}

const TreeProfile: FC<TreeProfileProps> = ({ }) => {

    return (
        <ProfileTemplate 
            title="Tree Profile"
            children={TreePage}
        />
    );
}

export default TreeProfile;