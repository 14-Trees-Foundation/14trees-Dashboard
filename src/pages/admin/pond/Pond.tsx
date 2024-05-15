import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridColumns } from "@mui/x-data-grid";
import AddPond from "./AddPond";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Pond } from "../../../types/pond";
import * as pondActionCreators from "../../../redux/actions/pondActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, Typography } from "@mui/material";
import EditPond from "./EditPond";

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

const rows = [
    {
        boundaries: {
            type: "Polygon",
            coordinates: [],
        },
        _id: "623b4476b2621b181db4c8aa",
        name: "521-main",
        tags: [],
        type: "Storage",
        date_added: "2022-03-23T16:01:58.971Z",
        images: [],
        lengthFt: 60,
        widthFt: 40,
        depthFt: 30,
        __v: 0,
    },
    {
        boundaries: {
            type: "Polygon",
            coordinates: [],
        },
        _id: "623d68e0cc8349ed6c95b573",
        name: "अखरवाडी गायरान तळ १",
        tags: [],
        type: "Storage",
        date_added: "2022-03-25T07:01:52.191Z",
        images: [],
        lengthFt: 30,
        widthFt: 30,
        depthFt: 30,
        __v: 0,
    },
    {
        boundaries: {
            type: "Polygon",
            coordinates: [],
        },
        _id: "623d693821a217610a750f6b",
        name: "दक्षणा तळ १ (Dakshana pond 1)",
        tags: [],
        type: "Storage",
        date_added: "2022-03-25T07:03:20.186Z",
        images: [],
        lengthFt: 30,
        widthFt: 30,
        depthFt: 30,
        __v: 0,
    },
    {
        boundaries: {
            type: "Polygon",
            coordinates: [],
        },
        _id: "623d693f21a217610a750f6e",
        name: "दक्षणा तळ २ (Dakshana pond 2)",
        tags: [],
        type: "Storage",
        date_added: "2022-03-25T07:03:27.978Z",
        images: [],
        lengthFt: 30,
        widthFt: 30,
        depthFt: 30,
        __v: 0,
    },
];


export const PondComponent = () => {
    const dispatch = useAppDispatch();
    const { getPonds, createPond, updatePond, deletePond } = bindActionCreators(
        pondActionCreators,
        dispatch
    );

    const [open, setOpen] = useState(false);
    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Pond | null>(null);
    const [selectedEditRow, setSelectedEditRow] = useState<RowType | null>(null);
    const [editModal, setEditModal] = useState(false);

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
            align: "center",
            headerAlign: "center",
        },
        {
            field: "type",
            headerName: "Type",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "boundaries.type",
            headerName: "Boundaries Type",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "boundaries.coordinates",
            headerName: "Boundaries Coordinates",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "lengthFt",
            headerName: "LengthFT",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "widthFt",
            headerName: "WidthFT",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "depthFt",
            headerName: "DeathFT",
            width: 150,
            editable: true,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "date_added",
            headerName: "Date Added",
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
                        onClick={() => handleDelete(params.row._id)}>
                        <DeleteIcon />
                    </Button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        getPondData();
    }, []);

    const getPondData = async () => {
        setTimeout(async () => {
            await getPonds();
        }, 1000);
    };

    let pondsList: Pond[] = [];
    const pondsMap = useAppSelector((state: RootState) => state.pondsData);
    if (pondsMap) {
        pondsList = Object.values(pondsMap);
    }

    const flattenedRows = pondsList.map((row) => ({
        ...row,
        "boundaries.type": row.boundaries.type,
        "boundaries.coordinates": row.boundaries.coordinates,
    }));

    type RowType = {
        id: string;
        name: string;
    };

    const handleDelete = (row: Pond) => {
        console.log("Delete", row);
        setOpenDeleteModal(true);
        setSelectedItem(row);
    };

    const handleEditSubmit = (formData: Pond) => {
        console.log(formData);
        updatePond(formData);
    };

    const handleCreatePondData = (formData: Pond) => {
        // console.log(formData);
        createPond(formData);
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
                    Add Pond
                </Button>
                <AddPond open={open} handleClose={handleModalClose} createPondData={handleCreatePondData} />
                <Button
                    variant="contained"
                    style={{ marginLeft: "10px" }}
                    onClick={handleModalOpen}>
                    Bulk Create
                </Button>
            </div>
            <Box sx={{ height: 540, width: "100%" }}>
                <DataGrid
                    rows={flattenedRows}
                    columns={columns}
                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: {
                            page: 1,
                            pageSize: 5,
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
                        Do you want to delete {selectedItem}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            console.log("Deleting item...",selectedItem);
                            if (selectedItem !== null) {
                                deletePond(selectedItem);
                            }
                            setOpenDeleteModal(false);
                        }}
                        color="primary"
                        autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {selectedEditRow && <EditPond row={selectedEditRow} openeditModal={editModal} setEditModal={setEditModal} editSubmit={handleEditSubmit} />}
        </>
    );
};
