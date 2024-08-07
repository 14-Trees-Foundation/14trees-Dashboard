import { FC, useEffect } from "react";
import * as treeActionCreators from "../../redux/actions/treeActions";
import { useAppDispatch, useAppSelector } from "../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { Tree } from "../../types/tree";
import { RootState } from "../../redux/store/store";
import { useParams } from "react-router";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import VisitCard from "./VisitCard";
import ImageSlider from "./ImageSlider";
import { getHumanReadableDate } from "../../helpers/utils";

interface TreePageProps {
    // saplingId: string
}

const TreePage: FC<TreePageProps> = ({ }) => {
    const dispatch = useAppDispatch();
    const { getTrees } = bindActionCreators(treeActionCreators, dispatch);

    const { saplingId } = useParams();

    useEffect(() => {
        getTrees(0, 1, [{ columnField: "sapling_id", value: saplingId, operatorField: "equals" }]);
    }, [saplingId]);

    let tree: Tree | null = null;
    const treesData = useAppSelector((state: RootState) => state.treesData);
    if (treesData) {
        const treesList = Object.values(treesData.trees);
        if (treesList.length > 0) {
            tree = treesList[0];
        }
    }

    const getStatusMessage = (status: string) => {
        switch (status) {
            case 'healthy':
                return 'The tree is healthy and thriving.';
            case 'diseased':
                return 'The tree is currently diseased and requires attention.';
            case 'dead':
                return 'Unfortunately, the tree is dead.';
            default:
                return '';
        }
    };

    return (
        <Box p={2}>
            <Box style={{ display: 'flex' }}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2} alignItems="flex-start">
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" >
                                    Tree ID: {tree?.sapling_id}
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: 1 }}>
                                    This tree is of the plant type {tree?.plant_type}. It is located in plot {tree?.plot}. It was planted on {getHumanReadableDate(tree?.created_at)}.
                                </Typography>
                                {/* <Typography variant="h6" >
                                    Plant Type
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: 1 }}>
                                    {tree?.plant_type}
                                </Typography>
                                <Typography variant="h6" >
                                    Plot
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: 1 }}>
                                    {tree?.plot}
                                </Typography>
                                <Typography variant="h6" >
                                    Status
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: 1 }}>
                                    {tree?.tree_status ? tree?.tree_status[0].toUpperCase() + tree?.tree_status.slice(1) : "Healthy"}
                                </Typography> */}
                            </Grid>
                            <Grid item xs={12} md={6} container justifyContent="center" alignItems="center">
                                <img style={{ height: '100%', width: '100%', borderRadius: 10 }} alt={"tree"} src={tree?.image} />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card style={{ display: 'flex', marginLeft: 10 }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="flex-start">
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" >
                                    Assigned To
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: 1 }}>
                                    {tree?.assigned_to_name}
                                </Typography>
                                <Typography variant="h6" >
                                    Donated By
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: 1 }}>
                                    {tree?.mapped_user_name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6} container justifyContent="center" alignItems="center">
                                <img style={{ height: '100%', width: '100%', borderRadius: 10 }} alt={"tree"} src={tree?.user_tree_image} />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
            <Box style={{ marginTop: 10 }}>
                <VisitCard
                    visitName={"IIT Kanpur Alumni Visit"}
                    visitDate="2024-08-08T00:00:00Z"
                    numberOfPeople={4}
                    numberOfImages={24}
                />
            </Box>
            <Box style={{ marginTop: 10 }}>
                <ImageSlider
                    images={[
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory1.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory3.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory4.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory5.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory6.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory8.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory9.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory11.jpg",
                        "https://14treesplants.s3.ap-south-1.amazonaws.com/memories/memory12.jpg",
                    ]}
                />
            </Box>
            <Box style={{ marginTop: 30 }}>

            </Box>
        </Box>
    );
}

export default TreePage;
