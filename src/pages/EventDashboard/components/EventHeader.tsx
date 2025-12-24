import React from 'react';
import { Box, Typography, useMediaQuery } from "@mui/material";
import transparentLogo from "../../../assets/transparent_logo.svg";

interface EventHeaderProps {
    eventName: string;
    currentTheme: {
        gradient: string;
        textAreaBg: string;
        textColor: string;
        logoColor: string;
        navColor: string;
    };
    logoBackgroundColor: string;
}

const EventHeader: React.FC<EventHeaderProps> = ({
    eventName,
    currentTheme,
    logoBackgroundColor,
}) => {
    const isMobile = useMediaQuery("(max-width:600px)");

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: isMobile ? 1.5 : 3,
            padding: isMobile ? '10px 20px' : '14px 24px',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            background: currentTheme.navColor
        }}>
            {/* Logo box with theme background */}
            <Box sx={{
                width: isMobile ? 72 : 110,
                height: isMobile ? 72 : 110,
                backgroundColor: 'transparent',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}>
                <Box
                    onClick={() => window.open('https://www.14trees.org/', '_blank', 'noopener')}
                    role="link"
                    aria-label="14 Trees website"
                    sx={{
                        width: '80%',
                        height: '80%',
                        position: 'relative',
                        left: isMobile ? '5px' : '20px',
                        bottom: isMobile ? '5px' : '8px',
                        cursor: 'pointer',
                        display: 'block',
                        marginTop: '20px',
                        // Use the SVG as a mask so we can tint the non-transparent parts via backgroundColor
                        backgroundColor: logoBackgroundColor,
                        WebkitMaskImage: `url(${transparentLogo})`,
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskSize: 'contain',
                        WebkitMaskPosition: 'center',
                        maskImage: `url(${transparentLogo})`,
                        maskRepeat: 'no-repeat',
                        maskSize: 'contain',
                        maskPosition: 'center',
                        // ensure background scales nicely
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                    }}
                />
            </Box>

            {/* Vertical divider */}
            {!isMobile && (
                <Box sx={{
                    width: 3,
                    height: 80,
                    backgroundColor: currentTheme.logoColor,
                    borderRadius: 1,
                    mx: 1,
                }} />
            )}

            {/* Title text */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: isMobile ? 'center' : 'flex-start',
            }}>
                <Typography
                    variant={isMobile ? 'h6' : 'h4'}
                    sx={{
                        color: currentTheme.logoColor,
                        fontFamily: '"Scotch Text", Georgia, serif',
                        fontWeight: 500,
                        fontStyle: 'normal',
                        fontSize: { xs: '26px', sm: '40px', md: '54.7px' },
                        lineHeight: '100%',
                        textAlign: 'left',
                    }}
                >
                    {eventName}
                </Typography>
            </Box>
        </Box>
    );
};

export default EventHeader;
