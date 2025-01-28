import { Autocomplete, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import { AWSUtils } from "../../../helpers/aws";
import { CardGiftcard } from "@mui/icons-material";
import CardDetails from "../gift/Form/CardDetailsForm";
import leafsPoster from "../../../assets/leafs.jpg";
import treePlanting from "../../../assets/planting_illustration.jpg";
import { makeStyles } from "@mui/styles";
import { LoadingButton } from "@mui/lab";

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

const useStyles = makeStyles((theme) => ({
    backgroundImage: {
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${leafsPoster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5, // Adjust the opacity as needed
        },
    },
}));

interface RedeemGiftTreeDialogProps {
    open: boolean
    onClose: () => void
    onSubmit: () => void
    giftMultiple?: boolean
    groupId: number,
    tree: {
        giftCardId: number,
        treeId: number,
        saplingId: string,
        plantType: string,
        requestId: string,
        giftedBy: string,
        logoUrl?: string | null,
    }
}

const RedeemGiftTreeDialog: React.FC<RedeemGiftTreeDialogProps> = ({ tree, open, giftMultiple, groupId, onSubmit, onClose }) => {

    const classes = useStyles();
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
    const [treesCount, setTreesCount] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData(prev => {
            return { ...prev, gifted_by: tree.giftedBy }
        })

        console.log(tree);
    }, [tree])

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

    const handleRedeemGiftTreeDialog = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!giftMultiple && (!tree.saplingId || !tree.treeId)) {
            toast.error("Gifted tree not found!");
            return;
        }

        setStep(1);
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            let profileImageUrl: string | null = null
            if (profileImage) {
                const awsUtils = new AWSUtils();
                profileImageUrl = await awsUtils.uploadFileToS3("gift-request", profileImage, tree.requestId);
            }

            const apiClient = new ApiClient();
            if (giftMultiple) {
                await apiClient.redeemMultipleGiftCardTemplate(treesCount, 'group', groupId, formData as any, profileImageUrl, messages);
                toast.success("Succefully gifted trees!");
            } else {
                await apiClient.redeemGiftCardTemplate('group', groupId, tree.giftCardId, tree.saplingId, tree.treeId, formData as any, profileImageUrl, messages);
                toast.success("Succefully gifted a tree!");
            }

            setLoading(false);
            onClose();
            onSubmit();
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

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, parseInt(event.target.value, 10));
        setTreesCount(value);
    };

    return (
        <Dialog open={open} fullWidth maxWidth='xl'>
            <DialogTitle>🌳 Gift {giftMultiple ? 'Trees' : 'a Tree'}</DialogTitle>
            <form onSubmit={handleRedeemGiftTreeDialog}>
                <DialogContent dividers>
                    <Box
                        hidden={step !== 0}
                    >
                        <Box
                            sx={{
                                maxWidth: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                position: 'relative',
                            }}
                            className={classes.backgroundImage}
                        >
                            <Box component={'img'} src={treePlanting} sx={{ maxWidth: '45%', height: 'auto', zIndex: 1, borderRadius: 2, boxShadow: '0.3em 0.3em 1em rgba(12, 123, 115, 0.8)' }}></Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto', padding: '0px 0px 10px 30px' }}>
                                <Grid container rowSpacing={2} columnSpacing={1}>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="name"
                                            label="Recipient Name"
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
                                            label="Recipient Email"
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
                                            label="Recipient Phone (optional)"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            error={!!errors.phone}
                                            helperText={errors.phone}
                                            fullWidth
                                        />
                                    </Grid>
                                    {giftMultiple && <Grid item xs={6}>
                                        <TextField
                                            name="trees_count"
                                            label="Number of Trees"
                                            value={treesCount}
                                            onChange={handleNumberChange}
                                            inputProps={{ min: 1 }}
                                            type="number"
                                            fullWidth
                                        />
                                    </Grid>}
                                    <Grid item xs={giftMultiple ? 6 : 12}>
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
                                    <Grid item xs={6}>
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
                                                    label='Occasion Type'
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Occasion Name"
                                            name="event_name"
                                            value={formData.event_name}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Gifted By"
                                            name="gifted_by"
                                            value={formData.gifted_by}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="Gifted on"
                                            name="gifted_on"
                                            value={formData.gifted_on}
                                            type="date"
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                    <Box hidden={step !== 1} sx={{ maxWidth: '100%' }}>
                        <CardDetails
                            request_id={tree.requestId}
                            presentationId={presentationId}
                            slideId={slideId}
                            messages={messages}
                            onChange={(messages) => { setMessages(messages) }}
                            onPresentationId={(presentationId: string, slideId: string) => { setPresentationId(presentationId); setSlideId(slideId); }}
                            saplingId={!giftMultiple ? tree.saplingId : '000000'}
                            plantType={!giftMultiple ? tree.plantType : undefined}
                            userName={formData.name.trim() ? formData.name.trim() : undefined}
                            treesCount={treesCount}
                            logo_url={tree.logoUrl}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="error" variant="outlined">
                        Cancel
                    </Button>
                    {step === 0 && <Button
                        variant="contained" color="success" type="submit"
                        style={{ textTransform: 'none' }}
                    >Preview Gift Card</Button>}
                    {step === 1 && <Button
                        variant="contained" color="success"
                        onClick={() => { setStep(0); }} style={{ textTransform: 'none' }}
                    >
                        Edit Details
                    </Button>}
                    {step === 1 && <LoadingButton
                        loading={loading}
                        color="success" variant="contained"
                        disabled={!!errors.name || !!errors.phone || !!errors.email}
                        startIcon={<CardGiftcard />}
                        onClick={handleSubmit}
                    >
                        Gift
                    </LoadingButton>}
                </DialogActions>
            </form>
        </Dialog>

    )
};

export default RedeemGiftTreeDialog;