import { useState, useRef, useCallback } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormGroup, Radio, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Tree } from "../../types/tree";
import { GiftRedeemTransaction } from "../../types/gift_redeem_transaction";
import RedeemGiftTreeDialog from "../../components/redeem/RedeemGiftTreeDialog";
import GiftTransactionSummary from "../../components/redeem/GiftTransactionSummary";
import ImageViewModal from "../../components/ImageViewModal";
import GiftAnalytics from "../../components/redeem/GiftAnalytics";
import GiftTreesGrid, { GiftTreesGridHandle } from "../../components/redeem/GiftTreesGrid";
import { toast } from "react-toastify";

interface GiftTreesProps {
    userId: number
}

const GiftTrees: React.FC<GiftTreesProps> = ({ userId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    
    const [giftDialogVisible, setGiftDialogVisible] = useState(false);
    const [selectedGiftTree, setSelectedGiftTree] = useState<Tree | null>(null);
    const [giftMultiple, setGiftMultiple] = useState(false);
    const [filter, setFilter] = useState<'gifted' | 'non-gifted' | 'all'>('all');
    const [searchUser, setSeachUser] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [availableTrees, setAvailableTrees] = useState(0);

    const [summaryOpen, setSummaryOpen] = useState(false);
    const [selectedTrn, setSelectedTrn] = useState<GiftRedeemTransaction | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [imageViewModalOpen, setImageViewModalOpen] = useState(false);
    const [imageViewModalImageUrl, setImageViewModalImageUrl] = useState('');

    const gridRef = useRef<GiftTreesGridHandle>(null);

    const handleMultiTreesGift = useCallback(async () => {
        setIsLoading(true);
        try {
            // Use the ref to get the first available tree
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
        <Box mt={3} id="your-wall-of-tree-gifts" sx={{ px: isMobile ? 1 : 2 }}>
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
                sx={{
                    maxWidth: '95%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            >
                Celebrate your eco-friendly contributions with a dedicated wall showcasing all the trees gifted. Each entry represents a lasting tribute to sustainability, featuring heartfelt gifting messages, occasion celebrations with nature and individual dashboard tracker links for each tree.
            </Typography>

            <GiftAnalytics 
                userId={userId}
                onTreesChange={value => setAvailableTrees(value)}
                onGiftMultiple={handleMultiTreesGift}
                refreshTrigger={refreshTrigger}
                isLoading={isLoading}
            />

            <Box sx={{ 
                mt: isMobile ? 8 : 4, 
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
                userId={userId}
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

            {selectedGiftTree && <RedeemGiftTreeDialog
                open={giftDialogVisible}
                availableTrees={availableTrees}
                onClose={() => { setGiftDialogVisible(false); setGiftMultiple(false); setSelectedGiftTree(null); }}
                onSubmit={() => { 
                    setGiftDialogVisible(false); 
                    setGiftMultiple(false);
                    setSelectedGiftTree(null);
                    setRefreshTrigger(prev => prev + 1); 
                }}
                tree={{
                    treeId: selectedGiftTree.id,
                    saplingId: selectedGiftTree.sapling_id,
                    plantType: selectedGiftTree.plant_type || '',
                    giftCardId: (selectedGiftTree as any).gift_card_id,
                    requestId: (selectedGiftTree as any).request_id,
                    giftedBy: (selectedGiftTree as any).gifted_by,
                    logoUrl: (selectedGiftTree as any).logo_url || '',
                }}
                giftMultiple={giftMultiple}
                userId={userId}
            />}

            {summaryOpen && selectedTrn && <Dialog
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
                    <Button variant="outlined" color="error" onClick={() => { setSummaryOpen(false); }}>Close</Button>
                </DialogActions>
            </Dialog>}

            <ImageViewModal
                open={imageViewModalOpen}
                onClose={() => setImageViewModalOpen(false)}
                imageUrl={imageViewModalImageUrl}
            />
        </Box>
    );
}

export default GiftTrees;