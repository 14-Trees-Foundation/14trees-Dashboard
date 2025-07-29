import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, IconButton, InputBase, Paper, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import CardGrid from "../../../components/CardGrid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import { useLocation, useParams } from "react-router-dom";
import { Search } from "@mui/icons-material";

interface MappedTreesProps {
}

const MappedTrees: React.FC<MappedTreesProps> = ({ }) => {
    const { id } = useParams();

    const location = useLocation();
    const isGroupView = location.pathname.includes('/group/');
    console.log(location.pathname)
    const [searchStr, setSearchStr] = useState('');
    const [filteredTrees, setFilteredTrees] = useState<any[]>([]);
    const [filter, setFilter] = useState<'default' | 'memorial' | 'all'>('default');
    const [viewType, setViewType] = useState<'user' | 'group'>('user');
    const [loading, setLoading] = useState(false);
    const [trees, setTrees] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [name, setName] = useState('');


    const getTrees = async (id: string, offset: number = 0) => {
        try {
            setLoading(true);
            const apiClient = new ApiClient();
            let response;

            if (isGroupView) {
                response = await apiClient.getMappedTreesForGroup(Number(id), offset, 200);
                console.log("Group API Response:", response);
            } else {
                response = await apiClient.getMappedTreesForTheUser(Number(id), offset, 200);
                console.log("User API Response:", response);
            }

            // Check if response and response.results are valid arrays
            const name = isGroupView
                ? (response as any).group_name || 'Group'
                : (response as any).results?.[0]?.sponsor_user_name || 'User';

            setName(name);
            setTotal(Number(response.total));
            setTrees(prev => [...prev, ...response.results]);

        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }


    /* const handleViewTypeChange = (
         event: React.MouseEvent<HTMLElement>,
         newViewType: 'user' | 'group',
     ) => {
         if (newViewType !== null) {
             setViewType(newViewType);
             setTrees([]); // Reset trees when switching views
             if (userId) getTrees(userId); // Refetch data for new view type
         }
     }; */

    useEffect(() => {

        const handler = setTimeout(() => {
            let filteredData: any[] = [];
            if (filter === 'all') filteredData = trees;
            else if (filter === 'memorial') filteredData = trees.filter(tree => tree.event_type === '2');
            else filteredData = trees.filter(tree => tree.event_type !== '2');

            if (searchStr.trim() !== '') {
                filteredData = filteredData.filter(item => item.assigned_to_name?.toLowerCase()?.includes(searchStr.toLocaleLowerCase()));
            }

            setFilteredTrees(filteredData)
        }, 300);

        return () => {
            clearTimeout(handler);
        }
    }, [searchStr, filter, trees])

    useEffect(() => {
        if (id) getTrees(id);
    }, [id]);


    return (
        <Box p={1}>
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        p: -2,
                        width: '100%',
                        position: 'absolute',
                        margin: '0 auto',
                    }}
                >
                    <Typography mb={1} variant="h4" color={"#323232"}>
                        {name}'s Dashboard
                    </Typography>
                    <Divider />
                </Box>
            </Box>
            <Box
                mt={8}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <FormControl component="fieldset">
                    <FormGroup aria-label="position" row>
                        <FormControlLabel
                            value="default"
                            control={<Checkbox checked={filter === 'default' || filter === 'all'} onChange={() => { setFilter('default') }} />}
                            label="F&F Trees"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="memorial"
                            control={<Checkbox checked={filter === 'memorial' || filter === 'all'} onChange={() => { setFilter('memorial') }} />}
                            label="Memorial Trees"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="all"
                            control={<Checkbox checked={filter === 'all'} onChange={() => { setFilter(prev => prev === 'all' ? 'default' : 'all') }} />}
                            label="Show All"
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
            <Box
                mt={1}
                padding="0 50px"
                className={"no-scrollbar"}
                style={{
                    height: '83vh',
                    overflowY: 'scroll',
                }}
            >
                <CardGrid
                    loading={loading}
                    cards={filteredTrees.map(tree => {
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
                            image: tree.illustration_s3_path
                                ? tree.illustration_s3_path
                                : tree.image,
                        }
                    })}
                />
                {id && total > trees.length && <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Button
                        variant="contained"
                        color="success"
                        disabled={loading}
                        onClick={() => { getTrees(id, trees.length) }}
                    >
                        Load More
                    </Button>
                </Box>}
            </Box>
        </Box>
    );
}

export default MappedTrees;