import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";


interface PaymentFormProps {

}

const PaymentForm: React.FC<PaymentFormProps> = ({ }) => {
    const [panNumber, setPanNumber] = useState('');
    const [consent, setConsent] = useState(false);

    return (
        <div>
            <Typography variant="h4">CHECKOUT</Typography>
            <Typography variant="h6">Something Here</Typography>
            <Divider sx={{ backgroundColor: 'black', mb: 2 }} />

            <Grid container spacing={2}>
                <Grid item xs={6} container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="PAN Number"
                            name="pan_number"
                            value={panNumber}
                            disabled={consent}
                            sx={{
                                "& .Mui-disabled": {
                                    backgroundColor: "#f0f0f0",
                                },
                            }}
                            onChange={(e) => { setPanNumber(e.target.value.toUpperCase().trim()) }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Checkbox checked={consent} onChange={(e, checked) => { setConsent(checked); }} />} label="I have not provided PAN number and I understand that I will not qualify for 80G benefit" />
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
        </div>
    )
};


export default PaymentForm;