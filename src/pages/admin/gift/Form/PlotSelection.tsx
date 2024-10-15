
import { FC, useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Chip, CircularProgress, TextField, Typography } from "@mui/material";
import { Plot } from "../../../../types/plot";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as plotActionCreators from "../../../../redux/actions/plotActions";

interface PlotSelectionProps {
    requiredTrees: number
    plots: Plot[]
    onPlotsChange: (plots: Plot[]) => void
}

const PlotSelection: FC<PlotSelectionProps> = ({ requiredTrees, plots, onPlotsChange }) => {
    const [position, setPosition] = useState(0);
    const listElem: any = useRef();
    const mounted = useRef<boolean>();

    useEffect(() => {
        if (!mounted.current) mounted.current = true;
        else if (position && listElem.current)
            listElem.current.scrollTop = position - listElem.current.offsetHeight;
    })

    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [plotName, setPlotName] = useState('');

    const dispatch = useAppDispatch();
    const { getPlots }
        = bindActionCreators(plotActionCreators, dispatch);

    useEffect(() => {

        const getPlotsData = async () => {
            const nameFilter = { columnField: "name", value: plotName, operatorValue: "contains" }
            const filters = plotName.length >= 3 ? [nameFilter] : []
            setLoading(true);
            getPlots(page * 10, 10, filters);
            setTimeout(async () => {
                setLoading(false);
            }, 1000);
        };

        getPlotsData()
    }, [page, plotName]);

    let plotsList: Plot[] = [];
    const plotsData = useAppSelector((state) => state.plotsData);
    if (plotsData) {
        plotsList = Object.values(plotsData.plots);
        plotsList = plotsList.sort((a, b) => b.id - a.id)
    }

    const handlePlotChanges = (event: any, plot: any) => {
        onPlotsChange(plot);
    }

    const countSum = (items: (number | string | undefined)[]) => {
        let sum = 0;
        items.forEach(item => {
            if (!item) return;
            else if (typeof item === 'string') sum += Number(item);
            else sum += item;
        });
        return sum;
    }

    let listboxProps = {
        ref: listElem,
        onScroll: (event: any) => {
            if (loading) return;

            const { scrollTop, scrollHeight, clientHeight } = event.target;
            const scrollPosition = scrollTop + clientHeight;
            if (scrollHeight - scrollPosition <= 1) {
                setPosition(scrollPosition);
                setPage(prev => prev + 1);
            }
        }
    } as any;

    return (
        <div>

            <Box style={{ 
                marginBottom: 30
            }}>
                <Typography variant='subtitle1'>Request Trees: <strong>{requiredTrees}</strong></Typography>
                <Typography variant='subtitle1'>Remaining Trees: <strong>{
                    Math.max(requiredTrees - plots
                    .map(pt => pt.available ?? 0)
                    .reduce((prev, current) => prev + current, 0), 0)
                }</strong></Typography>
                <Typography variant='subtitle1'>Tree distribution across the plots:</Typography>
                {plots.map((plot, idx) => {
                    const treesAllocated = plots
                        .slice(0, idx)
                        .map(pt => pt.available ?? 0)
                        .reduce((prev, current) => prev + current, 0);

                    const treesForCurrentPlot = Math.min(plot.available ?? 0, requiredTrees - treesAllocated);

                    return (
                        <Typography variant="body1" key={idx}>
                            {plot.name} <strong>[ Trees: {treesForCurrentPlot} ]</strong>
                        </Typography>
                    );
                })}
            </Box>

            <Autocomplete
                multiple
                loading={loading}
                value={plots}
                onChange={handlePlotChanges}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={plotsList}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                    <li {...props}>
                        {option.name} (Available: {option.available ?? 0})
                    </li>
                )}
                freeSolo
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            variant="outlined"
                            label={option.name}
                            {...getTagProps({ index })}
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Plots"
                        placeholder="Enter plot name to search..."
                        margin='none'
                        onChange={(event) => {
                            const { value } = event.target;
                            console.log(value);
                            setPage(0);
                            setPlotName(value);
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
                ListboxProps={listboxProps}
            />

            <div style={{ display: 'flex', marginTop: 20 }}>
                <h2 style={{ marginTop: "0px", paddingRight: "8px" }}>
                    Total:{" "}
                    <span style={{ color: "#C72542", fontStyle: "italic" }}>
                        {countSum(plots.map(item => item.total))}
                    </span>
                </h2>
                <h2 style={{ marginTop: "0px", paddingRight: "8px" }}>
                    Mapped:{" "}
                    <span style={{ color: "#C72542", fontStyle: "italic" }}>
                        {countSum(plots.map(item => item.booked))}
                    </span>
                </h2>
                <h2 style={{ marginTop: "0px", paddingRight: "8px" }}>
                    Assigned:{" "}
                    <span style={{ color: "#C72542", fontStyle: "italic" }}>
                        {countSum(plots.map(item => item.assigned))}
                    </span>
                </h2>
                <h2 style={{ marginTop: "0px", paddingRight: "8px" }}>
                    Available:{" "}
                    <span style={{ color: "#C72542", fontStyle: "italic" }}>
                        {countSum(plots.map(item => item.available))}
                    </span>
                </h2>
            </div>

        </div>
    );
}

export default PlotSelection;