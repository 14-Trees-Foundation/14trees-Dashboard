import { Avatar, Box, Button, Grid, Paper, TextField, Typography, useMediaQuery } from "@mui/material"
import { GiftCardUser } from "../../../types/gift_card";
import { createStyles, makeStyles } from "@mui/styles";
import { useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";
import { AWSUtils } from "../../../helpers/aws";
import poster from '../../../assets/ARANYA_poster.jpg'

interface RedeemTreeProps {
    tree: GiftCardUser
}

const RedeemTree: React.FC<RedeemTreeProps> = ({ tree }) => {
    const matches = useMediaQuery("(max-width:481px)");
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
        // pre-fill gifted_by with sponsor name when available
        gifted_by: (tree as any)?.gifted_by_name || '',
    });
    const [profileImage, setProfileImage] = useState<File | null>(null)

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


    const validate = () => {

        // Validate Name
        if (!validateTheName(formData.name)) return false;
        // Validate Email
        if (!validateTheEmail(formData.email)) return false;
        // Validate Phone
        if (!validateThePhone(formData.phone)) return false;

        return true;
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {

        if (event.target.name === 'name') validateTheName(event.target.value);
        if (event.target.name === 'email') validateTheEmail(event.target.value);
        if (event.target.name === 'phone') validateThePhone(event.target.value);

        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const refreshPage = () => {
        window.location.reload();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setProfileImage(file);
    };

    const handleRedeemTree = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!tree.sapling_id || !tree.tree_id) {
            toast.error("Gifted tree not found!");
            return;
        }

        try {

            let profileImageUrl: string | null = null
            if (profileImage) {
                const awsUtils = new AWSUtils();
                profileImageUrl = await awsUtils.uploadFileToS3("gift-request", profileImage, (tree as any).request_id);
            }

            const apiClient = new ApiClient();
            await apiClient.redeemGiftCardTemplate('user', null, tree.id, tree.sapling_id, tree.tree_id, formData as any, profileImageUrl);

            refreshPage();
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <Box
            className={matches ? classes.mbmain : classes.main}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100vh',
                backgroundImage: `url(${poster})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: 'white'
            }}>
            <Box
                style={{
                    maxWidth: matches ? "96%" : '600px',
                }}
            >
                <Box mt={1} sx={{ padding: 2 }}>
                    <Typography variant="body1" mb={1}>The tree with tracker ID: {tree.sapling_id} is reserved as a gift. Please provide the recipient's details below to gift the tree. (Note: It can be redeemed only once, so kindly ensure the information is accurate.)</Typography>
                    <form onSubmit={handleRedeemTree}>
                        <Grid container rowSpacing={2} columnSpacing={1}>
                            <Grid item xs={12}>
                                <TextField
                                    name="name"
                                    label="Recipient Name"
                                    placeholder="Recipient Name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: !!formData.name,
                                        sx: { bgcolor: 'white', color: 'black', px: 0.5, borderRadius: '4px' }
                                    }}
                                    sx={{
                                        "& .MuiInputLabel-root": { color: "black" }, // Label color
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "black" }, // Default border color
                                            "&:hover fieldset": { borderColor: "lightblue" }, // Hover border color
                                            "&.Mui-focused fieldset": { borderColor: "lightblue" }, // Focused border color
                                        },
                                        "& .MuiInputBase-input": { color: "black", backgroundColor: "white", borderRadius: '4px' }, // Input text color
                                        "& .MuiFormHelperText-root": {
                                            color: "white", // Change helper text color
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="email"
                                    label="Recipient Email"
                                    placeholder="Recipient Email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={!!errors.email}
                                    helperText={errors.email || "will be used to send gift notification"}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: !!formData.email,
                                        sx: { bgcolor: 'white', color: 'black', px: 0.5, borderRadius: '4px' }
                                    }}
                                    sx={{
                                        "& .MuiInputLabel-root": { color: "black" }, // Label color
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "black" }, // Default border color
                                            "&:hover fieldset": { borderColor: "lightblue" }, // Hover border color
                                            "&.Mui-focused fieldset": { borderColor: "lightblue" }, // Focused border color
                                        },
                                        "& .MuiInputBase-input": { color: "black", backgroundColor: "white", borderRadius: '4px' }, // Input text color
                                        "& .MuiFormHelperText-root": {
                                            color: "white", // Change helper text color
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="phone"
                                    label="Recipient Phone (optional)"
                                    placeholder="Recipient Phone (optional)"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: !!formData.phone,
                                        sx: { bgcolor: 'white', color: 'black', px: 0.5, borderRadius: '4px' }
                                    }}
                                    sx={{
                                        "& .MuiInputLabel-root": { color: "black" }, // Label color
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "black" }, // Default border color
                                            "&:hover fieldset": { borderColor: "lightblue" }, // Hover border color
                                            "&.Mui-focused fieldset": { borderColor: "lightblue" }, // Focused border color
                                        },
                                        "& .MuiInputBase-input": { color: "black", backgroundColor: "white", borderRadius: '4px' }, // Input text color
                                        "& .MuiFormHelperText-root": {
                                            color: "white", // Change helper text color
                                        }
                                    }}
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
                                <TextField
                                    name="gifted_by"
                                    label="Gifted by"
                                    placeholder="Gifted by"
                                    value={formData.gifted_by}
                                    onChange={handleInputChange}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: !!formData.gifted_by,
                                        sx: { bgcolor: 'white', color: 'black', px: 0.5, borderRadius: '4px' }
                                    }}
                                    sx={{
                                        "& .MuiInputLabel-root": { color: "black" }, // Label color
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "black" }, // Default border color
                                            "&:hover fieldset": { borderColor: "lightblue" }, // Hover border color
                                            "&.Mui-focused fieldset": { borderColor: "lightblue" }, // Focused border color
                                        },
                                        "& .MuiInputBase-input": { color: "black", backgroundColor: "white", borderRadius: '4px' }, // Input text color
                                        "& .MuiFormHelperText-root": {
                                            color: "white", // Change helper text color
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} display="flex" justifyContent="center">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    disabled={!!errors.name || !!errors.phone || !!errors.email}
                                >Redeem</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Box>
        </Box>
    )
};

const useStyles = makeStyles((theme) =>
    createStyles({
        mbmain: {
            height: "100%",
            paddingTop: "70px",
        },
        main: {
            height: "100%",
            paddingTop: "120px",
        },
    })
);

export default RedeemTree;