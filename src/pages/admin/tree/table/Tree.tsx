import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
    DataGrid,
    GridToolbar,
    GridColumns,
    GridFilterItem,
    GridFilterModel,
} from "@mui/x-data-grid";
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
import AddTree from "./AddTree";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Tree } from "../../../../types/tree";
import * as treeActionCreators from "../../../../redux/actions/treeActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { RootState } from "../../../../redux/store/store";
import CircularProgress from "@mui/material/CircularProgress";
import EditTree from "./EditTree";

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

export const TreeNew = () => {
    const dispatch = useAppDispatch();
    const { getTrees, createTree, updateTree, deleteTree, createBulkTrees } =
        bindActionCreators(treeActionCreators, dispatch);

    const [open, setOpen] = useState(false);
    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteRow, setDeleteRow] = useState<any>({});
    const [filters, setFilters] = useState<GridFilterItem[]>([]);
    const [page, setPage] = useState(0);
    const [selectedEditRow, setSelectedEditRow] = useState<Tree | null>(null);
    const [editModal, setEditModal] = useState(false);

    useEffect(() => {
        getTreeData();
    }, [page, filters, editModal]);

    const getTreeData = async () => {
        setTimeout(async () => {
            await getTrees(page * 10, 10, filters);
        }, 1000);
    };

    const columns: GridColumns = [
        {
            field: "action",
            headerName: "Action",
            width: 100,
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
                        onClick={() => {
                            setSelectedEditRow(params.row);
                            setEditModal(true);
                        }}>
                        <EditIcon />
                    </Button>
                    <Button onClick={() => handleDelete(params.row)}>
                        <DeleteIcon />
                    </Button>
                </div>
            ),
        },
        { field: "sapling_id", headerName: "Sapling ID", width: 150 },
        { field: "tree_id._id", headerName: "Tree ID", width: 150 },
        { field: "tree_id.name", headerName: "Tree Name", width: 150 },
        { field: "plot_id._id", headerName: "Plot ID", width: 150 },
        { field: "plot_id.name", headerName: "Plot Name", width: 150 },
        { field: "date_added", headerName: "Date Added", width: 150 },
        { field: "key", headerName: "Key", width: 150 },
        { field: "link", headerName: "Link", width: 150 },
        { field: "mapped_to", headerName: "Mapped To", width: 150 },
        { field: "event_type", headerName: "Event Type", width: 150 },
        { field: "date_assigned", headerName: "Date Assigned", width: 150 },
    ];

    let treesList: Tree[] = [];
    const treesData = useAppSelector((state: RootState) => state.treesData);
    if (treesData) {
        treesList = Object.values(treesData.trees).map(tree => ({
            ...tree,
            'tree_id._id': tree.tree_id._id,
            'tree_id.name': tree.tree_id.name,
            'plot_id._id': tree.plot_id._id,
            'plot_id.name': tree.plot_id.name,
        }));
    }

    const unflattenTree = (formData: any) => ({
        ...formData,
        tree_id: {
            _id: formData['tree_id._id'],
            name: formData['tree_id.name']
        },
        plot_id: {
            _id: formData['plot_id._id'],
            name: formData['plot_id.name']
        }
    });

    console.log(treesList);
    type RowType = {
        id: string;
        name: string;
    };

    const handleDelete = (row: RowType) => {
        console.log("Delete", row);
        setOpenDeleteModal(true);
        setDeleteRow(row);
    };

    const handleEditSubmit = (formData: Tree) => {
        
        console.log(formData);
        updateTree(formData as Tree);
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "20px",
                }}>
                <Button variant="contained" onClick={handleModalOpen} disabled={true}>
                    Add Tree
                </Button>
                <AddTree open={open} handleClose={handleModalClose} />
                <Button
                    variant="contained"
                    style={{ marginLeft: "10px" }}
                    onClick={handleModalOpen}
                    disabled={true}>
                    Bulk Create
                </Button>
            </div>
            <Box sx={{ height: 540, width: "100%" }}>
                <DataGrid
                    rows={treesList}
                    columns={columns}
                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: {
                            page: 0,
                            pageSize: 10,
                        },
                    }}
                    onPageChange={(page) => {
                        if (treesList.length / 10 === page) setPage(page);
                    }}
                    rowCount={treesData.totalTrees}
                    onFilterModelChange={(model: GridFilterModel) => {
                        setFilters(model.items);
                    }}
                    filterMode="server"
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
                        Do you want to delete tree with the sapling id '
                        {deleteRow?.sapling_id}'?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            deleteTree(deleteRow);
                            setOpenDeleteModal(false);
                        }}
                        color="primary"
                        autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {selectedEditRow && (
                <EditTree
                    row={selectedEditRow}
                    openeditModal={editModal}
                    setEditModal={setEditModal}
                    editSubmit={handleEditSubmit}
                />
            )}
        </>
    );
};
