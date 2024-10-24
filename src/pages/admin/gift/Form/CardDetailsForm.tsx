import { FC, useEffect, useRef, useState } from "react";
import { TextField, Typography } from "@mui/material";
import cardImage from "../../../../assets/gift-card.png";
import ApiClient from "../../../../api/apiClient/apiClient";

const defaultMessages = {
    primary: 'We are immensely delighted to share that a tree has been planted in your name at the 14 Trees Foundation, Pune. This tree will be nurtured in your honour, rejuvenating ecosystems, supporting biodiversity, and helping offset the harmful effects of climate change.',
    secondary: 'We invite you to visit 14 Trees and firsthand experience the growth and contribution of your tree towards a greener future.',
    logo: 'Gifted by 14 Trees in partnership with'
}

interface CardDetailsProps {
    logo_url?: string,
    request_id: string,
    presentationId: string | null,
    slideId: string | null,
    primaryMessage: string,
    secondaryMessage: string,
    eventName: string,
    plantedBy: string,
    logoMessage: string
    onChange: (primaryMessage: string, secondaryMessage: string, eventName: string, plantedBy: string, logoMessage: string) => void
    onPresentationId: (presentationId: string, slideId: string) => void
}

const CardDetails: FC<CardDetailsProps> = ({ logo_url, request_id, presentationId, slideId, primaryMessage, secondaryMessage, eventName, plantedBy, logoMessage, onChange, onPresentationId }) => {

    const [primary, setPrimary] = useState(primaryMessage || defaultMessages.primary);
    const [secondary, setSecondary] = useState(secondaryMessage || defaultMessages.secondary);
    const [event, setEvent] = useState(eventName);
    const [planted, setPlanted] = useState(plantedBy);
    const [logo, setLogo] = useState(logoMessage || defaultMessages.logo);

    const slideIdRef = useRef('');
    const presentationIdIdRef = useRef('');
    const recordRef = useRef({ primary: '', secondary: '', logo: '' })
    const [iframeSrc, setIframeSrc] = useState<string | null>(null);

    const updateSlide = async () => {
        if (!slideIdRef.current || !presentationIdIdRef.current) {
            return;
        }

        const apiClient = new ApiClient();
        await apiClient.updateGiftCardTemplate(presentationIdIdRef.current, slideIdRef.current, recordRef.current.primary, recordRef.current.secondary, recordRef.current.logo, logo_url);
        setIframeSrc(
            `https://docs.google.com/presentation/d/${presentationIdIdRef.current}/embed?rm=minimal&slide=id.${slideIdRef.current}&timestamp=${new Date().getTime()}`
        );
    }

    useEffect(() => {
        const interval = setInterval(() => {
            updateSlide();
        }, 10000);

        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        const generateGiftCard = async () => {
            const apiClient = new ApiClient();
            const resp = await apiClient.generateCardTemplate(request_id, primary, secondary, logo, logo_url, presentationId ?? undefined);
            slideIdRef.current = resp.slide_id;
            presentationIdIdRef.current = resp.presentation_id;

            onPresentationId(resp.presentation_id, resp.slide_id);
            setIframeSrc(
                `https://docs.google.com/presentation/d/${resp.presentation_id}/embed?rm=minimal&slide=id.${resp.slide_id}&timestamp=${new Date().getTime()}`
            )
        }

        if (!presentationId || !slideId) generateGiftCard();
        else {
            presentationIdIdRef.current = presentationId;
            slideIdRef.current = slideId

            setIframeSrc(
                `https://docs.google.com/presentation/d/${presentationId}/embed?rm=minimal&slide=id.${slideId}&timestamp=${new Date().getTime()}`
            )
        }
    }, [presentationId, slideId])

    useEffect(() => {
        onChange(primary, secondary, event, planted, logo);
        recordRef.current = { primary: primary, secondary: secondary, logo: logo }
    }, [primary, secondary, event, planted, logo])

    return (
        <div style={{ display: 'flex', padding: '10px 10px', width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '42%' }}>
                <Typography variant='h6'>Please provide the messages to use on gift card: </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>Primary Message (2)</Typography>
                <TextField
                    multiline
                    value={primary}
                    onChange={(e) => setPrimary(e.target.value)}
                    size="small"
                    inputProps={{ maxLength: 270 }}
                />
                <Typography variant="body1" sx={{ mt: 2 }}>Secondary Message (3)</Typography>
                <TextField
                    multiline
                    value={secondary}
                    onChange={(e) => setSecondary(e.target.value)}
                    size="small"
                    inputProps={{ maxLength: 125 }}
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
                <Typography variant="body1" sx={{ mt: 2 }}>Logo Message (4)</Typography>
                <TextField
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    size="small"
                    inputProps={{ maxLength: 50 }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', maxWidth: '55%' }}>
                {/* <img src={cardImage} /> */}
                {iframeSrc && <iframe
                    src={iframeSrc}
                    width="800"
                    height="600"
                    allowFullScreen
                ></iframe>}
            </div>
        </div>
    )
}

export default CardDetails;