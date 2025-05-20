import { FC, useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, Divider, TextField, Typography } from "@mui/material";
import ApiClient from "../../../../../api/apiClient/apiClient";

const prefixMessage = "Dear {recipient},\n\n"
const secondaryMessage = 'We invite you to visit 14 Trees and firsthand experience the growth and contribution of your tree towards a greener future.';

const defaultMessages = {
    primary: prefixMessage + 'We are immensely delighted to share that a tree has been planted in your name at the 14 Trees Foundation, Pune. This tree will be nurtured in your honour, rejuvenating ecosystems, supporting biodiversity, and helping offset the harmful effects of climate change.' + "\n\n" + secondaryMessage,
    birthday: prefixMessage + 'We are immensely delighted to share that a tree has been planted in your name on the occasion of your birthday by {giftedBy} at the 14 Trees Foundation, Pune. This tree will be nurtured in your honour, helping offset the harmful effects of climate change.' + "\n\n" + secondaryMessage,
    memorial: prefixMessage + 'A tree has been planted in the memory of <name here> at the 14 Trees Foundation reforestation site. For many years, this tree will help rejuvenate local ecosystems, support local biodiversity and offset the harmful effects of climate change and global warming.' + "\n\n" + secondaryMessage,
    logo: 'Gifted by 14 Trees in partnership with'
}


interface CardDetailsProps {
    eventType: string
}

const CardDetails: FC<CardDetailsProps> = ({ eventType }) => {

    const slideIdRef = useRef('');
    const presentationIdIdRef = useRef('');
    const recordRef = useRef({ primary: '', logo: '' })
    const logoRef = useRef({ logoUrl: undefined as string | null | undefined })
    const [iframeSrc, setIframeSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        primaryMessage: defaultMessages.primary,
        logoMessage: defaultMessages.logo,
    })
    const [msgError, setMsgError] = useState<string>("");

    const updateSlide = async () => {
        if (!slideIdRef.current || !presentationIdIdRef.current) {
            return;
        }

        setLoading(true);
        const apiClient = new ApiClient();
        await apiClient.updateGiftCardTemplate(slideIdRef.current, recordRef.current.primary, recordRef.current.logo, logoRef.current.logoUrl);
        setIframeSrc(
            `https://docs.google.com/presentation/d/${presentationIdIdRef.current}/embed?rm=minimal&slide=id.${slideIdRef.current}&timestamp=${new Date().getTime()}`
        );
        setLoading(false);
    }

    useEffect(() => {

        const requestId = sessionStorage.getItem("request_id");
        const logoUrl = sessionStorage.getItem("logo_url");
        const presentationId = sessionStorage.getItem("presentation_id");
        const slideId = sessionStorage.getItem("slide_id");
        logoRef.current = { logoUrl }

        if (requestId) {

            const generateGiftCard = async () => {
                setLoading(true);
                const apiClient = new ApiClient();
                const resp = await apiClient.generateCardTemplate(requestId, defaultMessages.primary, defaultMessages.logo, logoUrl);
                slideIdRef.current = resp.slide_id;
                presentationIdIdRef.current = resp.presentation_id;

                setIframeSrc(
                    `https://docs.google.com/presentation/d/${resp.presentation_id}/embed?rm=minimal&slide=id.${resp.slide_id}&timestamp=${new Date().getTime()}`
                )
                setLoading(false);
            }

            if (!presentationId || !slideId) generateGiftCard();
            else {
                presentationIdIdRef.current = presentationId;
                slideIdRef.current = slideId

                setIframeSrc(
                    `https://docs.google.com/presentation/d/${presentationId}/embed?rm=minimal&slide=id.${slideId}&timestamp=${new Date().getTime()}`
                )
            }
        }

    }, [])

    useEffect(() => {
        const eventMessage = eventType === "2" ? defaultMessages.memorial : eventType === "1" ? defaultMessages.birthday : defaultMessages.primary;
        if (formData.primaryMessage === "" || formData.logoMessage === ""
            || ((formData.primaryMessage === defaultMessages.primary || formData.primaryMessage === defaultMessages.birthday || formData.primaryMessage === defaultMessages.memorial) && formData.primaryMessage !== eventMessage)) {
            setFormData({
                ...formData,
                primaryMessage: eventMessage,
                logoMessage: defaultMessages.logo,
            })

            recordRef.current.primary = eventMessage;
            recordRef.current.logo = defaultMessages.logo;

            updateSlide();
        } else {
            recordRef.current.primary = formData.primaryMessage;
            recordRef.current.logo = formData.logoMessage;

            if (!formData.primaryMessage.includes("{recipient}")) setMsgError("Didn't found \"{recipient}\" placeholder text in your message. Recipient's name will not be visible in the generate tree card");
            if (eventType === "1" && !formData.primaryMessage.includes("{giftedBy}")) setMsgError("Didn't found \"{giftedBy}\" placeholder text in your message. Gifted by will not be visible in the generate tree card");
            else setMsgError("");
        }
    }, [eventType, formData])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: field, value } = e.target

        setFormData(prev => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <div>
            <Typography variant="h6">Card Messaging</Typography>
            <Divider sx={{ backgroundColor: 'black', mb: 2 }} />
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '42%' }}>
                    <Typography variant='h6'>{eventType === "1" ? "Birthday" : eventType === "2" ? "Memorial" : "General"} Gift</Typography>
                    <Typography variant='body1' mt={1}>If you would like to tweak/add some personalised touch, change the messaging below: </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}><strong>Card Message</strong></Typography>
                    <TextField
                        multiline
                        name="primaryMessage"
                        value={formData.primaryMessage}
                        onChange={handleChange}
                        size="small"
                        inputProps={{ maxLength: 430 }}
                        FormHelperTextProps={{ style: { textAlign: 'right' } }}
                        helperText={`${430 - formData.primaryMessage.length} characters remaining (max: 430)`}
                        error={msgError !== ""}
                    />
                    {msgError !== "" && <Typography mt={1} ml={1} color='crimson' variant='body2'>Warning: {msgError}</Typography>}
                    {logoRef.current.logoUrl && <Box>
                        <Typography variant="body1" sx={{ mt: 2 }}>Logo Message</Typography>
                        <TextField
                            name="logoMessage"
                            value={formData.logoMessage}
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
                    minWidth="600px"
                    margin="auto"
                    border="2px solid #ccc" // Add border
                    height="450px" // Set height to center loading content
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
                            width="600"
                            height="450"
                            allowFullScreen
                            style={{ border: "none" }}
                        ></iframe>
                    )}
                </Box>
            </div>
        </div>
    )
}

export default CardDetails;