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
import * as userTreesActionCreators from "../../../../redux/actions/userTreeActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { RootState } from "../../../../redux/store/store";
import CircularProgress from "@mui/material/CircularProgress";
import EditTree from "./EditTree";
import UserModal from './UserModel';

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
    const { getTrees, createTree, updateTree, deleteTree, createBulkTrees }
        = bindActionCreators(treeActionCreators, dispatch);
    const { mapTrees, unMapTrees, mapTreesForPlot }
        = bindActionCreators(userTreesActionCreators, dispatch);

    const [open, setOpen] = useState(false);
    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteRow, setDeleteRow] = useState<any>({});
    const [filters, setFilters] = useState<GridFilterItem[]>([]);
    const [page, setPage] = useState(0);
    const [disabledMapUnMapButton, setDisabledMapUnMapButton] = useState(true);
    const [isMapTrees, setIsMapTrees] = useState(true);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [saplingIds , setSaplingIds] = useState<string[]>([]);
    const [selectedEditRow, setSelectedEditRow] = useState<RowType | null>(null);
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
        treesList = Object.values(treesData.trees);
    }

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

    const handleSelectionChanges = (treeIds: string[]) => {
        const saplingIds = treeIds.map( (treeId) => treesData.trees[treeId].sapling_id );
        setSaplingIds(saplingIds);

        let mapped = 0, unMapped = 0;
        treeIds.forEach( (treeId) => {
            if (treesData.trees[treeId].mapped_to) {
                mapped++;
            } else {
                unMapped++;
            }
        } )

        if (mapped !== 0  && unMapped !== 0) setDisabledMapUnMapButton(true);
        else setDisabledMapUnMapButton(false)

        if (mapped === 0 && unMapped !== 0) setIsMapTrees(true);
        if (mapped !== 0 && unMapped === 0) setIsMapTrees(false);
        if (mapped === 0 && unMapped === 0) setDisabledMapUnMapButton(true);
    }

    const handleMapUnMap = () => {
        if (!isMapTrees) {
            unMapTrees(saplingIds);
            setSaplingIds([]);
            setDisabledMapUnMapButton(true);
        } else {
            setIsUserModalOpen(true);
        }

    }

    const handleMapTrees = (formData: any) => {
        mapTrees(saplingIds, formData.email);
        setSaplingIds([]);
        setDisabledMapUnMapButton(true);
        setIsUserModalOpen(false);
    }

    const handleEditSubmit = (formData: Tree) => {
        console.log(formData);
        updateTree(formData);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button variant="contained" onClick={handleMapUnMap}
                disabled={disabledMapUnMapButton} 
                >{ (isMapTrees)? "Map Trees" : "UnMap Trees" }</Button>
                <UserModal open={isUserModalOpen} handleClose={ () => {setIsUserModalOpen(false)}} onSubmit={handleMapTrees} />
                <Button variant="contained" style={{ marginLeft: '10px' }} onClick={handleModalOpen}
                disabled={true} 
                >Add Tree</Button>
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
                    onSelectionModelChange={(ids) => {
                        handleSelectionChanges(ids as string[]);
                      }}
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
