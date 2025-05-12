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
                <Typography variant='body1' mr={5}>Do you know the number of trees that are to be sponsored (approximately)?
                    <Tooltip title={"This will help us assign an appropriate plot for the gift request"}>
                        <Button sx={{ ml: -2 }} color="success"><HelpOutline fontSize="small"/></Button>
                    </Tooltip>
                </Typography>
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
                    <Tooltip title={"Foundation sites are 14 Trees Foundation's land reserves and Public sites are government owned lands such as gairans, schools, roadside, etc."}>
                        <Button sx={{ ml: -2 }} color="success"><HelpOutline fontSize="small"/></Button>
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
            {/* <Box sx={{ mt: 2 }} style={{ display: category === 'Public' ? 'none' : 'block' }}>
                <Typography mb={1} variant='body1'>Select a grove, such as birthday or memorial, based on the gifting occasion, or leave it blank for us to choose the best fit for you.</Typography>
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
            </Box> */}
        </div>
    )
}

export default CardCount;