import { useEffect, useState } from "react";
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Radio, TextField, Typography } from "@mui/material";
import { Card } from "antd";
import { createStyles, makeStyles } from "@mui/styles";
import { Tree } from "../../../types/tree";
import ApiClient from "../../../api/apiClient/apiClient";
import { toast } from "react-toastify";
import { CardGiftcard, Forest, GrassTwoTone, NaturePeople, OpenInNew, Wysiwyg } from "@mui/icons-material";
import RedeemGiftTreeDialog from "./RedeemGiftTreeDialog";
import { GiftRedeemTransaction } from "../../../types/gift_redeem_transaction";

interface CSRGiftTreesProps {
    groupId: number
}

const CSRGiftTrees: React.FC<CSRGiftTreesProps> = ({ groupId }) => {

    const classes = useStyle();

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [trees, setTrees] = useState<Record<number, Tree>>({});
    const [treesList, setTreesList] = useState<Tree[]>([]);
    const [totalRecords, setTotalRecords] = useState(10);
    const [giftDialogVisible, setGiftDialogVisible] = useState(false);
    const [selectedGiftTree, setSelectedGiftTree] = useState<Tree | null>(null);
    const [giftMultiple, setGiftMultiple] = useState(false);
    const [filter, setFilter] = useState<'gifted' | 'non-gifted' | 'all'>('all');
    const [searchUser, setSeachUser] = useState('');
    const [analytics, setAnalytics] = useState<any>(null)

    const [trnList, setTrnList] = useState<GiftRedeemTransaction[]>([]);
    const [totalTrnRecords, setTotalTrnRecords] = useState(10);
    const [transactions, setTransactions] = useState<Record<number, GiftRedeemTransaction>>({});
    const [trnPage, setTrnPage] = useState(0);

    useEffect(() => {
        const treesList = Object.values(trees);

        let filteredData: Tree[] = [];
        if (filter === 'all') filteredData = treesList;
        else if (filter === 'gifted') filteredData = treesList.filter(tree => tree.assigned_to);
        else filteredData = treesList.filter(tree => !tree.assigned_to);

        setTreesList(filteredData)
    }, [trees, filter, searchUser])


    useEffect(() => {
        if (filter !== 'gifted') return;

        const handler = setTimeout(() => {
            for (let i = trnPage * pageSize; i < Math.min((trnPage + 1) * pageSize, totalTrnRecords); i++) {
                if (!transactions[i]) {
                    getGiftTransactions(trnPage * pageSize, pageSize, groupId);
                    return;
                }
            }
        }, 300);

        return () => { clearTimeout(handler); }
    }, [filter, transactions, trnPage, pageSize, groupId, totalTrnRecords])

    useEffect(() => {
        setTrees({});
        setPage(0);
        setTreesList([]);
        setTotalRecords(20);
    }, [filter, searchUser])

    const getTrees = async (offset: number, limit: number, groupId: number, filters: any[]) => {
        setLoading(true);
        try {
            const apiClient = new ApiClient();
            const treesResp = await apiClient.getMappedGiftTrees(offset, limit, groupId, filters);

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

    const getAnanlyticsData = async (groupId: number) => {
        try {
            const apiClient = new ApiClient();
            const treesResp = await apiClient.getMappedGiftTreesAnalytics(groupId);
            setAnalytics(treesResp)
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const getGiftTransactions = async (offset: number, limit: number, groupId: number) => {
        try {
            const apiClient = new ApiClient();
            const trns = await apiClient.getGiftTransactions(offset, limit, groupId);
            setTransactions(prev => {
                const trnData = { ...prev };
                for (let i = 0; i < trns.results.length; i++) {
                    trnData[trns.offset + i] = trns.results[i];
                }

                return trnData;
            })
            setTotalRecords(Number(trns.total));
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        // group id is changed, reset the states
        setTrees({});
        setTotalRecords(20);
        setPage(0);

        // fethc new analytics
        getAnanlyticsData(groupId);
    }, [groupId])

    useEffect(() => {
        const handler = setTimeout(() => {
            const filters: any[] = []
            if (searchUser.trim().length > 0) {
                filters.push({ columnField: 'assigned_to_name', value: searchUser.trim(), operatorValue: 'contains' });
            }
            if (filter !== 'all') {
                filters.push({ columnField: 'assigned_to', operatorValue: filter === 'gifted' ? 'isNotEmpty' : 'isEmpty' });
            }

            for (let i = page * pageSize; i < Math.min((page + 1) * pageSize, totalRecords); i++) {
                if (!trees[i]) {
                    getTrees(page * pageSize, pageSize, groupId, filters);
                    return;
                }
            }
        }, 300);

        return () => { clearTimeout(handler); }
    }, [trees, page, pageSize, groupId, totalRecords, filter, searchUser])


    const handleMultiTreesGift = () => {
        setGiftMultiple(true);
        setGiftDialogVisible(true);
        setSelectedGiftTree(Object.values(trees)[0]);
    }

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
        <Box mt={5} id="your-wall-of-tree-gifts">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" ml={1} mr={2}>Green Tribute Wall</Typography>
                <TextField
                    label="Search trees by giftee's name"
                    value={searchUser}
                    onChange={(e) => { setSeachUser(e.target.value) }}
                    fullWidth
                    size="small"
                    sx={{ maxWidth: 500, m: 1}}
                />
            </Box>
            <Typography variant="subtitle1" ml={1} mb={1}>Celebrate your organization's eco-friendly contributions with a dedicated wall showcasing all the trees gifted. Each entry represents a lasting tribute to sustainability, featuring recipient details, heartfelt messages, and the tree's location.</Typography>

            {analytics && <Box style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}
            >
                <div className={classes.analyticsCard}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <Forest fontSize="large" style={{ color: "#53ad7a" }} />
                        <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {analytics?.total_trees ? analytics.total_trees : '0'}
                        </Typography>
                        <Typography variant="subtitle2" color="#1f3625">
                            Trees opted for Gifting
                        </Typography>
                    </Box>
                </div>
                <div className={classes.analyticsCard}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <NaturePeople
                            fontSize="large"
                            style={{ color: "#573D1C" }}
                        />
                        <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {analytics?.gifted_trees ? analytics.gifted_trees : '0'}
                        </Typography>
                        <Typography variant="subtitle2" color="#1f3625">
                            Trees Gifted
                        </Typography>
                    </Box>
                </div>
                <div className={classes.analyticsCard}>
                    <Box sx={{ paddingTop: "10px" }}>
                        <GrassTwoTone fontSize="large" style={{ color: "#F94F25" }} />
                        <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                            {Number(analytics?.total_trees) - Number(analytics?.gifted_trees) || '0'}
                        </Typography>
                        <Typography variant="subtitle2" color="#1f3625">
                            Available Giftable Inventory
                        </Typography>
                    </Box>
                </div>
            </Box>}
            {analytics?.total_trees !== analytics?.gifted_trees && <Box
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                }}
            >
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleMultiTreesGift}
                    style={{ textTransform: 'none', margin: '10px 5px 0 0' }}
                    startIcon={<CardGiftcard />}
                    disabled={analytics?.gifted_trees === analytics?.total_trees}
                >
                    Gift Trees Now!
                </Button>
                <Typography mt={1} variant='subtitle2'>(from your remaining stock of {Number(analytics?.total_trees) - Number(analytics?.gifted_trees)} trees)</Typography>
            </Box>}

            <Box sx={{ paddingX: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <FormControl component="fieldset">
                    <FormGroup aria-label="position" row>
                        <FormControlLabel
                            value="non-gifted"
                            control={<Radio color="success" checked={filter === 'non-gifted'} onChange={() => { setFilter('non-gifted') }} />}
                            label="Show Available Trees"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="gifted"
                            control={<Radio color="success" checked={filter === 'gifted'} onChange={() => { setFilter('gifted') }} />}
                            label="Show Gifted Trees"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="all"
                            control={<Radio color="success" checked={filter === 'all'} onChange={() => { setFilter(prev => prev === 'all' ? 'non-gifted' : 'all') }} />}
                            label="Show All"
                            labelPlacement="end"
                        />
                    </FormGroup>
                </FormControl>
            </Box>
            <Grid container spacing={3} padding={3}>
                {filter !== 'gifted' && treesList.map((tree) => (
                    <Grid item xs={12} sm={6} md={3} key={tree.id}>
                        <Card
                            hoverable
                            className={classes.customCard}
                            cover={<img height='auto' alt={tree.plant_type}
                                src={(tree as any).card_image_url
                                    ? (tree as any).card_image_url
                                    : tree.template_image
                                        ? tree.template_image
                                        : tree.illustration_s3_path
                                            ? tree.illustration_s3_path
                                            : tree.image } style={{ backgroundColor: 'white', width: '100%', objectFit: 'cover' }} />}
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


                {/* Gifted trees transactions */}
                {filter === 'gifted' && Object.values(transactions).map((trn) => (
                    <Grid item xs={12} sm={6} md={3} key={trn.id}>
                        <Card
                            hoverable
                            className={classes.customCard}
                            cover={<img height='auto' alt={trn.plant_type}
                                src={trn.card_image_url
                                    ? trn.card_image_url
                                    : trn.template_image
                                        ? trn.template_image
                                        : trn.illustration_s3_path } style={{ backgroundColor: 'white', width: '100%', objectFit: 'cover' }} />}
                        >
                            <div style={{ width: "100%", zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h6" gutterBottom noWrap>
                                    {trn.plant_type}
                                </Typography>
                                {trn.recipient_name && <Typography variant="body2" color="text.secondary" textAlign={'center'}>
                                    Pack of {trn.trees_count} trees gifted to {trn.recipient_name}
                                </Typography>}
                                {trn.recipient && <Typography
                                    noWrap
                                    component='a'
                                    href={getDashboardLink(trn as any)}
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
                onClose={() => { setGiftDialogVisible(false); setGiftMultiple(false); setSelectedGiftTree(null); }}
                onSubmit={() => { setTrees({}); setPage(0); getAnanlyticsData(groupId); }}
                tree={{
                    treeId: selectedGiftTree.id,
                    saplingId: selectedGiftTree.sapling_id,
                    plantType: selectedGiftTree.plant_type || '',
                    giftCardId: (selectedGiftTree as any).gift_card_id,
                    requestId: (selectedGiftTree as any).request_id,
                    giftedBy: (selectedGiftTree as any).gifted_by,
                }}
                giftMultiple={giftMultiple}
                groupId={groupId}
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
        analyticsCard: {
            width: "100%",
            maxWidth: "180px",
            minHeight: "170px",
            maxHeight: "260px",
            borderRadius: "15px",
            textAlign: "center",
            padding: "16px",
            margin: "20px",
            background: "linear-gradient(145deg, #9faca3, #bdccc2)",
            // boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
            boxShadow: "7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9",
        },
    })
);


export default CSRGiftTrees;