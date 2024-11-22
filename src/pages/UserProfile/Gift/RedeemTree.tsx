import { Box, Button, Grid, Paper, TextField, Typography, useMediaQuery } from "@mui/material"
import { GiftCardUser } from "../../../types/gift_card";
import { createStyles, makeStyles } from "@mui/styles";
import { useState } from "react";
import { toast } from "react-toastify";
import ApiClient from "../../../api/apiClient/apiClient";

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
    });

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

    const handleRedeemTree = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!tree.sapling_id || !tree.tree_id) {
            toast.error("Gifted tree not found!");
            return;
        }

        try {
            const apiClient = new ApiClient();
            await apiClient.redeemGiftCardTemplate(tree.id, tree.sapling_id, tree.tree_id, formData as any);

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
                paddingTop: "20px",
            }}>
            <Box
                style={{
                    maxWidth: matches ? "96%" : '600px',
                }}
            >
                <Box mt={1} component={Paper} sx={{ padding: 2 }}>
                    <Typography variant="body1" mb={1}>The tree with tracker ID: 49852 has been sponsored by {(tree as any).group_name || (tree as any).sponsor_name} and is reserved as a gift. Please provide the recipient's details below to redeem it. (Note: This tree can be redeemed only once, so kindly ensure the information is accurate.)</Typography>
                    <form onSubmit={handleRedeemTree}>
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
            marginTop: "50px",
        },
        main: {
            height: "100%",
            marginTop: "100px",
        },
    })
);

export default RedeemTree;