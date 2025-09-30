import { Box, FormControl, FormControlLabel, FormGroup, IconButton, InputBase, Paper, Radio, useMediaQuery } from "@mui/material"
import CardGrid, { CardGridTheme } from "../../../components/CardGrid";
import { Tree } from "../../../types/tree";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import { LoadingButton } from "@mui/lab";
import { Search } from "@mui/icons-material";

interface EventTreesProps {
    eventId: number,
    eventLinkId?: string,
    eventType: string,
    defaultViewMode?: 'illustrations' | 'profile',
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

const EventTrees: React.FC<EventTreesProps> = ({ eventId, eventLinkId, eventType, defaultViewMode = 'profile' }) => {

    const isMobile = useMediaQuery("(max-width:600px)");
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
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'space-between', flexWrap: 'wrap' }}>
                <FormControl component="fieldset">
                    <FormGroup aria-label="position" row>
                        <FormControlLabel
                            value="illustrations"
                            control={
                                <Radio
                                    color={radioColorProp}
                                    sx={radioSx}
                                    checked={imageMode}
                                    onChange={() => { setImageMode(true) }}
                                />
                            }
                            label={eventType === "2" ? "Blossoms of Legacy" : "Illustrations"}
                            labelPlacement="end"
                            sx={labelSx}
                        />
                        <FormControlLabel
                            value="profile"
                            control={
                                <Radio
                                    color={radioColorProp}
                                    sx={radioSx}
                                    checked={!imageMode}
                                    onChange={() => { setImageMode(false) }}
                                />
                            }
                            label={eventType === "2" ? "Guardians of Memory" : "Profile Images"}
                            labelPlacement="end"
                            sx={labelSx}
                        />
                    </FormGroup>
                </FormControl>
                <Paper
                    component="div"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, backgroundColor: '#e3e3e3bf' }}
                >
                    <IconButton sx={{ p: '10px' }} aria-label="search">
                        <Search />
                    </IconButton>
                    <InputBase
                        value={searchStr}
                        onChange={(e) => { setSearchStr(e.target.value) }}
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search name"
                        inputProps={{ 'aria-label': 'search friends & family members' }}
                    />
                </Paper>
            </Box>
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
                        name: tree.planted_by ? tree.planted_by : tree.assigned_to_name,
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
            {trees.length < total && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <LoadingButton
                    loading={loading}
                    variant="contained"
                    color={loadingButtonColor}
                    onClick={() => { setPage(prev => prev + 1) }}
                    {...loadingButtonSx}
                >
                    Load More Trees
                </LoadingButton>
            </div>}
        </Box>
    )
}

export default EventTrees;