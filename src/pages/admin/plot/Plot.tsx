import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, GridColumns } from "@mui/x-data-grid";
import AddPlot from "./AddPlot";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Plot } from "../../../types/plot";
import * as plotActionCreators from "../../../redux/actions/plotActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { RootState } from "../../../redux/store/store";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, Typography } from "@mui/material";
import EditPlot from "./EditPlot";

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
        "boundaries": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        18.92883906964203,
                        73.7769217462353
                    ],
                    [
                        18.92705962338517,
                        73.77601906599243
                    ],
                    [
                        18.92691470408016,
                        73.77663242954684
                    ],
                    [
                        18.92764441915284,
                        73.77778245391168
                    ],
                    [
                        18.92883906964203,
                        73.7769217462353
                    ]
                ]
            ]
        },
        "center": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        },
        "_id": "61b2f530969efcff564fa3c0",
        "name": "(14)-(वेताळे)-748()",
        "plot_id": "748",
        "tags": [],
        "__v": 0,
        "category": "6543803d302fc2b6520a9bac",
        "district": "6543803cd39dd1c57d6e1d02",
        "gat": "748",
        "land_type": null,
        "status": "",
        "taluka": "6543803f2ce60e0ea261efad",
        "village": "65438043b918bb6df695ff3d",
        "zone": "659f8b4b2523ee92ba4b55fe"
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
const flattenedRows = rows.map((row) => ({
    ...row,
    "boundaries.type": row.boundaries.type,
    "boundaries.coordinates": row.boundaries.coordinates,
}));

export const PlotComponent = () => {
    const dispatch = useAppDispatch();
    const { getPlots, createPlot, updatePlot, deletePlot } = bindActionCreators(
        plotActionCreators,
        dispatch
    );

    const [open, setOpen] = useState(false);
    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Plot | null>(null);
    const [selectedEditRow, setSelectedEditRow] = useState<RowType | null>(null);
    const [editModal, setEditModal] = useState(false);

    const columns: GridColumns = [
        {
            field: '_id',
            headerName: 'ID',
            width: 90,
            align: 'center',
            editable: true,
            headerAlign: 'center'
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            align: 'center',
            editable: true,
            headerAlign: 'center'
        },
        {
            field: 'plot_id',
            headerName: 'Plot ID',
            width: 150,
            align: 'center',
            editable: true,
            headerAlign: 'center'
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
            align: 'center',
            editable: true,
            headerAlign: 'center'
        },
        {
            field: 'district',
            headerName: 'District',
            width: 150, 
            align: 'center',
            editable: true,
            headerAlign: 'center'
        },
        {
            field: 'gat',
            headerName: 'Gat',
            width: 150,
            align: 'center',
            editable: true,
            headerAlign: 'center'
        },
        {
            field: 'land_type',
            headerName: 'Land Type',
            width: 150,
            align: 'center',
            editable: true,
            headerAlign: 'center'
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            align: 'center',
            editable: true,
            headerAlign: 'center'
        },
        {
            field: 'taluka',
            headerName: 'Taluka',
            width: 150,
            align: 'center',
            editable: true,
            headerAlign: 'center'
        },
        {
            field: 'village',
            headerName: 'Village',
            width: 150,
            align: 'center',
            editable: true,
            headerAlign: 'center'
        },
        {
            field: 'zone',
            headerName: 'Zone',
            width: 150,
            align: 'center',
            editable: true,
            headerAlign: 'center'
        },
        {
            field: '__v',
            headerName: 'Version',
            width: 90,
            align: 'center',
            editable: true,
            headerAlign: 'center'
        },
        {
            field: 'boundaries.type',
            headerName: 'Boundaries Type',
            width: 250,
            align: 'center',
            editable: true,
            headerAlign: 'center',
            valueGetter: (params) => JSON.stringify(params.row.boundaries.type),
        },
        {
            field: 'boundaries.coordinates',
            headerName: 'Boundaries Coordinates',
            width: 250,
            align: 'center',
            editable: true,
            headerAlign: 'center',
            valueGetter: (params) => JSON.stringify(params.row.boundaries.coordinates),
        },
        {
            field: 'center.type',
            headerName: 'Center Type',
            width: 250,
            align: 'center',
            editable: true,
            headerAlign: 'center',
            valueGetter: (params) => JSON.stringify(params.row.center.type),
        },
        {
            field: 'center.coordinates',
            headerName: 'Center Coordinates',
            width: 250,
            align: 'center',
            editable: true,
            headerAlign: 'center',
            valueGetter: (params) => JSON.stringify(params.row.center.coordinates),
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 250,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params: any) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        style={{ margin: '0 5px' }}
                        onClick={() => {
                            setSelectedEditRow(params.row)
                            setEditModal(true)
                        }}
                    >
                        <EditIcon />
                    </Button>
                    <Button variant="outlined" style={{ margin: '0 5px' }} onClick={() => handleDelete(params.row._id)}><DeleteIcon /></Button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        getPlotData();
    }, []);

    const getPlotData = async () => {
        setTimeout(async () => {
            await getPlots();
        }, 1000);
    };

    let plotsList: Plot[] = [];
    const plotsMap = useAppSelector((state: RootState) => state.plotsData);
    if (plotsMap) {
        plotsList = Object.values(plotsMap);
    }

    type RowType = {
        id: string;
        name: string;
    };

    const handleDelete = (row: Plot) => {
        console.log("Delete", row);
        setOpenDeleteModal(true);
        setSelectedItem(row);
    };

    const handleEditSubmit = (formData: Plot) => {
        console.log(formData);
        updatePlot(formData);
    };

    const handleCreatePlotData = (formData: Plot) => {
        console.log(formData);
        createPlot(formData);
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "20px",
                }}>
                <Button variant="contained" onClick={handleModalOpen} >
                    Add Plot
                </Button>
                <AddPlot open={open} handleClose={handleModalClose} createPlot={handleCreatePlotData} />
                <Button
                    variant="contained"
                    style={{ marginLeft: "10px" }}
                    onClick={handleModalOpen}>
                    Bulk Create
                </Button>
            </div>
            <Box sx={{ height: 540, width: "100%" }}>
                <DataGrid
                    rows={plotsList}
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
                            console.log("Deleting item...");
                            if (selectedItem !== null) {
                            deletePlot(selectedItem);
                            }
                            setOpenDeleteModal(false);
                        }}
                        color="primary"
                        autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {selectedEditRow && <EditPlot row={selectedEditRow} openeditModal={editModal} setEditModal={setEditModal} editSubmit={handleEditSubmit} />}
        </>
    );
};
