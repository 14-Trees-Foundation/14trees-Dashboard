import { HelpOutline } from "@mui/icons-material";
import { Autocomplete, Button, Divider, Grid, TextField, Tooltip, Typography } from "@mui/material";

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

interface DashboardDetailsFormProps {

}

const DashboardDetailsForm: React.FC<DashboardDetailsFormProps> = ({ }) => {

    return (
        <div>
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
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Event/Occasion</Typography>
                        <Autocomplete
                            size="small"
                            options={EventTypes}
                            getOptionLabel={option => option.label}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    name="eventType"
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
                            name="plantedBy"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Gifted On</Typography>
                        <TextField
                            fullWidth
                            name="giftedOn"
                            size="small"
                            type="date"
                        />
                    </Grid>
                </Grid>
            </Grid>
        </div >
    )
};


export default DashboardDetailsForm;