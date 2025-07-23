import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Grid, Typography, Button, Box, useMediaQuery, useTheme } from "@mui/material";
import { Card } from "antd";
import { createStyles, makeStyles } from "@mui/styles";
import { CardGiftcard, OpenInNew, Wysiwyg } from "@mui/icons-material";
import { Tree } from "../../types/tree";
import { GiftRedeemTransaction } from "../../types/gift_redeem_transaction";
import ApiClient from "../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import ScrambledImages from "../ScrambledImages";

const useStyles = makeStyles((theme) =>
    createStyles({
        customCard: {
            backgroundColor: '#b7edc47a',
            border: 'none',
            overflow: 'hidden',
            borderRadius: '20px',
            transition: 'background-color 0.3s',
            width: '100%',
            maxWidth: '100%',
            minHeight: '380px',
            '&:hover': {
                backgroundColor: '#8fcf9f7a !important', /* New hover color */
                cursor: 'pointer',
                transition: 'background-color 0.3s ease', /* Smooth transition */
            },
        },
    })
);

export interface GiftTreesGridHandle {
    getFirstAvailableTree: () => Promise<Tree | null>;
}

interface GiftTreesGridProps {
    userId?: number;
    groupId?: number;
    filter: 'gifted' | 'non-gifted' | 'all';
    searchUser: string;
    sourceTypeFilter?: 'all' | 'fresh_request' | 'pre_purchased';
    onSelectTree: (tree: Tree) => void;
    onSelectTransaction: (transaction: GiftRedeemTransaction) => void;
    onImageView: (imageUrl: string) => void;
    refreshTrigger?: number;
}

const GiftTreesGrid = forwardRef<GiftTreesGridHandle, GiftTreesGridProps>(({
    userId,
    groupId,
    filter,
    sourceTypeFilter = 'all',
    searchUser,
    onSelectTree,
    onSelectTransaction,
    onImageView,
    refreshTrigger = 0
}, ref) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [trees, setTrees] = useState<Record<number, Tree>>({});
    const [treesList, setTreesList] = useState<Tree[]>([]);
    const [totalRecords, setTotalRecords] = useState(10);
    
    const [transactions, setTransactions] = useState<Record<number, GiftRedeemTransaction>>({});
    const [trnPage, setTrnPage] = useState(0);
    const [totalTrnRecords, setTotalTrnRecords] = useState(10);

    // Expose method to get the first available tree
    useImperativeHandle(ref, () => ({
        getFirstAvailableTree: async () => {
            try {
                const apiClient = new ApiClient();
                const filters = [{ columnField: 'assigned_to', operatorValue: 'isEmpty' }];
                const type = userId ? 'user' : 'group';
                const id = userId || groupId;
                
                if (!id) {
                    toast.error('No user or group ID provided');
                    return null;
                }
                
                const treeResp = await apiClient.getMappedGiftTrees(0, 1, type as 'user' | 'group', id, filters);
                
                if (treeResp.results && treeResp.results.length > 0) {
                    return treeResp.results[0];
                } else {
                    toast.error("No available trees found for gifting");
                    return null;
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to load available trees");
                return null;
            }
        }
    }));

    // Filter trees based on assigned_to
    useEffect(() => {
        const treesList = Object.values(trees);

        let filteredData: Tree[] = [];
        if (filter === 'all') filteredData = treesList;
        else if (filter === 'gifted') filteredData = treesList.filter(tree => tree.assigned_to);
        else filteredData = treesList.filter(tree => !tree.assigned_to);

        setTreesList(filteredData);
    }, [trees, filter]);

    // Create filtered transactions list based on source type
    const filteredTransactions = Object.values(transactions).filter(trn => {
        if (sourceTypeFilter === 'all') return true;
        return trn.gift_source_type === sourceTypeFilter;
    });

    // Fetch transactions when in gifted mode
    useEffect(() => {
        if (filter !== 'gifted') return;

        const handler = setTimeout(() => {
            for (let i = trnPage * pageSize; i < Math.min((trnPage + 1) * pageSize, totalTrnRecords); i++) {
                if (!transactions[i]) {
                    if (userId) {
                        getGiftTransactions(trnPage * pageSize, pageSize, 'user', userId, searchUser);
                    } else if (groupId) {
                        getGiftTransactions(trnPage * pageSize, pageSize, 'group', groupId, searchUser);
                    }
                    return;
                }
            }
        }, 300);

        return () => { clearTimeout(handler); }
    }, [filter, searchUser, transactions, trnPage, pageSize, userId, groupId, totalTrnRecords, refreshTrigger]);

    // Reset state when filter changes
    useEffect(() => {
        if (filter === 'gifted') {
            setTrnPage(0);
            setTotalTrnRecords(10);
            setTransactions({});
        } else {
            setTrees({});
            setPage(0);
            setTreesList([]);
            setTotalRecords(10);
        }
    }, [filter, searchUser, refreshTrigger]);

    // Fetch trees
    useEffect(() => {
        if (filter === 'gifted') return;

        const handler = setTimeout(() => {
            const filters: any[] = []
            if (searchUser.trim().length > 0) {
                filters.push({ columnField: 'assigned_to_name', value: searchUser.trim(), operatorValue: 'contains' });
            }
            if (filter !== 'all') {
                filters.push({ 
                    columnField: 'assigned_to', 
                    operatorValue: 'isEmpty' 
                });
            }

            for (let i = page * pageSize; i < Math.min((page + 1) * pageSize, totalRecords); i++) {
                if (!trees[i]) {
                    if (userId) {
                        getTrees(page * pageSize, pageSize, 'user', userId, filters);
                    } else if (groupId) {
                        getTrees(page * pageSize, pageSize, 'group', groupId, filters);
                    }
                    return;
                }
            }
        }, 300);

        return () => { clearTimeout(handler); }
    }, [trees, page, pageSize, userId, groupId, totalRecords, filter, searchUser]);

    // Reset on user/group change
    useEffect(() => {
        setTrees({});
        setTotalRecords(10);
        setPage(0);
        setTransactions({});
        setTotalTrnRecords(10);
        setTrnPage(0);
    }, [userId, groupId]);

    const getTrees = async (offset: number, limit: number, type: 'user' | 'group', id: number, filters: any[]) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const treesResp = await apiClient.getMappedGiftTrees(offset, limit, type, id, filters);

            setTrees(prev => {
                const treesData = { ...prev };
                for (let i = 0; i < treesResp.results.length; i++) {
                    treesData[treesResp.offset + i] = treesResp.results[i];
                }
                return treesData;
            });
            setTotalRecords(Number(treesResp.total));
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getGiftTransactions = async (offset: number, limit: number, type: 'user' | 'group', id: number, search?: string) => {
        try {
            const apiClient = new ApiClient();
            const trns = await apiClient.getGiftTransactions(offset, limit, type, id, search);
            setTransactions(prev => {
                const trnData = { ...prev };
                for (let i = 0; i < trns.results.length; i++) {
                    trnData[trns.offset + i] = trns.results[i];
                }
                return trnData;
            });
            setTotalTrnRecords(Number(trns.total));
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const getDashboardLink = (tree: Tree) => {
        let location: string = '';
        const { hostname, host } = window.location;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
            location = "http://" + host + "/profile/" + tree.sapling_id;
        } else {
            location = "https://" + hostname + "/profile/" + tree.sapling_id;
        }
        return location;
    };

    const handleLoadMore = () => {
        if (filter === 'gifted') {
            setTrnPage(trnPage + 1);
        } else {
            setPage(page + 1);
        }
    };

    return (
        <>
            <Grid 
                container 
                spacing={isMobile ? 2 : 3} 
                padding={isMobile ? 1 : 3}
                sx={{ 
                    width: '100%', 
                    margin: 0,
                    overflow: 'hidden'
                }}
            >
                {filter !== 'gifted' && treesList.map((tree) => (
                    <Grid 
                        item 
                        xs={12} 
                        sm={6} 
                        md={4} 
                        lg={3} 
                        key={tree.id}
                        sx={{ padding: isMobile ? '8px' : undefined }}
                    >
                        <Card
                            hoverable
                            className={classes.customCard}
                            style={{ width: '100%', maxWidth: '100%' }}
                            cover={
                                <Box 
                                    component="div" 
                                    onClick={() => {
                                        const imageUrl = (tree as any).card_image_url
                                            ? (tree as any).card_image_url
                                            : tree.template_image
                                                ? tree.template_image
                                                : tree.illustration_s3_path
                                                    ? tree.illustration_s3_path
                                                    : tree.image;
                                        onImageView(imageUrl);
                                    }}
                                    sx={{ 
                                        cursor: 'zoom-in', 
                                        width: '100%',
                                        '&:hover': {
                                            opacity: 0.9
                                        }
                                    }}
                                >
                                    <img 
                                        height='auto' 
                                        alt={tree.plant_type}
                                        src={(tree as any).card_image_url
                                            ? (tree as any).card_image_url
                                            : tree.template_image
                                                ? tree.template_image
                                                : tree.illustration_s3_path
                                                    ? tree.illustration_s3_path
                                                    : tree.image} 
                                        style={{ 
                                            backgroundColor: 'white', 
                                            width: '100%', 
                                            objectFit: 'cover',
                                            maxWidth: '100%'
                                        }} 
                                    />
                                </Box>
                            }
                        >
                            <div style={{ 
                                width: "100%", 
                                zIndex: 10, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                overflow: 'hidden'
                            }}>
                                <Typography 
                                    variant={isMobile ? "subtitle1" : "h6"} 
                                    gutterBottom 
                                    noWrap
                                    sx={{ 
                                        fontSize: isMobile ? '1rem' : undefined,
                                        textAlign: 'center',
                                        width: '100%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {tree.plant_type}
                                </Typography>
                                {tree.assigned_to_name && 
                                   <Typography
                                   variant="body2"
                                   sx={{
                                     fontSize: isMobile ? '0.75rem' : undefined,
                                     textAlign: 'center',
                                     whiteSpace: 'normal',
                                     wordBreak: 'break-word'
                                   }}
                                 >
                                   Gifted to: {tree.assigned_to_name}
                                 </Typography>
                                }
                                {tree.assigned_to && 
                                    <Typography
                                        noWrap
                                        component='a'
                                        href={getDashboardLink(tree)}
                                        target="_blank"
                                        sx={{
                                            mt: 1,
                                            color: '#3f5344',
                                            textTransform: 'none',
                                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Go to Dashboard <OpenInNew sx={{ ml: 0.5, fontSize: isMobile ? '0.75rem' : 'inherit' }} />
                                    </Typography>
                                }
                                {!tree.assigned_to && 
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => onSelectTree(tree)}
                                        style={{ 
                                            textTransform: 'none', 
                                            margin: '10px 5px 0 0',
                                            fontSize: isMobile ? '0.75rem' : undefined,
                                            padding: isMobile ? '4px 10px' : undefined
                                        }}
                                        size={isMobile ? "small" : "medium"}
                                        startIcon={<CardGiftcard fontSize={isMobile ? "small" : "medium"} />}
                                    >
                                        Gift Tree
                                    </Button>
                                }
                            </div>
                        </Card>
                    </Grid>
                ))}

                {/* Gifted trees transactions */}
                {filter === 'gifted' && filteredTransactions.map((trn) => (
                    <Grid 
                        item 
                        xs={12} 
                        sm={6} 
                        md={4} 
                        lg={3} 
                        key={trn.id}
                        sx={{ padding: isMobile ? '8px' : undefined }}
                    >
                        <Card
                            hoverable
                            className={classes.customCard}
                            style={{ width: '100%', maxWidth: '100%' }}
                            cover={
                                <Box 
                                    component="div" 
                                    onClick={() => {
                                        const imageUrls = trn.tree_details?.map(tree => {
                                            return tree.card_image_url
                                                ? tree.card_image_url
                                                : tree.template_image
                                                    ? tree.template_image
                                                    : tree.illustration_s3_path || "";
                                        }).filter(url => url !== "") || [];

                                        if (imageUrls.length === 1) {
                                            onImageView(imageUrls[0]);
                                        } else {
                                            onSelectTransaction(trn);
                                        }
                                    }}
                                    sx={{ 
                                        cursor: 'zoom-in', 
                                        width: '100%',
                                        '&:hover': {
                                            opacity: 0.9
                                        }
                                    }}
                                >
                                    <ScrambledImages 
                                        images_urls={trn.tree_details?.map(tree => {
                                            return tree.card_image_url
                                                ? tree.card_image_url
                                                : tree.template_image
                                                    ? tree.template_image
                                                    : tree.illustration_s3_path || "";
                                        }) || []} 
                                    />
                                </Box>
                            }
                            actions={[
                                <Button
                                    color='success'
                                    startIcon={<Wysiwyg key="info" fontSize={isMobile ? "small" : "medium"} />}
                                    style={{ 
                                        textTransform: 'none',
                                        fontSize: isMobile ? '0.75rem' : undefined,
                                        padding: isMobile ? '4px 8px' : undefined
                                    }}
                                    size={isMobile ? "small" : "medium"}
                                    onClick={() => onSelectTransaction(trn)}
                                >
                                    Summary
                                </Button>
                            ]}
                        >
                            <div style={{ 
                                width: "100%", 
                                zIndex: 10, 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                padding: isMobile ? '8px 4px' : undefined,
                                overflow: 'hidden'
                            }}>


                                {trn.recipient_name && 
                                    <Typography 
                                        variant={isMobile ? "body2" : "body1"} 
                                        fontWeight={400}
                                        sx={{ 
                                            fontSize: isMobile ? '0.8rem' : undefined,
                                            width: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {Number(trn.trees_count) > 1 ? `Pack of ${trn.trees_count} trees` : `Tree`} gifted to {trn.recipient_name || ''}
                                    </Typography>
                                }
                                {trn.tree_details && trn.tree_details.length > 0 && 
                                    <Typography
                                        noWrap
                                        component='a'
                                        href={getDashboardLink(trn.tree_details[0] as any)}
                                        target="_blank"
                                        sx={{
                                            mt: 1,
                                            color: '#3f5344',
                                            textTransform: 'none',
                                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Go to Dashboard <OpenInNew sx={{ ml: 0.5, fontSize: isMobile ? '0.75rem' : 'inherit' }} />
                                    </Typography>
                                }
                            </div>
                        </Card>
                    </Grid>
                ))}

                {loading && [1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (
                    <Grid 
                        item 
                        xs={12} 
                        sm={6} 
                        md={4} 
                        lg={3} 
                        key={item}
                        sx={{ padding: isMobile ? '8px' : undefined }}
                    >
                        <Card loading style={{ 
                            backgroundColor: '#b7edc47a', 
                            border: 'none', 
                            overflow: 'hidden', 
                            borderRadius: '20px',
                            height: isMobile ? '250px' : '300px',
                            width: '100%',
                            maxWidth: '100%'
                        }}></Card>
                    </Grid>
                ))}
            </Grid>

            {((filter !== 'gifted' && Object.values(trees).length < totalRecords) || 
              (filter === 'gifted' && Object.values(transactions).length < totalTrnRecords)) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: isMobile ? 2 : 3 }}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleLoadMore}
                        size={isMobile ? "small" : "medium"}
                        sx={{ 
                            fontSize: isMobile ? '0.85rem' : undefined,
                            padding: isMobile ? '6px 16px' : undefined
                        }}
                    >
                        Load More Trees
                    </Button>
                </Box>
            )}
        </>
    );
});

export default GiftTreesGrid; 