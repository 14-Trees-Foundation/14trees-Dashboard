import { Box, Button, Divider, FormControl, InputAdornment, OutlinedInput, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

import imagePoster from '../../../../../assets/ARANYA_poster.jpg'
import { useState } from "react";
import { CardGiftcard } from "@mui/icons-material";

const treesCountList = ["5", "10", "14", "50", "100", "Other"]

interface PlantationFormProps {

}

const PlantationForm: React.FC<PlantationFormProps> = ({ }) => {

    const [selectedCount, setSelectedCount] = useState<string | null>('14');
    const [customCount, setCustomCount] = useState('14');

    const handleToggle = (_: React.MouseEvent<HTMLElement>, newCount: string | null) => {
        if (newCount !== null) {
            setSelectedCount(newCount);
            setCustomCount(prev => newCount !== 'Other' ? newCount : prev); // Clear custom count when selecting preset options
        }
    };

    const handleCustomCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomCount(value);
        setSelectedCount(treesCountList.find(item => item === value) ?? 'Other'); // Select "Other" if custom input is provided
    };

    return (
        <div>
            <Box
                display={"flex"}
                alignItems={"center"}
            >
                <img
                    src={imagePoster}
                    style={{
                        height: '400px'
                    }}
                />
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}
                >
                    <Typography variant="h4">GIFT TREES</Typography>
                    <Typography variant="h6">Something Here</Typography>
                    <Divider sx={{ backgroundColor: 'black', mb: 2 }} />
                    <Typography fontSize={18}>Gift a tree in someone's name as a heartfelt and everlasting way to show your appreciation. Your gift will support reforestation work in the locations where it is needed most! Simply choose how many trees you would like to plant, design your custom e-card, and let us know when you would like to send it.</Typography>
                    <Typography variant="subtitle1">By gifting a tree, you will help to:</Typography>
                    <Typography variant="subtitle2">Provide jobs to minimize poverty in local communities</Typography>
                    <Typography variant="subtitle2">Improve climate change resilience & mitigation</Typography>
                    <Typography variant="subtitle2">Restore forest cover to improve food security</Typography>

                    <Box p={2} mt={2} alignSelf='center' sx={{ maxWidth: 600, border: '1px solid #ddd', borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            NUMBER OF TREES TO BE PLANTED:
                        </Typography>

                        {/* Toggle Buttons */}
                        <ToggleButtonGroup
                            value={selectedCount}
                            exclusive
                            onChange={handleToggle}
                            aria-label="tree count"
                            fullWidth
                            sx={{
                                mb: 2,
                              }}
                            size="small"
                        >
                            {treesCountList.map((item) => (
                                <ToggleButton key={item} value={item}>{item}</ToggleButton>
                            ))}
                        </ToggleButtonGroup>

                        <FormControl fullWidth sx={{ mb: 1 }} size="small" variant="outlined">
                            <OutlinedInput
                                endAdornment={<InputAdornment position="end">TREES</InputAdornment>}
                                type="number"
                                inputProps={{ min: 1 }}
                                value={customCount}
                                onChange={handleCustomCountChange}
                            />
                        </FormControl>

                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<CardGiftcard />}
                            fullWidth
                        >
                            GIFT TREES
                        </Button>
                    </Box>
                </Box>
            </Box>
        </div>
    )
};


export default PlantationForm;