import React, { useEffect, useState } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Autocomplete,
    DialogTitle,
    TextField,
    Grid,
} from "@mui/material";

import * as plantTypeActionCreators from "../../../../redux/actions/plantTypeActions";
import * as plotActionCreators from "../../../../redux/actions/plotActions";
import * as userActionCreators from "../../../../redux/actions/userActions";
import * as groupActionCreators from "../../../../redux/actions/groupActions";
import { useAppDispatch, useAppSelector } from '../../../../redux/store/hooks';
import { bindActionCreators } from '@reduxjs/toolkit';
import TagSelector from '../../../../components/TagSelector';
import { AutocompleteWithPagination } from '../../../../components/AutoComplete';
import ApiClient from '../../../../api/apiClient/apiClient';

function EditTree({ row, openeditModal, handleCloseEditModal, editSubmit }) {

    const dispatch = useAppDispatch();
    const { getPlantTypes } =
        bindActionCreators(plantTypeActionCreators, dispatch);
    const { getPlots } =
        bindActionCreators(plotActionCreators, dispatch);
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch);
    const { getGroups } = bindActionCreators(groupActionCreators, dispatch);

    const [formData, setFormData] = useState(row);
    const [page, setPage] = useState(0);
    const [plantTypeName, setPlantTypeName] = useState('');
    const [plotName, setPlotName] = useState('');
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [reservedUser, setReservedUser] = useState(null);
    const [sponoredUser, setSponsoredUser] = useState(null);
    const [groupSearchQuery, setGroupSearchQuery] = useState('');
    const [reservedGroup, setReservedGroup] = useState(null);
    const [sponoredGroup, setSponsoredGroup] = useState(null);
    const [plantedBy, setPlantedBy] = useState('');

    const getPlantTypeData = async () => {
        let nameFilter;
        if (plantTypeName !== "") nameFilter = [{ columnField: "name", value: plantTypeName, operatorValue: "contains" }]
        getPlantTypes(page * 10, 10, nameFilter);
    };

    useEffect(() => {
        getPlantTypeData();
    }, [page, plantTypeName]);

    const getPlotData = async () => {
        const nameFilter = { columnField: "name", value: plotName, operatorValue: "contains" }
        getPlots(page * 10, 10, [nameFilter]);
    };

    useEffect(() => {
        getPlotData();
    }, [page, plotName]);

    useEffect(() => {
        if (groupSearchQuery.length >= 3) getGroups(0, 20, [{ columnField: 'name', value: groupSearchQuery, operatorValue: 'contains' }]);
    }, [groupSearchQuery])

    useEffect(() => {
        if (userSearchQuery.length >= 3) searchUsers(userSearchQuery);
    }, [userSearchQuery]);


    useEffect(() => {
        const fetchDetails = async () => {
            const apiClient = new ApiClient();
            if (row.mapped_to_user) {
                const userResp = await apiClient.getUsers(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: row.mapped_to_user }]);
                if (userResp.results.length === 1) setReservedUser(userResp.results[0]);
                else setReservedUser(null);
            } else setReservedUser(null);

            if (row.sponsored_by_user) {
                const userResp = await apiClient.getUsers(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: row.sponsored_by_user }]);
                if (userResp.results.length === 1) setSponsoredUser(userResp.results[0]);
                else setSponsoredUser(null);
            } else setSponsoredUser(null);

            if (row.mapped_to_group) {
                const groupResp = await apiClient.getGroups(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: row.mapped_to_group }]);
                if (groupResp.results.length === 1) setReservedGroup(groupResp.results[0]);
                else setReservedGroup(null);
            } else setReservedGroup(null);

            if (row.sponsored_by_group) {
                const groupResp = await apiClient.getGroups(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: row.sponsored_by_group }]);
                if (groupResp.results.length === 1) setSponsoredGroup(groupResp.results[0]);
                else setSponsoredGroup(null);
            } else setSponsoredGroup(null);
        }

        if (row) fetchDetails();
    }, [row]);

    let groups = [];
    const groupsData = useAppSelector((state) => state.groupsData);
    if (groupsData) {
        groups = Object.values(groupsData.groups);
    }

    let users = [];
    const usersData = useAppSelector((state) => state.searchUsersData);
    if (usersData) {
        users = Object.values(usersData.users);
    }

    let plotsList = [];
    let plotsMap = {}
    const plotsData = useAppSelector((state) => state.plotsData);
    if (plotsData) {
        plotsMap = { ...plotsData.plots }
        if (!Object.hasOwn(plotsMap, formData.plot_id)) {
            plotsMap[formData.plot_id] = { id: formData.plot_id, name: formData.plot }
        }
        plotsList = Object.values(plotsMap);
    }

    let plantTypesList = [];
    let plantTypesMap = {}
    const plantTypesData = useAppSelector((state) => state.plantTypesData);
    if (plantTypesData) {
        plantTypesMap = { ...plantTypesData.plantTypes }
        if (!Object.hasOwn(plantTypesMap, formData.plant_type_id)) {
            plantTypesMap[formData.plant_type_id] = { id: formData.plant_type_id, name: formData.plant_type }
        }
        plantTypesList = Object.values(plantTypesMap);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => {
            if (name === 'tree_id.name') {
                return { ...prevState, tree_id: { ...prevState.tree_id, name: value } };
            } else if (name.includes('_')) {
                const [parent, child] = name.split('_');
                return { ...prevState, [parent]: { ...prevState[parent], [child]: value } };
            }
            return { ...prevState, [name]: value };
        });
    };

    const handleEditSubmit = () => {
        const updated = { 
            ...formData,
            planted_by: plantedBy,
            sponsored_by_group: sponoredGroup ? sponoredGroup.id : null,
            sponsored_by_user: sponoredUser ? sponoredUser.id : null,
            mapped_to_group: reservedGroup ? reservedGroup.id : null,
            mapped_to_user: reservedUser ? reservedUser.id : null,
        };
        
        editSubmit(updated);
        handleCloseEditModal();
    };


    return (
        <Dialog fullWidth open={openeditModal} onClose={handleCloseEditModal} maxWidth='md'>
            <DialogTitle align="center">Edit Tree</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="sapling_id"
                            label="Sapling ID"
                            type="text"
                            fullWidth
                            value={formData.sapling_id}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Autocomplete
                            fullWidth
                            name="plant_type_id"
                            disablePortal
                            options={plantTypesList}
                            renderInput={(params) => <TextField {...params} onChange={(event) => {
                                const { value } = event.target;
                                setPlantTypeName(value);
                            }} margin="dense" label="Plant Type" />}
                            onChange={(event, value) => { if (value !== null) setFormData(prevState => ({ ...prevState, 'plant_type_id': value.id })) }}
                            value={(plantTypeName === '' && Object.hasOwn(plantTypesMap, formData.plant_type_id)) ? plantTypesMap[formData.plant_type_id] : null}
                            getOptionLabel={(option) => (option.name)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Autocomplete
                            fullWidth
                            name="plot_id"
                            disablePortal
                            options={plotsList}
                            renderInput={(params) => (
                                <TextField {...params}
                                    onChange={(event) => {
                                        const { value } = event.target;
                                        setPlotName(value);
                                    }}
                                    margin="dense"
                                    label="Plot"
                                />
                            )}
                            onChange={(event, value) => { if (value !== null) setFormData(prevState => ({ ...prevState, 'plot_id': value.id })) }}
                            value={(plotName === '' && Object.hasOwn(plotsMap, formData.plot_id)) ? plotsMap[formData.plot_id] : null}
                            getOptionLabel={(option) => (option.name)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TagSelector
                            value={formData.tags}
                            handleChange={(tags) =>
                                setFormData({ ...formData, tags: tags })
                            }
                            margin='dense'
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <AutocompleteWithPagination
                            label="Reserve for individual"
                            value={reservedUser}
                            options={users}
                            getOptionLabel={(user) => `${user.name} (${user.email})`}
                            onChange={(event, value) => setReservedUser(value)}
                            onInputChange={(event) => { setUserSearchQuery(event.target.value); }}
                            fullWidth
                            size="medium"
                            margin="dence"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <AutocompleteWithPagination
                            label="Reserve for group"
                            value={reservedGroup}
                            options={groups}
                            getOptionLabel={group => group.name}
                            onChange={(event, value) => setReservedGroup(value)}
                            onInputChange={(event) => { setGroupSearchQuery(event.target.value) }}
                            fullWidth
                            size="medium"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <AutocompleteWithPagination
                            label="Sponsored by individual"
                            value={sponoredUser}
                            options={users}
                            getOptionLabel={(user) => `${user.name} (${user.email})`}
                            onChange={(event, value) => setSponsoredUser(value)}
                            onInputChange={(event) => { setUserSearchQuery(event.target.value); }}
                            fullWidth
                            size="medium"
                            margin="dence"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <AutocompleteWithPagination
                            label="Sponsor for group"
                            value={sponoredGroup}
                            options={groups}
                            getOptionLabel={group => group.name}
                            onChange={(event, value) => setSponsoredGroup(value)}
                            onInputChange={(event) => { setGroupSearchQuery(event.target.value) }}
                            fullWidth
                            size="medium"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin="dense"
                            name="planted_by"
                            label="Planted By"
                            type="text"
                            fullWidth
                            value={plantedBy}
                            onChange={(e) => setPlantedBy(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <Button variant='outlined' onClick={handleCloseEditModal} color="error">
                    Cancel
                </Button>
                <Button variant='contained' color="success" onClick={handleEditSubmit}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditTree