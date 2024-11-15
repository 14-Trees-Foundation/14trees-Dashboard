import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import ApiClient from '../../../../api/apiClient/apiClient';
import { ForestOutlined, SelectAllRounded } from '@mui/icons-material';
import GeneralTable from '../../../../components/GenTable';
import getColumnSearchProps, { getColumnSelectedItemFilter } from '../../../../components/Filter';
import { GridFilterItem } from '@mui/x-data-grid';
import { toast } from 'react-toastify';


interface UserTreeMappingModalProps {
    users: any[]
    onUsersChange: (users: any[]) => void
    plotIds: number[]
}

const UserTreeMappingModal: React.FC<UserTreeMappingModalProps> = ({ users, onUsersChange, plotIds }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isTreeModalOpen, setTreeModalOpen] = useState(false);
    const [treesData, setTreesData] = useState<Record<number, any>>({})
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [loading, setLoading] = useState(false);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
    const [tags, setTags] = useState<string[]>([])

    const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
        setPage(0);
        setFilters(filters);
    }

    const getTrees = async (plotIds: number[]) => {
        const apiClient = new ApiClient();
        setLoading(true);
        if (plotIds.length > 0) {
            const filtersData: any[] = [{
                columnField: 'plot_id',
                operatorValue: 'isAnyOf',
                value: plotIds
            }]

            filtersData.push(...Object.values(filters));
            const treesResp = await apiClient.getGiftAbleTrees(page * pageSize, pageSize, filtersData);
            setTotal(Number(treesResp.total));

            setTreesData(prev => {

                const newTrees = { ...prev };
                for (let i = 0; i < treesResp.results.length; i++) {
                    newTrees[treesResp.offset + i] = treesResp.results[i];
                }

                return newTrees;
            });
        }
        setLoading(false);
    }

    useEffect(() => {
        setTreesData({});
        setPage(0);
    }, [filters, plotIds]);

    useEffect(() => {
        const handler = setTimeout(() => {
            const records: any[] = [];
            const maxLength = Math.min((page + 1) * pageSize, total);
            for (let i = page * pageSize; i < maxLength; i++) {
                if (Object.hasOwn(treesData, i)) {
                    const record = treesData[i];
                    if (record) {
                        records.push(record);
                    }
                } else {
                    getTrees(plotIds);
                    break;
                }
            }

            setTableRows(records);
        }, 300)

        return () => {
            clearTimeout(handler);
        }
    }, [pageSize, page, treesData, total, plotIds]);

    useEffect(() => {
        const handler = setTimeout(() => {
            getTrees(plotIds);
        }, 300)

        return () => {
            clearTimeout(handler);
        }

    }, [plotIds, filters])

    useEffect(() => {
        const getPTTags = async () => {
            try {
                const apiClient = new ApiClient();
                const tagsResp = await apiClient.getPlantTypeTags();
                setTags(tagsResp.results)
            } catch (error: any) {
                toast.error(error.message);
            }
        }

        getPTTags();
    }, [])

    const handleSelectTree = (tree: any) => {
        if (selectedUser) {
            const updatedUsers = users.map((user) =>
                user === selectedUser ? { ...user, tree_id: tree.id, sapling_id: tree.sapling_id, plant_type: tree.plant_type } : user
            );

            onUsersChange(updatedUsers);
            setSelectedUser(null);
        }
        setTreeModalOpen(false);
    };

    const openTreeModal = (user: any) => {
        setSelectedUser(user);
        setTreeModalOpen(true);
    };

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPage(page - 1);
        setPageSize(pageSize);
    }

    const columns: any[] = [
        {
            dataIndex: "sapling_id",
            key: "sapling_id",
            title: "Sapling Id",
            align: "center",
            width: 100,
        },
        {
            dataIndex: "plant_type",
            key: "plant_type",
            title: "Plant Type",
            align: "center",
            width: 200,
            ...getColumnSearchProps('plant_type', filters, handleSetFilters)
        },
        {
            dataIndex: "plot",
            key: "plot",
            title: "Plot Name",
            align: "center",
            width: 200,
            ...getColumnSearchProps('plot', filters, handleSetFilters)
        },
        {
            dataIndex: "tags",
            key: "tags",
            title: "Plot Name",
            align: "center",
            width: 200,
            ...getColumnSelectedItemFilter({ dataIndex: 'tags', filters, handleSetFilters, options: tags})
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Actions",
            width: 100,
            align: "center",
            render: (value: any, record: any, index: number) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        variant='outlined'
                        color='success'
                        style={{ margin: "0 5px" }}
                        disabled={users.find(item => item.tree_id === record.id)}
                        onClick={() => { handleSelectTree(record) }}
                    >
                        Select
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <>
            <Typography id="user-list-modal-title" variant="h6" sx={{ mb: 1, mt: 2 }}>
                Users List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Tree ID</TableCell>
                            <TableCell>Plant Type</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user.assigned_to_name}</TableCell>
                                <TableCell>{user.assigned_to_email}</TableCell>
                                <TableCell>{user.sapling_id || 'N/A'}</TableCell>
                                <TableCell>{user.plant_type || 'N/A'}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => openTreeModal(user)}>
                                        <ForestOutlined />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={isTreeModalOpen} aria-labelledby="tree-select-modal-title">
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%', // Responsive width
                        maxWidth: '80vw',
                        maxHeight: '90vh',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        overflow: 'auto',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography mb={2}>Select tree</Typography>
                    <GeneralTable
                        loading={loading}
                        rows={tableRows}
                        columns={columns}
                        totalRecords={total}
                        page={page}
                        pageSize={pageSize}
                        onPaginationChange={handlePaginationChange}
                        onDownload={async () => { return Object.values(treesData) }}
                        tableName="Trees"
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => { setTreeModalOpen(false) }} variant="outlined" color='error' sx={{ mr: 1 }}>Cancel</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default UserTreeMappingModal;
