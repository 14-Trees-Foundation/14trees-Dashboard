import { Box, FormControl, FormControlLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material"
import { useState } from "react"

interface DonorPreferencesFromProps {
    preference: string
    onPreferenceChange: (preference: string) => void
    eventName: string
    onEventNameChange: (eventName: string) => void
    alternateEmail: string
    onAlternateEmailChange: (alternateEmail: string) => void
}

const DonorPreferencesFrom: React.FC<DonorPreferencesFromProps> = ({ preference, onPreferenceChange, eventName, onEventNameChange, alternateEmail, onAlternateEmailChange }) => {

    const [emailError, setEmailError] = useState(false);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleAlternateEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;
        if (value) {
            setEmailError(!isValidEmail(value));
        }
        onAlternateEmailChange(value.trim());
    }

    const handlePreferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onPreferenceChange((event.target as HTMLInputElement).value);
    };

    return (
        <Box>
            <Box>
                <Typography>Is this donation for a specific occasion or event? If not, that's absolutely fine—your thoughtful gesture means a lot to us.</Typography>
                <TextField
                    placeholder="Occasion/event name"
                    value={eventName}
                    onChange={(e) => { onEventNameChange(e.target.value) }}
                    fullWidth
                />
            </Box>
            <Box mt={3}>
                <FormControl>
                    <Typography>How would you like your donation to be used?</Typography>
                    <RadioGroup
                        name="preference"
                        value={preference}
                        onChange={handlePreferenceChange}
                    >
                        <FormControlLabel value="user_visit" control={<Radio />} label="Plant a tree yourself during a visit to 14 Trees" />
                        <FormControlLabel sx={{ mt: -1 }} value="14trees_plantation" control={<Radio />} label="Let 14 Trees team plant trees under your name as per the plantation schedule" />
                        <FormControlLabel sx={{ mt: -1 }} value="adopt_trees" control={<Radio />} label="Sponsor or adopt existing trees" />
                    </RadioGroup>
                </FormControl>
            </Box>
            <Box mt={3}>
                <Typography>You may provide an alternate email address for communication.</Typography>
                <TextField
                    placeholder="Alternate email"
                    value={alternateEmail}
                    onChange={handleAlternateEmailChange}
                    fullWidth
                    error={emailError}
                    helperText={emailError ? "Invalid email address" : ''}
                />
            </Box>
        </Box>
    )
}

export default DonorPreferencesFrom;