import { Autocomplete, Box, Button, Divider, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Group } from "../../../../../types/Group";

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
        label: 'Festival'
    },
    {
        value: '3',
        label: 'General gift'
    },
]

interface DashboardDetailsFormProps {
    defaultGiftedByName?: string
    onEventTypeChange: (value: string) => void
}

const DashboardDetailsForm: React.FC<DashboardDetailsFormProps> = ({ defaultGiftedByName, onEventTypeChange }) => {

    const [formData, setFormData] = useState({
        eventName: "",
        eventType: "",
        giftedBy: "",
        giftedOn: new Date().toISOString().slice(0, 10),
    });

    useEffect(() =>{
        const value = sessionStorage.getItem('dashboard_details');
        if (value) setFormData(JSON.parse(value));
        console.log(EventTypes.find(item => item.value === formData.eventType));
    }, [])

    useEffect(() => {
        if (formData.giftedBy === '' && defaultGiftedByName) {
            setFormData({
                ...formData,
                giftedBy: defaultGiftedByName
            })
        }
    }, [defaultGiftedByName])

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleEventTypeSelection = (e: any, item: { value: string, label: string } | null) => {
        setFormData(prev => ({
            ...prev,
            eventType: item ? item.value : '',
        }))
        onEventTypeChange(item ? item.value : '')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sessionStorage.setItem("dashboard_details", JSON.stringify(formData));
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                p: 3,
                maxWidth: 800,
                mx: "auto",
                backgroundColor: "#fff",
            }}
        >
            <Typography variant="h6">Personalised Dashboard</Typography>
            <Divider sx={{ backgroundColor: 'black', mb: 5 }} />

            <Grid container rowSpacing={2} columnSpacing={10}>
                <Grid item xs={6} container spacing={2}>
                    <Grid item xs={12}>
                        <Typography>Event/Occasion Name</Typography>
                        <TextField
                            fullWidth
                            name="eventName"
                            size="small"
                            value={formData.eventName}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Event/Occasion</Typography>
                        <Autocomplete
                            size="small"
                            value={EventTypes.find(item => item.value === formData.eventType) ?? null}
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
                    </Grid>
                </Grid>
                <Grid item xs={6} container spacing={2}>
                    <Grid item xs={12}>
                        <Typography>Gifted By</Typography>
                        <TextField
                            fullWidth
                            name="giftedBy"
                            size="small"
                            value={formData.giftedBy}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Gifted On</Typography>
                        <TextField
                            fullWidth
                            name="giftedOn"
                            size="small"
                            type="date"
                            value={formData.giftedOn}
                            onChange={handleInputChange}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="success" fullWidth>
                        Submit
                    </Button>
                </Grid>
            </Grid>

        </Box >
    )
};


export default DashboardDetailsForm;