import { FC, useEffect, useState } from "react";
import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

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

const GiftRequestTypes = ['Cards Request', 'Normal Assignment', 'Promotion', 'Test']

interface Massages {
    primaryMessage: string,
    secondaryMessage: string,
    eventName: string,
    eventType: string | undefined,
    plantedBy: string,
    logoMessage: string,
}

interface DashboardDetailsProps {
    messages: Massages,
    onChange: (messages: Massages) => void,
    giftedOn: string,
    onGiftedOnChange: (date: string) => void,
    requestType: string,
    onRequestTypeChange: (requestType: string) => void,
}

const DashboardDetails: FC<DashboardDetailsProps> = ({ messages, onChange, giftedOn, onGiftedOnChange, requestType, onRequestTypeChange }) => {

    const [selectedEventType, setSelectedEventType] = useState<{ value: string, label: string } | null>(null);

    useEffect(() => {
        const eventType = EventTypes.find(item => item.value === messages.eventType)
        setSelectedEventType(eventType ? eventType : null);
    }, [messages])


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
        <div style={{ display: 'flex', padding: '10px 10px', width: '100%', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '42%' }}>
                <Typography variant='h6'>A few more details to make a bit more personalised dashboard: </Typography>
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
                            margin='dense'
                            label='Event Type'
                        />
                    )}
                />
                <Typography variant="body1" sx={{ mt: 2 }}>Event/Occasion Name</Typography>
                <TextField
                    name="eventName"
                    value={messages.eventName}
                    onChange={handleChange}
                    size="small"
                />
                <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="request-type">Request Type</InputLabel>
                        <Select
                            labelId="request-type"
                            value={requestType}
                            label="Request Type"
                            size="small"
                            onChange={(e) => { onRequestTypeChange(e.target.value); }}
                        >
                            {GiftRequestTypes.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                {requestType !== 'Normal Assignment' && <>
                    <Typography variant="body1" sx={{ mt: 2 }}>Gifted By</Typography>
                    <TextField
                        name="plantedBy"
                        value={messages.plantedBy}
                        onChange={handleChange}
                        size="small"
                    />
                    <Typography variant="body1" sx={{ mt: 2 }}>Gifted On</Typography>
                    <TextField
                        name="giftedOn"
                        value={giftedOn}
                        onChange={(e) => { onGiftedOnChange(e.target.value) }}
                        size="small"
                        type="date"
                    />
                </>}
            </div>
        </div>
    )
}

export default DashboardDetails;