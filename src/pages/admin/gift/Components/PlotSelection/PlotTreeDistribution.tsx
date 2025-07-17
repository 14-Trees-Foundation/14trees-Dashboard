import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { Plot } from "../../../../../types/plot";

interface PlotTreeDistributionProps {
    totalTrees: number;
    plots: Plot[];
    treesCount: number;
    bookAllHabits: boolean;
    bookNonGiftable: boolean;
    selectedTrees: any[];
}

const PlotTreeDistribution: FC<PlotTreeDistributionProps> = ({
    totalTrees,
    plots,
    treesCount,
    bookAllHabits,
    bookNonGiftable,
    selectedTrees
}) => {
    const getAvailableTreesCount = (plot: Plot) => {
        return bookAllHabits 
            ? bookNonGiftable
                ? plot.available 
                : plot.card_available
            : bookNonGiftable
                ? plot.available_trees
                : plot.card_available;
    };

    const totalAvailableFromPlots = plots
        .map(pt => getAvailableTreesCount(pt) ?? 0)
        .reduce((prev, current) => prev + current, 0);

    const remainingTreeCount = Math.max(treesCount - totalAvailableFromPlots, 0);

    return (
        <Box style={{ marginBottom: 20 }}>
            <Typography variant='subtitle1'>
                Total Trees Requested: <strong>{totalTrees}</strong>
            </Typography>
            
            {selectedTrees.length === 0 && (
                <Box>
                    <Typography variant='subtitle1'>
                        Remaining tree count for plot selection: <strong>{remainingTreeCount}</strong>
                    </Typography>
                    <Typography variant='subtitle1'>Tree distribution across the plots:</Typography>
                    {plots.map((plot, idx) => {
                        const treesAllocated = plots
                            .slice(0, idx)
                            .map(pt => getAvailableTreesCount(pt) ?? 0)
                            .reduce((prev, current) => prev + current, 0);

                        const treesForCurrentPlot = Math.min(
                            getAvailableTreesCount(plot) ?? 0, 
                            treesCount - treesAllocated
                        );

                        return (
                            <Typography variant="body1" key={idx}>
                                {plot.name} <strong>[ Trees: {Math.max(treesForCurrentPlot, 0)} ]</strong>
                            </Typography>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
};

export default PlotTreeDistribution;