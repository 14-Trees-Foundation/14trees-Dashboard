import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, useMediaQuery, Grid, Card, CardContent } from "@mui/material";
import { Carousel } from "antd";
import loriFayzanDashboardImage from "../../../assets/event-dashboard/Lori_Fayzan_Dashboard.jpg";
import { createStyles, makeStyles } from "@mui/styles";
import logo from "../../../assets/logo_white_small.png";
// Tree species images (replace these paths with your actual asset imports)
import logoTree from "../../../assets/logoTree.png";
import speciesImg1 from "../../../assets/planting_illustration.jpg";
import speciesImg2 from "../../../assets/neem.png";
import { Event, EventMessage } from "../../../types/event";
import { EventImage } from "../../../types/eventImage";
import EventMemories from "./EventMemories";
import EventTrees from "./EventTrees";
import EventMessages from "./EventMessages";
import EventImgMsg from "./EventImgMsg";
import ApiClient from "../../../api/apiClient/apiClient";
import background from "../../../assets/background.png";

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
    const [totalTrees, setTotalTrees] = useState<number | null>(null);
    const [eventTreeTypesCount, setEventTreeTypesCount] = useState<number | null>(null);
    const [eventTreeTypes, setEventTreeTypes] = useState<Array<{ label: string; illustration?: string }>>([]);

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
    const isWeddingType = event.type === "5";
    
    // Helper to render backend message preserving \r and \n as line breaks
    const renderMessageWithLineBreaks = (msg: string) => {
        const lines = msg.split(/\r\n|\n|\r/);
        return lines.map((line, idx) => (
            <span key={idx}>
                {line}
                {idx < lines.length - 1 && <br />}
            </span>
        ));
    };
    
    // Theme configuration based on theme_color
    const themeConfigs = {
        red: {
            gradient: 'linear-gradient(180deg, #C4392E 0%, #79221B 100%)',
            textAreaBg: '#F4DCD8',
            textColor: '#79221B',
            logoColor: '#FFD53F',
            navColor: '#C4392E',
        },
        yellow: {
            gradient: 'linear-gradient(180deg, #F6B02C 0%, #ED6B11 100%)',
            textAreaBg: '#F1E8DB',
            textColor: '#A33128',
            logoColor: '#A33128',
            navColor: '#F6B02C',
        },
        green: {
            gradient: 'linear-gradient(180deg, #4CA60F 0%, #183C11 100%)',
            textAreaBg: '#E0F6D1',
            textColor: '#183C11',
            logoColor: '#E0F6D1',
            navColor: '#4CA60F',
        },
      blue: {
        gradient: 'linear-gradient(180deg, #5E82DB 0%, #361777 100%)',
        textAreaBg: '#C1D1F9',
        textColor: '#3E2C8B',
        logoColor: '#D7E3FF',
        navColor: '#5E82DB',
      },
      pink: {
        gradient: 'linear-gradient(180deg, #B04EBB 0%, #C24144 100%)',
        textAreaBg: '#F7CFFB',
        textColor: '#520E57',
        logoColor: '#FDE7FF',
        navColor: '#B04EBB',
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
        // const legacyImages = event.memories || [];
        let legacyImages = [
          6, 1, 3, 5, 4, 8, 9, 1, 11, 12, 13, 14, 15, 23, 16, 17, 18, 19, 20, 21, 22,
        ].map((number) => {
          return `https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory${number}.jpg`;
        });
        const combinedImages = [ ...apiEventImages, ...legacyImages];
        // Remove duplicates in case the same image exists in both sources
        const uniqueImages = Array.from(new Set(combinedImages));
        setAllEventImages(uniqueImages);
    }, [event.memories, apiEventImages]);

    // Fetch tree types (species) with counts for this event using ApiClient base URL
    useEffect(() => {
      const fetchTreeTypes = async () => {
        try {
          const data = await apiClient.getTreeTypes(0, 500, [
            { columnField: 'event_id', operatorValue: 'equals', value: event.id }
          ]);
          const total = Number(data.total ?? 0);
          setEventTreeTypesCount(isNaN(total) ? null : total);
          const results: any[] = Array.isArray(data.results) ? data.results : [];
          const mapped = results.map(r => ({ label: String(r.plant_type || ''), illustration: r.illustration_s3_path || undefined }));
          setEventTreeTypes(mapped);
        } catch (e) {
          console.error('Species fetch error', e);
          setEventTreeTypesCount(null);
          setEventTreeTypes([]);
        }
      };
      fetchTreeTypes();
    }, [event.id]);

    // Images to show in carousels: exclude event poster if present
    const memoryImages = (event.event_poster && allEventImages.length > 0)
      ? allEventImages.filter((url) => url !== event.event_poster)
      : allEventImages;

    // Default species images for fallbacks
    const defaultSpecies: Array<{ src: string; label: string }> = [
      { src: speciesImg1, label: 'Species' },
      { src: speciesImg2, label: 'Species' },
      { src: speciesImg1, label: 'Species' },
      { src: speciesImg2, label: 'Species' },
    ];

    // Build species list: only API items with images; fallback to defaults if empty
    // Validate image URLs by preloading; exclude broken images to avoid blank cards
    const [validatedSpeciesImages, setValidatedSpeciesImages] = useState<Array<{ src: string; label: string }>>([]);
    useEffect(() => {
      const items: Array<{ src: string; label: string }> = eventTreeTypes
        .filter(s => Boolean(s.illustration))
        .map(s => ({ src: s.illustration as string, label: s.label }));
      if (items.length === 0) {
        setValidatedSpeciesImages([]);
        return;
      }
      let isCancelled = false;
      const preload = (url: string) => new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
      Promise.all(items.map(i => preload(i.src))).then(results => {
        if (isCancelled) return;
        const filtered = items.filter((_, idx) => results[idx]);
        setValidatedSpeciesImages(filtered);
      });
      return () => { isCancelled = true; };
    }, [eventTreeTypes]);

    const species: Array<{ src: string; label: string }> = (() => {
      const base = validatedSpeciesImages.length > 0 ? validatedSpeciesImages : defaultSpecies;
      return base;
    })();

    // Blessings state
    const [blessings, setBlessings] = useState<Array<{ id: number; user_name: string; message: string; created_at?: string }>>([]);
    const [isBlessingsLoading, setIsBlessingsLoading] = useState<boolean>(false);
    const [isBlessingModalOpen, setIsBlessingModalOpen] = useState<boolean>(false);
    const [newBlessingText, setNewBlessingText] = useState<string>("");
    const [newBlessingName, setNewBlessingName] = useState<string>("");

    // Fetch blessings for the event via getEventMessages
    useEffect(() => {
      const fetchBlessings = async () => {
        try {
          setIsBlessingsLoading(true);
          const messages = await apiClient.events.getEventMessages(event.link || String(event.id));
          setBlessings(messages || []);
        } catch (err) {
          console.error('Failed to fetch blessings', err);
        } finally {
          setIsBlessingsLoading(false);
        }
      };
      fetchBlessings();
    }, [event.id, event.link]);

    const addBlessing = async () => {
      const text = newBlessingText.trim();
      const name = newBlessingName.trim();
      if (!text || !name) return;
      const words = text.split(/\s+/).filter(Boolean);
      if (words.length > 150) return;
      try {
        const data = await apiClient.events.createEventMessage(event.id, text, name);
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

    if (isWeddingType) {
        return (
          <>
            {/* Header: Logo + Name inline (sticky) - outside main container */}
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
                  onClick={() => window.open('https://www.14trees.org/', '_blank', 'noopener')}
                  sx={{
                    width: '80%',
                    height: '80%',
                    position: 'relative',
                    left: isMobile ? '5px' : '20px',
                    bottom: isMobile ? '5px' : '8px',
                    objectFit: 'contain',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                  role="link"
                  aria-label="14 Trees website"
                />
              </Box>

              {/* Vertical divider */}
              {!isMobile && (
                <Box sx={{ 
                  width: 3, 
                  height: 80, 
                  backgroundColor: currentTheme.textColor, 
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
                    color: currentTheme.textColor,
                    fontFamily: '"Scotch Text", Georgia, serif',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    fontSize: { xs: '26px', sm: '40px', md: '54.7px' },
                    lineHeight: '100%',
                    textAlign: 'left',
                  }}
                >
                  {event.name}
                </Typography>
              </Box>
            </Box>

          <Box
            p={0}
            sx={{
              width: "100%",
              maxWidth: '100vw',
              margin: "0",
              background: currentTheme.gradient,
              minHeight: isMobile ? '100%' : '100vh',
              overflowX: 'hidden',
              boxSizing: 'border-box'
            }}
          >
            
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 5,
                alignItems: "stretch",
                padding: isMobile ? "8px 20px" : "40px",
                width: isMobile ? '100%' : '95%',
                margin: "0 auto",
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
                {/* Background area - ensure visible height on mobile */}
                <Box
                  sx={{
                    width: '100%',
                    height: isMobile ? 280 : '100%',
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
                        {renderMessageWithLineBreaks(event.message)}
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
                  {isLoadingImages ? (
                    <Typography variant="body2" sx={{ color: currentTheme.textColor }}>
                      Loading images...
                    </Typography>
                  ) : (
                    <EventMemories imageUrls={memoryImages} />
                  )}
                </Box>
              </Box>
            </Box>

            {/* About and Map Section */}
            <Box
              sx={{
                display: "flex",
                margin: "auto",
                width: isMobile ? "100%" : "90%",
                maxWidth: '100%',
                justifyContent: "space-between",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 4,
                padding: isMobile ? "8px 20px" : "16px 40px",
                marginBottom: 3,
              }}
            >
              {/* Map Section */}
              {event.location && event.location.lat && event.location.lng && (
                <Box
                  sx={{
                    width: isMobile ? "90%" : "50%",
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
                      src={`https://maps.google.com/maps?q=${event.location.lat},${event.location.lng}&t=k&z=15&ie=UTF8&iwloc=&output=embed`}
                      allowFullScreen
                    />
                  </Box>
                </Box>
              )}
              {/* Divider with endpoints and center marker showing grove age */}
             
              
              {/* About Section */}
              <Box
                sx={{
                  width: isMobile ? "82%" : (event.location && event.location.lat && event.location.lng ? "50%" : "100%"),
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
                        {/* Marker at beginning */}
                        <Box sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translate(-50%, -50%)', width: 18, height: 18, borderRadius: '50%', bgcolor: currentTheme.textColor || '#8c1f1f', border: '2px solid white' }} />
                      </Box>

                      {/* Planting date text below */}
                      {(() => {
                        const eventDate = new Date(event.event_date as any);
                        const formatted = eventDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
                        return (
                          <Typography sx={{ mt: 2, color: '#ffffff',
                          fontSize: isMobile ? '13px' : '24px', textAlign: 'center', fontWeight: 600 }}>
                            {`This grove was planted on ${formatted}`}
                          </Typography>
                        );
                      })()}
                    </Box>
                  </Box>
                </Box>
              )}

            {/* Species cards section: title, responsive cards, subtitle */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Box sx={{ width: isMobile ? '100%' : '90%', px: isMobile ? 0 : 0 }}>
                <Typography
                  variant={isMobile ? 'h6' : 'h4'}
                  sx={{ color: currentTheme.textAreaBg, fontFamily: 'serif', fontWeight: 700, textAlign: 'center', mb: 2 }}
                >
                  {`${(totalTrees ?? 150)} Trees Planted in this grove`}
                </Typography>

                <Box sx={{ width: '100%' }}>
                  {(() => {
                    const tilesPerSlide = isMobile ? 1 : 4;
                    const slides: Array<Array<{ src?: string; label: string }>> = [];
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
                      <Carousel autoplay={autoplayEnabled} dots style={{ width: '100%' }}>
                        {slides.map((slide, sIdx) => (
                          <div key={sIdx}>
                            <Box sx={{
                              display: 'grid',
                              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(4, 1fr)' },
                              gap: 2,
                            }}>
                              {slide.map((sp, idx) => (
                                <Card
                                  key={idx}
                                  sx={{
                                    height: { xs: 220, sm: '55vh' },
                                    borderRadius: 3,
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                                    backgroundImage: `url(${sp.src})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                  }}
                                />
                              ))}
                            </Box>
                          </div>
                        ))}
                      </Carousel>
                    );
                  })()}
                </Box>

                <Typography variant={isMobile ? 'h6' : 'h4'}
                  sx={{ color: currentTheme.textAreaBg, fontFamily: 'serif', fontWeight: 700, textAlign: 'center', mb: 2 }}>
                  {(eventTreeTypesCount)} Tree Species native to the region
                </Typography>
              </Box>
            </Box>

            {/* Blessings Section */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Box sx={{ width: isMobile ? '100%' : '90%', px: isMobile ? '20px' : 0 }}>
                {/* Blessings carousel: 3 cards on desktop, 1 on mobile */}
                {(() => {
                  type BlessingT = { id: number; user_name: string; message: string; created_at?: string };
                  const chunkSize = isMobile ? 1 : 3;
                  const chunks: Array<Array<BlessingT | null>> = [];
                  for (let i = 0; i < blessings.length || i === 0; i += chunkSize) {
                    const group: Array<BlessingT | null> = blessings.slice(i, i + chunkSize) as Array<BlessingT>;
                    while (group.length < chunkSize) group.push(null);
                    chunks.push(group);
                    if (blessings.length === 0) break;
                  }

                  return (
                    <Carousel dots arrows style={{ width: '95%', margin: '0 auto' }}>
                      {chunks.map((group, slideIdx) => (
                        <div key={`blessings-slide-${slideIdx}`}>
                          <Grid container spacing={1.25} sx={{ alignItems: 'stretch', justifyContent: 'center' }}>
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
                                      overflowY: item ? 'auto' : 'hidden', 
                                      display: 'flex', 
                                      alignItems: item ? 'flex-start' : 'center', 
                                      justifyContent: item ? 'flex-start' : 'center',
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
                                      ) : item ? (
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
                                      ) : (
                                        <Box sx={{
                                          border: '1px dashed rgba(0,0,0,0.15)',
                                          borderRadius: 2,
                                          height: '100%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: currentTheme.textColor
                                        }}>
                                          <Typography 
                                            variant={isMobile ? 'body2' : 'body1'}
                                            sx={{ fontSize: isMobile ? '14px' : '16px' }}
                                          >
                                            No blessing added
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
                  );
                })()}

                {/* Add blessing button - left aligned on desktop, centered on mobile */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                  <Box
                    role="button"
                    aria-label="Add your blessing"
                    onClick={() => setIsBlessingModalOpen(true)}
                    sx={{
                      width: { xs: '90%', md: 308 },
                      height: { xs: 48, md: 60 },
                      px: { xs: 2, md: '44px' },
                      py: { xs: '11px', md: '11px' },
                      gap: '10px',
                      borderRadius: '12px',
                      backgroundColor: '#ffffff',
                      color: currentTheme.textColor,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      fontFamily: { xs: 'inherit', md: '"DM Serif Text", serif' },
                      fontWeight: { xs: 600, md: 400 },
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '14px', md: '28px' },
                      lineHeight: { xs: 'normal', md: '100%' },
                      letterSpacing: '0%',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Add your blessing!
                  </Box>
                </Box>

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
                            Submit Blessing
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}
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
                  onTotalChange={(t) => setTotalTrees(t)}
                />
              </Box>
            </Box>
          </Box>
          </>
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