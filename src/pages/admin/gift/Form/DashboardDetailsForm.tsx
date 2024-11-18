import { FC, useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Button, TextField, Typography } from "@mui/material";
import ApiClient from "../../../../api/apiClient/apiClient";

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
    onChange: (messages: Massages) => void
}

const DashboardDetails: FC<DashboardDetailsProps> = ({ messages, onChange }) => {

    const [selectedEventType, setSelectedEventType] = useState<{ value: string, label: string } | null>(null);

    useEffect(() => {
        const eventType = EventTypes.find(item => item.value === messages.eventType)
        setSelectedEventType(eventType ? eventType : null);
    }, [messages])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name: field, value }= e.target

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
                <Typography variant='h6'>Please few more details to display on profile dashboard: </Typography>
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
                <Typography variant="body1" sx={{ mt: 2 }}>Gifted By</Typography>
                <TextField
                    name="plantedBy"
                    value={messages.plantedBy}
                    onChange={handleChange}
                    size="small"
                />
            </div>
        </div>
    )
}

export default DashboardDetails;