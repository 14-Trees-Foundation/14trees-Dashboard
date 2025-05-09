import { HelpOutline } from "@mui/icons-material";
import { Autocomplete, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const EventTypes = [
    {
        value: '1',
        label: 'Birthday'
    },
    {
        value: '2',
        label: 'Memorial'
    },
    {
        value: '3',
        label: 'General gift'
    },
]

const GiftRequestTypes = ['Gift Cards', 'Normal Assignment', 'Promotion', 'Visit', 'Test']

interface Massages {
    primaryMessage: string,
    secondaryMessage: string,
    eventName: string,
    eventType: string | undefined,
    plantedBy: string,
    logoMessage: string,
}

interface PlantationInfoProps {
    treeCountDisabled: boolean
    treeCount: number
    onTreeCountChange: (count: number) => void
    category: string
    onCategoryChange: (category: string) => void
    messages: Massages,
    onChange: (messages: Massages) => void,
    giftedOn: string,
    onGiftedOnChange: (date: string) => void,
    requestType: string,
    onRequestTypeChange: (requestType: string) => void,
}

const PlantationInfo: React.FC<PlantationInfoProps> = ({ treeCountDisabled, treeCount, onTreeCountChange, category, onCategoryChange, messages, onChange, giftedOn, onGiftedOnChange, requestType, onRequestTypeChange }) => {

    const [selectedEventType, setSelectedEventType] = useState<{ value: string, label: string } | null>(null);

    useEffect(() => {
        const eventType = EventTypes.find(item => item.value === messages.eventType)
        setSelectedEventType(eventType ? eventType : null);
    }, [messages])

    const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const number = parseInt(event.target.value);

        if (isNaN(number) || number < 0) onTreeCountChange(0);
        else onTreeCountChange(Number(number));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: field, value } = e.target

        onChange({
            ...messages,
            [field]: value,
        })
    }

    const handleEventTypeSelection = (e: any, item: { value: string, label: string } | null) => {
        onChange({
            ...messages,
            eventType: item ? item.value : undefined,
        })
    }

    return (
        <Box>
            <div style={{ padding: '10px 40px', width: '100%' }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1" sx={{ mt: 2 }}>Request Type:</Typography>
                    <FormControl sx={{ mt: 1 }}>
                        <Select
                            value={requestType}
                            size="small"
                            onChange={(e) => { onRequestTypeChange(e.target.value); }}
                            style={{ width: '250px' }}
                        >
                            {GiftRequestTypes.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='body1' mr={5}>Number of trees to be assigned/gifted (approximately)?
                        <Tooltip title={"This will help us assign an appropriate plot for the gift request"}>
                            <Button sx={{ ml: -2 }} color="success"><HelpOutline fontSize="small" /></Button>
                        </Tooltip>
                    </Typography>
                    <TextField
                        value={treeCount === 0 ? '' : treeCount}
                        onChange={handleCountChange}
                        disabled={treeCountDisabled}
                        type='number'
                        size="small"
                        style={{ width: '250px' }}
                    />
                </div>
                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} mt={2}>
                    <Typography mb={1} variant='body1'>Plantation Land Type
                        <Tooltip title={"Foundation sites are 14 Trees Foundation's land reserves and Public sites are government owned lands such as gairans, schools, roadside, etc."}>
                            <Button sx={{ ml: -2 }} color="success"><HelpOutline fontSize="small" /></Button>
                        </Tooltip>
                    </Typography>
                    <FormControl>
                        <Select
                            value={category}
                            onChange={(e) => { onCategoryChange(e.target.value) }}
                            size="small"
                            style={{ width: '250px' }}
                        >
                            <MenuItem value={'Foundation'}>Foundation Sites</MenuItem>
                            <MenuItem value={'Public'}>Public Sites</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body1" sx={{ mt: 2 }}>Event/Occasion</Typography>
                            <Autocomplete
                                size="small"
                                value={selectedEventType}
                                options={EventTypes}
                                getOptionLabel={option => option.label}
                                onChange={handleEventTypeSelection}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        name="eventType"
                                        label='Event Type'
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" sx={{ mt: 2 }}>Event/Occasion Name</Typography>
                            <TextField
                                placeholder="Occasion Name"
                                name="eventName"
                                value={messages.eventName}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        {requestType !== 'Normal Assignment' && <>
                            {requestType !== 'Visit' && <Grid item xs={6}>
                                <Typography variant="body1" sx={{ mt: 2 }}>Gifted By</Typography>
                                <TextField
                                    name="plantedBy"
                                    placeholder="Gifted By"
                                    value={messages.plantedBy}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                />
                            </Grid>}
                            <Grid item xs={6}>
                                <Typography variant="body1" sx={{ mt: 2 }}>{requestType === 'Visit' ? 'Visited' : 'Gifted'} On</Typography>
                                <TextField
                                    name="giftedOn"
                                    value={giftedOn}
                                    onChange={(e) => { onGiftedOnChange(e.target.value) }}
                                    size="small"
                                    fullWidth
                                    type="date"
                                />
                            </Grid>
                        </>}
                    </Grid>
                </div>
            </div>
        </Box>
    );

}

export default PlantationInfo;