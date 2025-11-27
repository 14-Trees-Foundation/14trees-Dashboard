import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    Box,
    TextField,
    Typography,
    Paper,
    Chip,
    Stack,
    CircularProgress,
    Button,
} from '@mui/material';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { LocationOn } from '@mui/icons-material';

interface Location {
    lat: number;
    lng: number;
    address?: string;
}

interface LocationPickerProps {
    value?: Location[];
    onChange?: (locations: Location[]) => void;
    label?: string;
    helperText?: string;
    required?: boolean;
    maxLocations?: number; // if 1, auto-replace existing location
}

const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '8px',
    marginTop: '16px',
};

const defaultCenter = {
    lat: 18.5204, // Pune, India
    lng: 73.8567,
};

const LocationPicker: React.FC<LocationPickerProps> = ({ 
    value = [], 
    onChange, 
    label = "Event Location",
    helperText = "Search and select location on map",
    required = false,
    maxLocations,
}) => {
    const [locations, setLocations] = useState<Location[]>(value);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [manualAddress, setManualAddress] = useState('');

    const apiKey = import.meta.env.VITE_APP_API_MAP_KEY || "";
    const hasValidApiKey = apiKey && apiKey !== "your_map_api_key_here" && apiKey.length > 20;

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries,
        ...(hasValidApiKey ? {} : { id: 'google-map-script-disabled' }), // Prevent loading if no valid key
    });

    useEffect(() => {
        if (isLoaded && searchInputRef.current) {
            const input = searchInputRef.current;
            if (input) {
                // Suppress the deprecation warning by catching it
                const originalWarn = console.warn;
                console.warn = (...args) => {
                    if (!args[0]?.includes?.('google.maps.places.Autocomplete')) {
                        originalWarn(...args);
                    }
                };

                const autocomplete = new google.maps.places.Autocomplete(input, {
                    fields: ['geometry', 'formatted_address', 'name'],
                });

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    
                    if (place.geometry && place.geometry.location) {
                        const newLocation: Location = {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                            address: place.formatted_address || place.name || 'Selected Location',
                        };

                        const cap = typeof maxLocations === 'number' ? maxLocations : Number.POSITIVE_INFINITY;
                        const updatedLocations = cap === 1 ? [newLocation] : [...locations, newLocation].slice(-cap);
                        setLocations(updatedLocations);
                        setMapCenter({ lat: newLocation.lat, lng: newLocation.lng });
                        
                        input.value = '';
                        
                        if (onChange) {
                            onChange(updatedLocations);
                        }
                    }
                });

                // Restore original console.warn after setup
                setTimeout(() => {
                    console.warn = originalWarn;
                }, 1000);
            }
        }
    }, [isLoaded, onChange]);

    // Sync internal state when external value changes
    useEffect(() => {
        if (Array.isArray(value)) {
            setLocations(value);
            if (value.length > 0 && typeof value[0]?.lat === 'number' && typeof value[0]?.lng === 'number') {
                setMapCenter({ lat: value[0].lat, lng: value[0].lng });
            }
        }
    }, [value]);

    const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            // Reverse geocoding to get address
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                let address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                
                if (status === 'OK' && results && results[0]) {
                    address = results[0].formatted_address;
                }

                const newLocation: Location = { lat, lng, address };
                const cap = typeof maxLocations === 'number' ? maxLocations : Number.POSITIVE_INFINITY;
                const updatedLocations = cap === 1 ? [newLocation] : [...locations, newLocation].slice(-cap);
                setLocations(updatedLocations);
                
                if (onChange) {
                    onChange(updatedLocations);
                }
            });
        }
    }, [locations, onChange, maxLocations]);

    const handleRemoveLocation = (index: number) => {
        const updatedLocations = locations.filter((_, i) => i !== index);
        setLocations(updatedLocations);
        
        if (onChange) {
            onChange(updatedLocations);
        }
    };

    const handleManualAddressSubmit = () => {
        if (!manualAddress.trim()) return;

        // If no valid API key, add location with just the address (no coordinates)
        const newLocation: Location = {
            lat: 0,
            lng: 0,
            address: manualAddress.trim(),
        };

        const cap = typeof maxLocations === 'number' ? maxLocations : Number.POSITIVE_INFINITY;
        const updatedLocations = cap === 1 ? [newLocation] : [...locations, newLocation].slice(-cap);
        setLocations(updatedLocations);
        setManualAddress('');
        
        if (onChange) {
            onChange(updatedLocations);
        }
    };

    // Fallback UI if no valid Google Maps API key
    if (!hasValidApiKey) {
        return (
            <Box>
                <Typography variant="subtitle2" gutterBottom>
                    {label} {required && <span style={{ color: 'red' }}>*</span>}
                </Typography>
                
                <Typography variant="caption" color="warning.main" sx={{ display: 'block', mb: 2 }}>
                    ⚠️ Google Maps API key not configured. Please enter location manually.
                </Typography>

                <Stack direction="row" spacing={1} alignItems="flex-start">
                    <TextField
                        fullWidth
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                        placeholder="Enter location address (e.g., Pune, Maharashtra, India)"
                        variant="outlined"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleManualAddressSubmit();
                            }
                        }}
                        InputProps={{
                            startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />,
                        }}
                    />
                    <Button 
                        variant="contained" 
                        onClick={handleManualAddressSubmit}
                        disabled={!manualAddress.trim()}
                        sx={{ minWidth: '80px', height: '56px' }}
                    >
                        Add
                    </Button>
                </Stack>

                {locations.length > 0 && (
                    <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Selected Locations ({locations.length}):
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {locations.map((loc, index) => (
                                <Chip
                                    key={index}
                                    label={loc.address || 'Unknown Location'}
                                    onDelete={() => handleRemoveLocation(index)}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ mb: 1 }}
                                />
                            ))}
                        </Stack>
                    </Paper>
                )}

                <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                    To enable map-based location picker, add Google Maps API key in .env file:<br/>
                    <code>VITE_APP_API_MAP_KEY=your_actual_api_key</code>
                </Typography>
            </Box>
        );
    }

    if (loadError) {
        return (
            <Box>
                <Typography color="error">
                    Error loading Google Maps. Please check your API key.
                </Typography>
            </Box>
        );
    }

    if (!isLoaded) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="subtitle2" gutterBottom>
                {label} {required && <span style={{ color: 'red' }}>*</span>}
            </Typography>

            {/* Search Box */}
            <TextField
                fullWidth
                placeholder="Search for a location (e.g., Pune, Maharashtra)"
                variant="outlined"
                inputRef={searchInputRef}
                InputProps={{
                    startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />,
                }}
            />

            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                {helperText}. You can also click directly on the map to add a location.
            </Typography>

            {/* Selected Locations */}
            {locations.length > 0 && (
                <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Selected Locations ({locations.length}):
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {locations.map((loc, index) => (
                            <Chip
                                key={index}
                                label={loc.address || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`}
                                onDelete={() => handleRemoveLocation(index)}
                                color="primary"
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                        ))}
                    </Stack>
                </Paper>
            )}

            {/* Google Map */}
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={12}
                onClick={onMapClick}
            >
                {locations.map((loc, index) => (
                    <Marker
                        key={index}
                        position={{ lat: loc.lat, lng: loc.lng }}
                        label={`${index + 1}`}
                    />
                ))}
            </GoogleMap>
        </Box>
    );
};

export default LocationPicker;
