import { Avatar, Box, Button, Checkbox, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface RecipientForm {

}

const RecipientForm: React.FC<RecipientForm> = ({ }) => {

    const [formOption, setFormOption] = useState('single');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [user, setUser] = useState({
        recipient_name: '',
        recipient_email: '',
        recipient_phone: '',
        assignee_email: '',
        assignee_name: '',
        assignee_phone: '',
        relation: '',
        gifted_trees: 1,
        showAssignedFields: false,
    });

    useEffect(() => {
        const value = sessionStorage.getItem("user_details");
        if (value) setUser(JSON.parse(value));
    }, [])

    const handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, parseInt(event.target.value, 10));
        setUser({ ...user, gifted_trees: value });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setProfileImage(file);
    };

    const handleImageSelection = (imageUrl: string) => {
        setUser(prev => ({
            ...prev,
            profileImage: imageUrl
        }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const data = { ...user };
        if (data.recipient_email.trim() === '') {
            data.recipient_email = data.recipient_name.toLocaleLowerCase().split(" ").join('.') + "@14trees"
        }

        if (!data.showAssignedFields || !data.assignee_name) {
            data.assignee_email = data.recipient_email
            data.assignee_phone = data.recipient_phone
            data.assignee_name = data.recipient_name
        }

        sessionStorage.setItem('user_details', JSON.stringify(user));
    };

    const handleCancel = () => {
        setUser({
            recipient_name: '',
            recipient_email: '',
            recipient_phone: '',
            assignee_email: '',
            assignee_name: '',
            assignee_phone: '',
            relation: '',
            gifted_trees: 1,
            showAssignedFields: false,
        });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                mt: 3,
                maxWidth: 800,
                mx: "auto",
                backgroundColor: "#fff",
            }}
        >
            <Typography variant="h6">Recipient(s) Details</Typography>
            <Divider sx={{ backgroundColor: 'black', mb: 2 }} />


            {/* <Box
                sx={{
                    mb: 3,
                }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography mr={10}>Would you like to gift these trees to single person or multiple persons?</Typography>
                <ToggleButtonGroup
                    value={formOption}
                    exclusive
                    onChange={(e, value) => { setFormOption(value); }}
                    size="small"
                >
                    <ToggleButton value="single">Single</ToggleButton>
                    <ToggleButton value="multi">Multiple</ToggleButton>
                </ToggleButtonGroup>
            </Box> */}
            <Grid container spacing={2}>
                <Grid item xs={user.showAssignedFields ? 6 : 12} container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            name="recipient_email"
                            label="Recipient Email"
                            value={user.recipient_email}
                            onChange={handleUserChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            size="small"
                            name="recipient_name"
                            label="Recipient Name"
                            value={user.recipient_name}
                            onChange={handleUserChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            name="recipient_phone"
                            label="Recipient Phone (Optional)"
                            value={user.recipient_phone}
                            onChange={handleUserChange}
                        />
                    </Grid>
                    {/* <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Number of trees to assign"
                            name="gifted_trees"
                            value={user.gifted_trees}
                            onChange={handleNumberChange}
                            inputProps={{ min: 1 }}
                        />
                    </Grid> */}
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <FormControlLabel
                                control={
                                    <Checkbox checked={user.showAssignedFields} onChange={(e) => { setUser(prev => ({ ...prev, showAssignedFields: e.target.checked })) }} name="show_all" />
                                }
                                label="Do you want to assign/name the tree(s) to someone else (related to recipient)?"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                {user.showAssignedFields &&
                    <Grid item xs={6} container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="small"
                                name="assignee_email"
                                label="Assignee Email"
                                value={user.assignee_email}
                                onChange={handleUserChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                size="small"
                                name="assignee_name"
                                label="Assignee Name"
                                value={user.assignee_name}
                                onChange={handleUserChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="small"
                                name="assignee_phone"
                                label="Assignee Phone (Optional)"
                                value={user.assignee_phone}
                                onChange={handleUserChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="relation-label">Relation with recipient</InputLabel>
                                <Select
                                    labelId="relation-label"
                                    value={user.relation}
                                    label="Relation with recipient"
                                    onChange={(e) => { setUser(prev => ({ ...prev, relation: e.target.value })) }}
                                >
                                    <MenuItem value={"father"}>Father</MenuItem>
                                    <MenuItem value={'mother'}>Mother</MenuItem>
                                    <MenuItem value={'uncle'}>Uncle</MenuItem>
                                    <MenuItem value={'aunt'}>Aunt</MenuItem>
                                    <MenuItem value={'grandfather'}>Grandfather</MenuItem>
                                    <MenuItem value={'grandmother'}>Grandmother</MenuItem>
                                    <MenuItem value={'son'}>Son</MenuItem>
                                    <MenuItem value={'daughter'}>Daughter</MenuItem>
                                    <MenuItem value={'wife'}>Wife</MenuItem>
                                    <MenuItem value={'husband'}>Husband</MenuItem>
                                    <MenuItem value={'grandson'}>Grandson</MenuItem>
                                    <MenuItem value={'granddaughter'}>Granddaughter</MenuItem>
                                    <MenuItem value={'brother'}>Brother</MenuItem>
                                    <MenuItem value={'sister'}>Sister</MenuItem>
                                    <MenuItem value={'cousin'}>Cousin</MenuItem>
                                    <MenuItem value={'friend'}>Friend</MenuItem>
                                    <MenuItem value={'colleague'}>Colleague</MenuItem>
                                    <MenuItem value={'other'}>Other</MenuItem>
                                </Select>
                            </FormControl>
                            {(user.relation && user.relation !== 'other') && <Typography>Tree(s) will be assigned in the name of {user.recipient_name}'s {user.relation}, {user.assignee_name}</Typography>}
                            {(user.relation && user.relation === 'other') && <Typography>Tree(s) will be assigned in the name of {user.assignee_name}</Typography>}
                        </Grid>
                    </Grid>}

                <Grid item xs={12}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                        <Avatar
                            src={profileImage ? URL.createObjectURL(profileImage) : undefined}
                            alt="User"
                            sx={{ width: 80, height: 80, marginRight: 2 }}
                        />
                        <Button variant="outlined" component="label" color='success' sx={{ marginRight: 2, textTransform: 'none' }}>
                            Upload {user.showAssignedFields ? "Assignee" : "Recipient"} Image
                            <input
                                value={''}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                        {profileImage && <Button variant="outlined" component="label" color='error' sx={{ textTransform: 'none' }} onClick={() => { setProfileImage(null); }}>
                            Remove Image
                        </Button>}
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="success" fullWidth>
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default RecipientForm;