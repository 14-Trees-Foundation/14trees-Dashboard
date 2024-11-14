import { Box, FormControl, FormControlLabel, InputAdornment, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { FC } from "react";
import FileInputComponent from "../../../../components/FileInputComponent";

interface PaymentFormProps {
    donorType: string
    onDonorTypeChange: (donorType: string) => void
    paymentMethod: string
    onPaymentMethodChange: (paymentMethod: string) => void
    panNumber: string | null
    onPanNumberChange: (panNumber: string | null) => void
}

const PaymentForm: FC<PaymentFormProps> = ({ donorType, onDonorTypeChange, paymentMethod, onPaymentMethodChange, panNumber, onPanNumberChange }) => {

    return (
        <Box>
            <Box>
                <FormControl fullWidth>
                    <InputLabel id="land-type-label">80g / 501 (c)/ FCRA matters</InputLabel>
                    <Select
                        labelId="land-type-label"
                        value={donorType}
                        label="Donor Type"
                        onChange={(e) => { onDonorTypeChange(e.target.value);  }}
                    >
                        <MenuItem value={'Indian Citizen'}>Indian Citizen</MenuItem>
                        <MenuItem value={'Foreign Donor'}>Foreign Donor</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                    <InputLabel id="payment-method-label">Payment Method</InputLabel>
                    <Select
                        disabled={donorType !== 'Indian Citizen'}
                        labelId="payment-method-label"
                        value={paymentMethod}
                        label="Payment Method"
                        onChange={(e) => { onPaymentMethodChange(e.target.value) }}
                    >
                        <MenuItem value={'UPI'}>UPI</MenuItem>
                        <MenuItem value={'Net Banking'}>Net Banking</MenuItem>
                        <MenuItem value={'Cheque'}>Cheque</MenuItem>
                        <MenuItem value={'Cash'}>Cash</MenuItem>
                        <MenuItem value={'Wire Transfer'}>Wire Transfer</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ mt: 2 }} hidden={donorType !== 'Indian Citizen'}>
                <TextField
                    label="Pan card Number"
                    name="pan_number"
                    value={panNumber}
                    onChange={(e) => { onPanNumberChange(e.target.value.toUpperCase() || null) }}
                    fullWidth
                />
            </Box>
        </Box>
    );
}

export default PaymentForm;
