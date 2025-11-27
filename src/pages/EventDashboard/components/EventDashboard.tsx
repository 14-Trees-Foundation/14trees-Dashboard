import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, useMediaQuery, Grid, Card, CardContent } from "@mui/material";
import logo from "../../../assets/logo_white_small.png";
import loriFayzanDashboardImage from "../../../assets/event-dashboard/Lori_Fayzan_Dashboard.jpg";
import { createStyles, makeStyles } from "@mui/styles";
// Tree species images (replace these paths with your actual asset imports)
import pimpalImg from "../../../assets/image 10.png";
import arjunImg from "../../../assets/image 7.png";
import peepalImg from "../../../assets/image 10.png";
import bargadImg from "../../../assets/image 7.png";
import neemImg from "../../../assets/image 10.png";
import background from "../../../assets/background.png";
import logoTree from "../../../assets/logoTree.png";
import { Event, EventMessage } from "../../../types/event";
import { EventImage } from "../../../types/eventImage";
import EventMemories from "./EventMemories";
import EventTrees from "./EventTrees";
import EventMessages from "./EventMessages";
import EventImgMsg from "./EventImgMsg";
import ApiClient from "../../../api/apiClient/apiClient";

interface EventDashboardProps {
    event: Event;
    eventMessages: EventMessage[];
}

interface EventDashboardLinkConfig {
    showFeaturedImage?: boolean;
    featuredImageSrc?: string;
    featuredImageAlt?: string;
    featuredImageWrapperSx?: Record<string, any>;
    featuredImageStyles?: React.CSSProperties;
    hideHeader?: boolean;
  posterBackgroundSrc?: string;
    memoriesHeadingText?: string;
    memoriesHeadingColor?: string;
    memoriesHeadingAlign?: React.CSSProperties["textAlign"];
    treesHeadingText?: string;
    treesHeadingColor?: string;
}

const EVENT_DASHBOARD_CONFIG_BY_LINK_ID: Record<string, EventDashboardLinkConfig> = {
    "jjaqyf4c": {
        showFeaturedImage: true,
    featuredImageSrc: loriFayzanDashboardImage,
    posterBackgroundSrc: background,
        hideHeader: true,
        memoriesHeadingText: "We’re planting 7 types of native trees",
        memoriesHeadingColor: "#EC7544",
        memoriesHeadingAlign: "center",
        treesHeadingText: "Find your family tree!",
        treesHeadingColor: "#EC7544",
    },
};

const useStyles = makeStyles((theme: any) =>
    createStyles({
        img: {
            width: "50px",
            height: "35px",
            marginRight: "5px",
            [theme.breakpoints.down("480")]: {
                width: "35px",
                height: "35px",
            },
        },
        root: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100vw",
            overflow: "hidden",
            flexWrap: "wrap",
        },
        content: {
            flex: 1,
            padding: "16px",
            overflowY: "auto",
            scrollbarWidth: "thin", // For Firefox
            scrollbarColor: "#c1c1c1 transparent", // For Firefox
            "&::-webkit-scrollbar": {
                width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c1c1c1",
                borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#a1a1a1",
            },
            "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
            },
        },
        messagePaper: {
            padding: "16px",
            marginBottom: "16px",
            borderRadius: "20px !important",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
        },
        featuredImage: {
            width: "100%",
            maxWidth: "960px",
            borderRadius: "24px",
            objectFit: "cover",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
        },
        usersSection: {
            // distinct styling for type 3 participants section
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: "12px",
            padding: "12px",
        },
    }))

const EventDashboard: React.FC<EventDashboardProps> = ({ event, eventMessages }) => {
    const classes = useStyles();
    const isMobile = useMediaQuery("(max-width:600px)");
    const [apiEventImages, setApiEventImages] = useState<string[]>([]);
    const [isLoadingImages, setIsLoadingImages] = useState<boolean>(true);
    const [allEventImages, setAllEventImages] = useState<string[]>([]);

    const apiClient = new ApiClient();
    const linkConfig = EVENT_DASHBOARD_CONFIG_BY_LINK_ID[event.link ?? ""] ?? {};
    const shouldRenderFeaturedImage = Boolean(linkConfig.showFeaturedImage && linkConfig.featuredImageSrc);
    const featuredImageWrapperSx = {
        display: "flex",
        justifyContent: "center",
        padding: isMobile ? "8px 8px 0" : "16px 16px 0",
        ...(linkConfig.featuredImageWrapperSx ?? {}),
    };
    const featuredImageAlt = linkConfig.featuredImageAlt ?? `${event.name} featured`;
    const memoriesHeadingText = linkConfig.memoriesHeadingText ?? (event.type === "2" ? "Memories" : "Event Memories");
    const memoriesHeadingColor = linkConfig.memoriesHeadingColor;
    const memoriesHeadingAlign = linkConfig.memoriesHeadingAlign ?? (isMobile ? "center" : "left");
    const treesHeadingText = linkConfig.treesHeadingText ?? (event.type === "2" ? "Memorial Trees" : "Event Trees");
    const treesHeadingColor = linkConfig.treesHeadingColor;
    const shouldHideHeader = linkConfig.hideHeader ?? false;
    const isType5 = event.type === "5";
    
    // Theme configuration based on theme_color
    const themeConfigs = {
        red: {
            gradient: 'linear-gradient(180deg, #C4392E 0%, #79221B 100%)',
            textAreaBg: '#F4DCD8',
            textColor: '#79221B',
            logoColor: '#FFD53F',
        },
        yellow: {
            gradient: 'linear-gradient(180deg, #F6B02C 0%, #ED6B11 100%)',
            textAreaBg: '#F1E8DB',
            textColor: '#A33128',
            logoColor: '#A33128',
        },
        green: {
            gradient: 'linear-gradient(180deg, #4CA60F 0%, #183C11 100%)',
            textAreaBg: '#E0F6D1',
            textColor: '#183C11',
            logoColor: '#E0F6D1',
        },
      blue: {
        gradient: 'linear-gradient(180deg, #5E82DB 0%, #361777 100%)',
        textAreaBg: '#C1D1F9',
        textColor: '#3E2C8B',
        logoColor: '#D7E3FF',
      },
      pink: {
        gradient: 'linear-gradient(180deg, #B04EBB 0%, #C24144 100%)',
        textAreaBg: '#F7CFFB',
        textColor: '#520E57',
        logoColor: '#FDE7FF',
      },
    };
    
    // Get theme or fallback to green
    const currentTheme = event.theme_color && themeConfigs[event.theme_color]
      ? themeConfigs[event.theme_color]
      : themeConfigs.green;
    
    // Legacy fallback for events without theme_color
    const weddingTheme = {
        primary: '#E53935', // red
        secondary: '#FFD54F' // yellow
    };

    useEffect(() => {
        const fetchEventImages = async () => {
            try {
                setIsLoadingImages(true);
                const images: EventImage[] = await apiClient.events.getEventImages(event.id);
                // Sort images by sequence and extract URLs
                const imageUrls = images
                    .sort((a, b) => a.sequence - b.sequence)
                    .map(img => img.image_url);
                setApiEventImages(imageUrls);
            } catch (error) {
                console.error('Failed to fetch event images:', error);
                setApiEventImages([]);
            } finally {
                setIsLoadingImages(false);
            }
        };

        fetchEventImages();
    }, [event.id]);

    // Combine images from both sources when either changes
    useEffect(() => {
        const legacyImages = event.memories || [];
        const combinedImages = [...legacyImages, ...apiEventImages];
        // Remove duplicates in case the same image exists in both sources
        const uniqueImages = Array.from(new Set(combinedImages));
        setAllEventImages(uniqueImages);
    }, [event.memories, apiEventImages]);

    // Images to show in carousels: exclude event poster if present
    const memoryImages = (event.event_poster && allEventImages.length > 0)
      ? allEventImages.filter((url) => url !== event.event_poster)
      : allEventImages;

    // Species data for cards (imported assets)
    const species = [
      { src: pimpalImg, label: 'Pimpal' },
      { src: arjunImg, label: 'Arjun' },
      { src: peepalImg, label: 'Peepal' },
      { src: bargadImg, label: 'Bargad' },
      { src: neemImg, label: 'Neem' },
    ];

    if (isType5) {
        return (
          <Box
            p={0}
            sx={{
              width: "100%",
              maxWidth: '100vw',
              margin: "0",
              background: currentTheme.gradient,
              minHeight: isMobile ? '100%' : '100vh',
              position: 'relative',
              overflowX: 'hidden',
              boxSizing: 'border-box'
            }}
          >

            {/* Header: Logo box, vertical divider, then Name (sticky) */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: isMobile ? 'center' : 'flex-start', 
              alignItems: 'center', 
              gap: isMobile ? 2 : 3,
              padding: isMobile ? '16px 12px' : '14px 40px',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}>
              {/* Logo box with theme background */}
              <Box sx={{ 
                width: isMobile ? 100 : 110, 
                height: isMobile ? 100 : 110, 
                backgroundColor: currentTheme.gradient.split(',')[0].split('(')[1].trim(),
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Box 
                  component="img" 
                  src={logoTree} 
                  alt="grove logo" 
                  sx={{ 
                    width: '80%', 
                    height: '80%', 
                    objectFit: 'contain',
                  }} 
                />
              </Box>

              {/* Vertical divider - hidden on mobile */}
              {!isMobile && (
                <Box sx={{ 
                  width: 3, 
                  height: 80, 
                  backgroundColor: currentTheme.textColor, 
                  borderRadius: 1,
                  mx: 1,
                }} />
              )}

              {/* Title text - two lines */}
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: isMobile ? 'center' : 'flex-start',
              }}>
                <Typography 
                  variant={isMobile ? 'h5' : 'h4'} 
                  sx={{ 
                    color: currentTheme.textColor,
                    fontFamily: '"Scotch Text", Georgia, serif',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    fontSize: { xs: '32px', sm: '40px', md: '54.7px' },
                    lineHeight: '100%',
                    textAlign: isMobile ? 'center' : 'left',
                  }}
                >
                  {event.name}
                </Typography>
              </Box>
            </Box>
            
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 5,
                alignItems: "stretch",
                padding: isMobile ? "8px" : "40px",
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* Image column (40%) - background image with poster positioned at left 40% top 30% */}
              <Box
                sx={{
                  width: isMobile ? "100%" : "38%",
                  maxWidth: '100%',
                  minHeight: isMobile ? 300 : '80vh',
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  boxSizing: 'border-box',
                  position: 'relative',
                }}
              >
                {/* Background area - optional image (provide via linkConfig.posterBackgroundSrc or linkConfig.featuredImageSrc) */}
                <Box
                  sx={{
                    width: '100%',
                    height: isMobile ? "auto" : "100%",
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundImage: `url(${event?.event_poster || background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  </Box>
              </Box>

              {/* Message + carousel column (60%) */}
              <Box
                sx={{
                  width: isMobile ? "100%" : "60%",
                  maxWidth: '100%',
                  overflow: 'hidden',
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  boxSizing: 'border-box'
                }}
              >
                {/* Message area takes 50% of column height on desktop */}
                <Box
                  sx={{
                    flex: isMobile ? "none" : "0 0 30%",
                    minHeight: isMobile ? "auto" : "45%",
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: currentTheme.textAreaBg,
                    borderRadius: 3,
                    padding: 2,
                  }}
                >
                  {event.message && (
                    <Box sx={{
                        height: "100%",
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        padding: isMobile ? 2 : '3rem 3rem',
                        maxHeight: 260,
                        overflowY: 'auto',
                      }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: currentTheme.textColor,
                          fontFamily: '"Noto Sans", sans-serif',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: { xs: '18px', md: '24px' },
                          lineHeight: '100%',
                          letterSpacing: 0,
                        }}
                      >
                        {event.message}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Memories carousel under message */}
                <Box
                  sx={{
                    flex: "1 1 auto",
                    minHeight: isMobile ? "200px" : "auto",
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {!isLoadingImages && memoryImages.length > 0 ? (
                    <EventMemories imageUrls={memoryImages} />
                  ) : (
                    <Typography variant="body2" sx={{ color: currentTheme.textColor }}>
                      {isLoadingImages ? 'Loading images...' : 'No images available'}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* About and Map Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 4,
                padding: isMobile ? "8px" : "16px 40px",
                marginBottom: 3,
              }}
            >
              {/* Map Section */}
              {event.location && event.location.lat && event.location.lng && (
                <Box
                  sx={{
                    width: isMobile ? "100%" : "50%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: isMobile ? '300px' : '500px',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${event.location.lat},${event.location.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      allowFullScreen
                    />
                  </Box>
                </Box>
              )}
              {/* Divider with endpoints and center marker showing grove age */}
             
              
              {/* About Section */}
              <Box
                sx={{
                  width: isMobile ? "100%" : (event.location && event.location.lat && event.location.lng ? "50%" : "100%"),
                  backgroundColor: currentTheme.textAreaBg,
                  borderRadius: 3,
                  padding: isMobile ? 2 : "4rem 3rem",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: currentTheme.textColor,
                          fontFamily: '"Noto Sans", sans-serif',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: { xs: '18px', md: '24px' },
                          lineHeight: '100%',
                          letterSpacing: 0,
                  }}
                >
                  14 Trees Foundation is a non-profit organisation that believes in a holistic effort for reforestation. We work on three parallels- native ecological revival, employing local people and increasing money flow to rural areas, and bridging the gap between urban dwellers and forests.
                  <br /><br />
                  We believe that a forest can only stand the test of time if these three pillars are aligned.
                  <br /><br />
                  We're thrilled to be a part of {event.name}'s celebrations! We've planted a tree for each participant attending this event.
                  <br /><br />
                  Do check below the tree that's planted for you!
                </Typography>
              </Box>
            </Box>

             {event.event_date && (
                <Box sx={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 3, 
                  mb: 2,
                  position: 'sticky',
                  top: isMobile ? 100 : 110,
                  zIndex: 9,
                }}>
                  <Box sx={{ width: isMobile ? '92%' : '90%', px: 2, py: 2, borderRadius: 2 }}>
                    <Box sx={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {/* Line */}
                      <Box sx={{ width: '100%', height: 4, bgcolor: '#ffffff', borderRadius: 2, position: 'relative' }}>
                        {/* Left endpoint */}
                        <Box sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translate(-50%, -50%)', width: 14, height: 14, borderRadius: '50%', bgcolor: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }} />
                        {/* Right endpoint */}
                        <Box sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translate(50%, -50%)', width: 14, height: 14, borderRadius: '50%', bgcolor: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }} />
                        {/* Middle marker */}
                        <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 18, height: 18, borderRadius: '50%', bgcolor: currentTheme.textColor || '#8c1f1f', border: '2px solid white' }} />
                      </Box>

                      {/* Age text below */}
                      {(() => {
                        const eventDate = new Date(event.event_date as any);
                        const now = new Date();
                        let years = now.getFullYear() - eventDate.getFullYear();
                        const m = now.getMonth() - eventDate.getMonth();
                        if (m < 0 || (m === 0 && now.getDate() < eventDate.getDate())) years--;
                        if (years < 0) years = 0;
                        return (
                          <Typography sx={{ mt: 2, color: '#ffffff', textAlign: 'center', fontWeight: 600 }}>
                            {`Your grove is ${years} year${years === 1 ? '' : 's'} old`}
                          </Typography>
                        );
                      })()}
                    </Box>
                  </Box>
                </Box>
              )}

            {/* Species cards section: title, responsive cards, subtitle */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Box sx={{ width: isMobile ? '100%' : '90%', px: isMobile ? 1 : 0 }}>
                <Typography
                  variant={isMobile ? 'h6' : 'h4'}
                  sx={{ color: currentTheme.textAreaBg, fontFamily: 'serif', fontWeight: 700, textAlign: 'center', mb: 2 }}
                >
                  {`150 Trees Planted in this grove`}
                </Typography>

                <Box
                  sx={{
                    display: { xs: 'flex', sm: 'grid' },
                    gridTemplateColumns: { sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
                    gap: 2,
                    overflowX: { xs: 'auto', sm: 'visible' },
                    pb: 1,
                    '&::-webkit-scrollbar': { display: { xs: 'block', sm: 'none' } },
                  }}
                >
                  {species.map((sp, idx) => (
                    <Card
                      key={idx}
                      sx={{
                        minWidth: { xs: 220, sm: 'auto' },
                        height: { xs: 180, sm: '50vh' },
                        borderRadius: 3,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                        flex: '0 0 auto',
                        backgroundImage: `url(${sp.src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'flex-end',
                      }}
                    >
                    </Card>
                  ))}
                </Box>

                <Typography variant={isMobile ? 'h6' : 'h4'}
                  sx={{ color: currentTheme.textAreaBg, fontFamily: 'serif', fontWeight: 700, textAlign: 'center', mb: 2 }}>
                  7 Tree Species native to the region
                </Typography>
              </Box>
            </Box>

            {/* Users / participants section (distinct styling) */}
            <Box
              sx={{ 
                padding: isMobile ? "8px" : "16px", 
                width: '100%', 
                maxWidth: '100%', 
                boxSizing: 'border-box',
                borderRadius: 2,
                margin: isMobile ? '8px 0' : '0 0 40px',
              }}
            >
              <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                <EventTrees
                  eventId={event.id}
                  eventLinkId={event.link}
                  eventType={event.type}
                  defaultViewMode={event.default_tree_view_mode || "profile"}
                  currentTheme={currentTheme}
                />
              </Box>
            </Box>
          </Box>
        );
    }

    return (
        <Box
            p={isMobile ? 0 : 2}
            sx={isMobile ? {
                width: "100vw",
                overflow: "hidden",
                paddingTop: "16px",
            } : undefined}
        >
            {shouldRenderFeaturedImage && (
                <Box sx={featuredImageWrapperSx}>
                    <img
                        src={linkConfig.featuredImageSrc}
                        alt={featuredImageAlt}
                        className={classes.featuredImage}
                        style={linkConfig.featuredImageStyles}
                    />
                </Box>
            )}
            {!shouldHideHeader && (
                <>
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            padding: isMobile ? "16px 8px 12px" : "10px",
                            display: "flex",
                            justifyContent: isMobile ? "center" : "flex-start",
                        }}
                    >
                        <img src={logo} alt={logo} className={classes.img} />
                        <Typography
                            mb={1}
                            variant={isMobile ? "h5" : "h4"}
                            color={"#323232"}
                            flexWrap={"wrap"}
                            textAlign={isMobile ? "center" : "left"}
                        >
                            {event.name} Dashboard
                        </Typography>
                    </Box>
                    <Divider />
                </>
            )}

            {/* Scrollable Content */}
            <Box className={classes.content}>
                {/* Event Message */}
                {event.message && (
                    <EventImgMsg imageUrls={event.images} message={event.message} />
                )}

                {/* Event Messages */}
                {eventMessages.length > 0 && (
                    <Box sx={{ mt: isMobile ? 3 : 5 }}>
                        <Typography
                            variant={isMobile ? "h6" : "h5"}
                            fontWeight={500}
                            gutterBottom
                            textAlign={isMobile ? "center" : "left"}
                        >
                            {event.type === "2" ? "Messages of Love and Remembrance" : "Event Messages"}
                        </Typography>
                        <Box
                            sx={{
                                overflow: "hidden",
                                height: "220px",
                            }}
                        >
                            <EventMessages messages={eventMessages} />
                        </Box>
                    </Box>
                )}

                {/* Event Memories */}
                {!isLoadingImages && allEventImages.length > 0 && (
                    <>
                        <Box sx={{ mt: isMobile ? 3 : 5 }}>
                            <Typography
                                variant={isMobile ? "h6" : "h5"}
                                fontWeight={500}
                                gutterBottom
                                textAlign={memoriesHeadingAlign}
                                color={memoriesHeadingColor}
                                marginBottom={isMobile ? "1rem" : "2rem"}
                            >
                                {/* {event.type === "2" ? "" : "Event"} Memories */}
                                {memoriesHeadingText}
                            </Typography>
                            <Box
                                sx={{
                                    overflow: "hidden",
                                    height: isMobile ? "250px" : "420px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <EventMemories imageUrls={memoryImages} />
                            </Box>
                        </Box>
                        <Divider sx={{ width: "100%", mt: 2 }} />
                    </>
                )}

                {/* Event Trees */}
                <Box sx={{ marginTop: isMobile ? 3 : 4 }}>
                    <Typography
                        variant={isMobile ? "h6" : "h5"}
                        fontWeight={500}
                        gutterBottom
                        textAlign={isMobile ? "center" : "left"}
                        color={treesHeadingColor}
                    >
                        {/* {event.type === "2" ? "Memorial Trees" : "Event Trees"} */}
                        {treesHeadingText}
                    </Typography>
                    <Box sx={{ maxWidth: "100%" }}>
                        <EventTrees 
                            eventId={event.id} 
                            eventLinkId={event.link}
                            eventType={event.type} 
                            defaultViewMode={event.default_tree_view_mode || 'profile'}
                            currentTheme={currentTheme}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default EventDashboard;