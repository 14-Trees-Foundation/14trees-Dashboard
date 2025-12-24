import React from 'react';
import { Box, Typography, Card, useMediaQuery } from "@mui/material";
import { Carousel } from "antd";

interface TreeSpecies {
    src?: string;
    label: string;
}

interface EventTreeSpeciesProps {
    species: TreeSpecies[];
    totalTrees: number | null;
    eventTreeTypesCount: number | null;
    validatedSpeciesImages: TreeSpecies[];
    currentTheme: {
        gradient: string;
        textAreaBg: string;
        textColor: string;
        logoColor: string;
        navColor: string;
    };
    onImageClick: (src: string) => void;
}

const EventTreeSpecies: React.FC<EventTreeSpeciesProps> = ({
    species,
    totalTrees,
    eventTreeTypesCount,
    validatedSpeciesImages,
    currentTheme,
    onImageClick,
}) => {
    const isMobile = useMediaQuery("(max-width:600px)");

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Box sx={{ width: isMobile ? '100%' : '90%', px: isMobile ? 0 : 0 }}>
                <Box sx={{ width: '100%', px: { xs: 0, md: 0 } }}>
                    {(() => {
                        const tilesPerSlide = isMobile ? 1 : 4;
                        const slides: Array<Array<TreeSpecies>> = [];
                        for (let i = 0; i < species.length; i += tilesPerSlide) {
                            const chunk = species.slice(i, i + tilesPerSlide);
                            // If the last chunk has fewer than 4 items, fill from the beginning
                            if (chunk.length < tilesPerSlide) {
                                const needed = tilesPerSlide - chunk.length;
                                const fillers = species.slice(0, needed);
                                slides.push([...chunk, ...fillers]);
                            } else {
                                slides.push(chunk);
                            }
                        }
                        const autoplayEnabled = validatedSpeciesImages.length >= tilesPerSlide;
                        return (
                            <Carousel autoplay={autoplayEnabled} autoplaySpeed={5000} arrows dots style={{ width: '100%' }}>
                                {slides.map((slide, sIdx) => (
                                    <div key={sIdx}>
                                        <Box sx={{
                                            display: 'grid',
                                            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(4, 1fr)' },
                                            gap: 2,
                                            px: { xs: '15px', sm: 0 },
                                        }}>
                                            {slide.map((sp, idx) => (
                                                <Card
                                                    key={idx}
                                                    onClick={() => sp.src && onImageClick(sp.src)}
                                                    sx={{
                                                        borderRadius: 4,
                                                        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                                                        cursor: 'pointer',
                                                        overflow: 'hidden',
                                                        transition: 'all 0.2s ease',
                                                        // keep a reasonable max height on mobile but allow natural image height
                                                        maxHeight: { xs: 520, sm: '55vh' },
                                                        display: 'flex',
                                                        alignItems: 'stretch',
                                                        p: 0,                        // remove inner padding so image can span full card
                                                        backgroundColor: 'transparent' // avoid white card background showing through
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={sp.src}
                                                        alt={sp.label}
                                                        sx={{
                                                            width: '100%',
                                                            maxHeight: { xs: 920, sm: '55vh' },
                                                            objectFit: 'cover',            // fill the container (no left/right whitespace)
                                                            objectPosition: 'center',
                                                            display: 'block',
                                                            backgroundColor: 'transparent'
                                                        }}
                                                    />
                                                </Card>
                                            ))}
                                        </Box>
                                    </div>
                                ))}
                            </Carousel>
                        );
                    })()}
                </Box>

                <Typography
                    variant={isMobile ? 'h6' : 'h4'}
                    sx={{ color: '#E5DBB8', fontFamily: '"Scotch Text", Georgia, serif', fontWeight: 700, textAlign: 'center', mb: 2, mt: 4 }}
                >
                    {`${(totalTrees ?? 150)} Trees planted in this grove`}
                </Typography>
                <Typography variant={isMobile ? 'h6' : 'h4'}
                    sx={{ color: '#E5DBB8', fontFamily: '"Scotch Text", Georgia, serif', fontWeight: 700, textAlign: 'center', mb: 2 }}>
                    {(eventTreeTypesCount)} Tree species native to the region
                </Typography>
            </Box>
        </Box>
    );
};

export default EventTreeSpecies;
