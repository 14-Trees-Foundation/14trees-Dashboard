import { useState } from "react";
import SponsorUserForm from "./Form/SponsorUser"
import { User } from "../../../types/user";
import DrawerTemplate from "../../../components/DrawerTemplate";
import logo from "../../../assets/logo_white_small.png";
import { Divider, Typography } from "@mui/material";
import SponsorGroupForm from "./Form/SponsorGroup";
import { Group } from "../../../types/Group";
import ImagePicker from "../../../components/ImagePicker";

const GiftCardForm: React.FC = () => {

    const [user, setUser] = useState<User | null>(null);
    const [group, setGroup] = useState<Group | null>(null);

    return (
        <div>
            <Typography variant="h2">Gift Trees</Typography>
            <Divider style={{ backgroundColor: 'black' }}/>
            <div style={{ 
                display: 'flex',
                justifyContent: 'center',
            }}>
                <div style={{ 
                    padding: '10px 40px', 
                    width: '70%',
                }}>
                    <Typography variant="h6" sx={{ pb: 2, pt: 1 }}>Sponsor Details: </Typography>
                    <SponsorUserForm 
                        user={user}
                        onSelect={user => setUser(user)}
                    />
                    <Divider sx={{ marginTop: '10px' }}/>
                    <Typography variant="h6" sx={{ pb: 2, pt: 1 }}>Corporate Details: </Typography>
                    <SponsorGroupForm 
                        group={group}
                        onSelect={group => setGroup(group)}
                    />

                    <Typography variant='subtitle1' sx={{ pt: 2 }}>Upload the company logo: </Typography>
                    <Typography variant='body1'>If you wish to put more then one logo on the gift card, please create a single image with multiple logos. </Typography>
                    <ImagePicker onChange={(file) => {  }} />
                    <Divider sx={{ marginTop: '10px' }}/>
                </div>
            </div>
        </div>
    )
}


const GiftCardRequest: React.FC = () => {
    return (
        <DrawerTemplate 
            pages={[
                {
                    page: GiftCardForm,
                    displayName: "Gift Card",
                    logo: logo,
                },
            ]}
        />
    )
}

export default GiftCardRequest;