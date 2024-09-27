import { Autocomplete, Box, Button, Grid, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { AutocompleteWithPagination } from "../../../../components/AutoComplete";
import { Group } from "../../../../types/Group";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as groupActionCreators from '../../../../redux/actions/groupActions'
import ApiClient from "../../../../api/apiClient/apiClient";
import { organizationTypes } from "../../organization/organizationType";

interface SponsorGroupFormProps {
    group: Group | null,
    onSelect: (group: Group | null) => void
}

const SponsorGroupForm: FC<SponsorGroupFormProps> = ({ group, onSelect }) => {

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
            const group = await apiClient.createGroup(formData as any);
            if (group) {
                onSelect(group);
            }
        }

        saveGroup();
    }

    return (
        <Box>


            {formOption === 'existing' && <Box>
                <Typography variant='body1'>Let's check whether corporate exist in the system</Typography>
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
                <Typography variant="body1">Couldn't find yourself in the system? <Typography color="primary" onClick={() => setFormOption('new')} variant="body1" component="span">Add sponsor details</Typography>.</Typography>
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
                <Typography variant="body1">Sponsor already exists? <Typography onClick={() => setFormOption('existing')} color='primary' variant="body1" component="span">Select Sponsor</Typography>.</Typography>
            </Box>}
        </Box>
    );
}

export default SponsorGroupForm;