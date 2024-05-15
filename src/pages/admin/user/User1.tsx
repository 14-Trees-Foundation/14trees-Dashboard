import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridColumns } from "@mui/x-data-grid";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import AddUser from "./AddUser";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type User } from "../../../types/user";
import * as userActionCreators from "../../../redux/actions/userActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import CircularProgress from "@mui/material/CircularProgress";
import EditUser from "./EditUser";

function LoadingOverlay() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}>
            <CircularProgress />
        </div>
    );
}


export const User1 = () => {
    const dispatch = useAppDispatch();
    const { getUsers, createUser, createBulkUsers, updateUser, deleteUser } =
        bindActionCreators(userActionCreators, dispatch);

    const [open, setOpen] = useState(false);
    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<User | null>(null);
    const [selectedEditRow, setSelectedEditRow] = useState<RowType | null>(null);
    const [editModal, setEditModal] = useState(false);

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        setTimeout(async () => {
            await getUsers();
        }, 1000);
    };

    const columns: GridColumns = [
        {
            field: "_id",
            headerName: "ID",
            width: 90,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "name",
            headerName: "Name",
            width: 150,
            editable: true,
        },
        {
            field: "email",
            headerName: "Email",
            width: 200,
        },
        {
            field: "dob",
            headerName: "Date of Birth",
            width: 200,
        },
        {
            field: "phone",
            headerName: "Phone",
            width: 100,
        },
        {
            field: "userid",
            headerName: "User ID",
            width: 200,
        },
        {
            field: "key",
            headerName: "Key",
            width: 200,
        },
        {
            field: "__v",
            headerName: "__V",
            width: 200,
        },
        {
            field: "action",
            headerName: "Action",
            width: 250,
            align: "center",
            headerAlign: "center",
            renderCell: (params: any) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant="outlined"
                        style={{ margin: "0 5px" }}
                        onClick={() => {
                            setSelectedEditRow(params.row);
                            setEditModal(true);
                        }}>
                        <EditIcon />
                    </Button>
                    <Button
                        variant="outlined"
                        style={{ margin: "0 5px" }}
                        onClick={() => handleDelete(params.row._id)}>
                        <DeleteIcon />
                    </Button>
                </div>
            ),
        },
    ];

    let usersList: User[] = [];
    const usersMap = useAppSelector((state: RootState) => state.usersData);
    if (usersMap) {
        usersList = Object.values(usersMap);
    }
    
    console.log(usersList);

    type RowType = {
        id: string;
        name: string;
    };

    const handleDelete = (row: User) => {
        console.log("Delete", row);
        setOpenDeleteModal(true);
        setSelectedItem(row);
    };

    const handleEditSubmit = (formData: User) => {
        console.log(formData);
        updateUser(formData);
    };

    const handleCreateUserData = (formData: User) => {
        console.log(formData);
        createUser(formData);
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "20px",
                }}>
                <Button variant="contained" onClick={handleModalOpen}>
                    Add User
                </Button>
                <AddUser
                    open={open}
                    handleClose={handleModalClose}
                    createUser={handleCreateUserData}
                />
                <Button
                    variant="contained"
                    style={{ marginLeft: "10px" }}
                    onClick={handleModalOpen}>
                    Bulk Create
                </Button>
            </div>
            <Box sx={{ height: 540, width: "100%" }}>
                <DataGrid
                    rows={usersList}
                    columns={columns}
                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: {
                            page: 1,
                            pageSize: 5,
                        },
                    }}
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
                        Do you want to delete {selectedItem}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            console.log("Deleting item...", selectedItem);
                            if (selectedItem !== null) {
                                deleteUser(selectedItem);
                            }
                            setOpenDeleteModal(false);
                        }}
                        color="primary"
                        autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {selectedEditRow && (
                <EditUser
                    row={selectedEditRow}
                    openeditModal={editModal}
                    setEditModal={setEditModal}
                    editSubmit={handleEditSubmit}
                />
            )}
        </>
    );
};
