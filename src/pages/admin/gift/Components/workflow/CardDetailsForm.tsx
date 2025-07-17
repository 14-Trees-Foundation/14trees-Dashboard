import { FC, useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import ApiClient from "../../../../../api/apiClient/apiClient";

const prefixMessage = "Dear {recipient},\n\n"
const secondaryMessage = 'We invite you to visit 14 Trees and firsthand experience the growth and contribution of your tree towards a greener future.';

const defaultMessages = {
    primary: prefixMessage + 'We are immensely delighted to share that a tree has been planted in your name at the 14 Trees Foundation, Pune. This tree will be nurtured in your honour, rejuvenating ecosystems, supporting biodiversity, and helping offset the harmful effects of climate change.' + "\n\n" + secondaryMessage,
    birthday: prefixMessage + 'We are immensely delighted to share that a tree has been planted in your name on the occasion of your birthday by {giftedBy} at the 14 Trees Foundation, Pune. This tree will be nurtured in your honour, helping offset the harmful effects of climate change.' + "\n\n" + secondaryMessage,
    memorial: prefixMessage + 'A tree has been planted in the memory of <name here> at the 14 Trees Foundation reforestation site. For many years, this tree will help rejuvenate local ecosystems, support local biodiversity and offset the harmful effects of climate change and global warming.' + "\n\n" + secondaryMessage,
    wedding: prefixMessage + 'We are delighted to share that a tree has been planted by {giftedBy} at the 14Trees Foundation, Pune, in your name to celebrate your special union. This tree will be nurtured in your honour, helping offset the harmful effects of climate change.'+ "\n\n" + secondaryMessage,
    anniversary: prefixMessage + 'We are delighted to share that a tree has been planted in your name to celebrate your Wedding Anniversary by {giftedBy} at the 14 Trees Foundation, Pune. This tree will be nurtured in your honour, helping offset the harmful effects of climate change.' + "\n\n" + secondaryMessage,
    festival: prefixMessage + 'We are delighted to share that a tree has been planted in your name to celebrate this joyous occasion by {giftedBy} at the 14 Trees Foundation, Pune. This tree will be nurtured in your honour, helping offset the harmful effects of climate change.' + "\n\n" + secondaryMessage,
    retirement: prefixMessage + 'We are delighted to share that a tree has been planted by {giftedBy} at the 14 Trees Foundation, Pune, in your name to commemorate your retirement. This tree will be nurtured in your honour, helping offset the harmful effects of climate change.' + secondaryMessage,
    logo: 'Gifted by 14 Trees in partnership with'
}

interface Massages {
    primaryMessage: string,
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
    assigneeName?: string | null
    treesCount?: number
    isPersonal?: boolean
}

const CardDetails: FC<CardDetailsProps> = ({ logo_url, request_id, presentationId, slideId, messages, saplingId, plantType, userName, assigneeName, onChange, onPresentationId, treesCount, isPersonal }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const slideIdRef = useRef('');
    const presentationIdIdRef = useRef('');
    const recordRef = useRef({ primary: '', logo: '' })
    const logoRef = useRef({ logoUrl: undefined as string | null | undefined })
    const [iframeSrc, setIframeSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const giftRef = useRef({
        saplingId: undefined as string | null | undefined,
        plantType: undefined as string | null | undefined,
        userName: undefined as string | null | undefined,
        assigneeName: undefined as string | null | undefined,
        giftedBy: undefined as string | null | undefined,
        treesCount: undefined as number | undefined,
        eventType: undefined as string | null | undefined,
    })
    const [msgError, setMsgError] = useState<string>("");

    const updateSlide = async () => {
        if (!slideIdRef.current || !presentationIdIdRef.current) {
            return;
        }

        setLoading(true);
        const apiClient = new ApiClient();
        await apiClient.updateGiftCardTemplate(slideIdRef.current, recordRef.current.primary, recordRef.current.logo, logoRef.current.logoUrl, giftRef.current.saplingId, giftRef.current.userName, giftRef.current.giftedBy,  giftRef.current.treesCount, giftRef.current.assigneeName, giftRef.current.eventType);
        setIframeSrc(
            `https://docs.google.com/presentation/d/${presentationIdIdRef.current}/embed?rm=minimal&slide=id.${slideIdRef.current}&timestamp=${new Date().getTime()}`
        );
        setLoading(false);
    }

    useEffect(() => {
        const generateGiftCard = async () => {
            setLoading(true);
            const apiClient = new ApiClient();
            const resp = await apiClient.generateCardTemplate(request_id, defaultMessages.primary, defaultMessages.logo, logoRef.current.logoUrl, giftRef.current.saplingId, giftRef.current.userName, giftRef.current.giftedBy, giftRef.current.plantType, isPersonal);
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
    }, [presentationId, slideId, isPersonal])

    useEffect(() => {
        logoRef.current.logoUrl = logo_url
    }, [logo_url])

    useEffect(() => {
        giftRef.current = { userName, assigneeName, saplingId, plantType, treesCount, giftedBy: messages.plantedBy, eventType: messages.eventType }
    }, [userName, assigneeName, saplingId, plantType, treesCount, messages])

    useEffect(() => {
        const eventMessage = messages.eventType === "2" ? defaultMessages.memorial : messages.eventType === "1" ? defaultMessages.birthday : messages.eventType === "4" ? defaultMessages.wedding : messages.eventType === "5" ? defaultMessages.anniversary : messages.eventType === "6" ? defaultMessages.festival : messages.eventType === "7" ? defaultMessages.retirement : defaultMessages.primary;
        if (messages.primaryMessage === "" || messages.logoMessage === ""
            || ((messages.primaryMessage === defaultMessages.primary || messages.primaryMessage === defaultMessages.birthday || messages.primaryMessage === defaultMessages.memorial || messages.primaryMessage === defaultMessages.wedding || messages.primaryMessage === defaultMessages.anniversary || messages.primaryMessage === defaultMessages.festival || messages.primaryMessage === defaultMessages.retirement) && messages.primaryMessage !== eventMessage)) {
            onChange({
                ...messages,
                primaryMessage: eventMessage,
                logoMessage: defaultMessages.logo,
            })

            recordRef.current.primary = eventMessage;
            recordRef.current.logo = defaultMessages.logo;

            updateSlide();
        } else {
            recordRef.current.primary = messages.primaryMessage;
            recordRef.current.logo = messages.logoMessage;

            if (!messages.primaryMessage.includes("{recipient}")) setMsgError("Didn't found \"{recipient}\" placeholder text in your message. Recipient's name will not be visible in the generate tree card");
            if (messages.eventType === "1" && !messages.primaryMessage.includes("{giftedBy}")) setMsgError("Didn't found \"{giftedBy}\" placeholder text in your message. Gifted by will not be visible in the generate tree card");
            else setMsgError("");
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
        <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            padding: isMobile ? '0px' : '10px 10px',
            width: '100%',
            justifyContent: 'space-between',
            gap: isMobile ? '20px' : '0'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: isMobile ? '100%' : '42%'
            }}>
                <Typography variant='h6'>{messages.eventType === "1" ? "Birthday" : messages.eventType === "2" ? "Memorial" : "General"} Gift</Typography>
                <Typography variant='body1' mt={1}>If you would like to tweak/add some personalised touch, change the messaging below: </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}><strong>Card Message</strong></Typography>
                <TextField
                    multiline
                    name="primaryMessage"
                    value={messages.primaryMessage}
                    onChange={handleChange}
                    size="small"
                    inputProps={{ maxLength: 430 }}
                    FormHelperTextProps={{ style: { textAlign: 'right' } }}
                    helperText={`${430 - messages.primaryMessage.length} characters remaining (max: 430)`}
                    error={msgError !== ""}
                />
                {msgError !== "" && <Typography mt={1} ml={1} color='crimson' variant='body2'>Warning: {msgError}</Typography>}
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
                    <Typography mr={1}>Click to refresh the card template{isMobile ? '' : ' on the right'}:</Typography>
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
                minWidth={isMobile ? '100%' : '800px'}
                maxWidth={isMobile ? '100%' : '800px'}
                margin={isMobile ? '20px 0 0 0' : 'auto'}
                border="2px solid #ccc"
                height={isMobile ? '300px' : '600px'}
                sx={{
                    overflowX: 'auto',
                    overflowY: 'hidden'
                }}
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
                        width={isMobile ? '100%' : '800'}
                        height={isMobile ? '400' : '600'}
                        allowFullScreen
                        style={{ border: "none", pointerEvents: "none" }}
                        sandbox="allow-scripts allow-same-origin"
                    ></iframe>
                )}
            </Box>
        </div>
    )
}

export default CardDetails;