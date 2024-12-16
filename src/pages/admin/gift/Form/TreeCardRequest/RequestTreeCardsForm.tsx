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

    const [messages, setMessages] = useState({ primaryMessage: "", secondaryMessage: "", eventName: "", eventType: undefined as string | undefined, plantedBy: "", logoMessage: "" });
    const [presentationId, setPresentationId] = useState<string | null>(null)
    const [slideId, setSlideId] = useState<string | null>(null)

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
                <SponsorForm />
                <DashboardDetailsForm />
                <CardDetails 
                    messages={messages}
                    request_id="123xyzabc1"
                    presentationId={presentationId}
                    slideId={slideId}
                    onChange={messages => { setMessages(messages) }}
                    onPresentationId={(presentationId: string, slideId: string) => { setPresentationId(presentationId); setSlideId(slideId); }}
                />
                <RecipientForm />
                <PaymentForm />
            </div>
        </div>
    )
};


export default RequestTreeCardsForm;