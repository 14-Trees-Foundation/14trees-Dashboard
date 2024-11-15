import { Box, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material"

interface PaymentBaseFormProps {
    amount: number
    donorType: string
    onDonorTypeChange: (donorType: string) => void
    panNumber: string
    onPanNumberChange: (panNumber: string) => void
}

const PaymentBaseForm: React.FC<PaymentBaseFormProps> = ({ amount, donorType, panNumber, onDonorTypeChange, onPanNumberChange }) => {


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
                <FormControl fullWidth>
                    <InputLabel id="donor-label">80g / 501 (c)/ FCRA matters</InputLabel>
                    <Select
                        labelId="donor-label"
                        value={donorType}
                        label="80g / 501 (c)/ FCRA matters"
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
                    onChange={(e) => { onPanNumberChange(e.target.value.toUpperCase()) }}
                    fullWidth
                />
            </Box>
        </Box>
    )
}

export default PaymentBaseForm;