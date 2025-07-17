import { Box, Button, Chip, Typography } from "@mui/material";
import { FC } from "react";

interface TreePlantTypeFilterProps {
    plantTypes: string[];
    selectedPlantTypes: string[];
    onPlantTypeSelect: (plantType: string) => void;
    onReset: () => void;
}

const TreePlantTypeFilter: FC<TreePlantTypeFilterProps> = ({
    plantTypes,
    selectedPlantTypes,
    onPlantTypeSelect,
    onReset
}) => {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography mb={1}>
                You can select tree(s) from the table below. Select plant type(s) or use filters to search for specific tree(s).
            </Typography>
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
            }}>
                {plantTypes.map((plantType, index) => (
                    <Chip
                        key={index}
                        label={plantType}
                        color="success"
                        variant={selectedPlantTypes.includes(plantType) ? 'filled' : "outlined"}
                        onClick={() => onPlantTypeSelect(plantType)}
                        sx={{ margin: '2px' }}
                    />
                ))}
            </Box>
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                <Button variant="outlined" color="success" onClick={onReset} sx={{ ml: 1 }}>
                    Reset
                </Button>
            </Box>
        </Box>
    );
};

export default TreePlantTypeFilter;