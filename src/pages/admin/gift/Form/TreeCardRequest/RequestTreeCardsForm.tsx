import { AppBar, Box, Button, Toolbar } from "@mui/material";
import PlantationForm from "./PlantationForm";
import SponsorForm from "./SponsorForm";
import CardDetails from "./CardMessagingForm";
import { useState } from "react";
import RecipientForm from "./RecipientForm";
import PaymentForm from "./PaymentForm";
import DashboardDetailsForm from "./DashboardDetailsForm";

interface RequestTreeCardsFormProps {

}

const RequestTreeCardsForm: React.FC<RequestTreeCardsFormProps> = ({ }) => {

    const [giftedBy, setGiftedBy] = useState('');
    const [eventType, setEventType] = useState('');

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed" sx={{ backgroundColor: '#4db281' }}>
                    <Toolbar>
                        <Box sx={{ flexGrow: 1 }}>
                        </Box>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <div
                style={{
                    marginTop: 100,
                    paddingLeft: 200,
                    paddingRight: 200,
                }}
            >
                <PlantationForm />
                <SponsorForm giftedByChange={value => setGiftedBy(value)} />
                <DashboardDetailsForm defaultGiftedByName={giftedBy} onEventTypeChange={eventType => { setEventType(eventType) }} />
                <CardDetails eventType={eventType} />
                <RecipientForm />
                <PaymentForm />
            </div>
        </div>
    )
};


export default RequestTreeCardsForm;