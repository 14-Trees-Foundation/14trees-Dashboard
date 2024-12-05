import { HelpOutline } from "@mui/icons-material";
import { Box, Button, FormControl, InputAdornment, MenuItem, OutlinedInput, Select, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import { FC } from "react";

interface TreePlantationFormProps {
    category: string,
    grove: string | null,
    pledged: number,
    pledgedArea: number,
    pledgedType: "trees" | "acres",
    onCategoryChange: (category: string) => void,
    onGroveChange: (grove: string | null) => void,
    onPledgedChange: (type: "trees" | "acres", pledged: number) => void,
}

const TreePlantationForm: FC<TreePlantationFormProps> = ({ category, grove, pledged, pledgedArea, pledgedType, onCategoryChange, onGroveChange, onPledgedChange }) => {
    const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const number = pledgedType === "trees" ? parseInt(event.target.value) : parseFloat(event.target.value);

        if (isNaN(number) || number < 0) onPledgedChange(pledgedType, 0);
        else onPledgedChange(pledgedType, Number(number));
    }

    return (
        <div style={{ padding: '10px 40px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='body1' mr={5}>How would you like to sponsor?
                    <Tooltip title={"This will help us assign an appropriate plot for this request"}>
                        <Button sx={{ ml: -2 }} color="success"><HelpOutline fontSize="small" /></Button>
                    </Tooltip>
                </Typography>
                <ToggleButtonGroup
                    color="success"
                    value={pledgedType}
                    exclusive
                    onChange={(e, value) => { onPledgedChange(value, value === 'trees' ? pledged : pledgedArea) }}
                    aria-label="Platform"
                    size="small"
                >
                    <ToggleButton value="trees">Trees</ToggleButton>
                    <ToggleButton value="acres">Acres</ToggleButton>
                </ToggleButtonGroup>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <OutlinedInput
                        endAdornment={<InputAdornment position="end">{pledgedType === "acres" ? "Acres" : "Trees"}</InputAdornment>}
                        sx={{ ml: 2 }}
                        value={pledgedType === 'trees' ? pledged : pledgedArea}
                        onChange={handleCountChange}
                        type='number'
                        size="small"
                    />
                </FormControl>
            </div>
            <Box mt={2}>
                <Typography mb={1} variant='body1'>Where would you like to plant the trees?
                    <Tooltip title={"Foundation sites are 14 Trees Foundation's land reserves and Public sites are government owned lands such as gairans, schools, roadside, etc."}>
                        <Button sx={{ ml: -2 }} color="success"><HelpOutline fontSize="small" /></Button>
                    </Tooltip>
                </Typography>
                <FormControl fullWidth>
                    <Select
                        labelId="land-type-label"
                        value={category}
                        onChange={(e) => { onCategoryChange(e.target.value) }}
                    >
                        <MenuItem value={'Foundation'}>Foundation Sites</MenuItem>
                        <MenuItem value={'Public'}>Public Sites</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ mt: 2 }} style={{ display: category === 'Public' ? 'none' : 'block' }}>
                <Typography mb={1} variant='body1'>Select a grove where would you like the trees to be planted, or leave it blank for us to choose the best fit for you.</Typography>
                <FormControl fullWidth>
                    <Select
                        labelId="grove-label"
                        value={grove || 'None'}
                        onChange={(e) => { onGroveChange(e.target.value !== "None" ? e.target.value : null) }}
                    >
                        <MenuItem value={'None'}>No Preference</MenuItem>
                        <MenuItem value={'Visitor'}>Visitor Grove</MenuItem>
                        <MenuItem value={'Family'}>Family Grove</MenuItem>
                        <MenuItem value={'Memorial'}>Memorial Grove</MenuItem>
                        <MenuItem value={'Social/Professional group'}>Social/Professional group Grove</MenuItem>
                        <MenuItem value={'School/College Alumni'}>School/College Alumni Grove</MenuItem>
                        <MenuItem value={'Corporate'}>Corporate Grove</MenuItem>
                        <MenuItem value={'Conference'}>Conference Grove</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </div>
    )
}

export default TreePlantationForm;
