import { Box, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import { FC, useEffect, useState } from "react";
import FileInputComponent from "../FileInputComponent";
import PaymentQR14tree from "../../assets/PaymentQR14tree.jpg";

interface PaymentFormProps {
    amount: number,
    donorType: string,
    onDonorTypeChange: (donorType: string) => void,
    paymentMethod: string | undefined
    onPaymentMethodChange: (paymentMethod: string | undefined) => void
    panNumber: string | null
    onPanNumberChange: (panNumber: string | null) => void
    paymentProof: File | null
    onPaymentProofChange: (paymentProof: File | null) => void
}

const PaymentForm: FC<PaymentFormProps> = ({ amount, donorType, onDonorTypeChange, paymentMethod, onPaymentMethodChange, panNumber, onPanNumberChange, paymentProof, onPaymentProofChange }) => {

    return (
        <Box style={{ display: 'flex', padding: '40px', width: '100%', justifyContent: 'space-between' }}>
            <Box width="45%">
                <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="amount">Amount</InputLabel>
                        <OutlinedInput
                            id="amount"
                            disabled
                            value={new Intl.NumberFormat('en-IN').format(amount)}
                            startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                            label="Amount"
                        />
                    </FormControl>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="donor-label">Applicable 80g / 501 (c)/ FCRA</InputLabel>
                        <Select
                            labelId="donor-label"
                            value={donorType}
                            label="Applicable for 80g / 501 (c)/ FCRA"
                            onChange={(e) => { onDonorTypeChange(e.target.value); }}
                        >
                            <MenuItem value={'Indian Citizen'}>Indian Citizen</MenuItem>
                            <MenuItem value={'Foreign Donor'}>Foreign Donor</MenuItem>
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
                <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="payment-method-label">Payment Method</InputLabel>
                        <Select
                            disabled={donorType !== 'Indian Citizen'}
                            labelId="payment-method-label"
                            value={paymentMethod || "None"}
                            label="Payment Method"
                            onChange={(e) => { onPaymentMethodChange(e.target.value !== "None" ? e.target.value : undefined) }}
                        >
                            <MenuItem value={"None"}>Not Selected</MenuItem>
                            <MenuItem value={'UPI'}>UPI</MenuItem>
                            <MenuItem value={'Net Banking'}>Net Banking</MenuItem>
                            <MenuItem value={'Cheque'}>Cheque</MenuItem>
                            <MenuItem value={'Cash'}>Cash</MenuItem>
                            <MenuItem value={'Wire Transfer'}>Wire Transfer</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <Box width="45%">
                <div style={{ textAlign: "center" }}>
                    <img
                        // eslint-disable-next-line no-octal-escape
                        src={PaymentQR14tree} // Replace with your QR code image URL
                        alt="QR Code"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "200px",
                            marginBottom: "20px",
                        }}
                    />
                </div>
                <Box sx={{ mt: 2 }}>
                    <FileInputComponent file={paymentProof} onFileChange={onPaymentProofChange} />
                </Box>
            </Box>
        </Box>
    );
}

export default PaymentForm;
