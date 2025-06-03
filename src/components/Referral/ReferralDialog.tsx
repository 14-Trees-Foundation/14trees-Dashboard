import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    Snackbar,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ApiClient from '../../api/apiClient/apiClient';

interface ReferralDialogProps {
    linkType: 'donate' | 'gift-trees'
    open: boolean;
    onClose: () => void;
    c_key?: string;
}

interface Campaign {
    name: string;
    c_key: string;
}

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

export const ReferralDialog = ({ linkType, open, onClose, c_key }: ReferralDialogProps) => {
    const [referralLink, setReferralLink] = useState<string>('');
    const [showCopiedAlert, setShowCopiedAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userEmail') || '';
        }
        return '';
    });
    const [emailError, setEmailError] = useState<string | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<string>('');
    const [showCampaignSelection, setShowCampaignSelection] = useState(false);
    const [referralData, setReferralData] = useState<{ rfr: string, c_key: string } | null>(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const apiClient = new ApiClient();
                const response = await apiClient.getCampaigns(0, 20);
                setCampaigns(Array.isArray(response.results) ? response.results : []);
            } catch (err) {
                console.error('Failed to fetch campaigns:', err);
                setError('Failed to load campaigns. Please try again.');
            }
        };

        if (open && !c_key) {
            fetchCampaigns();
        }
    }, [open, c_key]);

    useEffect(() => {
        if (referralData) {
            const baseUrl = 'https://www.14trees.org';
            let link = `${baseUrl}/${linkType}`;
            const params = new URLSearchParams();

            if (referralData.rfr) {
                params.append('r', referralData.rfr);
            }

            // Use the selected campaign's c_key if available, otherwise use the one from referralData
            if (showCampaignSelection && selectedCampaign) {
                const selectedCampaignObj = campaigns.find(c => c.name === selectedCampaign);
                if (selectedCampaignObj?.c_key) {
                    params.append('c', selectedCampaignObj.c_key);
                }
            } else if (referralData.c_key) {
                params.append('c', referralData.c_key);
            }

            if (params.toString()) {
                link += '?' + params.toString();
            }

            setReferralLink(link);
        }
    }, [referralData, selectedCampaign, showCampaignSelection, campaigns, linkType]);

    const validateEmail = (email: string): boolean => {
        if (!email) {
            setEmailError('Email is required');
            return false;
        }
        if (!isValidEmail(email)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError(null);
        return true;
    };

    const handleGenerateLink = async () => {
        if (!validateEmail(email)) {
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            let campaignKey: string | undefined = c_key;
            if (!campaignKey && showCampaignSelection) {
                const selectedCampaignObj = campaigns.find(c => c.name === selectedCampaign);
                campaignKey = selectedCampaignObj?.c_key;
            }

            const apiClient =  new ApiClient();
            const resp = await apiClient.getReferral(email, campaignKey);
            setReferralData(resp);
        } catch (err) {
            console.error('Failed to generate referral link:', err);
            setError('Failed to generate referral link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        if (typeof window !== 'undefined') {
            localStorage.setItem('userEmail', newEmail);
        }
        validateEmail(newEmail);
    };

    const handleCampaignChange = (event: any) => {
        setSelectedCampaign(event.target.value);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setShowCopiedAlert(true);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setError('Failed to copy link to clipboard. Please try again.');
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Share 14 Trees Initiative</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Share our reforestation initiative with your friends and family using your personal referral link.
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Your Email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            error={!!emailError}
                            helperText={emailError}
                            sx={{ mb: 2 }}
                            InputProps={{
                                sx: {
                                    backgroundColor: '#f5f5f5',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: emailError ? '#d32f2f' : '#e0e0e0',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: emailError ? '#d32f2f' : '#bdbdbd',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: emailError ? '#d32f2f' : '#4caf50',
                                        },
                                    },
                                },
                            }}
                        />
                        {!c_key && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={showCampaignSelection}
                                        onChange={(e) => setShowCampaignSelection(e.target.checked)}
                                        sx={{
                                            color: '#4caf50',
                                            '&.Mui-checked': {
                                                color: '#4caf50',
                                            },
                                        }}
                                    />
                                }
                                label="Share via an ongoing campaign"
                                sx={{ mb: showCampaignSelection ? 2 : 0 }}
                            />
                        )}
                        {!c_key && showCampaignSelection && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Select Campaign</InputLabel>
                                <Select
                                    value={selectedCampaign}
                                    label="Select Campaign"
                                    onChange={handleCampaignChange}
                                    sx={{
                                        backgroundColor: '#f5f5f5',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#e0e0e0',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#bdbdbd',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#4caf50',
                                        },
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {campaigns.map((campaign) => (
                                        <MenuItem key={campaign.c_key} value={campaign.name}>
                                            {campaign.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        <TextField
                            fullWidth
                            value={referralLink}
                            placeholder="Your referral link will appear here"
                            InputProps={{
                                readOnly: true,
                                sx: {
                                    backgroundColor: '#f5f5f5',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#e0e0e0',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#bdbdbd',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#4caf50',
                                        },
                                    },
                                },
                                endAdornment: referralLink ? (
                                    <IconButton 
                                        onClick={handleCopyLink} 
                                        sx={{ 
                                            color: 'green',
                                            borderRadius: '10px',
                                            height: '100%',
                                            padding: '8px',
                                            margin: '-14px',
                                            '&:hover': {
                                                backgroundColor: 'rgb(146 195 146)',
                                            },
                                        }}
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={handleGenerateLink}
                                        disabled={isLoading || !email || !!emailError || (showCampaignSelection && !selectedCampaign)}
                                        sx={{ 
                                            whiteSpace: 'nowrap',
                                            backgroundColor: '#4caf50',
                                            borderRadius: '0 4px 4px 0',
                                            margin: '-14px',
                                            height: '100%',
                                            padding: '6px 16px',
                                            '&:hover': {
                                                backgroundColor: '#388e3c',
                                            },
                                        }}
                                    >
                                        {isLoading ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : (
                                            'Generate Link'
                                        )}
                                    </Button>
                                ),
                            }}
                        />
                        {error && (
                            <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                                {error}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showCopiedAlert}
                autoHideDuration={3000}
                onClose={() => setShowCopiedAlert(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" onClose={() => setShowCopiedAlert(false)}>
                    Link copied to clipboard!
                </Alert>
            </Snackbar>
        </>
    );
};
