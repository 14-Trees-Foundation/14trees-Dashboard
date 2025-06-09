import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";

type Props = {
    isAboveLimit: boolean
    treesCount: number,
    onTreesCountChange: (value: number) => void
}

const TreesCount: React.FC<Props> = ({ isAboveLimit, treesCount, onTreesCountChange }) => {
    const treePresets = [2, 5, 10, 14, 50, 100];
    const [showCustomInput, setShowCustomInput] = useState(!treePresets.includes(treesCount));
    const [error, setError] = useState<string>("");

    const handlePresetSelect = (count: number) => {
        onTreesCountChange(count);
        setShowCustomInput(false);
        setError("");
    };

    const handleCustomTreeCount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        if (value === "") {
            setError("Number of trees is required");
            onTreesCountChange(0);
            return;
        }

        if (value.includes(".")) {
            setError("Decimal values are not allowed");
            return;
        }

        const numValue = parseInt(value);
        
        if (isNaN(numValue)) {
            setError("Please enter a valid number");
            return;
        }

        if (numValue < 0) {
            setError("Number of trees cannot be negative");
            return;
        }

        setError("");
        onTreesCountChange(numValue);
        setShowCustomInput(!treePresets.includes(numValue));
    };

    const handleOtherClick = () => {
        setShowCustomInput(true);
        setTimeout(() => {
            const input = document.querySelector('input[name="treesCount"]') as HTMLInputElement;
            if (input) {
                input.focus();
                input.select();
            }
        }, 0);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                How many trees would you like to sponsor?*
            </Typography>

            <Box sx={{
                border: 1,
                borderColor: error ? 'error.main' : 'divider',
                borderRadius: 1,
                p: 3,
                mb: 3,
                backgroundColor: 'background.paper'
            }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                        <TextField
                            name="treesCount"
                            type="number"
                            size="small"
                            value={treesCount}
                            onChange={handleCustomTreeCount}
                            error={!!error}
                            helperText={error}
                            inputProps={{
                                min: 1,
                                step: 1,
                            }}
                            sx={{
                                width: 200,
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">
                            Trees
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={1} sx={{ mt: 2 }}>
                    {treePresets.map((count) => (
                        <Grid item key={count}>
                            <Button
                                variant={treesCount === count ? "contained" : "outlined"}
                                color={treesCount === count ? "success" : "inherit"}
                                onClick={() => handlePresetSelect(count)}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: treesCount === count ? 'bold' : 'normal',
                                    minWidth: '80px'
                                }}
                            >
                                {count} Trees
                            </Button>
                        </Grid>
                    ))}
                    <Grid item>
                        <Button
                            variant={showCustomInput ? "contained" : "outlined"}
                            color={showCustomInput ? "success" : "inherit"}
                            onClick={handleOtherClick}
                            sx={{
                                textTransform: 'none',
                                fontWeight: showCustomInput ? 'bold' : 'normal',
                                minWidth: '80px'
                            }}
                        >
                            Other
                        </Button>
                    </Grid>
                </Grid>

                <Typography variant="body1" sx={{ mt: 2 }}>
                    Total Amount: ₹{(treesCount * 2000).toLocaleString()}
                    {isAboveLimit && (
                        <Typography component="span" color="error" sx={{ ml: 1 }}>
                            (Above Razorpay limit - Bank Transfer recommended)
                        </Typography>
                    )}
                </Typography>
            </Box>
        </Box>
    );
}

export default TreesCount;