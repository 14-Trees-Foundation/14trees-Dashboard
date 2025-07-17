import { Box, Button, TextField, Typography, Grid, FormControlLabel, Switch, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import ImagePicker from "../../../../../components/ImagePicker";
import { AutocompleteWithPagination } from "../../../../../components/AutoComplete";
import { Group } from "../../../../../types/Group";
import { useAppDispatch, useAppSelector } from "../../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as groupActionCreators from '../../../../../redux/actions/groupActions';

interface SponsorFormProps { 
    giftedByChange: (giftedBy: string) => void
}

const SponsorForm: React.FC<SponsorFormProps> = ({ giftedByChange }) => {
    const dispatch = useAppDispatch();
    const { getGroups } = bindActionCreators(groupActionCreators, dispatch);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        isCorporate: false,
        groupOption: "existing",
        corporateName: "",
        address: "",
    });
    const [logo, setLogo] = useState<File | null>(null);
    const [groupSearchQuery, setGroupSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    let groups: Group[] = [];
    const groupsData = useAppSelector((state) => state.groupsData);
    if (groupsData) {
        groups = Object.values(groupsData.groups);
    }

    useEffect(() => {
        const value = sessionStorage.getItem('sponsor_details');
        if (value) setFormData(JSON.parse(value));

        const groupValue = sessionStorage.getItem('group');
        if (groupValue) setSelectedGroup(JSON.parse(groupValue));
    }, [])

    useEffect(() => {
        const handler = setTimeout(() => {
            if (groupSearchQuery.length >= 3) getGroups(0, 20, [{ columnField: 'name', value: groupSearchQuery, operatorValue: 'contains' }]);
        }, 300)

        return () =>{
            clearTimeout(handler);
        }
    }, [groupSearchQuery])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sessionStorage.setItem("sponsor_details", JSON.stringify(formData));
        if (selectedGroup) sessionStorage.setItem("group", JSON.stringify(selectedGroup));

        giftedByChange(formData.isCorporate
                        ? formData.groupOption === 'existing'
                            ? selectedGroup?.name ?? ''
                            : formData.corporateName
                        : formData.name)
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                p: 3,
                maxWidth: 800,
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

                            {formData.groupOption === 'existing' && <Grid item xs={12}>
                                <AutocompleteWithPagination
                                    required
                                    label="Enter corporate name to search"
                                    value={selectedGroup}
                                    options={groups}
                                    getOptionLabel={group => group.name}
                                    onChange={(event, value: Group) => setSelectedGroup(value)}
                                    onInputChange={(event) => { setGroupSearchQuery(event.target.value) }}
                                    fullWidth
                                    size="medium"
                                />
                                <Typography variant="body1">Couldn't find corporate in the system? <Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => setFormData( prev => ({ ... prev, groupOption: "new"}))} variant="body1" component="span">Add corporate details</Typography>.</Typography>
                            </Grid>}

                            {formData.groupOption === 'new' && <>
                                <Grid item xs={12}>
                                    <Typography variant="body1">Sponsor already exists? <Typography onClick={() => setFormData( prev => ({ ... prev, groupOption: "existing"}))} style={{ cursor: 'pointer' }} color='primary' variant="body1" component="span">Select Sponsor</Typography>.</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        name="corporateName"
                                        label="Name"
                                        value={formData.corporateName}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        placeholder='Address...'
                                        value={formData.address}
                                        type='text'
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </>}
                            <Grid item xs={12}>
                                <ImagePicker
                                    image={logo ? logo : selectedGroup?.logo_url ? selectedGroup.logo_url : null}
                                    onChange={file => { setLogo(file); }}
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
