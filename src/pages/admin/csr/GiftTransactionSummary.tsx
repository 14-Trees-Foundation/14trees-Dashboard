import React, { useEffect, useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Card } from "antd";
import { toast } from "react-toastify";
import { createStyles, makeStyles } from "@mui/styles";
import { Typography, Grid, Box, Button } from "@mui/material";
import { OpenInNew, Email } from "@mui/icons-material";
import { Tree } from "../../../types/tree";
import { GiftRedeemTransaction } from "../../../types/gift_redeem_transaction";
import ApiClient from "../../../api/apiClient/apiClient";
import { getHumanReadableDateTime } from "../../../helpers/utils";
import CSREmailDialog from "./CSREmailDialog";

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
};

const GiftRedeemTrees: React.FC<Props> = ({ transaction }) => {
    const classes = useStyle();

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [trees, setTrees] = useState<Record<number, Tree>>({});
    const [totalRecords, setTotalRecords] = useState(10);

    useEffect(() => {
        const handler = setTimeout(() => {
            const filters: any[] = [
                { columnField: 'transaction_id', operatorValue: 'equals', value: transaction.id }
            ]

            for (let i = page * pageSize; i < Math.min((page + 1) * pageSize, totalRecords); i++) {
                if (!trees[i]) {
                    getTrees(page * pageSize, pageSize, transaction.group_id, filters);
                    return;
                }
            }
        }, 300);

        return () => { clearTimeout(handler); }
    }, [trees, page, pageSize, transaction, totalRecords])

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
        <Grid container spacing={3} padding={3}>
            {Object.values(trees).map((tree) => (
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

            {Object.values(trees).length < totalRecords && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => { setPage(page + 1) }}
                >
                    Load More Trees
                </Button>
            </div>}
        </Grid>
    )
}

const GiftRedeemSummary: React.FC<Props> = ({ transaction }) => {
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);

    const handleDownload = async () => {
        let imageUrls = transaction.tree_details?.map(tree => tree.card_image_url || '') || [];
        imageUrls = imageUrls.filter(imageUrl => imageUrl)

        const zip = new JSZip();
        const folder = zip.folder("images");

        if (!folder) {
            console.error("Failed to create ZIP folder.");
            return;
        }

        try {
            // Fetch and add each image to the ZIP
            for (let i = 0; i < imageUrls.length; i++) {
                const url = imageUrls[i];
                const fileName = url.split("/").slice(-1)[0]; // Customize file names as needed

                const response = await axios.get(url, { responseType: "blob" });
                folder.file(fileName, response.data);
            }

            // Generate the ZIP file
            const zipBlob = await zip.generateAsync({ type: "blob" });

            // Trigger the download
            saveAs(zipBlob, "images.zip");
        } catch (error) {
            console.error("Error downloading images:", error);
        }
    };

    return (
        <Box sx={{ mx: "auto", mt: 1, mb: 5 }}>
            <Card 
                style={{ 
                    marginBottom: 32, 
                    padding: 24,
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.08)'
                }}
            >
                <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#1a1a1a' }}>
                    Gift Details
                </Typography>
                <Grid container spacing={3}>
                    {/* Sender and Recipient Section */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 4 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">Created By</Typography>
                                <Typography variant="body1">{transaction.created_by_name || "N/A"}</Typography>
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
                        <Box sx={{ pl: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body1">
                                        <strong>Trees Gifted:</strong> {transaction.trees_count || 0}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">
                                        <strong>Occasion:</strong> {transaction.occasion_name || "N/A"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
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
                        <Box sx={{ pl: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            {transaction.mail_sent_at ? (
                                <Typography variant="body1" color="text.primary">
                                    Last mail sent at: {getHumanReadableDateTime(transaction.mail_sent_at)}
                                </Typography>
                            ) : (
                                <>
                                    <Typography variant="body1" color="text.secondary">
                                        Email not sent yet
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<Email />}
                                        onClick={() => setEmailDialogOpen(true)}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Send Now
                                    </Button>
                                </>
                            )}
                            
                        </Box>
                        {transaction.mail_error && (
                            <Typography variant="body1" color="error.main" sx={{ mt: 1 }}>
                                Error: {transaction.mail_error}
                            </Typography>
                        )}
                    </Grid>

                    {/* Tree Cards Section */}
                    {/* <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">Tree Cards</Typography>
                            <Button
                                variant="contained" 
                                color="success" 
                                onClick={handleDownload}
                                startIcon={<OpenInNew />}
                                sx={{ textTransform: 'none' }}
                            >
                                Download Images
                            </Button>
                        </Box>
                    </Grid> */}
                </Grid>
            </Card>

            <CSREmailDialog
                open={emailDialogOpen}
                onClose={() => setEmailDialogOpen(false)}
                transaction={transaction}
            />

            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Gifted Trees
            </Typography>
            <GiftRedeemTrees transaction={transaction} />
        </Box>
    );
};

export default GiftRedeemSummary;
