import React, { useEffect, useState } from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Autocomplete,
    DialogTitle,
    TextField,
} from "@mui/material";

import * as treeTypeActionCreators from "../../../../redux/actions/plantTypeActions";
import * as plotActionCreators from "../../../../redux/actions/plotActions";
import { useAppDispatch, useAppSelector } from '../../../../redux/store/hooks';
import { bindActionCreators } from '@reduxjs/toolkit';

function EditTree({ row, openeditModal, handleCloseEditModal, editSubmit }) {

    const dispatch = useAppDispatch();
    const { getTreeTypes } =
        bindActionCreators(treeTypeActionCreators, dispatch);
    const { getPlots } =
        bindActionCreators(plotActionCreators, dispatch);

    const [formData, setFormData] = useState(row);
    const [page, setPage] = useState(0);
    const [treeTypeName, setTreeTypeName] = useState('');
    const [plotName, setPlotName] = useState('');
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

    const handleEditSubmit = (event) => {
        event.preventDefault();
        editSubmit(formData);
        handleCloseEditModal();
    };

    const getTreeTypeData = async () => {
        setTimeout(async () => {
            await getTreeTypes(page*10, 10, treeTypeName);
        }, 1000);
    };

    useEffect(() => {
        getTreeTypeData();
    }, [page, treeTypeName]);

    let treeTypesList = [];
    let treeTypesMap = {}
    const treeTypesData = useAppSelector((state) => state.treeTypesData);
    if (treeTypesData) {
        treeTypesMap = { ...treeTypesData.treeTypes }
        if (!Object.hasOwn(treeTypesMap, formData.tree_id)) {
            treeTypesMap[formData.tree_id] = { _id: formData.tree_id, name: formData.tree.name}
        }
        treeTypesList = Object.values(treeTypesMap);
    }

    const getPlotData = async () => {
        setTimeout(async () => {
            await getPlots(page*10, 10, plotName);
        }, 1000);
    };

    useEffect(() => {
        getPlotData();
    }, [page, plotName]);

    let plotsList = [];
    let plotsMap = {}
    const plotsData = useAppSelector((state) => state.plotsData);
    if (plotsData) {
        plotsMap = { ...plotsData.plots }
        if (!Object.hasOwn(plotsMap, formData.plot_id)) {
            plotsMap[formData.plot_id] = { _id: formData.plot_id, name: formData.plot?.name}
        }
        plotsList = Object.values(plotsMap);
    }

    // const eventType = [
    //     {id: "1", label: "Birthday"},
    //     {id: "2", label: "In Memory of"},
    //     {id: "3", label: "General gift"},
    //     {id: "4", label: "Corporate gift"},
    // ]

    // const eventTypeMap = {
    //     "1": "Birthday",
    //     "2": "In Memory of",
    //     "3": "General gift",
    //     "4": "Corporate gift",
    // }


    return (
        <Dialog fullWidth open={openeditModal} onClose={handleCloseEditModal}>
            <DialogTitle align="center">Edit Tree</DialogTitle>
            <form onSubmit={handleEditSubmit}>
                <DialogContent>
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
                    <Autocomplete 
                        fullWidth
                        name="tree_id"
                        disablePortal
                        options={treeTypesList}
                        renderInput={(params) => <TextField {...params} onChange={(event) => {
                            const { value } = event.target;
                            setTreeTypeName(value);
                        }} margin="dense" label="Tree Type" />}
                        onChange={(event, value) => { if (value !== null) setFormData(prevState => ({ ...prevState, 'tree_id': value._id }))}}
                        value={ (treeTypeName === '' && Object.hasOwn(treeTypesMap, formData.tree_id)) ? treeTypesMap[formData.tree_id] : null}
                        getOptionLabel={(option) => (option.name)}
                    />
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
                        onChange={(event, value) => { if (value !== null) setFormData(prevState => ({ ...prevState, 'plot_id': value._id }))}}
                        value={ (plotName === '' && Object.hasOwn(plotsMap, formData.plot_id)) ? plotsMap[formData.plot_id] : null }
                        getOptionLabel={(option) => (option.name)}
                    />
                    {/* <TextField
                        autoFocus
                        margin="dense"
                        name="link"
                        label="Event"
                        type="text"
                        fullWidth
                        value={formData.link}
                        onChange={handleChange}
                    />
                    <Autocomplete 
                        fullWidth
                        name="event_type"
                        disablePortal
                        options={eventType}
                        value={formData.event_type ? {id: formData.event_type, label: eventTypeMap[formData.event_type]} : null}
                        renderInput={(params) => <TextField {...params} margin="dense" label="Event Type" />}
                        onChange={(event, value) => { if (value !== null) setFormData(prevState => ({ ...prevState, 'event_type': value.id }))}}
                        getOptionLabel={(option) => option.label}
                    /> */}
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                    <Button variant='contained' onClick={handleCloseEditModal} color="primary">
                        Cancel
                    </Button>
                    <Button variant='contained' type="submit" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default EditTree