import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Divider, useMediaQuery, Card } from "@mui/material";
import { Carousel } from "antd";
import loriFayzanDashboardImage from "../../../assets/event-dashboard/Lori_Fayzan_Dashboard.jpg";
import { createStyles, makeStyles } from "@mui/styles";
import logo from "../../../assets/logo_white_small.png";
import greenSprihLogo from "../../../assets/GreenSprihLogo.png";
// Tree species images (replace these paths with your actual asset imports)
import speciesImg1 from "../../../assets/planting_illustration.jpg";
import speciesImg2 from "../../../assets/neem.png";
import { Event, EventMessage } from "../../../types/event";
import { EventImage } from "../../../types/eventImage";
import EventMemories from "./EventMemories";
import EventTrees from "./EventTrees";
import EventMessages from "./EventMessages";
import EventImgMsg from "./EventImgMsg";
import EventBlessings from "./EventBlessings";
import EventTreeSpecies from "./EventTreeSpecies";
import EventHeader from "./EventHeader";
import EventPosterMessageMemories from "./EventPosterMessageMemories";
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
    const isNewEventType = event.type === "5" || event.type === "6"; // New event types for wedding and alumni events
    
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

    const getLandingImage = (event_id: number) => {
        switch (event_id) {
            case 8245:
                return  isMobile ? "https://14treesplants.s3.ap-south-1.amazonaws.com/events/landing_images/aayushi_wedding_landing_page_poster_phone.png" :
                "https://14treesplants.s3.ap-south-1.amazonaws.com/events/landing_images/aayushi_wedding_landing_page_poster.jpg";
            case 8251:
                return "https://14treesplants.s3.ap-south-1.amazonaws.com/events/landing_images/jayasree_adhiraj_wedding_grove.jpg";
            // default:
            //     return "https://14treesplants.s3.ap-south-1.amazonaws.com/events/default.jpg";
        }
    }
  // Prefer the server-provided landing image if available, otherwise fall back to id-based mapping
  const landingImageUrl = (isMobile && event.landing_image_mobile_s3_path) ? 
                  event.landing_image_mobile_s3_path 
                  : event.landing_image_s3_path ?? getLandingImage(event.id);
    
    // Theme configuration based on theme_color
    const themeConfigs = {
        white: {
            gradient: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)',
            textAreaBg: '#FCDDB3',
            textColor: '#454134', 
            logoColor: '#454134',
            navColor: '#FFFFFF',
        },
        red: {
            gradient: 'linear-gradient(180deg, #A03336 0%, #7E1F37 100%)',
            textAreaBg: '#F4DCD8',
            textColor: '#79221B', 
            logoColor: '#E5DBB8',
            navColor: '#611E1F',
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
    // Determine logo/background color for the logo box. For white theme, use black background per request.
    const logoBackgroundColor = (currentTheme.logoColor ?? (currentTheme.gradient?.split(',')[0].split('(')[1].trim()));
    

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
        // const combinedImages = [ ...apiEventImages, ...legacyImages];
        const combinedImages = [ ...apiEventImages];
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
          const mapped = results.map(r => ({ label: String(r.plant_type || ''), illustration: r.info_card_s3_path || undefined }));
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

    // Image lightbox state
    const [imageLightboxOpen, setImageLightboxOpen] = useState<boolean>(false);
    const [lightboxImageUrl, setLightboxImageUrl] = useState<string>("");

    const openImageLightbox = (url: string) => {
      setLightboxImageUrl(url);
      setImageLightboxOpen(true);
    };

    const closeImageLightbox = () => {
      setImageLightboxOpen(false);
      setLightboxImageUrl("");
    };

    const [showAddBlessing, setShowAddBlessing] = useState(() => {
      // Check the show_blessings flag from the event object
      // Default to true if not specified for backwards compatibility
      return event.show_blessings !== false;
    });

    const [showPoster, setShowPoster] = useState(() => {
      if (event.id === 8245 || event.id === 8251 || event.landing_image_s3_path!== null || event.landing_image_mobile_s3_path!== null) {
        return true;
      }
      return false;
    });
    const [posterSliding, setPosterSliding] = useState(false);
    const mainContentRef = useRef<HTMLDivElement | null>(null);
 
    useEffect(() => {
       // prevent background scrolling while poster is visible
       document.body.style.overflow = showPoster ? 'hidden' : '';
       return () => { document.body.style.overflow = ''; };
     }, [showPoster]);
 
     const handlePosterClick = () => {
      // Trigger slide-up animation
      setPosterSliding(true);
      
      // Remove poster after animation completes
      setTimeout(() => {
        setShowPoster(false);
        setPosterSliding(false);
      }, 800); // Match animation duration
     };
 
    if (isNewEventType) {
        return (
          <>

            {/* Header: Logo + Name inline (sticky) - outside main container */}
            <EventHeader
              eventName={event.name}
              currentTheme={currentTheme}
              logoBackgroundColor={logoBackgroundColor}
            />


          <Box
            ref={mainContentRef}
            p={0}
            sx={{
              width: "100%",
              maxWidth: '100vw',
              margin: "0",
              // paddingLeft: 30,
              paddingX: isMobile ? 0: 16,
              background: currentTheme.gradient,
              minHeight: isMobile ? '100%' : '100vh',
              overflowX: 'hidden',
              boxSizing: 'border-box'
            }}
          >

            <EventPosterMessageMemories
              eventPoster={event.event_poster}
              eventName={event.name}
              eventMessage={event.message}
              memoryImages={memoryImages}
              isLoadingImages={isLoadingImages}
              currentTheme={currentTheme}
              onImageClick={openImageLightbox}
              renderMessageWithLineBreaks={renderMessageWithLineBreaks}
            />

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
                          fontSize: { xs: '18px', md: '18px' },
                          lineHeight: '100%',
                          letterSpacing: 0,
                  }}
                >
                  14 Trees Foundation is a non-profit organisation that believes in a holistic effort for reforestation. We work on three parallels- native ecological revival, employing local people and increasing money flow to rural areas, and bridging the gap between urban dwellers and forests.
                  <br /><br />
                  We believe that a forest can only stand the test of time if these three pillars are aligned.
                  <br /><br />
                  We're thrilled to create a grove for you celebrating your special day!
                  <br /><br />
                  {/* Do check below the tree that's planted for you! */}
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
                      <Box sx={{ width: '100%', height: 4, bgcolor: '#E5DBB8', borderRadius: 2, position: 'relative' }}>
                        {/* Left endpoint */}
                        <Box sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translate(-50%, -50%)', width: 14, height: 14, borderRadius: '50%', bgcolor: '#E5DBB8', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }} />
                        {/* Right endpoint */}
                        <Box sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translate(50%, -50%)', width: 14, height: 14, borderRadius: '50%', bgcolor: '#E5DBB8', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }} />
                        {/* Marker at beginning */}
                        <Box sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translate(-50%, -50%)', width: 18, height: 18, borderRadius: '50%', bgcolor: '#E5DBB8', border: '2px solid white' }} />
                      </Box>

                      {/* Planting date text below */}
                      {(() => {
                        const eventDate = new Date(event.event_date as any);
                        const formatted = eventDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
                        return (
                          <Typography sx={{ mt: 2, color: '#E5DBB8',
                          fontSize: isMobile ? '13px' : '24px', textAlign: 'center', fontWeight: 600 }}>
                            {`This grove was allocated on ${formatted}`}
                          </Typography>
                        );
                      })()}
                    </Box>
                  </Box>
                </Box>
              )}

            {/* Species cards section: title, responsive cards, subtitle */}
            <EventTreeSpecies
              species={species}
              totalTrees={totalTrees}
              eventTreeTypesCount={eventTreeTypesCount}
              validatedSpeciesImages={validatedSpeciesImages}
              currentTheme={currentTheme}
              onImageClick={openImageLightbox}
            />

            {/* Blessings Section */}
            <EventBlessings
              eventId={event.id}
              eventLink={event.link}
              showAddBlessing={showAddBlessing}
              isMobile={isMobile}
              currentTheme={currentTheme}
            />

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

          {/* Image Lightbox Dialog */}
          <Box
            component="div"
            sx={{
              display: imageLightboxOpen ? 'block' : 'none',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.9)',
              zIndex: 9999,
              cursor: 'pointer',
            }}
            onClick={closeImageLightbox}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 10000,
                color: '#fff',
                fontSize: '32px',
                cursor: 'pointer',
                '&:hover': {
                  color: '#ccc',
                },
              }}
              onClick={closeImageLightbox}
            >
              ✕
            </Box>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
              }}
            >
              <Box
                component="img"
                src={lightboxImageUrl}
                alt="Enlarged view"
                sx={{
                  maxWidth: '95%',
                  maxHeight: '95%',
                  objectFit: 'contain',
                  borderRadius: 2,
                }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />
            </Box>
          </Box>

          { showPoster && (
            <div
              onClick={handlePosterClick}
              role="button"
              aria-label="Open event"
                style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                backgroundImage: `url(${landingImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: 9999,
                cursor: 'pointer',
                transform: posterSliding ? 'translateY(-100%)' : 'translateY(0)',
                transition: 'transform 800ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
              aria-hidden="true"
              id="landing-poster-overlay"
            >
              {/* Down arrow hint */}
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
                marginTop: 'auto',
                marginBottom: 48
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 5v14M19 12l-7 7-7-7" stroke="#1f1f1f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ) }
        </>
        );
    }

    return (
        <Box
            p={isMobile ? 0 : 2}
            sx={{
                width: isMobile ? "100vw" : "100%",
                height: "100vh",
                overflow: "auto",
                paddingTop: isMobile ? "16px" : undefined,
            }}
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
                            width: "95%",
                            padding: isMobile ? "16px 8px 12px" : "10px",
                            display: "flex",
                            justifyContent: isMobile ? "center" : "flex-start",
                        }}
                    >
                        <img src={event.link === "ij5h8ow9" ? greenSprihLogo : logo} alt={event.link === "ij5h8ow9" ? "GreenSprih Logo" : "14Trees Logo"} className={classes.img} />
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
            <Box className={classes.content} sx={{ height: 'auto', overflow: 'visible' }}>
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