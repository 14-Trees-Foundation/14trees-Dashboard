import { Box, Divider, Typography } from "@mui/material";
import CardGrid from "./CardGrid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import { useParams } from "react-router-dom";

const extractFileId = (url: string) => {
    const match = url.match(/\/d\/(.+?)\/view/);
    return match ? match[1] : null;
};

interface MappedTreesProps {
}

const MappedTrees: React.FC<MappedTreesProps> = ({ }) => {
    const { userId } = useParams();

    const [trees, setTrees] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [userName, setUserName] = useState('User');

    const getTrees = async (userId: string, offset: number = 0) => {
        try {
            const apiClient = new ApiClient();
            const response = await apiClient.getMappedTreesForTheUser(Number(userId), offset, 20);
            setTotal(Number(response.total));
            setTrees(response.results);

            if (response.results.length > 0 && response.results[0].mapped_user_name) {
                setUserName(response.results[0].mapped_user_name)
            }
        } catch (error: any) {
            toast.error(error.message);
        }
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
                    <Typography variant="h4">{userName}'s Dashboard</Typography>
                    <Divider sx={{ backgroundColor: 'black' }} />
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
                            // image: tree.image,
                            image: (tree.illustration_link && extractFileId(tree.illustration_link))
                                    ?  `https://drive.google.com/uc?export=view&id=${extractFileId(tree.illustration_link)}`
                                    : tree.image,
                        }
                    })}
                />
            </Box>
        </Box>
    );
}

export default MappedTrees;