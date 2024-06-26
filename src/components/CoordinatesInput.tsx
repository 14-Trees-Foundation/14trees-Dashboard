import React, { useState } from 'react';
import {
    TextField,
    IconButton,
    Box,
    Grid,
    Chip,
    InputAdornment,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';

interface LatLng {
    lat: number;
    lng: number;
}

interface CoordinatesInputProps {
    coordinates?: LatLng[];
    onChange?: (coordinates: LatLng[]) => void;
}

const CoordinatesInput: React.FC<CoordinatesInputProps> = ({ coordinates, onChange }: CoordinatesInputProps) => {
    const [latLngs, setLatLngs] = useState<LatLng[]>(coordinates || []);
    const [lat, setLat] = useState<string>('');
    const [lng, setLng] = useState<string>('');
    const [latError, setLatError] = useState<boolean>(false);
    const [lngError, setLngError] = useState<boolean>(false);

    const validateLatLng = (lat: string, lng: string) => {
        let valid = true;
        if (isNaN(parseFloat(lat)) || lat === '') {
            setLatError(true);
            valid = false;
        } else {
            setLatError(false);
        }

        if (isNaN(parseFloat(lng)) || lng === '') {
            setLngError(true);
            valid = false;
        } else {
            setLngError(false);
        }

        return valid;
    };

    const handleAdd = () => {
        if (!validateLatLng(lat, lng)) return;

        const latLng = { lat: parseFloat(lat), lng: parseFloat(lng) };
        setLat('');
        setLng('');

        if (latLngs.some((item) => item.lat === latLng.lat && item.lng === latLng.lng)) return;

        setLatLngs([...latLngs, latLng]);
        onChange && onChange([...latLngs, latLng]);
    };

    const handleRemove = (index: number) => {
        const newLatLngs = [...latLngs];
        newLatLngs.splice(index, 1);
        setLatLngs(newLatLngs);
        onChange && onChange(newLatLngs);
    };

    return (
        <Box width={'100%'}>
            <TextField
                label="Boundaries Coordinates"
                variant="outlined"
                fullWidth
                InputProps={{
                    startAdornment: latLngs.length > 0 && (
                        <InputAdornment position="start">
                            {latLngs.map((latLng, index) => (
                                <Chip
                                    key={index}
                                    label={`${latLng.lat}, ${latLng.lng}`}
                                    onDelete={() => handleRemove(index)}
                                    deleteIcon={<Close />}
                                    sx={{ margin: 0.5 }}
                                />
                            ))}
                        </InputAdornment>
                    ),
                    readOnly: true,
                }}
            />
            <Box mt={2}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={5}>
                        <TextField
                            label="Latitude"
                            variant="outlined"
                            fullWidth
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            error={latError}
                            helperText={latError ? "Invalid latitude" : ""}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            label="Longitude"
                            variant="outlined"
                            fullWidth
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                            error={lngError}
                            helperText={latError ? "Invalid longitude" : ""}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton
                            color="success"
                            onClick={handleAdd}
                            disabled={!lat || !lng}
                        >
                            <Add />
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>

        </Box>
    );
};

export default CoordinatesInput;
