import { ArrowForwardIos } from "@mui/icons-material";
import { Box, Button, Divider, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FC, useState } from "react";
import SponsorUserForm from "./SponsorUser";
import { User } from "../../../../types/user";
import { Group } from "../../../../types/Group";
import SponsorGroupForm from "./SponsorGroup";
import ImagePicker from "../../../../components/ImagePicker";
import CardDetails from "./CardDetailsForm";

interface GiftCardMessages {
    primaryMessage: string
    secondaryMessage: string
    eventName: string
    plantedBy: string
    logoMessage: string
}

interface SponsorFormInterface {
    messages: GiftCardMessages,
    onMessagesChange: (messages: GiftCardMessages) => void
    user: User | null;
    onUserChange: (user: User | null) => void
    group: Group | null;
    onGroupChange: (group: Group | null) => void
    onLogoChange: (logo: File | null) => void   
}

const SponsorForm: FC<SponsorFormInterface> = ({ messages, user, group, onUserChange, onGroupChange, onLogoChange, onMessagesChange }) => {
    const [formOption, setFormOption] = useState<"0" | "1">("1");
    const [inputOption, setInputOption] = useState<"user" | "group" | 'logo' | 'gift'>("user");

    const handleChange = (event: React.MouseEvent<HTMLElement>, newFormOption: "0" | "1") => {
        setFormOption(newFormOption);
    };

    return (
        <div style={{ flex: 1 }}>
            {/* <ToggleButtonGroup
                color="primary"
                value={formOption}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
                style={{ margin: 10, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <ToggleButton value="0" color="success" >Individual Sponsor</ToggleButton>
                <ToggleButton value="1" color="success" >Corporate Sponsor</ToggleButton>
            </ToggleButtonGroup> */}

            <Box
                style = {{ display: 'flex' }}
            >
                <Box
                    style={{ padding: 20, display: 'flex', flexDirection: 'column', width: '50%' }}
                >
                    <Button 
                        variant='text' 
                        color='inherit' 
                        style={{ textTransform: 'none', textAlign: 'left', fontSize: 20, }}
                        sx={{ marginX: 0 }}
                        endIcon={<ArrowForwardIos sx={{ fontSize: 18 }} />}
                        onClick={() => { setInputOption("user") }}
                    >Sponsor Details</Button>
                    <Button 
                        variant='text' 
                        color='inherit' 
                        style={{ textTransform: 'none', textAlign: 'left', fontSize: 20, }}
                        sx={{ marginX: 0 }}
                        endIcon={<ArrowForwardIos sx={{ fontSize: 18 }} />}
                        onClick={() => { setInputOption("logo") }}
                    >Company/Organization Logo</Button>
                    {formOption === '1' && <Button 
                        variant='text' 
                        color='inherit' 
                        style={{ textTransform: 'none', textAlign: 'left', fontSize: 20  }}
                        endIcon={<ArrowForwardIos sx={{ fontSize: 18 }} />}
                        onClick={() => { setInputOption("group") }}
                    >Corporate Details</Button>}
                    <Button 
                        variant='text' 
                        color='inherit' 
                        style={{ textTransform: 'none', textAlign: 'left', fontSize: 20, }}
                        sx={{ marginX: 0 }}
                        endIcon={<ArrowForwardIos sx={{ fontSize: 18 }} />}
                        onClick={() => { setInputOption("gift") }}
                    >Gift Card Details</Button>
                </Box>
                <Divider orientation='vertical' flexItem style={{ zIndex: 1, backgroundColor: 'black' }} />
                <Box style={{ padding: 50, width: '50%' }}>
                    { inputOption === 'user' && <SponsorUserForm user={user} onSelect={onUserChange}/>}
                    { inputOption === 'group' && <SponsorGroupForm group={group} onSelect={onGroupChange}/>}
                    { inputOption === 'logo' && <ImagePicker onChange={onLogoChange} width={300} height={200}/>}
                    { inputOption === 'gift' && <CardDetails 
                        primaryMessage={messages.primaryMessage}
                        secondaryMessage={messages.secondaryMessage}
                        eventName={messages.eventName}
                        plantedBy={messages.plantedBy}
                        logoMessage={messages.logoMessage}
                        onChange={(primary, secondary, event, planted, logo) => onMessagesChange({ primaryMessage: primary, secondaryMessage: secondary, eventName: event, plantedBy: planted, logoMessage: logo })}
                    />}
                </Box>
            </Box>
        </div>
    );
}

export default SponsorForm;