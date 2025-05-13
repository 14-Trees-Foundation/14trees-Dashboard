import { Autocomplete, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../api/apiClient/apiClient";
import { AWSUtils } from "../../helpers/aws";
import { CardGiftcard, Email, Edit } from "@mui/icons-material";
import CardDetails from "../../pages/admin/gift/Form/CardDetailsForm";
import leafsPoster from "../../assets/leafs.jpg";
import treePlanting from "../../assets/planting_illustration.jpg";
import { makeStyles } from "@mui/styles";
import { LoadingButton } from "@mui/lab";
import { GiftRedeemTransaction } from "../../types/gift_redeem_transaction";

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
    userId?: number,
    groupId?: number,
    tree: {
        giftCardId: number,
        treeId: number,
        saplingId: string,
        plantType: string,
        requestId: string,
        giftedBy: string,
        logoUrl?: string | null,
    }
    existingTransaction?: GiftRedeemTransaction 
}

const RedeemGiftTreeDialog: React.FC<RedeemGiftTreeDialogProps> = ({ 
    tree, 
    open, 
    giftMultiple, 
    userId,
    groupId, 
    onSubmit, 
    onClose, 
    existingTransaction 
}) => {

    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        communication_email: '',
    });

    const [initialFormData, setInitialFormData] = useState({
        name: '',
        phone: '',
        email: '',
        communication_email: '',
        birth_date: '',
        gifted_by: '',
        event_name: '',
        event_type: '',
        gifted_on: new Date().toISOString().slice(0, 10),
    });

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        communication_email: '',
        birth_date: '',
        gifted_by: '',
        event_name: '',
        event_type: '',
        gifted_on: new Date().toISOString().slice(0, 10),
    });
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [selectedEventType, setSelectedEventType] = useState<{ value: string, label: string } | null>(null);
    const [initialMessages, setInitialMessages] = useState({ 
        primaryMessage: '', 
        logoMessage: '', 
        eventName: '', 
        eventType: '' as string | undefined, 
        plantedBy: '' 
    });
    const [messages, setMessages] = useState({ 
        primaryMessage: '', 
        logoMessage: '', 
        eventName: '', 
        eventType: '' as string | undefined, 
        plantedBy: '' 
    });
    const [presentationId, setPresentationId] = useState<string | null>(null);
    const [slideId, setSlideId] = useState<string | null>(null);
    const [step, setStep] = useState(0);
    const [treesCount, setTreesCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        // Initialize form with existing transaction data if in edit mode
        if (existingTransaction) {
            setIsEditMode(true);
            
            const newFormData = {
                name: existingTransaction.recipient_name || '',
                phone: '',  // Assuming phone not in transaction model
                email: existingTransaction.recipient_email || '',
                communication_email: existingTransaction.recipient_communication_email || '',
                birth_date: '',  // Assuming not in transaction model
                gifted_by: existingTransaction.gifted_by || '',
                event_name: existingTransaction.occasion_name || '',
                event_type: existingTransaction.occasion_type || '',
                gifted_on: existingTransaction.gifted_on 
                    ? new Date(existingTransaction.gifted_on).toISOString().slice(0, 10) 
                    : new Date().toISOString().slice(0, 10),
            };
            
            setFormData(newFormData);
            setInitialFormData(newFormData);
            
            // Set event type
            if (existingTransaction.occasion_type) {
                const eventType = EventTypes.find(et => et.value === existingTransaction.occasion_type);
                if (eventType) {
                    setSelectedEventType(eventType);
                }
            }
            
            // Set messages
            const newMessages = {
                primaryMessage: existingTransaction.primary_message || '',
                logoMessage: existingTransaction.logo_message || '',
                eventName: existingTransaction.occasion_name || '',
                eventType: existingTransaction.occasion_type as string | undefined,
                plantedBy: existingTransaction.gifted_by || ''
            };
            
            setMessages(newMessages);
            setInitialMessages(newMessages);
            
            // Set trees count if applicable
            if (existingTransaction.trees_count) {
                setTreesCount(existingTransaction.trees_count);
            }
        } else {
            setFormData(prev => {
                return { ...prev, gifted_by: tree.giftedBy };
            });
            setInitialFormData(prev => {
                return { ...prev, gifted_by: tree.giftedBy };
            });
        }

        console.log(tree);
    }, [tree, existingTransaction]);

    const validateTheName = (name: string) => {
        if (name.trim()) setErrors({ ...errors, name: '' });
        else setErrors({ ...errors, name: 'Name is required' });

        return name.trim() === '' ? false : true;
    }

    const validateTheEmail = (email: string, field: 'email' | 'communication_email') => {
        let isValid = true;

        if (email) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                setErrors({ ...errors, [field]: 'Email is not valid' });
                isValid = false;
            } else setErrors({ ...errors, [field]: '' });
        } else {
            setErrors({ ...errors, [field]: '' });
        }

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

        let value = event.target.value;
        if (event.target.name === 'name') validateTheName(value);
        if (event.target.name === 'email') {
            value = value.trim();
            validateTheEmail(value, 'email');
        }
        if (event.target.name === 'phone') {
            if (value.startsWith('+91')) value = value.slice(3);
            if (value.startsWith('0')) value = value.slice(1);
            validateThePhone(value);
        }
        if (event.target.name === 'communication_email') validateTheEmail(event.target.value.trim(), 'communication_email');

        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setProfileImage(file);
    };

    const handleRedeemGiftTreeDialog = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isEditMode && !giftMultiple && (!tree.saplingId || !tree.treeId)) {
            toast.error("Gifted tree not found!");
            return;
        }

        setStep(1);
    }

    // Function to get changed fields for update
    const getChangedFields = () => {
        const mask: string[] = [];
        const data: Record<string, any> = {};
        
        // Check form data changes
        if (formData.name !== initialFormData.name) {
            mask.push('name');
            data.name = formData.name;
        }
        
        if (formData.email !== initialFormData.email) {
            mask.push('email');
            data.email = formData.email || formData.name.trim().split(' ').join('.').toLowerCase() + '@14trees';
        }
        
        if (formData.communication_email !== initialFormData.communication_email) {
            mask.push('communication_email');
            data.communication_email = formData.communication_email;
        }
        
        if (formData.gifted_by !== initialFormData.gifted_by) {
            mask.push('gifted_by');
            data.gifted_by = formData.gifted_by;
        }
        
        if (formData.event_name !== initialFormData.event_name) {
            mask.push('occasion_name');
            data.occasion_name = formData.event_name;
        }
        
        if (formData.event_type !== initialFormData.event_type) {
            mask.push('occasion_type');
            data.occasion_type = formData.event_type;
        }
        
        if (formData.gifted_on !== initialFormData.gifted_on) {
            mask.push('gifted_on');
            data.gifted_on = formData.gifted_on + 'T00:00:00Z';
        }
        
        // Check message changes
        if (messages.primaryMessage !== initialMessages.primaryMessage) {
            mask.push('primary_message');
            data.primary_message = messages.primaryMessage;
        }
        
        if (messages.logoMessage !== initialMessages.logoMessage) {
            mask.push('logo_message');
            data.logo_message = messages.logoMessage;
        }
        
        return { mask, data };
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            let profileImageUrl: string | null = null;
            
            if (profileImage) {
                const awsUtils = new AWSUtils();
                profileImageUrl = await awsUtils.uploadFileToS3("gift-request", profileImage, tree.requestId);
            }

            const apiClient = new ApiClient();

            if (isEditMode && existingTransaction) {
                // Update existing transaction
                const { mask, data } = getChangedFields();
                
                if (mask.length === 0) {
                    toast.info("No changes detected to update");
                    setLoading(false);
                    onClose();
                    return;
                }
                
                // If profile image was changed
                if (profileImage) {
                    mask.push('profile_image_url');
                    data.profile_image_url = profileImageUrl;
                }
                
                await apiClient.updateTransaction(existingTransaction.id, mask, data);
                toast.success("Transaction updated successfully!");
            } else {
                // Create new transaction
                const data: any = {
                    ...formData,
                    email: formData.email || formData.name.trim().split(' ').join('.').toLowerCase() + '@14trees',
                };

                const entityType = userId ? 'user' : 'group';
                const entityId = userId || groupId || 0;

                if (giftMultiple) {
                    await apiClient.redeemMultipleGiftCardTemplate(treesCount, entityType, entityId, data, profileImageUrl, messages);
                    toast.success("Successfully gifted trees!");
                } else {
                    await apiClient.redeemGiftCardTemplate(entityType, entityId, tree.giftCardId, tree.saplingId, tree.treeId, data, profileImageUrl, messages);
                    toast.success("Successfully gifted a tree!");
                }
            }

            setLoading(false);
            onClose();
            onSubmit();
        } catch (error: any) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    const handleEventTypeSelection = (e: any, item: { value: string, label: string } | null) => {
        setFormData(prev => ({
            ...prev,
            event_type: item ? item.value : '',
        }));
        setSelectedEventType(item ? item : null);
        setMessages(prev => ({
            ...prev,
            eventType: item?.value,
        }));
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, parseInt(event.target.value, 10));
        setTreesCount(value);
    };

    const dialogTitle = isEditMode 
        ? "✏️ Edit Gift Details" 
        : `🌳 Gift ${giftMultiple ? 'Trees' : 'a Tree'}`;

    const submitButtonText = isEditMode 
        ? "Update Gift" 
        : "Gift";

    return (
        <Dialog open={open} fullWidth maxWidth='xl'>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <form onSubmit={handleRedeemGiftTreeDialog}>
                <DialogContent dividers>
                    <Box
                        hidden={step !== 0}
                    >
                        <Box
                            sx={{
                                maxWidth: '100%',
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                justifyContent: 'space-between',
                                position: 'relative',
                            }}
                            className={classes.backgroundImage}
                        >
                            {!isMobile && (
                                <Box 
                                    component={'img'} 
                                    src={treePlanting} 
                                    sx={{ 
                                        maxWidth: '45%', 
                                        height: 'auto', 
                                        zIndex: 1, 
                                        borderRadius: 2, 
                                        boxShadow: '0.3em 0.3em 1em rgba(12, 123, 115, 0.8)' 
                                    }}
                                />
                            )}
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                margin: 'auto', 
                                padding: isMobile ? '0px' : '0px 0px 10px 30px',
                                width: isMobile ? '100%' : 'auto'
                            }}>
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
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            error={!!errors.email}
                                            helperText={errors.email ? errors.email : formData.email ? "will be used to send gift notification" : formData.communication_email ? "Recipient will use communication email for updates" : "Optional - for sending gift notification"}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="communication_email"
                                            label="Communication Email"
                                            value={formData.communication_email}
                                            onChange={handleInputChange}
                                            error={!!errors.communication_email}
                                            helperText={errors.communication_email ? "Will be used for notifications" : "Optional - alternative email for notifications"}
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
                                    {giftMultiple && !isEditMode && <Grid item xs={12} sm={6}>
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
                                    <Grid item xs={12} sm={giftMultiple && !isEditMode ? 6 : 12}>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            marginBottom: 16,
                                            // flexDirection: isMobile ? 'column' : 'row',
                                            gap: isMobile ? '10px' : '0'
                                        }}>
                                            <Avatar
                                                src={profileImage ? URL.createObjectURL(profileImage) : undefined}
                                                alt="User"
                                                sx={{ 
                                                    width: 80, 
                                                    height: 80, 
                                                    marginRight: isMobile ? 0 : 2,
                                                    marginBottom: isMobile ? 1 : 0
                                                }}
                                            />
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: isMobile ? 'column' : 'row',
                                                gap: isMobile ? '10px' : '0'
                                            }}>
                                                <Button variant="outlined" component="label" color='success'
                                                    sx={{
                                                        marginRight: isMobile ? 0 : 2,
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
                                            </Box>
                                        </div>
                                        <Typography fontSize={10}>Recipient image will be used to create more personalised dashboard, but it is not required to redeem the tree.</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
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
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Occasion Name"
                                            name="event_name"
                                            value={formData.event_name}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Gifted By"
                                            name="gifted_by"
                                            value={formData.gifted_by}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
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
                            logo_url={tree.logoUrl}
                            treesCount={treesCount}
                            isPersonal={userId ? true : false}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ 
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: 'stretch',
                    justifyContent: isMobile ? 'center' : 'flex-end',
                    '& > button': {
                        margin: isMobile ? '5px 0' : undefined,
                        width: isMobile ? '100%' : undefined
                    },
                    '& >:not(:first-of-type)': {
                        marginLeft: isMobile ? 0 : 1
                    }
                }}>
                    <Button onClick={onClose} color="error" variant="outlined">
                        Cancel
                    </Button>
                    {step === 0 && <Button
                        variant="contained" color="success" type="submit"
                        style={{ textTransform: 'none' }}
                    >{isEditMode ? "Preview Updated Gift Card" : "Preview Gift Card"}</Button>}
                    {step === 1 && <Button
                        variant="contained" color="success"
                        onClick={() => { setStep(0); }} style={{ textTransform: 'none' }}
                    >
                        Go Back
                    </Button>}
                    {step === 1 && <LoadingButton
                        loading={loading}
                        color="success" variant="contained"
                        disabled={!!errors.name || !!errors.phone || !!errors.email}
                        startIcon={isEditMode ? <Edit /> : <CardGiftcard />}
                        onClick={handleSubmit}
                    >
                        {submitButtonText}
                    </LoadingButton>}
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default RedeemGiftTreeDialog; 