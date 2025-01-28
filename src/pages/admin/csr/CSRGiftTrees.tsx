import { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import CSRGiftTreesCards from "./CSRTreeCards";
import { Card, Empty } from "antd";
import { createStyles, makeStyles } from "@mui/styles";
import { Tree } from "../../../types/tree";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { AccountCircleOutlined, CardGiftcard, OpenInNew, Wysiwyg } from "@mui/icons-material";
import RedeemGiftTreeDialog from "./RedeemGiftTreeDialog";

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
    const [giftDialogVisible, setGiftDialogVisible] = useState(false);
    const [selectedGiftTree, setSelectedGiftTree] = useState<Tree | null>(null);

    const getTrees = async (offset: number, limit: number, groupId: number) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const treesResp = await apiClient.getMappedGiftTrees(offset, limit, groupId);

            setTrees(prev => {
                const treesData = { ...prev };
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
                    getTrees(page * pageSize, pageSize, groupId);
                    return;
                }
            }
        }, 300);

        return () => { clearTimeout(handler); }
    }, [trees, page, pageSize, groupId, totalRecords])

    const getDashboardLink = (tree: Tree) => {
        let location: string = ''
        const { hostname, host } = window.location;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
            location = "http://" + host + "/profile/" + tree.sapling_id
        } else {
            location = "https://" + hostname + "/profile/" + tree.sapling_id
        }

        return location;
    }

    return (
        <Box mt={10} id="your-wall-of-tree-gifts">
            <Typography variant="h4" ml={1} mr={2}>Green Tribute Wall</Typography>
            <Typography variant="subtitle1" ml={1} mb={1}>Celebrate your organization's eco-friendly contributions with a dedicated wall showcasing all the trees gifted. Each entry represents a lasting tribute to sustainability, featuring recipient details, heartfelt messages, and the tree's location.</Typography>
            <Grid container spacing={3} padding={3}>
                {Object.values(trees).map((tree) => (
                    <Grid item xs={12} sm={6} md={3} key={tree.id}>
                        <Card
                            hoverable
                            className={classes.customCard}
                            cover={<img height='auto' alt={tree.plant_type} 
                                src={ tree.template_image 
                                        ? tree.template_image
                                        : tree.illustration_s3_path
                                            ? tree.illustration_s3_path
                                            : tree.image} style={{ backgroundColor: 'white', width: '100%', objectFit: 'cover' }} />}
                        >
                            <div style={{ width: "100%", zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h6" gutterBottom noWrap>
                                    {tree.plant_type}
                                </Typography>
                                {tree.assigned_to_name && <Typography variant="body2" color="text.secondary" noWrap>
                                    Gifted to: {tree.assigned_to_name}
                                </Typography>}
                                {tree.assigned_to && <Typography
                                    noWrap
                                    component='a'
                                    href={getDashboardLink(tree)}
                                    target="_blank"
                                    sx={{
                                        mt: 1,
                                        color: '#3f5344',
                                        textTransform: 'none',
                                        fontSize: '0.875rem', // Smaller button text
                                        display: 'inline-flex', // Align text and icon
                                        alignItems: 'center', // Center text and icon vertically
                                        textDecoration: 'none', // Remove underline
                                    }}
                                >
                                    Go to Dashboard <OpenInNew sx={{ ml: 1 }} fontSize='inherit' />
                                </Typography>}
                                {!tree.assigned_to && <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => { setSelectedGiftTree(tree); setGiftDialogVisible(true); }}
                                    style={{ textTransform: 'none', margin: '10px 5px 0 0' }}
                                    startIcon={tree.assigned_to ? <Wysiwyg /> : <CardGiftcard />}
                                >
                                    {tree.assigned_to ? 'View Summary' : 'Gift Tree'}
                                </Button>}
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

            {selectedGiftTree && <RedeemGiftTreeDialog 
                open={giftDialogVisible}
                onClose={ () => { setGiftDialogVisible(false); setSelectedGiftTree(null); }}
                onSubmit={ () => { getTrees(0, Object.values(trees).length, groupId) }}
                tree={{
                    treeId: selectedGiftTree.id,
                    saplingId: selectedGiftTree.sapling_id,
                    plantType: selectedGiftTree.plant_type || '',
                    giftCardId: (selectedGiftTree as any).gift_card_id,
                    requestId: (selectedGiftTree as any).request_id,
                    giftedBy: (selectedGiftTree as any).gifted_by,
                    logoUrl: (selectedGiftTree as any).logo_url,
                }}
            />}
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