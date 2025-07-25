import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import {
    GridFilterItem,
} from "@mui/x-data-grid";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { type Tree } from "../../../../types/tree";
import * as treeActionCreators from "../../../../redux/actions/treeActions";
import * as userTreesActionCreators from "../../../../redux/actions/userTreeActions";
import * as userActionCreators from "../../../../redux/actions/userActions";
import * as plotActionCreators from "../../../../redux/actions/plotActions";
import * as treeImageActionCreators from "../../../../redux/actions/treeImageActions";
import { bindActionCreators } from "redux";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { RootState } from "../../../../redux/store/store";
import EditTree from "./EditTree";
import AssignTreeModal from "./AssignTreeModal";
import getColumnSearchProps, { getColumnDateFilter, getColumnSelectedItemFilter, getSortIcon } from "../../../../components/Filter";
import { TableColumnsType } from "antd";
import { Plot } from "../../../../types/plot";
import TableComponent from "../../../../components/Table";
import { AutocompleteWithPagination } from "../../../../components/AutoComplete";
import Timeline from "./timeline";
import { TreeImage } from "../../../../types/tree_snapshots";
import MapTreesModal from "./MapTreesModal";
import { toast } from "react-toastify";
import ApiClient from "../../../../api/apiClient/apiClient";
import { Order } from "../../../../types/common";
import { getHumanReadableDate, getDashboardUrl } from "../../../../helpers/utils";
import TreeSearch from "../components/TreeSearch";

export const TreeNew = () => {
    const dispatch = useAppDispatch();
    const { getTrees, updateTree, deleteTree, changeTreesPlot }
        = bindActionCreators(treeActionCreators, dispatch);
    const { mapTrees, unMapTrees, assignTrees, unassignUserTrees }
        = bindActionCreators(userTreesActionCreators, dispatch);
    const { searchUsers }
        = bindActionCreators(userActionCreators, dispatch);
    const { getPlots }
        = bindActionCreators(plotActionCreators, dispatch);
    const { getTreeImages }
        = bindActionCreators(treeImageActionCreators, dispatch);

    const [plotPage, setPlotPage] = useState(0);
    const [plotName, setPlotName] = useState('');
    const [plotsLoading, setPlotsLoading] = useState(false);

    const [loading, setLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedTreeForTimeline, setSelectedTreeForTimeline] = useState<Tree | null>(null);
    const [deleteRow, setDeleteRow] = useState<any>({});
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [srNoPage, setSrNoPage] = useState(0);
    const [disabledMapUnMapButton, setDisabledMapUnMapButton] = useState(true);
    const [isMapTrees, setIsMapTrees] = useState(true);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [disabledAUButton, setDisabledAUButton] = useState(true);
    const [isAssignTrees, setIsAssignTrees] = useState(true);
    const [isAssignTreeModalOpen, setIsAssignTreeModalOpen] = useState(false);
    const [saplingIds, setSaplingIds] = useState<string[]>([]);
    const [selectedEditRow, setSelectedEditRow] = useState<Tree | null>(null);
    const [editModal, setEditModal] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [operation, setOperation] = useState('');
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [orderBy, setOrderBy] = useState<Order[]>([]);
    const [selectedTreeIds, setSelectedTreeIds] = useState<number[]>([]);
    const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
    const [changePlotModal, setChangePlotModal] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([]);


    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const getColumnFixed = (columnKey: string): 'left' | 'right' | undefined => {
        if (columnKey === 'sapling_id') return 'left';
        return undefined;
    };

    useEffect(() => {
        const getTags = async () => {
            try {
                const apiClient = new ApiClient();
                const resp = await apiClient.getTreeTags();
                setTags(resp.results)
            } catch (error: any) {
                toast.error(error.message);
            }
        };

        getTags();
    }, [])

    useEffect(() => {
        getTreeData();
    }, [pageSize, page, filters, editModal, orderBy]);

    const getTreeData = async () => {
        const filtersData = Object.values(filters);
        setLoading(true);
        getTrees(page * pageSize, pageSize, filtersData, orderBy);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        getPlotsData();
    }, [plotPage, plotName]);

    useEffect(() => {
        if (selectedTreeForTimeline) {
            getTreeImages(selectedTreeForTimeline.sapling_id, 0, 20);
        }
    }, [selectedTreeForTimeline])

    let treeImages: TreeImage[] = [];
    const treeImagesData = useAppSelector((state) => state.treeImagesData);
    if (treeImagesData) {
        treeImages = Object.values(treeImagesData.treeImages);
        if (selectedTreeForTimeline && selectedTreeForTimeline.image) {
            treeImages.push({
                image: selectedTreeForTimeline.image,
                image_date: selectedTreeForTimeline.created_at,
                tree_status: selectedTreeForTimeline.tree_status,
                created_at: selectedTreeForTimeline.created_at,
                id: 0,
                key: 0,
                user_id: 0,
                sapling_id: selectedTreeForTimeline.sapling_id,
            })
        }
        treeImages = treeImages.sort((a, b) => {
            if (b.image_date > a.image_date) return 1;
            if (b.image_date < a.image_date) return -1;
            return 0;
        });
    }

    const getPlotsData = async () => {
        const nameFilter = { columnField: "name", value: plotName, operatorValue: "contains" }
        setPlotsLoading(true);
        getPlots(plotPage * 10, 10, [nameFilter]);
        setTimeout(() => {
            setPlotsLoading(false);
        }, 1000);
    };

    let plotsList: Plot[] = [];
    const plotsData = useAppSelector((state) => state.plotsData);
    if (plotsData) {
        plotsList = Object.values(plotsData.plots);
        plotsList = plotsList.sort((a, b) => {
            return b.id - a.id;
        });
    }

    const handleSortingChange = (sorter: any) => {
        let newOrder = [...orderBy];
        const updateOrder = (item: { column: string, order: 'ASC' | 'DESC' }) => {
            const index = newOrder.findIndex((item) => item.column === sorter.field);
            if (index > -1) {
                if (sorter.order) newOrder[index].order = sorter.order;
                else newOrder = newOrder.filter((item) => item.column !== sorter.field);
            } else if (sorter.order) {
                newOrder.push({ column: sorter.field, order: sorter.order });
            }
        }

        if (sorter.field) {
            setPage(0);
            updateOrder(sorter);
            setOrderBy(newOrder);
        }
    }

    const getSortableHeader = (header: string, key: string) => {
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
            {header} {getSortIcon(key, orderBy.find((item) => item.column === key)?.order, handleSortingChange)}
          </div>
        )
    }

    const columns: TableColumnsType<Tree> = [
        {
            dataIndex: "srNo",
            key: "srNo",
            title: "Sr. No.",
            width: 100,
            align: 'center',
            filteredValue: null,
            render: (value, record, index) => `${index + 1 + srNoPage * pageSize}.`,
        },
        {
            dataIndex: "sapling_id",
            key: "sapling_id",
            title: "Sapling ID",
            width: 150,
            align: 'center',
            fixed: getColumnFixed('sapling_id'),
            filteredValue: filters['sapling_id']?.value || null,
            ...getColumnSearchProps('sapling_id', filters, handleSetFilters, true)
        },
        {
            dataIndex: "plant_type",
            key: "plant_type",
            title: "Plant Type",
            width: 250,
            align: 'center',
            filteredValue: filters['plant_type']?.value || null,
            ...getColumnSearchProps('plant_type', filters, handleSetFilters)
        },
        {
            dataIndex: "habit",
            key: "habit",
            title: "habitat",
            width: 250,
            align: 'center',
            filteredValue: filters['habit']?.value || null,
            ...getColumnSelectedItemFilter({ dataIndex: 'habit', filters, handleSetFilters, options: ['Tree', 'Herb', 'Shrub', 'Climber'] })
        },
        {
            dataIndex: "plot",
            key: "plot",
            title: "Plot",
            width: 350,
            align: 'center',
            render: (value, record, index) => record?.plot,
            filteredValue: filters['plot']?.value || null,
            ...getColumnSearchProps('plot', filters, handleSetFilters)
        },
        {
            dataIndex: "tags",
            key: "tags",
            title: "Tags",
            width: 200,
            align: 'center',
            render: value => value ? value?.join(", ") : '',
            filteredValue: filters['tags']?.value || null,
            ...getColumnSelectedItemFilter({ dataIndex: 'tags', filters, handleSetFilters, options: tags })
        },
        {
            dataIndex: "mapped_user_name",
            key: "mapped_user_name",
            title: "Reserved for (Individual)",
            width: 250,
            align: 'center',
            filteredValue: filters['mapped_user_name']?.value || null,
            ...getColumnSearchProps('mapped_user_name', filters, handleSetFilters)
        },
        {
            dataIndex: "mapped_group_name",
            key: "mapped_group_name",
            title: "Reserved for (Group)",
            width: 250,
            align: 'center',
            filteredValue: filters['mapped_group_name']?.value || null,
            ...getColumnSearchProps('mapped_group_name', filters, handleSetFilters)
        },
        {
            dataIndex: "sponsor_user_name",
            key: "sponsor_user_name",
            title: "Sponsored By (Individual)",
            width: 250,
            align: 'center',
            filteredValue: filters['sponsor_user_name']?.value || null,
            ...getColumnSearchProps('sponsor_user_name', filters, handleSetFilters)
        },
        {
            dataIndex: "sponsor_group_name",
            key: "sponsor_group_name",
            title: "Sponsored By (Group)",
            width: 250,
            align: 'center',
            filteredValue: filters['sponsor_group_name']?.value || null,
            ...getColumnSearchProps('sponsor_group_name', filters, handleSetFilters)
        },
        {
            dataIndex: "assigned_to_name",
            key: "assigned_to_name",
            title: "Assigned To",
            width: 250,
            align: 'center',
            filteredValue: filters['assigned_to_name']?.value || null,
            ...getColumnSearchProps('assigned_to_name', filters, handleSetFilters)
        },
        {
            dataIndex: "planted_by",
            key: "planted_by",
            title: "Planted By",
            width: 250,
            align: 'center',
            filteredValue: filters['planted_by']?.value || null,
            ...getColumnSearchProps('planted_by', filters, handleSetFilters)
        },
        {
            dataIndex: "association_type",
            key: "association_type",
            title: "Association Type",
            width: 180,
            align: 'center',
            render: (value, record) => {
                if (!value) return '-';
                
                const getColor = (type: string) => {
                    switch (type) {
                        case 'Gift Cards': return '#4caf50';
                        case 'Normal Assignment': return '#9c27b0';
                        case 'Visit': return '#1976d2';
                        case 'Donation': return '#2196f3';
                        default: return '#666';
                    }
                };

                return (
                    <span
                        style={{
                            color: getColor(value),
                            fontWeight: 'bold',
                            backgroundColor: `${getColor(value)}20`,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px'
                        }}
                    >
                        {value}
                    </span>
                );
            },
            filteredValue: filters['association_type']?.value || null,
            ...getColumnSelectedItemFilter({ 
                dataIndex: 'association_type', 
                filters, 
                handleSetFilters, 
                options: ['Gift Cards', 'Normal Assignment', 'Visit', 'Donation'] 
            })
        },
        {
            dataIndex: "request_id",
            key: "request_id",
            title: "Association Request ID",
            width: 120,
            align: 'center',
            render: (value, record) => {
                return value ? value.toString() : '-';
            },
            filteredValue: filters['request_id']?.value || null,
            ...getColumnSearchProps('request_id', filters, handleSetFilters, true)
        },
        {
            dataIndex: "mapped_at",
            key: "Reserved on",
            title: getSortableHeader("Reserved on", "mapped_at"),
            width: 250,
            align: 'center',
            hidden: true,
            render: value => value ? getHumanReadableDate(value) : '',
            filteredValue: filters['mapped_at']?.value || null,
            ...getColumnDateFilter({dataIndex: 'mapped_at', filters, handleSetFilters, label: 'Reserved'})
        },
        {
            dataIndex: "assigned_at",
            key: "Assigned on",
            title: getSortableHeader("Assigned on", "assigned_at"),
            width: 250,
            align: 'center',
            hidden: true,
            render: value => value ? getHumanReadableDate(value) : '',
            filteredValue: filters['assigned_at']?.value || null,
            ...getColumnDateFilter({dataIndex: 'assigned_at', filters, handleSetFilters, label: 'Assigned'})
        },
        {
            dataIndex: "created_at",
            key: "Uploaded on",
            title: getSortableHeader("Uploaded on", "created_at"),
            width: 250,
            align: 'center',
            hidden: true,
            render: value => value ? getHumanReadableDate(value) : '',
            filteredValue: filters['created_at']?.value || null,
            ...getColumnDateFilter({dataIndex: 'created_at', filters, handleSetFilters, label: 'Uploaded'})
        },
        {
            dataIndex: "tree_status",
            key: "tree_status",
            title: "Tree Health",
            width: 150,
            align: 'center',
            render: (value, record) => (
                <span
                    style={{
                        color: value === 'dead' ? '#ff0000' : value === 'lost' ? '#ff8c00' : '#008000',
                        fontWeight: value === 'dead' || value === 'lost' ? 'bold' : 'normal',
                        backgroundColor: value === 'dead' ? '#ffebee' : value === 'lost' ? '#fff3e0' : '#e8f5e8',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        fontSize: '12px'
                    }}
                >
                    {value || 'healthy'}
                </span>
            ),
            filteredValue: filters['tree_status']?.value || null,
            ...getColumnSelectedItemFilter({ 
                dataIndex: 'tree_status', 
                filters, 
                handleSetFilters, 
                options: ['healthy', 'dead', 'lost'] 
            })
        },
        {
            dataIndex: "deleted_at",
            key: "deleted_at",
            title: "Deleted On",
            width: 200,
            align: 'center',
            render: (value, record) => (
                <span
                    style={{
                        color: value ? '#d32f2f' : '#666',
                        fontWeight: value ? 'bold' : 'normal',
                        fontSize: '12px'
                    }}
                >
                    {value ? getHumanReadableDate(value) : '-'}
                </span>
            ),
            filteredValue: filters['deleted_at']?.value || null,
            ...getColumnDateFilter({dataIndex: 'deleted_at', filters, handleSetFilters, label: 'Deleted'})
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 350,
            align: "center",
            filteredValue: null,
            render: (value, record, index) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    {/* Dashboard button - only show if tree is assigned to someone */}
                    {record.assigned_to && (
                        <Button
                            variant="outlined"
                            color="primary"
                            style={{ margin: "0 5px" }}
                            onClick={() => {
                                const dashboardUrl = getDashboardUrl(record.sapling_id);
                                window.open(dashboardUrl, '_blank');
                            }}
                            title="View in Dashboard"
                        >
                            <DashboardIcon />
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        style={{ margin: "0 5px" }}
                        onClick={() => {
                            setSelectedTreeForTimeline(record);
                        }}>
                        <ImageIcon />
                    </Button>
                    <Button
                        variant="outlined"
                        color='success'
                        style={{ margin: "0 5px" }}
                        onClick={() => {
                            setSelectedEditRow(record);
                            setEditModal(true);
                        }}>
                        <EditIcon />
                    </Button>
                    <Button
                        disabled
                        variant="outlined"
                        color="error"
                        style={{ margin: "0 5px" }}
                        onClick={() => handleDelete(record)}>
                        <DeleteIcon />
                    </Button>
                </div>
            ),
        },
    ];

    let treesList: Tree[] = [];
    const treesData = useAppSelector((state: RootState) => state.treesData);
    if (treesData) {
        treesList = Object.values(treesData.trees);
        treesList = treesList.sort((a, b) => {
            if (a.sapling_id > b.sapling_id) return 1;
            if (a.sapling_id < b.sapling_id) return -1;
            return 0;
        })
    }

    const getAllTreesData = async () => {
        let filtersData = Object.values(filters);
        getTrees(0, treesData.totalTrees, filtersData, orderBy);
    };

    const handleDelete = (row: Tree) => {
        setOpenDeleteModal(true);
        setDeleteRow(row);
    };

    const handleSelectionChanges = (treeIds: number[]) => {
        const saplingIds = treeIds.map((treeId) => treesData.trees[treeId].sapling_id);
        setSaplingIds(saplingIds);
        setSelectedTreeIds(treeIds);

        let mapped = 0, unMapped = 0;
        let assigned = 0, unassigned = 0;
        treeIds.forEach((treeId) => {
            if (treesData.trees[treeId].mapped_to_user || treesData.trees[treeId].mapped_to_group) mapped++;
            else unMapped++;

            if (treesData.trees[treeId].assigned_to) assigned++;
            else unassigned++;
        })

        if (mapped !== 0 && unMapped !== 0) setDisabledMapUnMapButton(true);
        else setDisabledMapUnMapButton(false)

        if (mapped === 0 && unMapped !== 0) setIsMapTrees(true);
        if (mapped !== 0 && unMapped === 0) setIsMapTrees(false);
        if (mapped === 0 && unMapped === 0) setDisabledMapUnMapButton(true);

        if (assigned !== 0 && unassigned !== 0) setDisabledAUButton(true);
        else setDisabledAUButton(false)

        if (assigned === 0 && unassigned !== 0) setIsAssignTrees(true);
        if (assigned !== 0 && unassigned === 0) setIsAssignTrees(false);
        if (assigned === 0 && unassigned === 0) setDisabledAUButton(true);
    }

    const handleMapUnMap = () => {
        if (!isMapTrees) {
            setOperation('un-map');
            setOpenConfirmation(true);
        } else {
            setIsUserModalOpen(true);
        }

    }

    const handleUnMapTrees = () => {
        unMapTrees(saplingIds);
        setSaplingIds([]);
        setDisabledMapUnMapButton(true);
        setDisabledAUButton(true);
        getTreeData();
    }

    const handleMapTrees = (formData: any) => {
        // const req: MapTreesUsingSaplingIdsRequest = {
        //     mapped_to: 'user',
        //     id: formData.id,
        //     sapling_ids: saplingIds,
        //     name: formData.name,
        //     email: formData.email,
        //     phone: formData.phone
        // }
        mapTrees({ ...formData, sapling_ids: saplingIds });
        setSaplingIds([]);
        setDisabledMapUnMapButton(true);
        setDisabledAUButton(true);
        setIsUserModalOpen(false);
        getTreeData();
    }

    const handleAssignUnAssign = () => {
        if (!isAssignTrees) {
            setOperation('unassign');
            setOpenConfirmation(true);
        } else {
            setIsAssignTreeModalOpen(true);
        }
    }

    const handleUnassignTrees = () => {
        unassignUserTrees(saplingIds);
        setSaplingIds([]);
        setDisabledAUButton(true);
        setDisabledMapUnMapButton(true);
        getTreeData();
    }

    const handleAssignTrees = (data: any) => {
        data['sapling_ids'] = saplingIds
        let formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string);
        })
        assignTrees(formData);
        setSaplingIds([]);
        setDisabledAUButton(true);
        setDisabledMapUnMapButton(true);
        setIsAssignTreeModalOpen(false);
        getTreeData();
    }

    const handleEditSubmit = (formData: Tree) => {
        updateTree(formData);
    };

    const handleCloseEditModal = () => {
        setEditModal(false);
        setSelectedEditRow(null);
    };

    const handleChangePlot = () => {
        if (selectedPlot === null) return;

        changeTreesPlot(selectedTreeIds, selectedPlot.id);
        setSelectedPlot(null);
        setTimeout(() => {
            getTreeData();
        }, 1000)
    }

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 12px",
                }}
            >
                <Typography variant="h4" style={{ marginTop: '5px' }}>Trees</Typography>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', marginBottom: '5px', marginTop: '5px', gap: '10px' }}>
                    <TreeSearch
                        onSearch={(saplingIds) => {
                            const newFilters = {
                                ...filters,
                                "sapling_id": {
                                    columnField: "sapling_id",
                                    value: saplingIds,
                                    operatorValue: 'isAnyOf'
                                }
                            };
                            setFilters(newFilters);
                        }}
                        onClear={() => {
                            const newFilters = { ...filters };
                            delete newFilters["sapling_id"];
                            setFilters(newFilters);
                        }}
                    />
                    {/* <Button variant="contained" color={isAssignTrees ? 'success' : 'error'} onClick={handleAssignUnAssign}
                        disabled={disabledAUButton}
                        >{(isAssignTrees) ? "Assign Trees" : "Unassign Trees"}</Button> */}
                    <AssignTreeModal open={isAssignTreeModalOpen} handleClose={() => { setIsAssignTreeModalOpen(false) }} onSubmit={handleAssignTrees} searchUsers={searchUsers} />
                    <Button 
                        variant="contained" 
                        color={isMapTrees ? 'success' : 'error'} 
                        onClick={handleMapUnMap}
                        disabled={disabledMapUnMapButton}
                        sx={{ height: 'fit-content' }}
                    >
                        {(isMapTrees) ? "Reserve Trees" : "Unreserve Trees"}
                    </Button>
                    {/* <UserModal open={isUserModalOpen} handleClose={() => { setIsUserModalOpen(false) }} onSubmit={handleMapTrees} searchUser={searchUsers} /> */}
                    <Button 
                        variant="contained" 
                        color='success' 
                        onClick={() => setChangePlotModal(true)}
                        disabled={selectedTreeIds.length === 0}
                        sx={{ height: 'fit-content' }}
                    >
                        Change Plot
                    </Button>
                </div>
            </div>
            <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
            <Box sx={{ height: 840, width: "100%" }}>
                <TableComponent
                    loading={loading}
                    dataSource={treesList}
                    columns={columns}
                    totalRecords={treesData.totalTrees}
                    fetchAllData={getAllTreesData}
                    setPage={setPage}
                    setPageSize={setPageSize}
                    handleSelectionChanges={handleSelectionChanges}
                    setSrNoPage={setSrNoPage}
                    pageSize={pageSize}
                    currentPage={page}
                    rowClassName={(record, index) => { 
                        // Priority: Dead trees get red background, deleted trees get gray background
                        if (record.tree_status === 'dead') return 'bg-dead-tree';
                        if (record.deleted_at !== null && record.deleted_at !== undefined) return 'bg-deleted-tree';
                        if (record.tree_status === 'lost') return 'bg-lost-tree';
                        // Default habitat-based coloring for healthy/active trees
                        return record.habit === 'Tree' ? 'bg-green' : record.habit === 'Shrub' ? 'bg-cyan' : record.habit === 'Herb' ? 'bg-yellow' : 'bg-red';
                    }}
                    tableRowColoringLabels={[
                        { className: 'bg-dead-tree', label: 'Dead Tree' }, 
                        { className: 'bg-deleted-tree', label: 'Deleted Tree' }, 
                        { className: 'bg-lost-tree', label: 'Lost Tree' }, 
                        { className: 'bg-green', label: 'Tree' }, 
                        { className: 'bg-cyan', label: 'Shrub' }, 
                        { className: 'bg-yellow', label: 'Herb' }, 
                        { className: 'bg-red', label: 'Unknown' }
                    ]}
                    tableName="Trees"
                />
            </Box>

            <Dialog open={selectedTreeForTimeline !== null} onClose={() => setSelectedTreeForTimeline(null)} PaperProps={{ sx: { width: '80%', maxWidth: '80%', maxHeight: '80%' } }}>
                <DialogTitle>Timeline For Sapling {selectedTreeForTimeline?.sapling_id}</DialogTitle>
                <DialogContent>
                    <Timeline created_at={selectedTreeForTimeline?.created_at as any} items={treeImages.map(image => ({ date: image.image_date.toString(), status: image.tree_status, image: image.image }))} />
                </DialogContent>
            </Dialog>

            {selectedEditRow && (
                <EditTree
                    row={selectedEditRow}
                    openeditModal={editModal}
                    handleCloseEditModal={handleCloseEditModal}
                    editSubmit={handleEditSubmit}
                />
            )}

            <MapTreesModal
                open={isUserModalOpen}
                onClose={() => { setIsUserModalOpen(false) }}
                onSubmit={handleMapTrees}
            />

            <Dialog open={openConfirmation} onClose={() => setOpenConfirmation(false)}>
                <DialogTitle>Confirm {operation}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to {operation} trees with the sapling ids '
                        {saplingIds.join(", ")}'?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmation(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (operation === 'un-map') handleUnMapTrees();
                            if (operation === 'unassign') handleUnassignTrees();
                            setOpenConfirmation(false);
                        }}
                        color="primary"
                        autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

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

            <Dialog open={changePlotModal} onClose={() => setChangePlotModal(false)} >
                <DialogTitle>Select a Site</DialogTitle>
                <DialogContent sx={{ width: 500 }}>
                    <DialogContentText>
                        This action will change plot for selected Trees.
                    </DialogContentText>
                    <div style={{ width: 500, marginTop: 5 }}>
                        <AutocompleteWithPagination
                            label="Select a Plot"
                            options={plotsList}
                            getOptionLabel={(option) => option?.name || ''}
                            onChange={(event, newValue) => {
                                setSelectedPlot(newValue);
                            }}
                            onInputChange={(event) => {
                                const { value } = event.target;
                                setPlotPage(0);
                                setPlotName(value);
                            }}
                            setPage={setPlotPage}
                            fullWidth
                            size="medium"
                            loading={plotsLoading}
                            value={(plotName === '' && selectedPlot) ? selectedPlot : null}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="error"
                        variant="outlined"
                        onClick={() => setChangePlotModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            handleChangePlot();
                            setChangePlotModal(false);
                        }}
                        color="success"
                        variant="contained"
                        autoFocus
                        disabled={selectedPlot === null}
                    >
                        Change Plot
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
