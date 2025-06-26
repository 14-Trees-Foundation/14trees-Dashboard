import { useState, useRef, useCallback } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    FormControlLabel,
    FormGroup,
    Radio,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Tree } from "../../../types/tree";
import { GiftRedeemTransaction } from "../../../types/gift_redeem_transaction";
import RedeemGiftTreeDialog from "../../../components/redeem/RedeemGiftTreeDialog";
import GiftTransactionSummary from "../../../components/redeem/GiftTransactionSummary";
import ImageViewModal from "../../../components/ImageViewModal";
import GiftAnalytics from "../../../components/redeem/GiftAnalytics";
import GiftTreesGrid, { GiftTreesGridHandle } from "../../../components/redeem/GiftTreesGrid";
import { toast } from "react-toastify";
import CSRBulkGift from "./CSRBulkGift";
import { Group } from "../../../types/Group";

interface CSRGiftTreesProps {
    selectedGroup: Group;
    groupId: number;
}

const CSRGiftTrees: React.FC<CSRGiftTreesProps> = ({ groupId, selectedGroup }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [giftDialogVisible, setGiftDialogVisible] = useState(false);
    const [selectedGiftTree, setSelectedGiftTree] = useState<Tree | null>(null);
    const [availableTrees, setAvailableTrees] = useState(0);
    const [giftMultiple, setGiftMultiple] = useState(false);
    const [filter, setFilter] = useState<'gifted' | 'non-gifted' | 'all'>('all');
    const [searchUser, setSeachUser] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [summaryOpen, setSummaryOpen] = useState(false);
    const [selectedTrn, setSelectedTrn] = useState<GiftRedeemTransaction | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [imageViewModalOpen, setImageViewModalOpen] = useState(false);
    const [imageViewModalImageUrl, setImageViewModalImageUrl] = useState('');
    const [bulkGifting, setBulkGifting] = useState(false);

    const gridRef = useRef<GiftTreesGridHandle>(null);

    const handleMultiTreesGift = useCallback(async () => {
        setIsLoading(true);
        try {
            if (gridRef.current) {
                const tree = await gridRef.current.getFirstAvailableTree();
                if (tree) {
                    setSelectedGiftTree(tree);
                    setGiftMultiple(true);
                    setGiftDialogVisible(true);
                }
            }
        } catch (error: any) {
            toast.error("Error fetching available trees: " + (error.message || "Unknown error"));
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSelectTree = (tree: Tree) => {
        setSelectedGiftTree(tree);
        setGiftMultiple(false);
        setGiftDialogVisible(true);
    };

    const handleSelectTransaction = (transaction: GiftRedeemTransaction) => {
        setSelectedTrn(transaction);
        setSummaryOpen(true);
    };

    const handleTransactionUpdated = () => {
        setRefreshTrigger(prev => prev + 1);
        if (selectedTrn) {
            setSummaryOpen(false);
            setSelectedTrn(null);
        }
    };

    return (
        <Box mt={3} id="Setting-Details" sx={{ px: isMobile ? 1 : 2 }}>
            <Box mt={3} id="your-wall-of-tree-gifts" sx={{ px: isMobile ? 1 : 2 }}></Box>
            <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'space-between',
                mb: 2
            }}>
                <Typography variant={isMobile ? "h5" : "h4"} ml={1} mr={2}>
                    Green Tribute Wall
                </Typography>
            </Box>

            <Typography
                variant={isMobile ? "body2" : "subtitle1"}
                ml={1}
                mb={2}
            >
                Celebrate your organization's eco-friendly contributions with a dedicated wall showcasing all the trees gifted. Each entry represents a lasting tribute to sustainability, featuring recipient details, heartfelt messages, and the tree's location.
            </Typography>

            <GiftAnalytics
                groupId={groupId}
                onTreesChange={value => { setAvailableTrees(value) }}
                onGiftMultiple={handleMultiTreesGift}
                onBulkGifting={() => { setBulkGifting(true) }}
                refreshTrigger={refreshTrigger}
                isLoading={isLoading}
            />

            <Box sx={{
                mt: 4,
                paddingX: 1,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                justifyContent: 'space-between',
                gap: 2
            }}>
                <TextField
                    label="Search trees by giftee's name"
                    value={searchUser}
                    onChange={(e) => { setSeachUser(e.target.value) }}
                    fullWidth
                    size="small"
                    sx={{
                        maxWidth: isMobile ? '100%' : '500px',
                        m: isMobile ? 0 : 1,
                        mb: isMobile ? 2 : 1
                    }}
                />
                <FormControl component="fieldset" sx={{ width: isMobile ? '100%' : 'auto' }}>
                    <FormGroup
                        aria-label="position"
                        row={!isMobile}
                        sx={{
                            justifyContent: 'space-between'
                        }}
                    >
                        <FormControlLabel
                            value="non-gifted"
                            control={<Radio color="success" checked={filter === 'non-gifted'} onChange={() => { setFilter('non-gifted') }} />}
                            label="Show Available Trees"
                            labelPlacement="end"
                            sx={{ mr: 1 }}
                        />
                        <FormControlLabel
                            value="gifted"
                            control={<Radio color="success" checked={filter === 'gifted'} onChange={() => { setFilter('gifted') }} />}
                            label="Show Gifted Trees"
                            labelPlacement="end"
                            sx={{ mr: 1 }}
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

            <GiftTreesGrid
                ref={gridRef}
                groupId={groupId}
                filter={filter}
                searchUser={searchUser}
                refreshTrigger={refreshTrigger}
                onSelectTree={handleSelectTree}
                onSelectTransaction={handleSelectTransaction}
                onImageView={(imageUrl) => {
                    setImageViewModalOpen(true);
                    setImageViewModalImageUrl(imageUrl);
                }}
            />

            {bulkGifting && <CSRBulkGift groupId={groupId} logoUrl={selectedGroup.logo_url} availableTrees={availableTrees} open={bulkGifting} onClose={() => { setBulkGifting(false); }} onSubmit={() => { setRefreshTrigger(prev => prev + 1); }} />}

            {giftDialogVisible && selectedGiftTree && (
                <RedeemGiftTreeDialog
                    open={giftDialogVisible}
                    availableTrees={availableTrees}
                    onClose={() => {
                        setGiftDialogVisible(false);
                        setGiftMultiple(false);
                        setSelectedGiftTree(null);
                    }}
                    onSubmit={() => {
                        setGiftDialogVisible(false);
                        setGiftMultiple(false);
                        setSelectedGiftTree(null);
                        setRefreshTrigger(prev => prev + 1);
                    }}
                    groupId={groupId}
                    tree={{
                        giftCardId: Number((selectedGiftTree as any).gift_card_id) || 0,
                        treeId: selectedGiftTree.id,
                        saplingId: String(selectedGiftTree.sapling_id || ''),
                        plantType: String(selectedGiftTree.plant_type || ''),
                        requestId: String(Math.random().toString(36).substring(2, 15)),
                        giftedBy: String((selectedGiftTree as any).gifted_by || ''),
                        logoUrl: String((selectedGiftTree as any).logo_url || '')
                    }}
                    giftMultiple={giftMultiple}
                />
            )}

            {summaryOpen && selectedTrn && (
                <Dialog
                    fullWidth
                    maxWidth={isMobile ? "sm" : "xl"}
                    open={summaryOpen}
                    onClose={() => { setSummaryOpen(false); }}
                >
                    <DialogContent>
                        <GiftTransactionSummary
                            transaction={selectedTrn}
                            onTransactionUpdated={handleTransactionUpdated}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => { setSummaryOpen(false); }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <ImageViewModal
                open={imageViewModalOpen}
                onClose={() => setImageViewModalOpen(false)}
                imageUrl={imageViewModalImageUrl}
            />
        </Box>
    );
}

export default CSRGiftTrees;