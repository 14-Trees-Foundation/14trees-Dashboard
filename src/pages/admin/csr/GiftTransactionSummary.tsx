import React, { useEffect, useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Card } from "antd";
import { toast } from "react-toastify";
import { createStyles, makeStyles } from "@mui/styles";
import { Typography, Grid, Divider, Box, Button } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import { Tree } from "../../../types/tree";
import { GiftRedeemTransaction } from "../../../types/gift_redeem_transaction";
import ApiClient from "../../../api/apiClient/apiClient";

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
            <Grid container spacing={2}>
                {/* Created By */}
                <Grid item xs={6}>
                    <Typography variant="body2" fontWeight="bold">Created By:</Typography>
                    <Typography variant="body2">{transaction.created_by_name || "N/A"}</Typography>
                </Grid>

                {/* Recipient */}
                <Grid item xs={6}>
                    <Typography variant="body2" fontWeight="bold">Recipient:</Typography>
                    <Typography variant="body2">{transaction.recipient_name || "N/A"}</Typography>
                </Grid>

                {/* Primary Message */}
                <Grid item xs={12}>
                    <Typography variant="body2" fontWeight="bold">Primary Message:</Typography>
                    <Typography variant="body2">{transaction.primary_message}</Typography>
                </Grid>

                {/* Secondary Message */}
                {transaction.secondary_message && (
                    <Grid item xs={12}>
                        <Typography variant="body2" fontWeight="bold">Secondary Message:</Typography>
                        <Typography variant="body2">{transaction.secondary_message}</Typography>
                    </Grid>
                )}

                {/* Occasion */}
                {transaction.occasion_name && (
                    <Grid item xs={6}>
                        <Typography variant="body2" fontWeight="bold">Occasion:</Typography>
                        <Typography variant="body2">{transaction.occasion_name}</Typography>
                    </Grid>
                )}

                {/* Trees Count */}
                <Grid item xs={6}>
                    <Typography variant="body2" fontWeight="bold">Trees Gifted:</Typography>
                    <Typography variant="body2">{transaction.trees_count || 0}</Typography>
                </Grid>

                {/* Gifted On */}
                <Grid item xs={12}>
                    <Typography variant="body2" fontWeight="bold">Gifted On:</Typography>
                    <Typography variant="body2">{new Date(transaction.gifted_on).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" fontWeight="bold">Tree Cards:</Typography>
                    <Button variant="contained" color="primary" onClick={handleDownload}>
                        Download
                    </Button>
                </Grid>
            </Grid>
            <Divider sx={{ mb: 5, mt: 2 }} />
            <GiftRedeemTrees transaction={transaction} />
        </Box>
    );
};

export default GiftRedeemSummary;
