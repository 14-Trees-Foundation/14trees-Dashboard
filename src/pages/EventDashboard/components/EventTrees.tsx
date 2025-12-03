import { Box, FormControl, FormControlLabel, FormGroup, IconButton, InputBase, Paper, Radio, useMediaQuery, Button, TextField } from "@mui/material"
import CardGrid, { CardGridTheme } from "../../../components/CardGrid";
import { Tree } from "../../../types/tree";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import { LoadingButton } from "@mui/lab";
import { Search } from "@mui/icons-material";

interface ThemeConfig {
    gradient: string;
    textAreaBg: string;
    textColor: string;
    logoColor: string;
}

interface EventTreesProps {
    eventId: number,
    eventLinkId?: string,
    eventType: string,
    defaultViewMode?: 'illustrations' | 'profile',
    currentTheme?: ThemeConfig,
    onTotalChange?: (total: number) => void,
}

interface EventTreesLinkConfig {
    formControlColor?: string;
    loadingButtonSx?: Record<string, unknown>;
    loadingButtonColor?: "inherit" | "primary" | "secondary" | "success" | "info" | "warning" | "error";
    cardTheme?: CardGridTheme;
}

const DEFAULT_FORM_CONTROL_COLOR = "success";
const DEFAULT_LOADING_BUTTON_COLOR: EventTreesLinkConfig["loadingButtonColor"] = "success";
const DEFAULT_THEME_COLOR = "#3f5344";

const EVENT_TREES_CONFIG_BY_LINK_ID: Record<string, EventTreesLinkConfig> = {
    "jjaqyf4c": {
        formControlColor: "#EC7544",
        loadingButtonSx: {
            backgroundcolor: "#EC7544",
            "&:hover": { backgroundColor: "#EC7544" },
        },
        loadingButtonColor: undefined,
        cardTheme: {
            // coverBackgroundColor: "#EC7544",
            // contentBackgroundColor: "#EC7544",
            // nameColor: "#ffffff",
            // typeColor: "#ffffff",
            // linkColor: "#ffffff",
        },
    },
};

const EventTrees: React.FC<EventTreesProps> = ({ eventId, eventLinkId, eventType, defaultViewMode = 'profile', currentTheme, onTotalChange }) => {

    const isMobile = useMediaQuery("(max-width:600px)");
    const isTablet = useMediaQuery("(max-width:900px)");
    const [loading, setLoading] = useState(false);
    const [trees, setTrees] = useState<Tree[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(20);
    const [imageMode, setImageMode] = useState(defaultViewMode === 'illustrations');
    const [searchStr, setSearchStr] = useState('');

    const linkIdKey = eventLinkId ?? "";
    const linkConfig = EVENT_TREES_CONFIG_BY_LINK_ID[linkIdKey] ?? {};
    const formControlColorOverride = linkConfig.formControlColor;
    const formControlColor = formControlColorOverride ?? DEFAULT_THEME_COLOR;
    const radioColorProp = formControlColorOverride ? undefined : DEFAULT_FORM_CONTROL_COLOR;
    const radioSx = formControlColorOverride
        ? { color: formControlColor, '&.Mui-checked': { color: formControlColor } }
        : undefined;
    const labelSx = formControlColorOverride ? { color: formControlColor } : undefined;
    const loadingButtonColor = linkConfig.loadingButtonColor ?? DEFAULT_LOADING_BUTTON_COLOR;
    const loadingButtonSx = linkConfig.loadingButtonSx;

    const cardGridTheme: CardGridTheme | undefined = useMemo(() => {
        return linkConfig.cardTheme;
    }, [linkConfig]);

    useEffect(() => {
        setPage(0);
        setTotal(20);
        setTrees([]);
    }, [searchStr])

    const getTrees = async (eventId: number, offset: number, limit: number) => {
        setLoading(true);
        try {

            let filteredData: any[] = [{
                columnField: 'event_id',
                operatorValue: 'equals',
                value: eventId,
            }];

            if (searchStr.trim() !== '') {
                filteredData.push({
                    columnField: 'assigned_to_name',
                    operatorValue: 'contains',
                    value: searchStr,
                })
            }

            const apiClient = new ApiClient();
            const treesResp = await apiClient.getTrees(offset, limit, filteredData)

            if (offset === 0) setTrees(treesResp.results);
            else setTrees(prev => [...prev, ...treesResp.results]);

            setTotal(treesResp.total);
            if (typeof onTotalChange === 'function') {
                onTotalChange(treesResp.total);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
        setLoading(false);
    }


    useEffect(() => {
        const handler = setTimeout(async () => {
            getTrees(eventId, page * pageSize, pageSize)
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [page, pageSize, eventId, searchStr])

    return (
        <Box sx={{ 
            width: '100%',
            py: isMobile ? 2 : 4,
            px: isMobile ? 1 : 3,
        }}>
            {/* Container with max-width */}
            <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Top toolbar: Search bar + Buttons */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'stretch' : 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    mb: 3,
                }}>
                    {/* Search bar */}
                    <TextField
                        fullWidth={isMobile}
                        value={searchStr}
                        onChange={(e) => { setSearchStr(e.target.value) }}
                        placeholder="Search by name..."
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <IconButton sx={{ p: '10px' }} aria-label="search">
                                    <Search />
                                </IconButton>
                            ),
                        }}
                        sx={{ 
                            flex: isMobile ? 'none' : 1,
                            maxWidth: isMobile ? '100%' : '500px',
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f5f5f0',
                                borderRadius: '28px',
                                '& fieldset': {
                                    borderColor: 'transparent',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(0,0,0,0.1)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: currentTheme?.textColor || '#A33128',
                                },
                            },
                        }}
                    />

                    {/* Buttons */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: 2,
                    }}>
                        {/* <Button
                            variant="contained"
                            sx={{
                                backgroundColor: currentTheme?.textColor || '#A33128',
                                color: '#ffffff',
                                borderRadius: '28px',
                                px: 3,
                                py: 1.2,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: currentTheme?.textColor || '#A33128',
                                    opacity: 0.9,
                                },
                            }}
                        >
                            Add your blessing
                        </Button> */}
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: currentTheme?.textColor || '#A33128',
                                color: '#ffffff',
                                borderRadius: '28px',
                                px: 3,
                                py: 1.2,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: currentTheme?.textColor || '#A33128',
                                    opacity: 0.9,
                                },
                            }}
                            onClick={() => { window.open('https://www.14trees.org/plant-memory', '_blank', 'noopener,noreferrer'); }}
                        >
                            Gift a Tree!
                        </Button>
                    </Box>
                </Box>

                {/* View mode toggle (illustrations vs profile) */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <FormControl component="fieldset">
                        <FormGroup aria-label="position" row>
                            <FormControlLabel
                                value="illustrations"
                                control={
                                    <Radio sx={radioSx} checked={imageMode} onChange={() => setImageMode(true)} />
                                }
                                label="Illustrations"
                                labelPlacement="end"
                                sx={labelSx}
                            />
                            <FormControlLabel
                                value="profile"
                                control={
                                    <Radio sx={radioSx} checked={!imageMode} onChange={() => setImageMode(false)} />
                                }
                                label={eventType === "2" ? "Guardians of Memory" : "Profile Images"}
                                labelPlacement="end"
                                sx={labelSx}
                            />
                        </FormGroup>
                    </FormControl>
                </Box>

                {/* Cards grid container */}
                <Box>
                    <CardGrid
                        loading={loading}
                        padding="24px 0 24px 0"
                        cardTheme={cardGridTheme}
                        cards={trees.map((tree: any) => {
                            let location: string = ''
                            const { hostname, host } = window.location;
                            if (hostname === "localhost" || hostname === "127.0.0.1") {
                                location = "http://" + host + "/profile/" + tree.sapling_id
                            } else {
                                location = "https://" + hostname + "/profile/" + tree.sapling_id
                            }

                            return {
                                id: tree.id,
                                name: tree.assigned_to_name ? tree.assigned_to_name: tree.planted_by,
                                type: tree.plant_type,
                                dashboardLink: location,
                                image: imageMode
                                    ? tree.illustration_s3_path
                                        ? tree.illustration_s3_path
                                        : tree.image
                                    : tree.user_tree_image
                                        ? tree.user_tree_image
                                        : tree.image
                            }
                        })}
                    />
                    {trees.length < total && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
                        <LoadingButton
                            loading={loading}
                            variant="contained"
                            sx={{
                                backgroundColor: currentTheme?.textColor || '#A33128',
                                color: '#ffffff',
                                borderRadius: '28px',
                                px: 4,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: currentTheme?.textColor || '#A33128',
                                    opacity: 0.9,
                                },
                            }}
                            onClick={() => { setPage(prev => prev + 1) }}
                        >
                            Load More Trees
                        </LoadingButton>
                    </div>}
                </Box>
            </Box>
        </Box>
    )
}

export default EventTrees;