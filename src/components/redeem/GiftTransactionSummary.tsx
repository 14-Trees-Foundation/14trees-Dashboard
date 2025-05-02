import React, { useEffect, useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Card } from "antd";
import { toast } from "react-toastify";
import { createStyles, makeStyles } from "@mui/styles";
import { Typography, Grid, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { OpenInNew, Email, Edit } from "@mui/icons-material";
import { Tree } from "../../types/tree";
import { GiftRedeemTransaction } from "../../types/gift_redeem_transaction";
import ApiClient from "../../api/apiClient/apiClient";
import { getHumanReadableDateTime } from "../../helpers/utils";
import EmailDialog from "./EmailDialog";
import RedeemGiftTreeDialog from "./RedeemGiftTreeDialog";
import ImageViewModal from "../ImageViewModal";
import EditUserEmailDialog from "./EditUserEmailDialog";

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

type Props = {
    transaction: GiftRedeemTransaction;
    onTransactionUpdated?: () => void;
    showEditButton?: boolean;
};

const GiftRedeemTrees: React.FC<{ transaction: GiftRedeemTransaction }> = ({ transaction }) => {
    const classes = useStyle();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [trees, setTrees] = useState<Record<number, Tree>>({});
    const [totalRecords, setTotalRecords] = useState(10);

    const [imageViewModalOpen, setImageViewModalOpen] = useState(false);
    const [imageViewModalImageUrl, setImageViewModalImageUrl] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            const filters: any[] = [
                { columnField: 'transaction_id', operatorValue: 'equals', value: transaction.id }
            ]

            for (let i = page * pageSize; i < Math.min((page + 1) * pageSize, totalRecords); i++) {
                if (!trees[i]) {
                    if (transaction.user_id) {
                        getTrees(page * pageSize, pageSize, 'user', transaction.user_id, filters);
                    } else if (transaction.group_id) {
                        getTrees(page * pageSize, pageSize, 'group', transaction.group_id, filters);
                    }
                    return;
                }
            }
        }, 300);

        return () => { clearTimeout(handler); }
    }, [trees, page, pageSize, transaction, totalRecords])

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
            })
            setTotalRecords(Number(treesResp.total));

        } catch (error: any) {
            toast.error(error.message);
        }
        setLoading(false);
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
        <Grid container spacing={isMobile ? 2 : 3} padding={isMobile ? 1 : 3}>
            {Object.values(trees).map((tree) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={tree.id}>
                    <Card
                        hoverable
                        className={classes.customCard}
                        cover={<img 
                            onClick={() => {
                                setImageViewModalOpen(true);
                                setImageViewModalImageUrl((tree as any).card_image_url
                                ? (tree as any).card_image_url
                                : tree.template_image
                                    ? tree.template_image
                                    : tree.illustration_s3_path
                                        ? tree.illustration_s3_path
                                        : tree.image);
                            }}
                            height='auto' alt={tree.plant_type}
                            src={(tree as any).card_image_url
                                ? (tree as any).card_image_url
                                : tree.template_image
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
                        </div>
                    </Card>
                </Grid>
            ))}

            {loading && [1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (<Grid item xs={12} sm={6} md={4} key={item}>
                <Card loading style={{ backgroundColor: '#b7edc47a', border: 'none', overflow: 'hidden', borderRadius: '20px' }}></Card>
            </Grid>))}

            {Object.values(trees).length < totalRecords && <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: isMobile ? 1 : 2 }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => { setPage(page + 1) }}
                    fullWidth={isMobile}
                    sx={{ maxWidth: isMobile ? '100%' : '200px' }}
                >
                    Load More Trees
                </Button>
            </Grid>}

            <ImageViewModal 
                open={imageViewModalOpen}
                onClose={() => setImageViewModalOpen(false)}
                imageUrl={imageViewModalImageUrl}
            />
        </Grid>
    )
}

const GiftTransactionSummary: React.FC<Props> = ({ transaction, onTransactionUpdated, showEditButton = true }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [treeCardImages, setTreeCardImages] = useState<string[]>([]);
    const [editEmailDialogOpen, setEditEmailDialogOpen] = useState(false);

    useEffect(() => {
        getTransactionTreeCardImages(transaction.id);
    }, [transaction.id])

    const getTransactionTreeCardImages = async (transaction_id: number) => {
        try {
            const apiClient = new ApiClient();
            const treeCardImages = await apiClient.getTransactionTreeCardImages(transaction_id);
            setTreeCardImages(treeCardImages);
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const handleDownload = async () => {
        const imageUrls = treeCardImages;
        let url = '';
        let fileName = '';
        
        if (imageUrls.length === 1) {
            url = imageUrls[0];
            fileName = imageUrls[0].split('/').pop() || 'image.png';
        } else {
            fileName = transaction.recipient_name + "_" + transaction.trees_count;
            let location: string = process.env.REACT_APP_BASE_URL || '';
            url = location + '/gift-cards/transactions/tree-cards/download/' + transaction.id + '?file_name=' + fileName;
        }

        try {
            // Create an anchor element and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        } catch (error) {
            console.error("Error downloading image:", error);
            toast.error("Failed to download image. Try right-clicking and 'Save image as' instead.");
            return;
        }
    };

    return (
        <Box sx={{ mx: "auto", mt: 1, mb: 5, px: isMobile ? 1 : 0 }}>
            <Card 
                style={{ 
                    marginBottom: 32, 
                    padding: isMobile ? 16 : 24,
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.08)'
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between', 
                    alignItems: isMobile ? 'flex-start' : 'center', 
                    mb: 3,
                    gap: isMobile ? 2 : 0
                }}>
                    <Typography variant="h6" sx={{ color: '#1a1a1a' }}>
                        Gift Details
                    </Typography>
                    {showEditButton && (
                        <Button
                            variant="outlined"
                            color="success"
                            startIcon={<Edit />}
                            onClick={() => setEditDialogOpen(true)}
                            sx={{ textTransform: 'none' }}
                            fullWidth={isMobile}
                        >
                            Edit Details
                        </Button>
                    )}
                </Box>
                <Grid container spacing={isMobile ? 2 : 3}>
                    {/* Sender and Recipient Section */}
                    <Grid item xs={12}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: isMobile ? 2 : 4 
                        }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Gifted By
                                </Typography>
                                <Typography variant="body1">{transaction.gifted_by}</Typography>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">Recipient</Typography>
                                <Typography variant="body1">{transaction.recipient_name || "N/A"}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Gift Details Section */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Gift Information</Typography>
                        <Box sx={{ pl: isMobile ? 0 : 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <strong>Trees Gifted:</strong> {transaction.trees_count || 0}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    {transaction.occasion_name && <Typography variant="body1">
                                        <strong>Occasion:</strong> {transaction.occasion_name || "N/A"}
                                    </Typography>}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <strong>Gifted On:</strong> {new Date(transaction.gifted_on).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    {/* Email Status Section */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Email Status</Typography>
                        <Box sx={{ 
                            pl: isMobile ? 0 : 2, 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'flex-start' : 'center', 
                            gap: 2 
                        }}>
                            {transaction.mail_sent_at ? (
                                <Typography variant="body1" color="text.primary">
                                    Last mail sent at: {getHumanReadableDateTime(transaction.mail_sent_at)}
                                </Typography>
                            ) : (
                                <>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                {(!transaction.recipient_email && !transaction.recipient_communication_email) || 
                                                 (transaction.recipient_email?.endsWith('@14trees') && 
                                                  (!transaction.recipient_communication_email || transaction.recipient_communication_email?.endsWith('@14trees'))) ? 
                                                  'Email notification cannot be sent - no valid email provided' : 
                                                  'Email not sent yet'}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    startIcon={<Email />}
                                                    onClick={() => setEmailDialogOpen(true)}
                                                    disabled={(!transaction.recipient_email && !transaction.recipient_communication_email) || 
                                                             (transaction.recipient_email?.endsWith('@14trees') && 
                                                              (!transaction.recipient_communication_email || transaction.recipient_communication_email?.endsWith('@14trees')))}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Send Now
                                                </Button>
                                                {((!transaction.recipient_email && !transaction.recipient_communication_email) || 
                                                  (transaction.recipient_email?.endsWith('@14trees') && 
                                                   (!transaction.recipient_communication_email || transaction.recipient_communication_email?.endsWith('@14trees')))) && (
                                                    <Button
                                                        variant="outlined"
                                                        color="success"
                                                        onClick={() => setEditEmailDialogOpen(true)}
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        Edit Email
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                        {(!transaction.recipient_email || transaction.recipient_email?.endsWith('@14trees')) && 
                                         transaction.recipient_communication_email && 
                                         !transaction.recipient_communication_email?.endsWith('@14trees') && (
                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                This is the communication email address
                                            </Typography>
                                        )}
                                    </Box>
                                </>
                            )}
                        </Box>
                        {transaction.mail_error && (
                            <Typography variant="body1" color="error.main" sx={{ mt: 1 }}>
                                Error: {transaction.mail_error}
                            </Typography>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'flex-start' : 'center', 
                            gap: 2 
                        }}>
                            <Typography variant="subtitle2" color="text.secondary">Tree Cards: {treeCardImages.length} </Typography>
                            <Button
                                variant="contained" 
                                color="success" 
                                onClick={handleDownload}
                                startIcon={<OpenInNew />}
                                disabled={treeCardImages.length === 0}
                                sx={{ textTransform: 'none' }}
                                fullWidth={isMobile}
                            >
                                Download
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Card>

            <EmailDialog
                open={emailDialogOpen}
                onClose={() => setEmailDialogOpen(false)}
                transaction={transaction}
            />

            <EditUserEmailDialog
                open={editEmailDialogOpen}
                onClose={() => setEditEmailDialogOpen(false)}
                onSubmit={() => {
                    if (onTransactionUpdated) {
                        onTransactionUpdated();
                    }
                }}
                userId={transaction.recipient}
                recipientName={transaction.recipient_name || ''}
                recipientEmail={transaction.recipient_email}
                recipientCommunicationEmail={transaction.recipient_communication_email}
            />

            {editDialogOpen && <RedeemGiftTreeDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onSubmit={() => {
                    setEditDialogOpen(false);
                    toast.success("Transaction details updated successfully");
                    if (onTransactionUpdated) {
                        onTransactionUpdated();
                    }
                }}
                userId={transaction.user_id || undefined}
                groupId={transaction.group_id || undefined}
                tree={{
                    giftCardId: 0, // This will be ignored in edit mode
                    treeId: 0, // This will be ignored in edit mode
                    saplingId: transaction.tree_details?.[0]?.sapling_id || '',
                    plantType: transaction.tree_details?.[0]?.plant_type || '',
                    requestId: '',
                    giftedBy: transaction.gifted_by || '',
                    logoUrl: transaction.tree_details?.[0]?.logo_url || null
                }}
                existingTransaction={transaction}
            />}

            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Gifted Trees
            </Typography>
            <GiftRedeemTrees transaction={transaction} />
        </Box>
    );
};

export default GiftTransactionSummary; 