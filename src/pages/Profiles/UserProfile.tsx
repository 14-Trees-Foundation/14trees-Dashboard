
import { FC } from "react";
import ProfileTemplate from "./ProfileTemplate";
import UserPage from "./User/User";

interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = ({ }) => {

    return (
        <ProfileTemplate 
            title="User Profile"
            children={UserPage}
        />
    );
}

export default UserProfile;