import { Box, Checkbox, FormControl, FormControlLabel, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material"

interface PaymentBaseFormProps {
    amount: number
    donorType: string
    onDonorTypeChange: (donorType: string) => void
    panNumber: string
    onPanNumberChange: (panNumber: string) => void
    consent: boolean
    onConsentChange: (consent: boolean) => void
}

const PaymentBaseForm: React.FC<PaymentBaseFormProps> = ({ amount, donorType, panNumber, consent, onDonorTypeChange, onPanNumberChange, onConsentChange }) => {


    return (
        <Box>
            <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="amount">Amount</InputLabel>
                    <OutlinedInput
                        id="amount"
                        value={new Intl.NumberFormat('en-IN').format(amount)}
                        startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                        label="Amount"
                    />
                </FormControl>
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography mb={1}>Tax Benefits:</Typography>
                <FormControl fullWidth>
                    <InputLabel id="donor-label">Citizenship (Applicable for 80G/501(c)/FCRA)</InputLabel>
                    <Select
                        labelId="donor-label"
                        value={donorType}
                        label="Citizenship (Applicable for 80G/501(c)/FCRA)"
                        onChange={(e) => { onDonorTypeChange(e.target.value); }}
                    >
                        <MenuItem value={'Indian Citizen'}>Indian Citizen</MenuItem>
                        <MenuItem value={'Foreign Donor'}>Foreign Donor</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ mt: 2 }} hidden={donorType !== 'Indian Citizen'}>
                <TextField
                    label="PAN Number"
                    name="pan_number"
                    value={panNumber}
                    onChange={(e) => { onPanNumberChange(e.target.value.toUpperCase()) }}
                    fullWidth
                />
            </Box>
            <Box sx={{ mt: 2 }} hidden={donorType !== 'Indian Citizen' || panNumber !== ''}>
                <FormControlLabel control={<Checkbox checked={consent} onChange={(e, checked) => { onConsentChange(checked); }} />} label="I have not provided PAN number and I understand that I will not qualify for 80G benefit" />
            </Box>
        </Box>
    )
}

export default PaymentBaseForm;