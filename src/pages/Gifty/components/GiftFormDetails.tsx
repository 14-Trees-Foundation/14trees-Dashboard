import { CardGiftcard, Event, ParkOutlined, People } from "@mui/icons-material";
import { Box, CircularProgress, Paper, Typography, useTheme } from "@mui/material";
import DynamicTable from "../../../components/dynamic/Table";
import { useEffect, useRef, useState } from "react";
import ApiClient from "../../../api/apiClient/apiClient";

interface GiftFormDetailsProps {
    data: any
}

const GiftFormDetails: React.FC<GiftFormDetailsProps> = ({ data }) => {
    const theme = useTheme();

    const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const cardDetailsRef = useRef({
        presentationId: null as string | null,
        slideId: null as string | null,
        card_message: "",
        userName: undefined as string | undefined,
        giftedBy: undefined as string | undefined,
        eventType: "3",
    })

    useEffect(() => {

        const handler = setTimeout(() => {
            if (data.card_message) cardDetailsRef.current.card_message = data.card_message;
            if (data.gifted_by) cardDetailsRef.current.giftedBy = data.gifted_by;

            handleGeneratePreview();
        }, 1000)

        return () => { clearTimeout(handler) }
    }, [data])

    const handleGeneratePreview = async () => {
        if (isGeneratingPreview) return;

        setIsGeneratingPreview(true);
        try {

            const apiClient = new ApiClient();
            if (cardDetailsRef.current.presentationId && cardDetailsRef.current.slideId) {
                await apiClient.updateGiftCardTemplate(cardDetailsRef.current.slideId, cardDetailsRef.current.card_message, "", undefined, null, cardDetailsRef.current.userName, cardDetailsRef.current.giftedBy);
            } else {
                const resp = await apiClient.generateCardTemplate("", cardDetailsRef.current.card_message, "", null, null, cardDetailsRef.current.userName, cardDetailsRef.current.giftedBy, null, true);
                cardDetailsRef.current.presentationId = resp.presentation_id;
                cardDetailsRef.current.slideId = resp.slide_id;
            }

            setPreviewUrl(
                `https://docs.google.com/presentation/d/${cardDetailsRef.current.presentationId}/embed?rm=minimal&slide=id.${cardDetailsRef.current.slideId}&timestamp=${Date.now()}`
            );
        } catch (error) {
            console.error("Error generating preview:", error);
        } finally {
            setIsGeneratingPreview(false);
        }
    };

    return (
        <div>
            {/* Donor Details */}
            {(data.sponsor_name || data.sponsor_email) && <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ParkOutlined sx={{ color: '#2e7d32' }} /> Sponsor Details
                </Typography>
                <Box sx={{ ml: 4 }}>
                    {data.sponsor_name && <Typography sx={{ mb: 1 }}><strong>Name:</strong> {data.sponsor_name}</Typography>}
                    {data.sponsor_email && <Typography><strong>Email:</strong> {data.sponsor_email}</Typography>}
                </Box>
            </Paper>}

            {data.recipients && <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <People sx={{ color: '#2e7d32' }} /> Gift Recipients
                </Typography>
                <DynamicTable data={data.recipients} />
            </Paper>}

            {(data.occasion_name || data.occasion_type || data.gifted_by || data.gifted_on) && <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Event sx={{ color: '#2e7d32' }} /> Occasion Details
                </Typography>
                <Box sx={{ ml: 4 }}>
                    {data.occasion_name && <Typography sx={{ mb: 1 }}><strong>Occasion Name:</strong> {data.occasion_name}</Typography>}
                    {data.occasion_type && <Typography><strong>Occasion Type:</strong> {data.occasion_type}</Typography>}
                    {data.gifted_by && <Typography><strong>Gifted By:</strong> {data.gifted_by}</Typography>}
                    {data.gifted_on && <Typography><strong>Gifted On:</strong> {data.gifted_on}</Typography>}
                </Box>
            </Paper>}

            {data.card_message && <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CardGiftcard sx={{ color: '#2e7d32' }} /> Gift Card Details
                </Typography>
                <Box sx={{ ml: 4 }}>
                    {data.card_message && <Typography sx={{ mb: 1, whiteSpace: "pre-wrap" }}><strong>Card Message:</strong> {data.card_message}</Typography>}
                </Box>
                <Box
                    sx={{
                        minHeight: "250px",
                        maxHeight: "600px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {isGeneratingPreview ? (
                        <Box
                            sx={{
                                textAlign: "center",
                                py: 8,
                            }}
                        >
                            <CircularProgress sx={{ color: "green", mb: 2 }} />
                            <Typography sx={{ color: "gray.600" }}>
                                Generating your card preview...
                            </Typography>
                        </Box>
                    ) : previewUrl ? (
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                minHeight: "250px",
                                maxHeight: "540px",
                                maxWidth: "960px",
                                aspectRatio: "16/9",
                                border: "1px solid",
                                borderColor: "gray.200",
                                borderRadius: 2,
                            }}
                        >
                            <iframe
                                src={previewUrl}
                                title="Gift card preview"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                    borderRadius: "8px",
                                }}
                            />
                        </Box>
                    ) : (
                        <Typography sx={{ color: "gray.500", py: 8 }}>
                            Your card preview will appear here
                        </Typography>
                    )}
                </Box>
            </Paper>}
        </div>
    );
}

export default GiftFormDetails;