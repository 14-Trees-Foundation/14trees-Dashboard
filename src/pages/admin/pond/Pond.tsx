import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridColumns} from '@mui/x-data-grid';
import { Button, Modal, Typography } from '@mui/material';
import AddUser from './AddPond';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {type User} from '../../../types/user';
import * as userActionCreators from '../../../redux/actions/userActions';
import {bindActionCreators} from 'redux';
import {useAppDispatch, useAppSelector} from '../../../redux/store/hooks';
import { RootState } from '../../../redux/store/store';

const columns: GridColumns = [
    { field: 'id', headerName: 'ID', width: 90, align: 'center', headerAlign: 'center', },
    {
        field: 'name',
        headerName: 'Name',
        width: 150,
        editable: true,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'phone',
        headerName: 'Phone',
        width: 150,
        editable: true,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 150,
        editable: true,
        align: 'center',
        headerAlign: 'center',
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
                <Button variant="outlined" style={{ margin: '0 5px' }} onClick={() => console.log('Delete', params.row)}><DeleteIcon /></Button>
            </div>
        ),
    },
];

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

export const Pond = () => {

    const dispatch = useAppDispatch();
	const {getUsers, createUser, createBulkUsers, updateUser, deleteUser}
        = bindActionCreators(userActionCreators, dispatch);

    const [open, setOpen] = useState(false);
    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
		getUserData();
	}, []);

    const getUserData = async () => {
		setLoading(true);
		setTimeout(async () => {
			await getUsers();
		}, 20000);
		setLoading(false);
	};

    let usersList: User[] = [];
	const usersMap = useAppSelector((state: RootState) => state.usersData);
	if (usersMap) {
		usersList = Object.values(usersMap);
	}

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button variant="contained" onClick={handleModalOpen}>Add Pond</Button>
                <AddUser open={open} handleClose={handleModalClose} />
                <Button variant="contained" style={{ marginLeft: '10px' }} onClick={handleModalOpen}>Bulk Create</Button>
            </div>
            <Box sx={{ height: 540, width: '100%' }}>
                <DataGrid
                    components={{ Toolbar: GridToolbar }}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            page: 1,
                            pageSize: 5
                        },
                    }}
                    // pageSizeOptions= {5}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </Box>

        </>
    );
}
