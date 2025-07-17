import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";


interface PaymentFormProps {

}

const PaymentForm: React.FC<PaymentFormProps> = ({ }) => {
    const [formData, setFormData] = useState({
        panNumber: '',
        consent: false,
    })

    useEffect(() => {
        const value = sessionStorage.getItem("payment_details");
        if (value) setFormData(JSON.parse(value));
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sessionStorage.setItem("payment_details", JSON.stringify(formData));
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
            <Typography variant="h4">CHECKOUT</Typography>
            <Typography variant="h6">Something Here</Typography>
            <Divider sx={{ backgroundColor: 'black', mb: 2 }} />

            <Grid container spacing={2}>
                <Grid item xs={6} container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="PAN Number"
                            name="panNumber"
                            value={formData.panNumber}
                            disabled={formData.consent}
                            sx={{
                                "& .Mui-disabled": {
                                    backgroundColor: "#f0f0f0",
                                },
                            }}
                            onChange={(e) => { setFormData( prev => ({ ...prev, panNumber: e.target.value.toUpperCase().trim()}))}}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Checkbox checked={formData.consent} onChange={(e, checked) => { setFormData( prev => ({ ...prev, consent: checked}) ) }} />} label="I have not provided PAN number and I understand that I will not qualify for 80G benefit" />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            sx={{ textTransform: 'none' }}
                            onClick={() => {  }}
                            color="success" variant="contained">
                            Make Payment
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={5} container spacing={0}>
                    <Grid item xs={4}>
                        <Typography>Total Trees:</Typography>
                        <Typography>Amount payable:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography><strong>20</strong></Typography>
                        <Typography><strong>₹ 60,000/-</strong></Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
};


export default PaymentForm;