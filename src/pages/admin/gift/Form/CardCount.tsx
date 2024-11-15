import { FC } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

interface CardCountProps {
    disabled: boolean
    treeCount: number
    onTreeCountChange: (count: number) => void
    category: string
    onCategoryChange: (category: string) => void
    grove: string
    onGroveChange: (category: string) => void
}

const CardCount: FC<CardCountProps> = ({ disabled, treeCount, onTreeCountChange, category, onCategoryChange, grove, onGroveChange }) => {

    const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const number = parseInt(event.target.value);

        if (isNaN(number) || number < 0) onTreeCountChange(0);
        else onTreeCountChange(Number(number));
    }

    return (
        <div style={{ padding: '10px 40px', width: '100%' }}>
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
            <Box sx={{ mt: 2, mb: 2 }} style={{ display: category === 'Public' ? 'none' : 'block' }}>
                <FormControl fullWidth>
                    <InputLabel id="grove-label">Grove</InputLabel>
                    <Select
                        labelId="grove-label"
                        value={grove}
                        label="Grove"
                        onChange={(e) => { onGroveChange(e.target.value) }}
                    >
                        <MenuItem value={'No Preference'}>No Preference</MenuItem>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h6'>Please enter the number of gift cards: </Typography>
                <TextField
                    value={treeCount === 0 ? '' : treeCount}
                    onChange={handleCountChange}
                    disabled={disabled}
                    type='number'
                    size="small"
                />
            </div>
        </div>
    )
}

export default CardCount;