import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Tooltip } from "@mui/material";
import { Carousel } from "antd";
import ApiClient from "../../../api/apiClient/apiClient";

interface EventBlessingsProps {
    eventId: number;
    eventLink: string | null;
    showAddBlessing: boolean;
    isMobile: boolean;
    currentTheme: {
        gradient?: string;
        textAreaBg: string;
        textColor: string;
        logoColor?: string;
        navColor?: string;
    };
}

interface Blessing {
    id: number;
    user_name: string;
    message: string;
    created_at?: string;
}

const EventBlessings: React.FC<EventBlessingsProps> = ({
    eventId,
    eventLink,
    showAddBlessing,
    isMobile,
    currentTheme
}) => {
    const [blessings, setBlessings] = useState<Blessing[]>([]);
    const [isBlessingsLoading, setIsBlessingsLoading] = useState<boolean>(false);
    const [isBlessingModalOpen, setIsBlessingModalOpen] = useState<boolean>(false);
    const [newBlessingText, setNewBlessingText] = useState<string>("");
    const [newBlessingName, setNewBlessingName] = useState<string>("");

    const apiClient = new ApiClient();

    // Fetch blessings for the event via getEventMessages
    useEffect(() => {
        const fetchBlessings = async () => {
            try {
                setIsBlessingsLoading(true);
                const messages = await apiClient.events.getEventMessages(eventLink || String(eventId));
                setBlessings(messages || []);
            } catch (err) {
                console.error('Failed to fetch blessings', err);
            } finally {
                setIsBlessingsLoading(false);
            }
        };
        fetchBlessings();
    }, [eventId, eventLink]);

    const addBlessing = async () => {
        const text = newBlessingText.trim();
        const name = newBlessingName.trim();
        if (!text || !name) return;
        const words = text.split(/\s+/).filter(Boolean);
        if (words.length > 150) return;
        try {
            const data = await apiClient.events.createEventMessage(eventId, text, name);
            if (data && data.id) {
                // Optimistically prepend
                setBlessings(prev => [{ id: data.id, user_name: data.user_name, message: data.message, created_at: data.created_at }, ...prev]);
                setNewBlessingText("");
                setNewBlessingName("");
                setIsBlessingModalOpen(false);
            }
        } catch (err) {
            console.error('Failed to add blessing', err);
        }
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box sx={{ width: isMobile ? '100%' : '90%', px: { xs: '0', md: 0 } }}>
                {/* Blessings carousel: only show if blessings exist */}
                {blessings.length > 0 && (() => {
                    const chunkSize = isMobile ? 1 : 3;
                    const chunks: Array<Array<Blessing>> = [];
                    for (let i = 0; i < blessings.length; i += chunkSize) {
                        const group = blessings.slice(i, i + chunkSize);
                        chunks.push(group);
                    }

                    return (
                        <>
                            <style>{`
                                @media (max-width: 600px) {
                                    .ant-carousel .slick-prev,
                                    .ant-carousel .slick-next {
                                        top: 40% !important;
                                    }
                                }
                            `}</style>
                            <Carousel dots arrows style={{ width: '100%', margin: '0 auto', marginBottom: isMobile ? '12px' : '24px' }}>
                                {chunks.map((group, slideIdx) => (
                                    <div key={`blessings-slide-${slideIdx}`}>
                                        <Grid container spacing={1.25} sx={{ alignItems: 'stretch', justifyContent: 'flex-start', px: { xs: '15px', sm: 0 } }}>
                                            {group.map((item, idx) => (
                                                <Grid item xs={12} sm={6} md={4} key={`bl-card-${slideIdx}-${idx}`}>
                                                    <Card sx={{
                                                        borderRadius: '12px',
                                                        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                                                        backgroundColor: currentTheme.textAreaBg,
                                                        color: currentTheme.textColor,
                                                        width: { xs: '100%' },
                                                        minHeight: { xs: 280, md: 354 },
                                                        maxHeight: { xs: 400, md: 354 },
                                                        opacity: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        margin: '0 auto'
                                                    }}>
                                                        <CardContent sx={{ p: isMobile ? 2.5 : 3.5, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                                            <Box sx={{
                                                                height: '100%',
                                                                overflowY: 'auto',
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                justifyContent: 'flex-start',
                                                                scrollbarWidth: 'thin',
                                                                scrollbarColor: `${currentTheme.textColor}30 transparent`,
                                                                '&::-webkit-scrollbar': {
                                                                    width: '2px',
                                                                },
                                                                '&::-webkit-scrollbar-track': {
                                                                    background: 'transparent',
                                                                },
                                                                '&::-webkit-scrollbar-thumb': {
                                                                    background: 'transparent',
                                                                    borderRadius: '10px',
                                                                    transition: 'background 0.3s ease',
                                                                },
                                                                '&:hover::-webkit-scrollbar-thumb': {
                                                                    background: `${currentTheme.textColor}30`,
                                                                },
                                                                '&::-webkit-scrollbar-thumb:hover': {
                                                                    background: `${currentTheme.textColor}60`,
                                                                },
                                                            }}>
                                                                {isBlessingsLoading ? (
                                                                    <Typography
                                                                        variant={isMobile ? 'body2' : 'body1'}
                                                                        sx={{ color: currentTheme.textColor, textAlign: 'center', fontSize: isMobile ? '14px' : '16px' }}
                                                                    >
                                                                        Loading blessings...
                                                                    </Typography>
                                                                ) : (
                                                                    <Box sx={{
                                                                        color: currentTheme.textColor,
                                                                        borderRadius: 2,
                                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                                        p: 2,
                                                                        width: '100%'
                                                                    }}>
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            sx={{
                                                                                color: currentTheme.textColor,
                                                                                fontSize: isMobile ? '13px' : '22px',
                                                                                fontWeight: 600,
                                                                                mb: 1
                                                                            }}
                                                                        >
                                                                            {item.user_name}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant={isMobile ? 'body2' : 'body1'}
                                                                            sx={{
                                                                                color: currentTheme.textColor,
                                                                                fontSize: isMobile ? '14px' : '20px',
                                                                                lineHeight: 1.6,
                                                                                wordBreak: 'break-word',
                                                                                whiteSpace: 'pre-wrap'
                                                                            }}
                                                                        >
                                                                            {item.message}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </div>
                                ))}
                            </Carousel>
                        </>
                    );
                })()}

                {/* Add blessing button - left aligned on desktop, centered on mobile */}
                {showAddBlessing && (
                    <Box sx={{ mt: { xs: 1.5, md: 3 }, display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Adding blessings is allowed only within 7 days of the event.">
                            <Box
                                role="button"
                                aria-label="Add your blessing"
                                onClick={() => setIsBlessingModalOpen(true)}
                                sx={{
                                    width: { xs: '90%', md: 348 },
                                    height: { xs: 48, md: 60 },
                                    px: { md: '44px' },
                                    py: { md: '11px' },
                                    gap: '10px',
                                    borderRadius: '28px',
                                    backgroundColor: '#ffffff',
                                    color: currentTheme.textColor,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    cursor: 'pointer',
                                    fontFamily: '"Scotch Text", Georgia, serif',
                                    fontWeight: { xs: 600, md: 400 },
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: { xs: '16px', md: '28px' },
                                    lineHeight: { xs: 'normal', md: '100%' },
                                    letterSpacing: '0%',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                {eventLink === "fk2yvs0k" ? "Add your wishes!" : "Bless the bride and groom!"}
                            </Box>
                        </Tooltip>
                    </Box>
                )}

                {/* Blessing popup modal */}
                {isBlessingModalOpen && (
                    <Box
                        aria-label="Add blessing dialog"
                        sx={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 1200,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: { xs: 1, sm: 2 },
                            backdropFilter: 'blur(4px)'
                        }}
                        onClick={() => { setIsBlessingModalOpen(false); setNewBlessingText(''); }}
                    >
                        <Box
                            sx={{
                                width: { xs: '95%', sm: '85%', md: '700px', lg: '800px' },
                                maxWidth: '95vw',
                                backgroundColor: currentTheme.textAreaBg,
                                borderRadius: '16px',
                                p: { xs: 2.5, sm: 3, md: 4 },
                                boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                                display: 'flex',
                                flexDirection: 'column',
                                maxHeight: '90vh',
                                overflow: 'auto'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Typography
                                variant={isMobile ? 'h5' : 'h4'}
                                sx={{
                                    color: currentTheme.textColor,
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    mb: 1,
                                    fontFamily: 'serif',
                                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                                }}
                            >
                                Add your message
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: currentTheme.textColor,
                                    textAlign: 'center',
                                    display: 'block',
                                    mb: { xs: 2, md: 3 },
                                    opacity: 0.8,
                                    fontSize: { xs: '0.875rem', md: '1rem' }
                                }}
                            >
                                Share your blessings and good wishes (max 150 words)
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 2 }}>
                                <input
                                    type="text"
                                    aria-label="Your name"
                                    value={newBlessingName}
                                    onChange={(e) => setNewBlessingName(e.target.value)}
                                    placeholder="Your name"
                                    style={{
                                        width: '100%',
                                        maxWidth: '100%',
                                        height: 48,
                                        borderRadius: 12,
                                        padding: '0 16px',
                                        border: '2px solid rgba(0,0,0,0.12)',
                                        fontSize: isMobile ? '14px' : '16px',
                                        fontFamily: 'inherit',
                                        outline: 'none',
                                        backgroundColor: '#ffffff',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <textarea
                                    aria-label="Blessing message"
                                    value={newBlessingText}
                                    onChange={(e) => setNewBlessingText(e.target.value)}
                                    placeholder="Write your blessing here..."
                                    className="custom-scrollbar"
                                    style={{
                                        width: '100%',
                                        maxWidth: '100%',
                                        minHeight: isMobile ? 180 : 220,
                                        borderRadius: 12,
                                        padding: 16,
                                        border: '2px solid rgba(0,0,0,0.12)',
                                        fontSize: isMobile ? '14px' : '16px',
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                        outline: 'none',
                                        backgroundColor: '#ffffff',
                                        boxSizing: 'border-box',
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: `${currentTheme.textColor}30 transparent`
                                    }}
                                />
                                <style>{`
                                    .custom-scrollbar::-webkit-scrollbar {
                                        width: 2px;
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-track {
                                        background: transparent;
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-thumb {
                                        background: transparent;
                                        border-radius: 10px;
                                        transition: background 0.3s ease;
                                    }
                                    .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                                        background: ${currentTheme.textColor}30;
                                    }
                                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                        background: ${currentTheme.textColor}60;
                                    }
                                `}</style>
                                {(() => {
                                    const wordCount = newBlessingText.trim().split(/\s+/).filter(Boolean).length;
                                    const isOverLimit = wordCount > 150;
                                    return (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: isOverLimit ? '#d32f2f' : currentTheme.textColor,
                                                textAlign: 'right',
                                                mt: 1,
                                                fontWeight: isOverLimit ? 600 : 400,
                                                width: '100%',
                                                fontSize: { xs: '0.75rem', md: '0.875rem' }
                                            }}
                                        >
                                            {wordCount} / 150 words {isOverLimit && '(Limit exceeded)'}
                                        </Typography>
                                    );
                                })()}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: { xs: 'center', sm: 'flex-end' },
                                    gap: { xs: 1.5, sm: 2 },
                                    mt: { xs: 2, md: 3 },
                                    width: '100%',
                                    flexWrap: 'wrap'
                                }}>
                                    <Box
                                        role="button"
                                        aria-label="Cancel"
                                        onClick={() => { setIsBlessingModalOpen(false); setNewBlessingText(''); setNewBlessingName(''); }}
                                        sx={{
                                            color: currentTheme.textColor,
                                            cursor: 'pointer',
                                            px: { xs: 2.5, sm: 3 },
                                            py: { xs: 1.25, sm: 1.5 },
                                            borderRadius: '12px',
                                            border: `2px solid ${currentTheme.textColor}`,
                                            fontWeight: 600,
                                            fontSize: { xs: '14px', md: '16px' },
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0,0,0,0.05)'
                                            },
                                            minWidth: { xs: '100px', sm: '120px' },
                                            textAlign: 'center'
                                        }}
                                    >
                                        Cancel
                                    </Box>
                                    <Box
                                        role="button"
                                        aria-label="Submit blessing"
                                        onClick={addBlessing}
                                        sx={{
                                            backgroundColor: '#ffffff',
                                            color: currentTheme.textColor,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            borderRadius: '12px',
                                            px: { xs: 2.5, sm: 3, md: 4 },
                                            py: { xs: 1.25, sm: 1.5 },
                                            fontWeight: 600,
                                            fontSize: { xs: '14px', md: '16px' },
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                                                transform: 'translateY(-1px)'
                                            },
                                            minWidth: { xs: '100px', sm: '140px' },
                                            textAlign: 'center'
                                        }}
                                    >
                                        Submit
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default EventBlessings;
