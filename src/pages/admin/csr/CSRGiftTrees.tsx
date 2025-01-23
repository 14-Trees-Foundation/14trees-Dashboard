import { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import CSRGiftTreesCards from "./CSRTreeCards";
import { Card, Empty } from "antd";
import { createStyles, makeStyles } from "@mui/styles";
import { Tree } from "../../../types/tree";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { AccountCircleOutlined, CardGiftcard, Wysiwyg } from "@mui/icons-material";

interface CSRGiftTreesProps {
    groupId: number
}

const CSRGiftTrees: React.FC<CSRGiftTreesProps> = ({ groupId }) => {

    const classes = useStyle();

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [trees, setTrees] = useState<Record<number, Tree>>({});
    const [totalRecords, setTotalRecords] = useState(10);

    const getTrees = async (offset: number, limit: number, groupId: number) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const treesResp = await apiClient.getMappedGiftTrees(offset, limit, groupId);
            
            setTrees(prev => {
                const treesData = {...prev};
                for (let i = 0; i < treesResp.results.length; i++) {
                    treesData[treesResp.offset + i] = treesResp.results[i];
                }

                return treesData;
            })
            setTotalRecords(Number(treesResp.total));

        } catch (error: any) {
            toast.error(error.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            for (let i = page * pageSize; i < Math.min((page + 1) * pageSize, totalRecords); i++) {
                if (!trees[i]) {
                    getTrees(page*pageSize, pageSize, groupId);
                    return;
                }
            }
        }, 300);

        return () => { clearTimeout(handler); }
    }, [trees, page, pageSize, groupId, totalRecords])

    return (
        <Box mt={5} id="your-wall-of-gift-trees">
            <Typography variant="h5" ml={1} mr={2}>Your Wall of Gift Trees</Typography>
            <Typography variant="subtitle1" ml={1} mb={1}>View your gift trees.</Typography>
            <Grid container spacing={3} padding={3}>
                {Object.values(trees).map((tree) => (
                    <Grid item xs={12} sm={6} md={3} key={tree.id}>
                        <Card
                            hoverable
                            className={classes.customCard}
                            cover={<img height={240} alt={tree.plant_type} src={tree.illustration_s3_path
                                ? tree.illustration_s3_path
                                : tree.image} style={{ backgroundColor: 'white', width: '100%', objectFit: 'cover' }} />}
                        >
                            <div style={{ width: "100%", zIndex: 10 }}>
                                <Typography variant="h6" gutterBottom noWrap>
                                    {tree.sapling_id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    Plant Type: {tree.plant_type}
                                </Typography>
                                {tree.assigned_to_name && <Typography variant="body2" color="text.secondary" noWrap>
                                    Gifted to: {tree.assigned_to_name}
                                </Typography>}
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => {  }}
                                    style={{ textTransform: 'none', margin: '10px 5px 0 0' }}
                                    startIcon={tree.assigned_to ? <Wysiwyg /> : <CardGiftcard />}
                                >
                                    {tree.assigned_to ? 'View Summary' : 'Gift Tree'}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => { 
                                        let location: string = ''
                                        const { hostname, host } = window.location;
                                        if (hostname === "localhost" || hostname === "127.0.0.1") {
                                            location = "http://" + host + "/profile/" + tree.sapling_id
                                        } else {
                                            location = "https://" + hostname + "/profile/" + tree.sapling_id
                                        }

                                        window.open(location);
                                    }}
                                    style={{ textTransform: 'none', margin: '10px 5px 0 0' }}
                                    startIcon={<AccountCircleOutlined />}
                                >
                                    Profile
                                </Button>
                            </div>
                        </Card>
                    </Grid>
                ))}

                {loading && [1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (<Grid item xs={12} sm={6} md={4} key={item}>
                    <Card loading style={{ backgroundColor: '#b7edc47a', border: 'none', overflow: 'hidden', borderRadius: '20px' }}></Card>
                </Grid>))}
            </Grid>
            
            {Object.values(trees).length < totalRecords && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => { setPage(page + 1) }}
                >
                    Load More Trees
                </Button>
            </div>}
        </Box>
    );
}

const useStyle = makeStyles((theme) =>
    createStyles({
        customCard: {
            backgroundColor: '#b7edc47a',
            border: 'none',
            overflow: 'hidden',
            borderRadius: '20px',
            transition: 'background-color 0.3s',
            '&:hover': {
                backgroundColor: '#8fcf9f7a !important', /* New hover color */
                cursor: 'pointer',
                transition: 'background-color 0.3s ease', /* Smooth transition */
            },
        },
    })
);

export default CSRGiftTrees;