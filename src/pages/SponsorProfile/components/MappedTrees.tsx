import { Box, Button, Divider, Typography } from "@mui/material";
import CardGrid from "./CardGrid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import { useParams } from "react-router-dom";

interface MappedTreesProps {
}

const MappedTrees: React.FC<MappedTreesProps> = ({ }) => {
    const { userId } = useParams();

    const [loading, setLoading] = useState(false);
    const [trees, setTrees] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [userName, setUserName] = useState('User');

    const getTrees = async (userId: string, offset: number = 0) => {
        try {
            setLoading(true);
            const apiClient = new ApiClient();
            const response = await apiClient.getMappedTreesForTheUser(Number(userId), offset, 15);
            setTotal(Number(response.total));
            setTrees( prev => [...prev, ...response.results]);

            if (response.results.length > 0 && response.results[0].mapped_user_name) {
                setUserName(response.results[0].mapped_user_name)
            }
        } catch (error: any) {
            toast.error(error.message);                                                                                                                                                                                                                                         
        }
        setLoading(false);
    }

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
                mt={6}
                padding="0 50px"
                style={{
                    height: '90vh',
                    overflowY: 'scroll',
                    scrollbarWidth: 'none', // For Firefox
                    '&::-webkit-scrollbar': { display: 'none' } // For Chrome, Safari
                }}
            >
                <CardGrid
                    loading={loading}
                    cards={trees.map(tree => {
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
                                    ?  tree.illustration_s3_path
                                    : tree.image,
                        }
                    })}
                />
                {userId && total > trees.length && <Button 
                    variant="text"
                    color="success"
                    disabled={loading}
                    onClick={() => { getTrees(userId, trees.length) }}
                >
                    Load More
                </Button>}
            </Box>
        </Box>
    );
}

export default MappedTrees;