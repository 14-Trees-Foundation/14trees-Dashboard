import { FC, useEffect, useState } from "react";
import { TextField, Typography } from "@mui/material";

const defaultMessages = {
    primary: 'We are immensely delighted to share that a tree has been planted in your name at the 14 Trees Foundation, Pune. This tree will be nurtured in your honour, rejuvenating ecosystems, supporting biodiversity, and helping offset the harmful effects of climate change.',
    secondary: 'We invite you to visit 14 Trees and firsthand experience the growth and contribution of your tree towards a greener future.',
    logo: 'Gifted by 14 Trees in partnership with'
}

interface CardDetailsProps {
    primaryMessage: string,
    secondaryMessage: string,
    eventName: string,
    plantedBy: string,
    logoMessage: string
    onChange: (primaryMessage: string, secondaryMessage: string, eventName: string, plantedBy: string, logoMessage: string) => void
}

const CardDetails: FC<CardDetailsProps> = ({ primaryMessage, secondaryMessage, eventName, plantedBy, logoMessage, onChange }) => {

    const [primary, setPrimary] = useState(primaryMessage || defaultMessages.primary);
    const [secondary, setSecondary] = useState(secondaryMessage || defaultMessages.secondary);
    const [event, setEvent] = useState(eventName);
    const [planted, setPlanted] = useState(plantedBy);
    const [logo, setLogo] = useState(logoMessage || defaultMessages.logo);

    useEffect(() => {
        onChange(primary, secondary, event, planted, logo);
    }, [primary, secondary, event, planted, logo])

    return (
        <div style={{ padding: '10px 10px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <Typography variant='h6'>Please provide the messages to use on gift card: </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>Primary Message</Typography>
                <TextField 
                    multiline
                    value={primary}
                    onChange={(e) => setPrimary(e.target.value)}
                    size="small"
                />
                <Typography variant="body1" sx={{ mt: 2 }}>Secondary Message</Typography>
                <TextField 
                    multiline
                    value={secondary}
                    onChange={(e) => setSecondary(e.target.value)}
                    size="small"
                />
                <Typography variant="body1" sx={{ mt: 2 }}>Event Name</Typography>
                <TextField 
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    size="small"
                />
                <Typography variant="body1" sx={{ mt: 2 }}>Planted By</Typography>
                <TextField 
                    value={planted}
                    onChange={(e) => setPlanted(e.target.value)}
                    size="small"
                />
                <Typography variant="body1" sx={{ mt: 2 }}>Logo Message</Typography>
                <TextField 
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    size="small"
                />
            </div>
        </div>
    )
}

export default CardDetails;