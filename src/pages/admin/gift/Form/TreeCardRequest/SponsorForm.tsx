import { Box, Button, TextField, Typography, Grid, FormControlLabel, Switch, Divider } from "@mui/material";
import { useState } from "react";
import ImagePicker from "../../../../../components/ImagePicker";

interface SponsorFormProps { }

const SponsorForm: React.FC<SponsorFormProps> = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        isCorporate: false,
        corporateName: "",
        address: "",
    });
    const [logo, setLogo] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                p: 3,
                maxWidth: 600,
                mx: "auto",
                backgroundColor: "#fff",
            }}
        >
            <Typography variant="h4">SPONSOR</Typography>
            <Typography variant="h6">Contact Details</Typography>
            <Divider sx={{ backgroundColor: 'black', mb: 2 }} />

            <Grid container spacing={2}>
                <Grid item xs={4} container>
                    <Typography>Sponsor Details:</Typography>
                </Grid>

                <Grid item xs={8} container spacing={2}>
                    {/* Name Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    {/* Email Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                </Grid>


                {/* Toggle: Are you making on behalf of corporate? */}
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isCorporate}
                                onChange={handleChange}
                                name="isCorporate"
                                color="primary"
                            />
                        }
                        label="Are you making on behalf of corporate?"
                    />
                </Grid>

                {/* Conditional Corporate Fields */}
                {formData.isCorporate && (
                    <>
                        <Grid item xs={4} container>
                            <Typography>Corporate Details:</Typography>
                        </Grid>

                        <Grid item xs={8} container spacing={2}>
                            {/* Corporate Name */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Corporate Name"
                                    variant="outlined"
                                    fullWidth
                                    name="corporateName"
                                    value={formData.corporateName}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            {/* Address */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Address"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            {/* Logo */}
                            <Grid item xs={12}>
                                <Typography variant="body1" sx={{ pb: 2 }}>Please upload the corporate logo (this will be shown on the tree card)</Typography>
                                <ImagePicker
                                    image={logo}
                                    onChange={logoFile => { setLogo(logoFile) }}
                                />
                            </Grid>
                        </Grid>
                    </>
                )}
            </Grid>

            {/* Submit Button */}
            <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" color="success" fullWidth>
                    Submit
                </Button>
            </Box>
        </Box>
    );
};

export default SponsorForm;
