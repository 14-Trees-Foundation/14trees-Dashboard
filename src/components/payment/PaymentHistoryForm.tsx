import { Box, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material"

interface PaymentHistoryFormProps {
    amount: number,
    receivedAmount: number,
    onReceivedAmountChange: (receivedAmount: number) => void
    paymentMethod: string,
    onPaymentMethodChange: (paymentMethod: string) => void
    status: string,
    onStatusChange: (status: string) => void
    paymentReceivedDate: string,
    onPaymentReceivedDateChange: (paymentReceivedDate: string) => void
}

const PaymentHistoryForm: React.FC<PaymentHistoryFormProps> = ({ amount, receivedAmount, onReceivedAmountChange, paymentMethod, onPaymentMethodChange, status, onStatusChange, paymentReceivedDate, onPaymentReceivedDateChange }) => {

    return (
        <Box>
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
                    <InputLabel id="payment-method-label">Payment Method</InputLabel>
                    <Select
                        labelId="payment-method-label"
                        disabled
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
            <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="received-amount">Received Amount</InputLabel>
                    <OutlinedInput
                        id="received-amount"
                        value={new Intl.NumberFormat('en-IN').format(receivedAmount)}
                        startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                        label="Amount"
                        onChange={(e) => { onReceivedAmountChange(e.target.value ? parseInt(e.target.value.replaceAll(',', '')) : 0) }}
                    />
                </FormControl>
            </Box>
            <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        value={status}
                        label="Status"
                        onChange={(e) => { onStatusChange(e.target.value) }}
                    >
                        <MenuItem value={"pending_validation"}>Pending Validation</MenuItem>
                        <MenuItem value={'payment_not_received'}>Payment not Received</MenuItem>
                        <MenuItem value={'validated'}>Validated</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ mt: 2 }}>
                <TextField
                    label="Payment received on"
                    type="date"
                    value={paymentReceivedDate.slice(0, 10)}
                    onChange={(e) => { onPaymentReceivedDateChange(e.target.value) }}
                    fullWidth
                />
            </Box>
        </Box>
    );
}

export default PaymentHistoryForm;