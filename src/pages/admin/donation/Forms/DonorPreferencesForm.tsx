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
                <Typography>Is there any occasion/event for which you are making donation?</Typography>
                <TextField
                    placeholder="Occasion/event name"
                    value={eventName}
                    onChange={(e) => { onEventNameChange(e.target.value) }}
                    fullWidth
                />
            </Box>
            <Box mt={3}>
                <FormControl>
                    <Typography>What would you like to do with your donation?</Typography>
                    <RadioGroup
                        name="preference"
                        value={preference}
                        onChange={handlePreferenceChange}
                    >
                        <FormControlLabel value="user_visit" control={<Radio />} label="Plant tree during a visit to 14 Trees by yourself" />
                        <FormControlLabel sx={{ mt: -1 }} value="14trees_plantation" control={<Radio />} label="Trees will be planted by 14 Trees as per plantation schedule under your name" />
                        <FormControlLabel sx={{ mt: -1 }} value="adopt_trees" control={<Radio />} label="Sponsor/adopt existing trees" />
                    </RadioGroup>
                </FormControl>
            </Box>
            <Box mt={3}>
                <Typography>You can provided alternate email address for communication</Typography>
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