import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, IconButton, InputBase, Paper, Typography } from "@mui/material";
import CardGrid from "../../../components/CardGrid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import { useParams } from "react-router-dom";
import { Search } from "@mui/icons-material";

interface MappedTreesProps {
}

const MappedTrees: React.FC<MappedTreesProps> = ({ }) => {
    const { userId } = useParams();

    const [searchStr, setSearchStr] = useState('');
    const [filteredTrees, setFilteredTrees] = useState<any[]>([]);
    const [filter, setFilter] = useState<'default' | 'memorial' | 'all'>('default');
    const [loading, setLoading] = useState(false);
    const [trees, setTrees] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [userName, setUserName] = useState('User');

    const getTrees = async (userId: string, offset: number = 0) => {
        try {
            setLoading(true);
            const apiClient = new ApiClient();
            const response = await apiClient.getMappedTreesForTheUser(Number(userId), offset, 200);
            setTotal(Number(response.total));
            setTrees(prev => [...prev, ...response.results]);

            if (response.results.length > 0 && response.results[0].mapped_user_name) {
                setUserName(response.results[0].mapped_user_name)
            }
        } catch (error: any) {
            toast.error(error.message);
        }
        setLoading(false);
    }

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
        if (userId) getTrees(userId);
    }, [userId]);

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
                    <Typography mb={1} variant="h4" color={"#323232"}                                                                                                                                                                                                                                                                                                                                                       >{userName}'s Dashboard</Typography>
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
                        onChange={(e) =>{  setSearchStr(e.target.value) }}
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search name"
                        inputProps={{ 'aria-label': 'search friends & family members' }}
                    />
                </Paper>
            </Box>
            <Box
                mt={1}
                padding="0 50px"
                style={{
                    height: '83vh',
                    overflowY: 'scroll',
                    scrollbarWidth: 'none', // For Firefox
                   // '&::-webkit-scrollbar': { display: 'none' } // For Chrome, Safari
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
                {userId && total > trees.length && <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Button
                        variant="contained"
                        color="success"
                        disabled={loading}
                        onClick={() => { getTrees(userId, trees.length) }}
                    >
                        Load More
                    </Button>
                </Box>}
            </Box>
        </Box>
    );
}

export default MappedTrees;