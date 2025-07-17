import { Box, Button, Chip, Typography } from "@mui/material";
import { FC } from "react";

interface PlotTagSelectorProps {
    tags: string[];
    selectedTags: string[];
    onTagSelect: (tag: string) => void;
    onSelectAll: () => void;
    onReset: () => void;
}

const PlotTagSelector: FC<PlotTagSelectorProps> = ({
    tags,
    selectedTags,
    onTagSelect,
    onSelectAll,
    onReset
}) => {
    return (
        <Box sx={{ marginBottom: '20px' }}>
            <Typography>Select tags to filter plots</Typography>
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
            }}>
                {tags.map((tag, index) => (
                    <Chip
                        key={index}
                        label={tag}
                        color="success"
                        variant={selectedTags.includes(tag) ? 'filled' : "outlined"}
                        onClick={() => onTagSelect(tag)}
                        sx={{ margin: '2px' }}
                    />
                ))}
            </Box>
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                <Button variant="contained" color="success" onClick={onSelectAll}>
                    All
                </Button>
                <Button variant="outlined" color="success" onClick={onReset} sx={{ ml: 1 }}>
                    Reset
                </Button>
            </Box>
        </Box>
    );
};

export default PlotTagSelector;