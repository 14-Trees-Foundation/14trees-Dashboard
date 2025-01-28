import { FC, useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import ApiClient from "../../../../api/apiClient/apiClient";

const defaultMessages = {
    primary: 'We are immensely delighted to share that a tree has been planted in your name at the 14 Trees Foundation, Pune. This tree will be nurtured in your honour, rejuvenating ecosystems, supporting biodiversity, and helping offset the harmful effects of climate change.',
    birthday: 'We are immensely delighted to share that a tree has been planted in your name on the occasion of your birthday at the 14 Trees Foundation, Pune. This tree will be nurtured in your honour, helping offset the harmful effects of climate change.',
    memorial: 'A tree has been planted in the memory of <name here> at the 14 Trees Foundation reforestation site. For many years, this tree will help rejuvenate local ecosystems, support local biodiversity and offset the harmful effects of climate change and global warming.',
    secondary: 'We invite you to visit 14 Trees and firsthand experience the growth and contribution of your tree towards a greener future.',
    logo: 'Gifted by 14 Trees in partnership with'
}

interface Massages {
    primaryMessage: string,
    secondaryMessage: string,
    eventName: string,
    eventType: string | undefined,
    plantedBy: string,
    logoMessage: string,
}

interface CardDetailsProps {
    logo_url?: string | null,
    request_id: string,
    presentationId: string | null,
    slideId: string | null,
    messages: Massages,
    onChange: (messages: Massages) => void
    onPresentationId: (presentationId: string, slideId: string) => void
    saplingId?: string | null
    plantType?: string | null
    userName?: string | null
}

const CardDetails: FC<CardDetailsProps> = ({ logo_url, request_id, presentationId, slideId, messages, saplingId, plantType, userName, onChange, onPresentationId }) => {

    const slideIdRef = useRef('');
    const presentationIdIdRef = useRef('');
    const recordRef = useRef({ primary: '', secondary: '', logo: '' })
    const logoRef = useRef({ logoUrl: undefined as string | null | undefined })
    const [iframeSrc, setIframeSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const giftRef = useRef({ saplingId: undefined as string | null | undefined, plantType: undefined as string | null | undefined, userName: undefined as string | null | undefined })

    const updateSlide = async () => {
        if (!slideIdRef.current || !presentationIdIdRef.current) {
            return;
        }

        setLoading(true);
        const apiClient = new ApiClient();
        await apiClient.updateGiftCardTemplate(slideIdRef.current, recordRef.current.primary, recordRef.current.secondary, recordRef.current.logo, logoRef.current.logoUrl, giftRef.current.saplingId, giftRef.current.userName);
        setIframeSrc(
            `https://docs.google.com/presentation/d/${presentationIdIdRef.current}/embed?rm=minimal&slide=id.${slideIdRef.current}&timestamp=${new Date().getTime()}`
        );
        setLoading(false);
    }

    useEffect(() => {
        const generateGiftCard = async () => {
            setLoading(true);
            const apiClient = new ApiClient();
            const resp = await apiClient.generateCardTemplate(request_id, defaultMessages.primary, defaultMessages.secondary, defaultMessages.logo, logoRef.current.logoUrl, giftRef.current.saplingId, giftRef.current.userName, giftRef.current.plantType);
            slideIdRef.current = resp.slide_id;
            presentationIdIdRef.current = resp.presentation_id;

            onPresentationId(resp.presentation_id, resp.slide_id);
            setIframeSrc(
                `https://docs.google.com/presentation/d/${resp.presentation_id}/embed?rm=minimal&slide=id.${resp.slide_id}&timestamp=${new Date().getTime()}`
            )
            setLoading(false);
        }

        const handler = setTimeout(() => {
            if (!presentationId || !slideId) generateGiftCard();
            else {
                presentationIdIdRef.current = presentationId;
                slideIdRef.current = slideId

                setIframeSrc(
                    `https://docs.google.com/presentation/d/${presentationId}/embed?rm=minimal&slide=id.${slideId}&timestamp=${new Date().getTime()}`
                )
            }
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [presentationId, slideId])

    useEffect(() => {
        logoRef.current.logoUrl = logo_url
        console.log(logo_url);
    }, [logo_url])

    useEffect(() => {
        giftRef.current = { userName, saplingId, plantType }
    }, [userName, saplingId, plantType])

    useEffect(() => {
        const eventMessage = messages.eventType === "2" ? defaultMessages.memorial : messages.eventType === "1" ? defaultMessages.birthday : defaultMessages.primary;
        if (messages.primaryMessage === "" || messages.secondaryMessage === "" || messages.logoMessage === ""
            || ((messages.primaryMessage === defaultMessages.primary || messages.primaryMessage === defaultMessages.birthday || messages.primaryMessage === defaultMessages.memorial) && messages.primaryMessage !== eventMessage)) {
            onChange({
                ...messages,
                primaryMessage: eventMessage,
                secondaryMessage: defaultMessages.secondary,
                logoMessage: defaultMessages.logo,
            })

            recordRef.current.primary = eventMessage;
            recordRef.current.secondary = defaultMessages.secondary;
            recordRef.current.logo = defaultMessages.logo;

            updateSlide();
        } else {
            recordRef.current.primary = messages.primaryMessage;
            recordRef.current.secondary = messages.secondaryMessage;
            recordRef.current.logo = messages.logoMessage;
        }
    }, [messages])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: field, value } = e.target

        onChange({
            ...messages,
            [field]: value,
        })
    }

    return (
        <div style={{ display: 'flex', padding: '10px 10px', width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '42%' }}>
                <Typography variant='h6'>{messages.eventType === "1" ? "Birthday" : messages.eventType === "2" ? "Memorial" : "General"} Gift</Typography>
                <Typography variant='body1' mt={1}>If you would like to tweak/add some personalised touch, change the messaging below: </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}><strong>Primary Message</strong></Typography>
                <TextField
                    multiline
                    name="primaryMessage"
                    value={messages.primaryMessage}
                    onChange={handleChange}
                    size="small"
                    inputProps={{ maxLength: 270 }}
                    FormHelperTextProps={{ style: { textAlign: 'right' } }}
                    helperText={`${270 - messages.primaryMessage.length} characters remaining (max: 270)`}
                />
                <Typography variant="body1" sx={{ mt: 2 }}><strong>Secondary Message</strong></Typography>
                <TextField
                    multiline
                    name="secondaryMessage"
                    value={messages.secondaryMessage}
                    onChange={handleChange}
                    size="small"
                    inputProps={{ maxLength: 125 }}
                    FormHelperTextProps={{ style: { textAlign: 'right' } }}
                    helperText={`${125 - messages.secondaryMessage.length} characters remaining (max: 125)`}
                />
                {logo_url && <Box>
                    <Typography variant="body1" sx={{ mt: 2 }}>Logo Message</Typography>
                    <TextField
                        name="logoMessage"
                        value={messages.logoMessage}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        inputProps={{ maxLength: 50 }}
                    />
                </Box>}
                <Box style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: 20 }}>
                    <Typography mr={1}>Click to refresh the card template on the right:</Typography>
                    <Button onClick={updateSlide} size='small' variant="contained" color="success" disabled={!presentationIdIdRef.current}>
                        Preview
                    </Button>
                </Box>
            </div>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minWidth="800px"
                margin="auto"
                border="2px solid #ccc" // Add border
                height="600px" // Set height to center loading content
            >
                {(!iframeSrc || loading) ? (
                    <Box textAlign="center">
                        <CircularProgress />
                        <Typography variant="h6" marginTop={2}>
                            Loading preview...
                        </Typography>
                        <Typography variant="subtitle1">
                            (This may take a while)
                        </Typography>
                    </Box>
                ) : (
                    <iframe
                        src={iframeSrc}
                        width="800"
                        height="600"
                        allowFullScreen
                        style={{ border: "none" }}
                    ></iframe>
                )}
            </Box>
        </div>
    )
}

export default CardDetails;