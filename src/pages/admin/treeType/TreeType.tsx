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
    Modal,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type TreeType } from "../../../types/treeType";
import * as treeTypeActionCreators from "../../../redux/actions/treeTypeActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import AddTreeType from "./AddTreeType";
import CircularProgress from "@mui/material/CircularProgress";
import EditTreeType from "./EditTreeType.jsx";

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

export const TreeTypeComponent = () => {
    const dispatch = useAppDispatch();
    const { getTreeTypes, createTreeType, updateTreeType, deleteTreeType } =
        bindActionCreators(treeTypeActionCreators, dispatch);

    const [open, setOpen] = useState(false);
    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TreeType | null>(null);
    const [selectedEditRow, setSelectedEditRow] = useState<RowType | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [page, setPage] = useState(0);

    const columns: GridColumns = [
        // {
        //     field: "_id",
        //     headerName: "ID",
        //     width: 90,
        //     align: "center",
        //     headerAlign: "center",
        // },
        {
            field: "name",
            headerName: "Name",
            width: 220,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "name_english",
            headerName: "Name (English)",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "tree_id",
            headerName: "Tree ID",
            width: 120,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "scientific_name",
            headerName: "Scientific Name",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "habit",
            headerName: "Habit",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
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
                            setSelectedEditRow(params.row)
                            setEditModal(true)
                        }}
                    >
                        <EditIcon />
                    </Button>
                    <Button
                        variant="outlined"
                        style={{ margin: "0 5px" }}
                        onClick={() => handleDeleteTreeType(params.row as TreeType)}>
                        <DeleteIcon />
                    </Button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        getTreeTypeData();
    }, [page]);

    const getTreeTypeData = async () => {
        setTimeout(async () => {
            await getTreeTypes(page*10, 10);
        }, 1000);
    };

    let treeTypesList: TreeType[] = [];
    const treeTypesData = useAppSelector(
        (state: RootState) => state.treeTypesData
    );
    if (treeTypesData) {
        treeTypesList = Object.values(treeTypesData.treeTypes);
    }

    const handleCreateTreeTypeData = (formData: TreeType) => {
        console.log(formData);
        createTreeType(formData);
    };

    type RowType = {
        id: string;
        name: string;
    };

    const handleDeleteTreeType = (row: TreeType) => {
        // console.log("Delete", row);
        setOpenDeleteModal(true);
        setSelectedItem(row);
    };

    const handleEditSubmit = (formData: TreeType) => {
        // console.log(formData);
        updateTreeType(formData);
    };

    const handleCloseEditModal = () => {
        setEditModal(false);
        setSelectedEditRow(null);
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "20px",
                }}>
                <Button variant="contained" style={{ backgroundColor:'blue' }} onClick={handleModalOpen}>
                    Add Tree type
                </Button>
                <AddTreeType
                    open={open}
                    handleClose={handleModalClose}
                    createTreeData={handleCreateTreeTypeData}
                />
                <Button
                    variant="contained"
                    style={{ marginLeft: "10px", }}
                    onClick={handleModalOpen} disabled={true} >
                    Bulk Create
                </Button>
            </div>

            <Box sx={{ height: 540, width: "100%" }}>
                <DataGrid
                    rows={treeTypesList}
                    columns={columns}
                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: {
                            page: 0,
                            pageSize: 10,
                        },
                    }}
                    onPageChange={(page) => { if(treeTypesList.length < (page + 1)*10) setPage(page); }}
                    rowCount={treeTypesData.totalTreeTypes}
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
                        Do you want to delete {selectedItem?.name}?
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
                                deleteTreeType(selectedItem)
                            }
                            setOpenDeleteModal(false);
                        }}
                        color="primary"
                        autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {selectedEditRow && <EditTreeType row={selectedEditRow} openeditModal={editModal} handleCloseEditModal={handleCloseEditModal} editSubmit={handleEditSubmit} />}
        </>
    );
};
