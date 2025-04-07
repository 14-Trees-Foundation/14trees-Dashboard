import { Box, Button, FormControl, FormControlLabel, FormGroup, IconButton, InputBase, Paper, Radio, useMediaQuery } from "@mui/material"
import CardGrid from "../../../components/CardGrid";
import { Tree } from "../../../types/tree";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import { LoadingButton } from "@mui/lab";
import { Search } from "@mui/icons-material";

interface EventTreesProps {
    eventId: number
}


const EventTrees: React.FC<EventTreesProps> = ({ eventId }) => {

    const isMobile = useMediaQuery("(max-width:600px)");
    const [loading, setLoading] = useState(false);
    const [trees, setTrees] = useState<Tree[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(20);
    const [imageMode, setImageMode] = useState(true);
    const [searchStr, setSearchStr] = useState('');

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
                            value="illustation"
                            control={<Radio color="success" checked={imageMode} onChange={() => { setImageMode(true) }} />}
                            label="Illustations"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="profile"
                            control={<Radio color="success" checked={!imageMode} onChange={() => { setImageMode(false) }} />}
                            label="Profile Images"
                            labelPlacement="end"
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
                        name: tree.assigned_to_name,
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
                    color="success"
                    onClick={() => { setPage(prev => prev + 1) }}
                >
                    Load More Trees
                </LoadingButton>
            </div>}
        </Box>
    )
}

export default EventTrees;