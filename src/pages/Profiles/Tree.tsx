import { FC, useEffect, useRef } from "react";
import * as treeActionCreators from "../../redux/actions/treeActions";
import { useAppDispatch, useAppSelector } from "../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { Tree } from "../../types/tree";
import { RootState } from "../../redux/store/store";
import { useParams } from "react-router";
import { Box, Button, Divider, Typography } from "@mui/material";
import TreeInfo from "./Tree/TreeInfo";
import { Spinner } from "../../components/Spinner";
import UserTreeInfo from "./Tree/UserTreeInfo";
import VisitInfo from "./Tree/VisitInfo";
import TreeTimelineInfo from "./Tree/TreeTimelineInfo";
import { Map } from "./Tree/Map";

interface TreePageProps {}

const TreePage: FC<TreePageProps> = ({ }) => {
    const dispatch = useAppDispatch();
    const { getTrees } = bindActionCreators(treeActionCreators, dispatch);

    const visitRef = useRef<any>(null);
    const timelineRef = useRef<any>(null);

    const handleVisitScroll = () => {
        if (visitRef.current) {
            visitRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handleTimelineScroll = () => {
        if (timelineRef.current) {
            timelineRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

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

    if (!tree) {
        return (
            <Spinner text={"Loading..."} />
        );
    }

    return (
        <Box p={2}>
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box style={{ flexGrow: 1 }}>
                    <Typography variant="h4" style={{ marginBottom: 3 }}>
                        {tree.plant_type}
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: 10 }}>
                        Tracking ID: {tree.sapling_id}
                    </Typography>
                </Box>
                <Button variant="contained" style={{ marginRight: 10 }} onClick={handleVisitScroll}>Visit Details</Button>
                <Button variant="contained" onClick={handleTimelineScroll}>Tree Timeline</Button>
            </Box>
            <Divider style={{ marginBottom: 10 }}/>
            <Box style={{ marginBottom: 20 }}>
                <TreeInfo tree={tree} />
            </Box>
            <Box style={{ marginBottom: 20 }}>
                <UserTreeInfo tree={tree} />
            </Box>
            <Box style={{ marginBottom: 20 }}>
                <Map tree={tree} />
            </Box>
            <Box style={{ marginBottom: 20 }} ref={visitRef}>
                <VisitInfo visit={{
                    visit_name: "IIT Kanpur Alumni Visit",
                    created_at: new Date("2024-08-08T00:00:00Z"),
                    user_count: 4,
                    id: 0,
                    visit_type: 'corporate',
                    visit_images: [],
                    visit_date: new Date("2024-08-08T00:00:00Z"),
                    key: 0,
                    updated_at: new Date("2024-08-08T00:00:00Z"),
                }} />
            </Box>
            <Box style={{ marginBottom: 10 }} ref={timelineRef}>
                <TreeTimelineInfo />
            </Box>
        </Box>
    );
}

export default TreePage;
