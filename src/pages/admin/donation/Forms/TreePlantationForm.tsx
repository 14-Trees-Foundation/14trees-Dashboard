import { Box, FormControl, FormControlLabel, InputAdornment, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { FC } from "react";

interface TreePlantationFormProps {
    category: string,
    grove: string | null,
    pledged: number,
    userVisit: boolean,
    onCategoryChange: (category: string) => void,
    onGroveChange: (grove: string | null) => void,
    onPledgedChange: (pledged: number) => void,
    onUserVisitChange: (userVisit: boolean) => void,
}

const TreePlantationForm: FC<TreePlantationFormProps> = ({ category, grove, pledged, userVisit, onCategoryChange, onGroveChange, onPledgedChange, onUserVisitChange }) => {

    return (
        <Box>
            <Box>
                <FormControl fullWidth>
                    <InputLabel id="land-type-label">Land Type</InputLabel>
                    <Select
                        labelId="land-type-label"
                        value={category}
                        label="Land Type"
                        onChange={(e) => { onCategoryChange(e.target.value) }}
                    >
                        <MenuItem value={'Foundation'}>Foundation</MenuItem>
                        <MenuItem value={'Public'}>Public</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ mt: 2 }} style={{ display: category === 'Public' ? 'none' : 'block' }}>
                <FormControl fullWidth>
                    <InputLabel id="grove-label">Grove</InputLabel>
                    <Select
                        labelId="grove-label"
                        value={grove}
                        label="Grove"
                        onChange={(e) => { onGroveChange(e.target.value) }}
                    >
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
            <Box sx={{ mt: 2 }}>
                <TextField
                    type="number"
                    label="Number Of Trees"
                    name="pledged"
                    value={pledged || ""}
                    inputProps={{ min: 1 }}
                    onChange={(e) => { onPledgedChange(parseInt(e.target.value || "0")) }}
                    fullWidth
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="amount">Amount</InputLabel>
                    <OutlinedInput
                        id="amount"
                        value={new Intl.NumberFormat('en-IN').format(pledged * (category === 'Public' ? 1500 : 3000))}
                        startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                        label="Amount"
                    />
                </FormControl>
            </Box>
            <Box sx={{ mt: 2 }}>
                <FormControl>
                    <Typography>Would you like to visit the 14 Trees Foundation and plant trees your self?</Typography>
                    <RadioGroup
                        row
                        value={userVisit ? "yes" : "no"}
                        onChange={(e) => { onUserVisitChange(e.target.value === 'yes' ? true : false) }}
                    >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
            </Box>
        </Box>
    );
}

export default TreePlantationForm;
