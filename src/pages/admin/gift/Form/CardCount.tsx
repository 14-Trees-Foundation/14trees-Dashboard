import { FC } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";

interface CardCountProps {
    disabled: boolean
    treeCount: number
    onTreeCountChange: (count: number) => void
    category: string
    onCategoryChange: (category: string) => void
    grove: string | null
    onGroveChange: (grove: string | null) => void
}

const CardCount: FC<CardCountProps> = ({ disabled, treeCount, onTreeCountChange, category, onCategoryChange, grove, onGroveChange }) => {

    const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const number = parseInt(event.target.value);

        if (isNaN(number) || number < 0) onTreeCountChange(0);
        else onTreeCountChange(Number(number));
    }

    return (
        <div style={{ padding: '10px 40px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='h6' mr={5}>Please enter the number of gift cards: </Typography>
                <TextField
                    value={treeCount === 0 ? '' : treeCount}
                    onChange={handleCountChange}
                    disabled={disabled}
                    type='number'
                    size="small"
                />
            </div>
            <Box mt={2}>
                <Typography mb={1} variant='body1'>Where would you like to plant the trees? 
                    <Tooltip title={"Foundation sites are 14 Trees Foundation's land preserves and Public sites are government owned lands such as schools, guirans etc."}>
                        <Button><HelpOutline /></Button>
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
                <Typography mb={1} variant='body1'>If you want to plant trees in any specific grove, you can select appropriate grove from the dropdown.</Typography>
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

export default CardCount;