import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridColumns } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, Typography } from "@mui/material";
import AddTree from './AddTree';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { type Tree } from '../../../types/tree';
import * as treeActionCreators from '../../../redux/actions/treeActions';
import { bindActionCreators } from 'redux';
import { useAppDispatch, useAppSelector } from '../../../redux/store/hooks';
import { RootState } from '../../../redux/store/store';
import CircularProgress from '@mui/material/CircularProgress';

function LoadingOverlay() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
        </div>
    );
}


const rows = [
    { id: 1, name: 'Jon Snow', phone: '123-456-7890', email: 'jon.snow@example.com' },
    { id: 2, name: 'Cersei Lannister', phone: '234-567-8901', email: 'cersei.lannister@example.com' },
    { id: 3, name: 'Jaime Lannister', phone: '345-678-9012', email: 'jaime.lannister@example.com' },
    { id: 4, name: 'Arya Stark', phone: '456-789-0123', email: 'arya.stark@example.com' },
    { id: 5, name: 'Daenerys Targaryen', phone: '567-890-1234', email: 'daenerys.targaryen@example.com' },
    { id: 6, name: 'Melisandre', phone: '678-901-2345', email: 'melisandre@example.com' },
    { id: 7, name: 'Ferrara Clifford', phone: '789-012-3456', email: 'ferrara.clifford@example.com' },
    { id: 8, name: 'Rossini Frances', phone: '890-123-4567', email: 'rossini.frances@example.com' },
    { id: 9, name: 'Harvey Roxie', phone: '901-234-5678', email: 'harvey.roxie@example.com' },
];

export const TreeNew = () => {

    const dispatch = useAppDispatch();
    const { getTrees, createTree, updateTree, deleteTree, createBulkTrees }
        = bindActionCreators(treeActionCreators, dispatch);

    const [open, setOpen] = useState(false);
    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    useEffect(() => {
        getTreeData();
    }, []);

    const getTreeData = async () => {
        setTimeout(async () => {
            await getTrees();
        }, 1000);
    };
    
    const columns: GridColumns = [
        { field: '_id', headerName: 'ID', width: 90, align: 'center', headerAlign: 'center' },
        {
            field: 'sapling_id',
            headerName: 'Sapling ID',
            width: 150, align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'tree_id',
            headerName: 'Tree ID',
            width: 150,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'plot_id',
            headerName: 'Plot ID',
            width: 150,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'date_added',
            headerName: 'Date Added',
            width: 150,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'link',
            headerName: 'Link',
            width: 150,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'mapped_to',
            headerName: 'Mapped To',
            width: 150,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'event_type',
            headerName: 'Event Type',
            width: 150,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'date_assigned',
            headerName: 'Date Assigned',
            width: 150,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: '__v',
            headerName: '__V',
            width: 90,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'location.type',
            headerName: 'Location Type',
            width: 150,
            align: 'center',
            headerAlign: 'center',
            valueGetter: (params) => params.row.location?.type,
        },
        {
            field: 'location.coordinates',
            headerName: 'Location Coordinates',
            width: 150,
            align: 'center',
            headerAlign: 'center',
            valueGetter: (params) => params.row.location?.coordinates.join(', '),
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 250,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params: any) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button variant="outlined" style={{ margin: '0 5px' }} onClick={() => console.log('Edit', params.row)}><EditIcon /></Button>
                    <Button variant="outlined" style={{ margin: '0 5px' }} onClick={() => handleDelete(params.row)}><DeleteIcon /></Button>
                </div>
            ),
        },
    ];

    let treesList: Tree[] = [];
    const treesMap = useAppSelector((state: RootState) => state.treesData);
    if (treesMap) {
        treesList = Object.values(treesMap);
    }

    type RowType = {
        id: string;
        name: string;
    };

    const handleDelete = (row: RowType) => {
        console.log('Delete', row.name);
        setOpenDeleteModal(true);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button variant="contained" onClick={handleModalOpen}
                disabled={true} 
                >Add Tree</Button>
                <AddTree open={open} handleClose={handleModalClose} />
                <Button variant="contained" style={{ marginLeft: '10px' }} onClick={handleModalOpen}>Bulk Create</Button>
            </div>
            <Box sx={{ height: 540, width: '100%' }}>
                <DataGrid
                    rows={treesList}
                    columns={columns}
                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: {
                            page: 1,
                            pageSize: 5
                        },
                    }}
                    // pageSizeOptions= {5}
                    checkboxSelection
                    disableSelectionOnClick
                    components={{
                        Toolbar: GridToolbar,
                        NoRowsOverlay: LoadingOverlay,
                    }}
                />
            </Box>

            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to delete this item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            console.log("Deleting item...");
                            setOpenDeleteModal(false);
                        }}
                        color="primary"
                        autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}
