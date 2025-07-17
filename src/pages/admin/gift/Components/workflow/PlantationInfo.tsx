import { HelpOutline } from "@mui/icons-material";
import { Autocomplete, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
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
        value: '4',
        label: 'Wedding'
    },
    {
        value: '5',
        label: 'Anniversary'
    },
    {
        value: '6',
        label: 'Festival Celebration'
    },
    {
        value: '7',
        label: 'Retirement'
    },
    {
        value: '3',
        label: 'General gift'
    },
]

const GiftRequestTypes = ['Gift Cards', 'Normal Assignment', 'Promotion', 'Visit', 'Test']

interface Massages {
    primaryMessage: string,
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

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedEventType, setSelectedEventType] = useState<{ value: string, label: string } | null>(null);
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        const eventType = EventTypes.find(item => item.value === messages.eventType)
        setSelectedEventType(eventType ? eventType : null);
    }, [messages.eventType])

    // Initialize input value when treeCount changes from parent
    useEffect(() => {
        if (treeCount === 0) {
            setInputValue('');
        } else {
            setInputValue(treeCount.toString());
        }
    }, [treeCount])

    const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (treeCountDisabled) return; // Don't process if disabled
        
        const value = event.target.value;
        
        // Only allow numbers (including empty string for deletion)
        if (!/^\d*$/.test(value)) {
            return; // Don't update if contains non-numeric characters
        }
        
        // Update local input value immediately (allows free editing)
        setInputValue(value);
        
        // Update parent state
        if (value === '') {
            onTreeCountChange(0);
        } else {
            const number = parseInt(value);
            if (number >= 0) {
                onTreeCountChange(number);
            }
        }
    }

    const handleCountBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (treeCountDisabled) return; // Don't process if disabled
        
        const value = inputValue;
        const number = parseInt(value) || 0;
        
        // If empty or less than 1, set to 1
        if (value === '' || number < 1) {
            setInputValue('1');
            onTreeCountChange(1);
        }
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
        <Box sx={{ 
            overflow: 'hidden', 
            width: '100%', 
            maxWidth: '100%' 
        }}>
            <Box sx={{ 
                padding: isMobile ? '10px 16px' : '10px 24px', 
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box' 
            }}>
                <Box sx={{ 
                    mb: 2, 
                    display: 'flex', 
                    alignItems: isMobile ? 'flex-start' : 'center', 
                    justifyContent: 'space-between',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 1 : 0
                }}>
                    <Typography variant="body1" sx={{ mt: 2, mb: isMobile ? 1 : 0 }}>Request Type:</Typography>
                    <FormControl sx={{ mt: 1, minWidth: isMobile ? '100%' : '200px', maxWidth: isMobile ? '100%' : '250px' }}>
                        <Select
                            value={requestType}
                            size="small"
                            onChange={(e) => { onRequestTypeChange(e.target.value); }}
                            fullWidth
                        >
                            {GiftRequestTypes.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: isMobile ? 'flex-start' : 'center', 
                    justifyContent: 'space-between',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 1 : 0,
                    mb: 2
                }}>
                    <Typography variant='body1' sx={{ 
                        mr: isMobile ? 0 : 2, 
                        mb: isMobile ? 1 : 0,
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}>
                        Number of trees to be assigned/gifted (approximately)?
                        <Tooltip title={"This will help us assign an appropriate plot for the gift request"}>
                            <Button sx={{ ml: 0.5, minWidth: 'auto', p: 0.5 }} color="success">
                                <HelpOutline fontSize="small" />
                            </Button>
                        </Tooltip>
                    </Typography>
                    {treeCountDisabled ? (
                        <TextField
                            value={treeCount}
                            disabled={true}
                            type='text'
                            size="small"
                            helperText="Field is disabled (existing request)"
                            sx={{ 
                                minWidth: isMobile ? '100%' : '150px',
                                maxWidth: isMobile ? '100%' : '250px',
                                width: isMobile ? '100%' : 'auto'
                            }}
                        />
                    ) : (
                        <TextField
                            value={inputValue}
                            onChange={handleCountChange}
                            onBlur={handleCountBlur}
                            type='text'
                            size="small"
                            placeholder="1"
                            helperText="Enter number of trees"
                            inputProps={{ 
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                                autoComplete: 'off'
                            }}
                            sx={{ 
                                minWidth: isMobile ? '100%' : '150px',
                                maxWidth: isMobile ? '100%' : '250px',
                                width: isMobile ? '100%' : 'auto'
                            }}
                        />
                    )}
                </Box>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: isMobile ? 'flex-start' : 'center', 
                    justifyContent: 'space-between',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 1 : 0,
                    mb: 2
                }}>
                    <Typography variant='body1' sx={{ 
                        mr: isMobile ? 0 : 2, 
                        mb: isMobile ? 1 : 0,
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}>
                        Plantation Land Type
                        <Tooltip title={"Foundation sites are 14 Trees Foundation's land reserves and Public sites are government owned lands such as gairans, schools, roadside, etc."}>
                            <Button sx={{ ml: 0.5, minWidth: 'auto', p: 0.5 }} color="success">
                                <HelpOutline fontSize="small" />
                            </Button>
                        </Tooltip>
                    </Typography>
                    <FormControl sx={{ 
                        minWidth: isMobile ? '100%' : '200px', 
                        maxWidth: isMobile ? '100%' : '250px' 
                    }}>
                        <Select
                            value={category}
                            onChange={(e) => { onCategoryChange(e.target.value) }}
                            size="small"
                            fullWidth
                        >
                            <MenuItem value={'Foundation'}>Foundation Sites</MenuItem>
                            <MenuItem value={'Public'}>Public Sites</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <Grid container spacing={isSmall ? 1 : 2} sx={{ width: '100%', m: 0 }}>
                        <Grid item xs={12} sm={6}>
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
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                            {requestType !== 'Visit' && <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                </Box>
            </Box>
        </Box>
    );

}

export default PlantationInfo;