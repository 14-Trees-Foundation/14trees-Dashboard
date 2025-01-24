import { Autocomplete, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material"
import { useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import { AWSUtils } from "../../../helpers/aws";
import { CardGiftcard } from "@mui/icons-material";
import CardDetails from "../gift/Form/CardDetailsForm";

const EventTypes = [
    {
        value: '1',
        label: 'Birthday'
    },
    {
        value: '2',
        label: 'Memorial'
    },
    {
        value: '3',
        label: 'General gift'
    },
]

interface RedeemGiftTreeDialogProps {
    open: boolean
    onClose: () => void
    tree: {
        giftCardId: number,
        treeId: number,
        saplingId: string,
        plantType: string,
        requestId: string,
    }
}

const RedeemGiftTreeDialog: React.FC<RedeemGiftTreeDialogProps> = ({ tree, open, onClose }) => {

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        birth_date: '',
        gifted_by: '',
        event_name: '',
        event_type: '',
        gifted_on: new Date().toISOString().slice(0, 10),
    });
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [selectedEventType, setSelectedEventType] = useState<{ value: string, label: string } | null>(null);
    const [messages, setMessages] = useState({ primaryMessage: '', secondaryMessage: '', logoMessage: '', eventName: '', eventType: '' as string | undefined, plantedBy: '' });
    const [presentationId, setPresentationId] = useState<string | null>(null);
    const [slideId, setSlideId] = useState<string | null>(null);
    const [step, setStep] = useState(0);

    const validateTheName = (name: string) => {
        if (name.trim()) setErrors({ ...errors, name: '' });
        else setErrors({ ...errors, name: 'Name is required' });

        return name.trim() === '' ? false : true;
    }

    const validateTheEmail = (email: string) => {
        let isValid = true;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setErrors({ ...errors, email: 'Email is not valid' });
            isValid = false;
        } else setErrors({ ...errors, email: '' });

        return isValid;
    }

    const validateThePhone = (phone: string) => {
        let isValid = true;
        const phonePattern = /^[0-9]{10}$/; // Assuming a 10-digit phone number
        if (phone && !phonePattern.test(phone)) {
            setErrors({ ...errors, phone: 'Phone number is not valid' });
            isValid = false;
        } else setErrors({ ...errors, phone: '' });

        return isValid;
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {

        if (event.target.name === 'name') validateTheName(event.target.value);
        if (event.target.name === 'email') validateTheEmail(event.target.value);
        if (event.target.name === 'phone') validateThePhone(event.target.value);

        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setProfileImage(file);
    };

    const handleRedeemGiftTreeDialog = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!tree.saplingId || !tree.treeId) {
            toast.error("Gifted tree not found!");
            return;
        }

        try {

            let profileImageUrl: string | null = null
            if (profileImage) {
                const awsUtils = new AWSUtils();
                profileImageUrl = await awsUtils.uploadFileToS3("gift-request", profileImage, tree.requestId);
            }

            const apiClient = new ApiClient();
            await apiClient.redeemGiftCardTemplate(tree.giftCardId, tree.saplingId, tree.treeId, formData as any, profileImageUrl);

            onClose();
            toast.success("Succefully gifted a tree!");
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const handleEventTypeSelection = (e: any, item: { value: string, label: string } | null) => {
        setFormData(prev => ({
            ...prev,
            event_type: item ? item.value : '',
        }))
        setSelectedEventType(item ? item : null);
        setMessages(prev => ({
            ...prev,
            eventType: item?.value,
        }))
    }

    return (
        <Dialog open={open} fullWidth maxWidth='xl'>
            <DialogTitle>Gift a Tree</DialogTitle>
            <form onSubmit={handleRedeemGiftTreeDialog}>
                <DialogContent dividers>
                    <Box hidden={step !== 0} sx={{ maxWidth: '100%' }}>
                        <Grid container rowSpacing={2} columnSpacing={1}>
                            <Grid item xs={12}>
                                <TextField
                                    name="name"
                                    placeholder="Recipient Name *"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="email"
                                    placeholder="Recipient Email *"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={!!errors.email}
                                    helperText={errors.email || "will be used to send gift notification"}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="phone"
                                    placeholder="Recipient Phone (optional)"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                                    <Avatar
                                        src={profileImage ? URL.createObjectURL(profileImage) : undefined}
                                        alt="User"
                                        sx={{ width: 80, height: 80, marginRight: 2 }}
                                    />
                                    <Button variant="outlined" component="label" color='success'
                                        sx={{
                                            marginRight: 2,
                                            textTransform: 'none',
                                            backgroundColor: "white",
                                            "&:hover": {
                                                backgroundColor: "white", // Hover background color
                                            },
                                        }}
                                    >
                                        Add Recipient Pic
                                        <input
                                            value={''}
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </Button>
                                    {profileImage &&
                                        <Button variant="outlined" component="label" color='error'
                                            sx={{
                                                textTransform: 'none',
                                                backgroundColor: "white",
                                                "&:hover": {
                                                    backgroundColor: "white", // Hover background color
                                                },
                                            }}
                                            onClick={() => { setProfileImage(null) }}
                                        >
                                            Remove Image
                                        </Button>}
                                </div>
                                <Typography fontSize={10}>Recipient image will be used to create more personalised dashboard, but it is not required to redeem the tree.</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    value={selectedEventType}
                                    options={EventTypes}
                                    getOptionLabel={option => option.label}
                                    onChange={handleEventTypeSelection}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            name="event_type"
                                            margin='dense'
                                            label='Occasion Type'
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    placeholder="Occasion Name"
                                    name="event_name"
                                    value={formData.event_name}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>
                                    This tree is being gifted by{' '}
                                    <TextField
                                        value={formData.gifted_by}
                                        onChange={handleInputChange}
                                        placeholder="Gifted By"
                                        name="gifted_by"
                                        variant="standard"
                                        InputProps={{
                                            disableUnderline: true,
                                            style: { width: 'auto', display: 'inline-block' },
                                        }}
                                    />{' '}
                                    on{' '}
                                    <TextField
                                        value={formData.gifted_on}
                                        onChange={handleInputChange}
                                        placeholder="Gifted on"
                                        name="gifted_on"
                                        variant="standard"
                                        InputProps={{
                                            disableUnderline: true,
                                            style: { width: 'auto', display: 'inline-block' },
                                        }}
                                    />.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box hidden={step !== 1} sx={{ maxWidth: '100%' }}>
                        <CardDetails 
                            request_id={tree.requestId}
                            presentationId={presentationId}
                            slideId={slideId}
                            messages={messages}
                            onChange={(messages) => { setMessages(messages) }}
                            onPresentationId={(presentationId: string, slideId: string) => { setPresentationId(presentationId); setSlideId(slideId); }}
                            saplingId={tree.saplingId}
                            plantType={tree.plantType}
                            userName={formData.name.trim() ? formData.name.trim() : undefined}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="error" variant="outlined">
                        Cancel
                    </Button>
                    {step === 0 && <Button variant="contained" color="success" onClick={() => { setStep(1); }} style={{ textTransform: 'none' }}>View Gift Card</Button>}
                    {step === 1 && <Button
                        variant="contained" color="success" 
                        onClick={() => { setStep(0); }} style={{ textTransform: 'none' }}
                    >
                        Edit Details
                    </Button>}
                    {step === 1 && <Button
                        color="success" variant="contained" type="submit"
                        disabled={!!errors.name || !!errors.phone || !!errors.email}
                        startIcon={<CardGiftcard />}
                    >
                        Gift
                    </Button>}
                </DialogActions>
            </form>
        </Dialog>

    )
};

export default RedeemGiftTreeDialog;