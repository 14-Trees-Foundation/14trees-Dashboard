import { Autocomplete, Box, Button, Divider, Grid, TextField, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { AutocompleteWithPagination } from "../../../../components/AutoComplete";
import { Group } from "../../../../types/Group";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as groupActionCreators from '../../../../redux/actions/groupActions'
import ApiClient from "../../../../api/apiClient/apiClient";
import { organizationTypes } from "../../organization/organizationType";
import ImagePicker from "../../../../components/ImagePicker";

interface SponsorGroupFormProps {
    logo: File | string | null,
    onLogoChange: (logo: File | null) => void,
    group: Group | null,
    onSelect: (group: Group | null) => void
}

const SponsorGroupForm: FC<SponsorGroupFormProps> = ({ logo, onLogoChange, group, onSelect }) => {

    const dispatch = useAppDispatch();
    const { getGroups } = bindActionCreators(groupActionCreators, dispatch);

    const [formOption, setFormOption] = useState<"existing" | "new">("existing");
    const [groupSearchQuery, setGroupSearchQuery] = useState('');

    let groups: Group[] = [];
    const groupsData = useAppSelector((state) => state.groupsData);
    if (groupsData) {
        groups = Object.values(groupsData.groups);
    }

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        description: '',
        address: '',
    });

    useEffect(() => {
        setFormOption('existing')
    }, [group])

    useEffect(() => {
        if (groupSearchQuery.length >= 3) getGroups(0, 20, [{ columnField: 'name', value: groupSearchQuery, operatorValue: 'contains' }]);
    }, [groupSearchQuery])

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleCreateGroupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const apiClient = new ApiClient();
        const saveGroup = async () => {
            const group = await apiClient.createGroup(formData as any, typeof logo !== "string" && logo !== null ? logo : undefined);
            if (group) {
                onSelect(group);
            }
        }

        saveGroup();
    }

    return (
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box style={{ width: '48%' }}>
                {formOption === 'existing' && <Box>
                    <Typography variant='body1'>Do you want to sponsor on behalf of a corporate/organization?</Typography>
                    <AutocompleteWithPagination
                        label="Enter corporate name to search"
                        value={group}
                        options={groups}
                        getOptionLabel={group => group.name}
                        onChange={(event, value: Group) => onSelect(value)}
                        onInputChange={(event) => { setGroupSearchQuery(event.target.value) }}
                        fullWidth
                        size="medium"
                    />
                    <Typography variant="body1">Couldn't find corporate in the system? <Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => setFormOption('new')} variant="body1" component="span">Add corporate details</Typography>.</Typography>
                </Box>}

                {formOption === 'new' && <Box>
                    <Typography variant="body1">Add Corporate Sponsor details</Typography>
                    <form onSubmit={handleCreateGroupSubmit}>
                        <Grid container rowSpacing={2} columnSpacing={1} >
                            <Grid item xs={12}>
                                <TextField name="name" label="Name" value={formData.name} onChange={handleInputChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    options={organizationTypes}
                                    value={formData.type ? organizationTypes.find((option) => option.id === formData.type) : null}
                                    onChange={(event, value) => { if (value !== null) setFormData(prevState => ({ ...prevState, 'type': value.id })) }}
                                    getOptionLabel={(option) => (option.label.toUpperCase())}
                                    renderInput={(params) => <TextField {...params} margin="dense" label="Type" name="type" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="description" label="Description" value={formData.description} onChange={handleInputChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={7}
                                    variant="outlined"
                                    placeholder='Address...'
                                    value={formData.address}
                                    type='text'
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ImagePicker
                                    image={logo}
                                    onChange={onLogoChange}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
                                <Button
                                    type="submit"
                                    variant='contained'
                                    color='success'
                                    sx={{ marginLeft: '10px' }}
                                >Add Sponsor</Button>
                            </Grid>
                        </Grid>
                    </form>
                    <Typography variant="body1">Sponsor already exists? <Typography onClick={() => setFormOption('existing')} style={{ cursor: 'pointer' }} color='primary' variant="body1" component="span">Select Sponsor</Typography>.</Typography>
                </Box>}
            </Box>
            <Divider orientation="vertical" flexItem style={{ backgroundColor: 'black' }} />
            <Box style={{ width: '48%' }}>
                <Typography variant="body1" sx={{ pb: 2 }}>Please upload the corporate logo (this will be shown on the tree card)</Typography>
                <ImagePicker
                    image={logo}
                    onChange={onLogoChange}
                />
            </Box>
        </Box>
    );
}

export default SponsorGroupForm;